<template>
    <div class="container">
        <div class="game" v-if="!loading">
    
            <!-- numbers -->
            <div class="top" v-if="!unlimited">
                <div 
                    v-for="i in limit" :key="i-1" 
                    class="song-indicator"
                    :class="{'active': i-1 == current && !finished, 'correct': (songs[i-1] && i-1 < current ? songs[i-1].correct : false ), 'incorrect': (songs[i-1] && i-1 < current ? !songs[i-1].correct : false )}"
                >{{i}}</div>
            </div>
            <div class="top" v-else>
                <div class="song-indicator">
                    <span class="correct">{{ songs.filter(x => x.correct).length }}</span> : <span class="incorrect">{{ songs.filter((x, i) => (!x.correct && current > i)).length }}</span></div>
            </div>
        
            <!-- PLAYER -->
            <Player
                v-if="!finished"
                :src="songs[this.current].op"
                :video="video"
                @ready="playerReady()"
                class="player"
                ref="player"
            ></Player>
            
            <!-- game window -->
            <div class="window" v-if="!finished" @touchstart="swipeStart($event)" @touchmove="swipeEnd($event)">
                <div class="controls">
                    <div class="bubble timer">
                        <span>{{ remaining }}</span>
                        <div class="remaining" :style="{width: (remaining/(unlimited ? 10 : 45))*100+'%'}"></div>
                    </div>
    
                    <div class="bubble" @click="switchPlay()">
                        <font-awesome-icon icon="pause" v-if="playing" />
                        <font-awesome-icon icon="compact-disc" class="loading" v-else-if="!ready" />
                        <font-awesome-icon icon="play" v-else />
                    </div>
    
                    <div class="bubble" @click="next()">
                        <font-awesome-icon icon="forward" />
                    </div>
    
                </div> 
    
                <input v-if="choices == 0" class="answer-input" type="text" placeholder="Guess" @keyup.enter="guess($event)">

                <div class="spacer"></div>

                <transition name="swip">
                    <div class="back swip" v-if="swipeVisible" @click="end()">
                        <font-awesome-icon icon="sign-out-alt"></font-awesome-icon> End game
                    </div>
                </transition>
                
            </div>

            <div class="choices" v-if="!more && choices > 0 && !finished">
                <Choice v-for="(choice, i) in choicesList" :key="i" @click.native="guessChoice(choice)" :data="choice"></Choice>
            </div>

            <div class="more" v-if="more" :class="[song.correct ? 'more-correct' : 'more-incorrect']">
                <div class="more-content">
                    <del class="incorrect" v-if="!song.correct">{{ song.guess }}</del>
                    <span style="font-size: .9em" v-else>Correct</span>
                    <ResultSong :song="song"></ResultSong>
                </div>
                <div class="forward" @click="forward()">
                    <font-awesome-icon class="forward-icon" icon="arrow-right" />
                    <span class="forward-text">Next</span>
                </div>
            </div>

            <Results 
                v-if="finished"
                :songs="songs"></Results>
        </div>
         
        <span style="flex: 1 1 0;"></span>
    
        <div class="back back-d" v-if="!finished" @click="end()">
                <font-awesome-icon icon="sign-out-alt"></font-awesome-icon> End game
        </div>
        
        <transition name="progr">
            <Progress v-if="loading"></Progress>
        </transition>
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPause, faPlay, faForward, faCompactDisc, faSignOutAlt, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import stringSimilarity from 'string-similarity';

import Player from '../components/Game/Player';
import Results from '../components/Game/Results';
import Progress from '../components/Progress';
import ResultSong from '../components/Game/ResultSong';
import Choice from '../components/Game/Choice';

import Timer from '../timer';
import store from '../services/store'
import { getRandom, shuffle } from '../util';
import { getAnime } from '../services/anime';

library.add(faPause, faPlay, faForward, faCompactDisc, faSignOutAlt, faArrowRight);

