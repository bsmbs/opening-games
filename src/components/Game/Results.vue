<template>
    <div class="results">
        <h3>Results</h3>
        <div class="songs">
            <div class="song" 
                v-for="(song, i) in songs" :key="i"
                :class="[song.correct ? 'correct' : 'incorrect']">
                <div class="i">
                    {{ i+1 }}
                </div>
                <ResultSong :song="song"></ResultSong>
            </div>
        </div>
        
        <router-link to="/" class="big button">
            <span class="text">Back to menu</span>
        </router-link>
    </div>
</template>

<script>
import ResultSong from './ResultSong';

export default {
    components: {
        ResultSong
    },
    props: ['songs']
}
</script>

<style lang="scss" scoped>
.results {
    //padding: 30px;
    display: flex;
    flex-direction: column;

    border-radius: 6px;
}

h3 {
    margin: 0;
}

.songs {
    display: grid;
    grid-template-columns: 350px;
}

@media screen and (min-width: 760px) {
    .songs {
        grid-template-columns: repeat(2, 350px);
    }
}

.song {
    background: #131a27;

    border: 1px solid #27334d;
    border-radius: 3px;
    
    margin: 6px;
    padding: 12px 16px;

    display: flex;
    align-items: center;
}

.i {
    font-size: 2.5em;
    margin-right: 10px;
}

.button {
    display: block;
    text-decoration: none;
    color: inherit;

    border: 1px solid #27334d;
    border-radius: 3px;

    padding: 6px 8px;

    flex-grow: 1;
    display: flex;
    align-items: center;

    transition: 200ms;
    cursor: pointer;

    &:hover {
        background: #1c2538;
    }

    &:first-child {
        margin-right: 8px;
    }
}

.big {
    margin-top: 20px;
    margin-bottom: 10px;
    
    padding: 20px;
    justify-content: center;

    .text {
        font-size: initial;
    }
}

.correct {
    border-left: 3px solid #5dc05d;
}

.incorrect {
    border-left: 3px solid #f16a48;
}
</style>