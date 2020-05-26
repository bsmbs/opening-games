<template>
    <div class="settings">
        <h3>Settings</h3>
        <div class="modes">
            <h4>Choices</h4>
            <div class="m">
                <div class="mode" v-for="i in choices" :key=i :class="{'active': settings.choices == i}" @click="setSettings('choices', i)">
                    <div class="mode-title" :class="{not: i == 0}">{{ i == 0 ? 'Guess the title' : i}}</div>
                </div>
            </div>
            <h4>Other</h4>
            <div class="switches">
                <Mswitch n="a" :checked="settings.unlimited" @input="settings.unlimited = $event">Unlimited game</Mswitch>
                <Mswitch n="b" :checked="settings.video" @input="settings.video = $event">Show video</Mswitch>
                <Mswitch n="c" :checked="settings.autoplay" @input="settings.autoplay = $event">Autoplay</Mswitch>
            </div>
        </div>
    </div>
</template>

<script>
import Mswitch from './Mswitch';
import store from '../../services/store';

export default {
    components: {
        Mswitch
    },
    data: () => ({
        state: store.state,
        choices: [0, 2, 3, 4, 5, 6],

        settings: {
            choices: 4,
            unlimited: true,
            video: false,
            autoplay: false,
        }
    }),
    mounted() {
        store.setSettings(this.settings) // reset settings
    },
    watch: {
        settings: {
            handler(val) {
                console.log("a?")
                store.setSettings(val);
            },
            deep: true
        }
    },
    methods: {
        setSettings(k, i) {
            this.settings[k] = i;
        }
    }
}
</script>

<style lang="scss" scoped>
.modes {
}

.m {
    display: flex;
    flex: 1 1 0;

    margin: 5px;
}

.mode {
    flex-grow: 1;

    background: #1b2436;
    border: 1px solid #27334d;

    padding: 10px;
    margin: 5px;
    border-radius: 3px;

    transition: 200ms;

    cursor: pointer;

    &:not(.active):hover {
        background: #28334b;
    }
}

.mode-title {
    text-align: center;
    font-weight: 500;
}

.switches {
    display: flex;
    margin-left: 10px;

    & > div {
        flex-grow: 1;
    }
}

.active {
    border: 1px solid #028857;
    background: #016641;
    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.25);
}

h3, h4 {
    margin-left: 10px;
}

@media screen and (max-width: 760px) {
    .switches {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>