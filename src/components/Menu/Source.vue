<template>
    <div>
        <h3>Source</h3>
        <div class="source-list">
            <div class="source-button" @click="settings.choice = 0" :class="{ active: settings.choice == 0 }">
                <div class="source-text">MyAnimeList</div>
            </div>
            <div class="source-button" @click="settings.choice = 1" :class="{ active: settings.choice == 1 }">
                <div class="source-text">AniList</div>
            </div>
            <div class="source-button" @click="settings.choice = 2" :class="{ active: settings.choice == 2 }">
                <div class="source-text">MAL Top 100</div>
            </div>
            <div class="source-button" @click="settings.choice = 3" :class="{ active: settings.choice == 3 }">
                <div class="source-text">MAL Top 250</div>
            </div>
        </div>
        <div class="settings">
            <div class="source-settings">
                <transition name="input">
                    <div class="source-input" v-if="settings.choice == 0 || settings.choice == 1">
                        <input class="list-input" type="text" placeholder="Username" @input="settings.username = $event.target.value"
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
                </transition>
            </div>
        </div>
        

    </div>
</template>

<script>
export default {
    props: ['value'],
    data: () => ({
        settings: {
            choice: -1,
            username: "",
            chosenLists: ['WATCHING', 'COMPLETED']
        },
        lists: ['WATCHING', 'COMPLETED', 'PLANNING'],
    }),
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
        }
    },
    watch: {
        settings: {
            handler(val) {
                this.$emit('settings', val)
            },
            deep: true
        }
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

    transition: 100ms;

    border: 1px solid #27334d;
    margin: 10px;
    border-radius: 3px;
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
        display: grid;
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>