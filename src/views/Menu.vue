<template>
    <div class="container">
        <Progress v-if="loading"></Progress>
        <div class="content">
            <header>
                <h1>Opening Games</h1>
            </header>
            <main>
                <Gamemode v-on:mode="mode($event)"></Gamemode>
                <transition name="source">
                    <div v-if="gamemode >= 0">
                        <Source @settings="sets($event)" />
                        <div class="separator"></div>
                        <Settings v-if="settings"></Settings>
                    </div>
                </transition>
            </main>
            <span style="flex: 1 1 0;"></span>
            <div class="play" :class="{ disabled: gamemode < 0 || !settings || loading }" @click="play()">
                Start
            </div>
            <footer>
                <span>&#127279; pizza61 2020; Powered by <a href="https://animethemes.moe">animethemes.moe</a>. Source code on <a href="https://github.com/pizza61/opening-games">GitHub</a></span>
            </footer>
        </div>
    </div>
</template>

<script>
import store from '../services/store';

import Source from '@/components/Menu/Source';
import Gamemode from '@/components/Menu/Gamemode';
import Settings from '@/components/Menu/Settings';
import Progress from '@/components/Progress';

export default {
    components: { 
        Source, Gamemode, Settings, Progress
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
    text-align: center;
    background: #161d2b;
    transition: 200ms;
    padding: 30px;
    font-size: 1.3em;
    margin-bottom: 40px;
    border: 1px solid #27334d;
    cursor: pointer;

    &:hover {
        background: #212b3f;
    }
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

    a {
        text-decoration: none;
        color: lightskyblue;
    }
}

.source-enter-active, .source-leave-active {
    transition: opacity .2s;
}

.source-enter, .source-leave-to {
    opacity: 0;
}
</style>