export default {
    components: {
        FontAwesomeIcon,
        Player,
        Results,
        Progress,
        ResultSong,
        Choice
    },
    data: () => ({
        // Game data
        state: store.state, // State
        list: [], // Anime database
        songs: [], // Selected songs array
        choicesList: [], // Currently displayed choices array

        // State
        ready: false, // Song is loaded and ready to play
        playing: false, // Song is playing
        finished: false, // Game finished
        loading: true, // Game is loading

        fails: 0,   // MAL API errors counter
        current: 0, // Current playing song position
        more: false, // Show more information after guess
        timer: null, // Timer

        initialRemaining: 0, 

        // Game settings
        unlimited: false, // Game unlimited
        limit: 7, // Songs limit (only if not unlimited)
        remaining: 10, // Remaining time (for song if unlimited, game if not unlimited)
        choices: 0, // Number of available choices
        autoplay: false, // Song autoplay
        video: false,

        // Mobile swipe
        initialY: null,
        swipeVisible: false
    }),
    async mounted() {
        // Load database (user list)
        if(this.state.list.length == 0) { // List is empty for some reason
            // Fallback to MAL top 100
            this.list = await store.fetchList(2);

        } else {
            this.list = this.state.list;
        }

        // Set time and song limit
        if(this.state.settings.unlimited) {
            this.unlimited = true;
        } else {
            this.limit = 7; // 7 songs
            this.remaining = 45; // 45 seconds limit for game
        }

        // Determine choices number (or no choices)
        this.choices = this.state.settings.choices;

        // Determine autoplay
        this.autoplay = this.state.settings.autoplay;
        
        // Determine video visible
        this.video = this.state.settings.video;

        // Pick first anime
        this.pick()
        .then(song => {
            if(this.choices > 0) this.pickChoices(song);
            this.initialRemaining = this.remaining;
            this.loading = false;
        });

        // Initiate timer
        this.game();
    },
    computed: {
        song() {
            return this.songs[this.current];
        }
    },
    methods: {
        async pick() {
            try {
            // Filter available choices to prevent duplicates
            const choices = this.list.filter(x => this.songs.map(x => x.id).indexOf(x.id) == -1);
            
            if(choices.length == 0) { // unlimited was a scam
                this.finished = true;
                return;
            }

            // The chosen one
            const choice = choices[Math.floor(Math.random() * this.list.length)];
            
            // Fetch anime data from backend
            const resp = await fetch('/api/anime?id='+choice.id)
            console.log("a")
            const anime = await resp.json();
            console.log("b")

            // And more anime data from MAL
            const data = await getAnime(choice.id);
            
            // Choose random opening (or if there's no openings, ending)
            const openings = anime.themes.filter(x => x.type == 'opening');
            
            let randomOpening = openings[Math.floor(Math.random() * openings.length)];
            if(!randomOpening) randomOpening = anime.themes[0];

            const selected = {
                // Opening data
                id: data.id,
                titles: data.titles,
                op: randomOpening.link,
                cover: data.image,

                // Data for game
                guess: '',
                correct: false,
                took: 0
            }

            // (i don't know if await is necessary)
            await this.songs.push(selected);
            return selected;

            } catch(e) {
                console.error(e)
                if(this.fails++ == 3) return this.finished = true; // todo display error to user
                return this.pick(); // Try again
            }
        },
        game() {
            this.timer = new Timer(1000, () => {
                this.remaining--;
            });
        },
        switchPlay() {
            if(!this.ready) return;

            if(this.playing) {
                this.pause();
            }
            else {
                this.play();
            }
        },
        next() {
            if(this.more) return this.forward();

            const took = this.initialRemaining - this.remaining;

            this.song.took = took;

            if(!this.unlimited) return this.forward();

            this.timer.pause();
            this.play();

            this.more = true;
        },
        forward() { // Next song
            if(!this.ready) return;

            this.pause();
            this.more = false;
            this.ready = false;

            if(this.current+1 == this.limit && !this.unlimited) { // game ended
                this.current++;
                this.finished = true;
                // Show results
            } else {
                this.fails = 0;
                this.pick().then(song => {
                    if(this.unlimited) this.remaining = 10;

                    this.initialRemaining = this.remaining;

                    this.current++;

                    // Initiate choices
                    if(this.choices > 0) {
                        this.pickChoices(song);
                    }
                });
            }
        },
        pickChoices(correct) {
            const filteredList = this.list.filter(x => x.id != correct.id);
            let choices = getRandom(filteredList, this.choices-1);
          
            choices.push(correct);
            
            choices = choices.map(x => ({
                id: x.id,
                title: x.titles[0],
                cover: x.cover,
                correct: (x.id == correct.id)
            }))

            const shuffled = shuffle(choices);
            this.choicesList = shuffled;
        },
        pause() {
            this.$refs.player.pause(); // Pause the player
            this.playing = false;
            this.timer.pause(); // Pause the timer
        },
        play() {
            this.$refs.player.play()
            .then(() => {
                this.playing = true;
                if(!this.more) this.timer.run(); // Resume the timer
            }) // Play the player  
        },
        playerReady() {
            this.ready = true;
            if(this.autoplay) this.play();
        },

        guess(e) {
            // Process all titles
            const titles = this.song.titles
            .filter(x => !!x) // to avoid errors
            .map(x => x.toLowerCase()); // case insensitive

            // Method 1 (split title into words)
            const possibilites = titles.map(x => x.split(" "))
            .flat(1)
            .filter(x => x.length > 3); // so 'no' 'of' or 'not' doesn't count

            // Set for results
            this.songs[this.current].guess = e.target.value;
            // Case insensitive
            const guess = e.target.value.toLowerCase();

            // DEBUG
            if(process.env.NODE_ENV != "production") {
                titles.forEach(x => {
                    console.log("similarity for '"+x+"': "+stringSimilarity.compareTwoStrings(x, guess));
                })
            }
            
            // Clear input
            e.target.value = ''; 

            /** TODO count multiple words */
            if( possibilites.indexOf(guess) > -1 || // At least one word is right or
                titles.find(x => stringSimilarity.compareTwoStrings(x, guess) > 0.75)) // Guess is similar enough (typos should be allowed)
            {
                this.song.correct = true;
            } else {
                this.song.correct = false;
            }

            this.next(); // Next song
        },
        guessChoice(choice) {
            console.log("hm?")
            this.song.guess = choice.title;
            this.song.correct = choice.correct;

            this.next();
        },
        end() {
            this.more = false;
            this.finished = true;
        },

        // SWIPE
        swipeStart(e) {
            this.initialY = e.touches[0].clientY;
            //e.preventDefault();
        },
        swipeEnd(e) {
            const currentY = e.touches[0].clientY;
            const diff = this.initialY - currentY;
            if(diff > 15) {
                this.swipeVisible = true;
            } else if (diff < -10) {
                this.swipeVisible = false;
            }
            e.preventDefault();
        }
    },
    watch: {
        remaining(val) {
            if(val < 0) { // time is over :)))))((
                this.timer.pause();
                alert("gam over")
            }
        }
    }
    
}
</script>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;

    height: 100vh;
}

