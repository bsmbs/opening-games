<template>
    <div class="modes">
        <div class="mode" 
            v-for="mode in modes" 
            :key="mode.id"
            :style="{ borderTop: '3px solid '+mode.color, background: (active == mode.id ? mode.darker : '')}"
            :class="{ disabled: !mode.active }"
            @click="choose(mode.id)"
        >
            <div class="title">{{ mode.title }}</div>
            <div class="desc">{{ mode.desc }}</div>
        </div>
    </div>
</template>

<script>
import store from '../../services/store';

export default {
   data: () => ({
       modes: [
           {
               id: 0,
                title: "Guess the anime",
                desc: "You have 30 seconds of playing time for 7 songs. You can pause anytime and think as much as you want.",
                color: '#1a9e60',
                darker: '#125737',
                active: true
           },
           {
                id: 1,
                title: "Guess the studio",
                desc: "Guess the animation studio based on opening animation. No time limit.",
                color: '#c77211',
                darker: '#74430b',
                active: false
           }
       ],
       active: -1,
       state: store.state
   }),
   methods: {
       choose(id) {
           if(this.active == id) id = -1;
           this.active = id;
           store.setGamemode(id);
           
           this.$emit('next');
       }
   }
}
</script>

<style lang="scss" scoped>

.mode {
    flex-grow: 1;
    flex-basis: 0;

    background: #1b2436;
    border: 1px solid #27334d;
    border-radius: 3px;

    margin: 10px;
    padding: 15px;

    cursor: pointer;
    transition: .2s;

    &:hover {
        background: #243047;
    }
}

.title {
    font-size: 1.5em;
}

.desc {
    padding-top: 6px;
    line-height: 140%;
}
</style>