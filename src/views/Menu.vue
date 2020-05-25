<template>
    <div class="container">
        <Progress v-if="loading"></Progress>
        <div class="content">
            <header>
                <h1>Opening Games</h1>
            </header>
            <main>
                <Gamemode v-on:mode="mode($event)" :class="{ darken: gamemode >= 0 }"></Gamemode>
                <transition name="source">
                    <div v-if="gamemode >= 0">
                        <Source ref="el" @settings="sets($event)" />
                        <div class="separator"></div>
                        <Settings></Settings>
                    </div>
                </transition>
            </main>
            <span style="flex: 1 1 0;"></span>

            <div class="play"  @click="play()">
                <font-awesome-icon icon="compact-disc" class="play-icon animated" v-if="loading"></font-awesome-icon>
                <font-awesome-icon icon="play" class="play-icon" v-else></font-awesome-icon>
                <span class="play-text">Start</span>
            </div>
            <footer>
                <span>Powered by <a href="https://animethemes.moe">animethemes.moe</a>. Source code on <a href="https://github.com/pizza61/opening-games">GitHub</a></span>
            </footer>
        </div>
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlay, faCompactDisc } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import store from '../services/store';

import Source from '@/components/Menu/Source';
import Gamemode from '@/components/Menu/Gamemode';
import Settings from '@/components/Menu/Settings';
import Progress from '@/components/Progress';

library.add(faPlay, faCompactDisc);

export default {
    components: { 
        Source, Gamemode, Settings, Progress, FontAwesomeIcon
    },

    data: () => ({
        gamemode: -1,
        username: "",
        settings: null,
        loading: false,

        state: store.state,
    }),
    mounted() { },
    destroyed() {
    },
    methods: {
        // Mode, soruce, settings
        mode(id) {
            this.gamemode = id;
        },
        sets(v) {
            this.settings = v;
        },

        // Start
        play() {
            // check
            if(this.gamemode < 0 || !this.settings) return;
            // Fetch user lists
            this.loading = true;
            store.fetchList(this.settings.choice, this.settings.username)
            .then(list => {
                this.loading = false;
                if(this.settings.choice == 0 || this.settings.choice == 1) {
                    const filtered = list.filter(x => this.settings.chosenLists.indexOf(x.list) > -1);
                    this.state.list = filtered;
                } else {
                    this.state.list = list;
                }
                this.$router.push('game');
            })
            .catch(e => {
                this.loading = false;
                alert("Something went wrong")
            })
        }
    },
    watch: {
        settings() {
            window.scrollBy({ top: this.$refs.el.$el.scrollHeight, behavior: 'smooth' })
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    height: 100vh;
    position: relative;
    background: #161d2bec;
}

.content {
    max-width: 809px;
    margin: auto;

    height: 100vh;
    display: flex;
    flex-direction: column;
}

.bg {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
    object-fit: cover;
}

main {
    display: flex;
    flex-direction: column;
}

.play {    
    transition: 200ms;
    font-size: 1.3em;

    z-index: 1;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    margin: 20px;
    padding: 12px 24px;
    box-shadow: 0 5px 10px #111;

    background: #016641;
    border-radius: 666px;

    &:hover {
        background: #01794d;
    }
}

.play-icon {
    font-size: 16px;
    padding-right: 12px;
}

.play-text {
    font-size: .9em;
    letter-spacing: 1px;
}

h1 {
    display: block;
    padding: 20px;
    margin: 0;
}

.separator {
    background: #27334d;
    height: 2px;
    margin: 10px auto;
}

footer {
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 0.6;
    z-index: 0;

    a {
        text-decoration: none;
        color: lightskyblue;
    }
}

@media screen and (max-width: 760px) {
    .play {
        position: fixed;
        bottom: 0;
        right: 0;
    }
}

.animated {
    animation: spinning 1s;
}

@keyframes spinning {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.source-enter-active, .source-leave-active {
    transition: opacity .2s;
}

.source-enter, .source-leave-to {
    opacity: 0;
}
</style>