.game {
    display: flex;
    flex-direction: column;
    align-items: center;
}
/* 
    TOP
*/
.top {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.song-indicator {
    padding: 0 12px;

    text-align: center;
    font-size: 2em;
}

.active {
    color: white;
    font-size: 2.2em;
    border-bottom: 2px solid #5dc05d;
    text-shadow: 1px 1px 2px #fff;
}

.correct {
    color: #5dc05d;
}

.incorrect {
    color: #f16a48;
}

/*
    CONTROLS
*/
$bubble-background: #131a27;

@media screen and (min-width: 760px) { // DESKTOP
    .window {
        background: $bubble-background;
        border: 1px solid #27334d;

        margin: 30px 0;
        padding: 30px;

        display: none;
        flex-direction: column;

        border-radius: 6px;
    }

    .swip {
        display: none;
    }
} // DESKTOP

@media not screen and (min-width: 760px) { // MOBILE
    .window {
        background: $bubble-background;
        padding: 0;

        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;

        box-shadow: 0 -2px 3px rgba(0, 0, 0, 0.25);
    }

    .bubble {
        margin: 6px;
        
        &:nth-child(2) {
            border-left: 1px solid #27334d;
            border-right: 1px solid #27334d;
        }
    }

    .back-d {
        display: none;
    }

    .spacer {
        height: 3px;
        width: 20%;
        margin: 6px auto;
        border-radius: 12px;
        background: #27334d;
    }

    .back {
        padding: 16px 12px;

        font-weight: 500;
        text-align: center;
    }

    .choices {
        width: 100vw;
        display: flex;
        flex-direction: column;
    }
} // @media not screen and (min-width: 760px) 


.controls {
    display: flex;
    align-items: center;
}

.bubble {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 80px;
    height: 47px;

    border-radius: 3px;

    flex-grow: 1;
    padding: 12px 24px;
    
    font-size: 32px;
    transition: 200ms;

    &:hover {
        background: #161e2e;
    }
}

.loading {
    animation: spinning 1s infinite;
}

.timer {
    position: relative;
}

.remaining {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 3px;
    background: #5dc05d;
    transition: width 1s;
}

/** more window */
.more {
    background: $bubble-background;
    border: 1px solid #27334d;

    margin: 6px;
    width: 100%;
    //padding: 12px 16px;

    display: flex;
    justify-content: space-between;

    border-radius: 6px;
    border-left: 3px solid #5dc05d;
}

.more-content {
    padding: 12px 16px;
}

.more-correct {
    border-left: 3px solid #5dc05d;
}

.more-incorrect {
    border-left: 3px solid #f16a48;
}

.forward {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    border-left: 1px solid #27334d;
    flex-basis: 30%;
    min-width: 100px;

    cursor: pointer;
    transition: 200ms;
    user-select: none;

    &:hover {
        background: #161e2e; 
    }
}

.forward-icon {
    font-size: 24px;
    text-align: center;
}

.forward-text {
    display: block;
    font-size: .9em;
}

// Choices


// Player
.player {
    width: 576px;
    height: auto;

    margin-top: 6px;
    border: 1px solid #27334d;
    border-radius: 6px;
}

// Answer
.answer-input {
    background: #1b2436;

    outline: 0;
    border: 0;
    border-radius: 3px;

    margin-top: 24px;
    padding: 9px 16px;

    font: inherit;
    font-weight: 500;
    font-size: 1.5em;
    border: 1px solid #27334d;
    color: white;
    transition: 200ms;

    box-sizing: border-box;
    width: 100%;

    &::placeholder {
        opacity: 0.4;
    }
}

.back {
    text-decoration: none;
    color: white;

    border-radius: 3px;

    margin-top: 10px;

    cursor: pointer;
    transition: 200ms;

    &:hover {
        background: #1c2538;
    }
}

// media
@media screen and (min-width: 760px) {
    .choices {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))
    }

    .window {
        display: flex;
    }

    .bubble {
        border: 1px solid #27334d;
        margin: 0 24px;
    }

    .back {
        border: 1px solid #27334d;
        padding: 12px 48px;
        margin: 10px;
    }

    .choices {
        display: grid;
        width: 100%;
    }
}

// animations
.progr-enter-active, .progr-leave-active {
    transition: opacity 1s;
}

.progr-enter, .progr-leave-to {
    opacity: 0;
}

.swip-enter-active, .swip-leave-active {
    transition: margin-bottom 0.15s ease-out;
}

.swip-enter, .swip-leave-to {
    margin-bottom: -50px;

}

@keyframes spinning {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

</style>