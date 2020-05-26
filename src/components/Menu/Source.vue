<template>
    <div>
        <h3 :class="{darken: settings.choice >= 0}">Source</h3>
        <div class="source-list" :class="{darken: settings.choice >= 0}">
            <div class="source-button" @click="settings.choice = 0" :class="{ active: settings.choice == 0 }">
                <div class="source-text">MyAnimeList</div>
            </div>
            <div class="source-button" @click="settings.choice = 1" :class="{ active: settings.choice == 1 }">
                <div class="source-text">AniList</div>
            </div>
            <div class="source-button" @click="settings.choice = 2; next()" :class="{ active: settings.choice == 2 }">
                <div class="source-text">MAL Top 100</div>
            </div>
            <div class="source-button" @click="settings.choice = 3; next()" :class="{ active: settings.choice == 3 }">
                <div class="source-text">MAL Top 250</div>
            </div>
        </div>
        <div class="settings">
            <transition name="input">
                <div class="source-settings" v-if="settings.choice == 0 || settings.choice == 1">
                    <div class="source-input">
                        <input class="list-input" type="text" placeholder="Username" :value="settings.username" @input="settings.username = $event.target.value" @keyup.enter="next()" @focus="center($event)"
                        >
                        <div class="lists">
                            <div class="list" 
                              v-for="(n, i) in lists" :key="i" 
                              v-bind:class="{ 'list-active': settings.chosenLists.indexOf(n) > -1}"
                              v-on:click="add(n)"
                            >
                                {{ n | capitalize }}
                            </div>
                        </div>
                    </div>
                    <div class="next">
                        <button class="next-button" @click="next()">
                            <font-awesome-icon icon="forward" class="next-icon"></font-awesome-icon>
                            <span class="next-text">Next</span>
                        </button>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faForward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import store from '../../services/store';

library.add(faForward);

export default {
    components: { FontAwesomeIcon },
    props: ['value'],
    data: () => ({
        state: store.state,
        settings: {
            choice: -1,
            username: "",
            chosenLists: ['WATCHING', 'COMPLETED']
        },
        lists: ['WATCHING', 'COMPLETED', 'PLANNING'],
    }),
    mounted() {
        this.settings = this.state.source;
    },
    filters: {
        capitalize(val) {
            return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
        }
    },
    methods: {
        add(n) {
            let i = this.settings.chosenLists.indexOf(n);
            if(i > -1) {
                this.settings.chosenLists.splice(i, 1);
            } else {
                this.settings.chosenLists.push(n);
            }
        },
        center(e) {
            //window.scrollTo(0, e.target.offsetHeight)
            e.preventDefault();
        },
        next() {
            store.setSource(this.settings);

            this.$emit('next');
        }
    },
    watch: {
    }
}
</script>

<style lang="scss" scoped>
.source-list {
    display: flex;
    justify-content: space-evenly;
}

.source-button {
    flex: 1 1 0px;

    cursor: pointer;
    background: #1b2436;

    transition: 200ms;

    border: 1px solid #27334d;
    margin: 10px;
    border-radius: 3px;

    &:not(.active):hover {
        background: #28334b;
    }
}

.source-text {
    text-align: center;
    padding: 10px;
}

h3 {
    margin-left: 10px;
    margin-bottom: 10px;
}

.source-settings {
    margin: 10px;
}

.source-input {
    display: flex;
    flex-direction: column;
}

.lists {
    display: flex;
}

.list {
    display: inline-block;
    flex-grow: 1;

    outline: 0;
    border: 0;

    background: #1b2436;
    border: 1px solid #27334d;
    padding: 8px 16px;
    width: 100px;
    transition: 200ms;
    cursor: pointer;
    user-select: none;
    text-align: center;

    color: white;
    font: inherit;

    &:hover {
        background: #243049;
    }
}

.next {
    display: flex;
    justify-content: center;
}
.next-button {
    color: inherit;
    outline: none;
    border: none;
    font: inherit;

    margin: 20px;
    padding: 12px;
    width: 30%;

    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);

    background: #016641;
    border-radius: 666px;

    letter-spacing: 1px;

    text-align: center;

    cursor: pointer;
    user-select: none;
    transition: 200ms;

    &:hover {
        background: #01794d;
    }
}

.next-icon {
    font-size: 16px;
    padding-right: 12px;
}

.next-text {
    font-weight: 500;
    letter-spacing: 1px;
}

// INPUT
.list-input {
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    padding: 12px 16px;
    background: #1b2436;
    outline: 0;
    font: inherit;
    font-weight: 500;
    font-size: 1.1em;
    border: 1px solid #27334d;
    color: white;
    transition: 200ms;

    &::placeholder {
        opacity: 0.8;
    }
}

// TRANSITIONS
.input-enter-active, .input-leave-active {
    transition: opacity .2s;
}

.input-enter, .input-leave-to {
    opacity: 0;
}

// ACTIVE
.list-active {
    border-bottom: 3px solid #028857;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
}

.active {
    border: 1px solid #028857;
    background: #016641;
    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.25);
}

// MEDIA
@media screen and (max-width: 760px) {
    .source-list {
        flex-direction: column;
        grid-template-columns: repeat(2, 1fr);
    }

    .list-input {
        padding: 16px 16px;
    }
}
</style>