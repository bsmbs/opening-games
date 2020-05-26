<template>
    <div class="container">
        <Progress v-if="loading"></Progress>
        <div class="content">
            <header>
                <h1>Opening Games</h1>
                <a href="https://github.com/pizza61/opening-games" target="_blank" class="header-icon-ct">
                    <font-awesome-icon :icon="['fab', 'github']" class="header-icon"></font-awesome-icon>
                </a>
            </header>
            <main>
                <div class="steps">
                    <Step 
                        v-for="(s, i) in steps" 
                        :key="i" :i="i+1" 
                        @click.native="currentStep = i"
                        :current="currentStep == i"
                    >{{ s.title }}</Step>
                </div>
                <transition name="source" mode="out-in">
                    <component style="position: relative;" :is="steps[currentStep].component" @next="currentStep++"></component>
                </transition>
            </main>
            <span style="flex: 1 1 0;"></span>

            <div class="play" :class="{ disabled: currentStep != 2 }" @click="play()">
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
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import store from '../services/store';

import Source from '@/components/Menu/Source';
import Gamemode from '@/components/Menu/Gamemode';
import Settings from '@/components/Menu/Settings';
import Step from '@/components/Menu/Step';
import Progress from '@/components/Progress';

library.add(faPlay, faCompactDisc, faGithub);

export default {
    components: { 
        Source, Gamemode, Settings, Progress, Step, FontAwesomeIcon
    },

    data: () => ({
        gamemode: -1,
        username: "",
        loading: false,

        currentStep: 0,
        steps: [{
            title: "Select game",
            component: "Gamemode"
        }, {
            title: "Source",
            component: "Source"
        }, {
            title: "Settings",
            component: "Settings"
        }],

        state: store.state,
    }),
    mounted() { 
        window.scrollTo(0, 0);
    },
    methods: {
        // Start
        play() {
            // check
            if(this.state.gamemode < 0 || this.state.source.choice == -1 || this.currentStep != 2) return;
            // Fetch user lists
            this.loading = true;
            store.fetchList(this.state.source.choice, this.state.source.username)
            .then(list => {
                this.loading = false;
                if(this.state.source.choice == 0 || this.state.source.choice == 1) {
                    const filtered = list.filter(x => this.state.source.chosenLists.indexOf(x.list) > -1);
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
            //window.scrollBy({ top: this.$refs.el.$el.scrollHeight, behavior: 'smooth' })
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    height: 100vh;
    position: relative;
    //background: #161d2b;
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

.steps {
    display: flex;
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
}

.play-text {
    font-size: .9em;
    padding-left: 16px;
    letter-spacing: 1px;
}

h1 {
    display: block;
    padding: 20px;
    margin: 0;
}

.header-icon-ct {
    display: none;
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

@media screen and (max-width: 644px) {
    header {
        background: #2c704b;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2);

        h1 {
            font-size: 1.2em;
            padding: 16px 20px;
        }
    }

    .header-icon-ct {
        padding: 16px 20px;
        font-size: 20px;
        display: block;

        color: inherit;
        
    }
}

.animated {
    animation: spinning 1s infinite linear;
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
    transition: all .3s;
}

.source-enter, .source-leave-to {
    margin-top: 50px;
    opacity: 0;
}
</style>