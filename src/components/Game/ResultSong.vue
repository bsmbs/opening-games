<template>
    <div class="content">
        <span class="title">{{ song.titles[0] }}</span>
        <span class="took">Took {{ song.took }}s</span>
        <div class="buttons">
            <a class="button" :href="'https://myanimelist.net/anime/'+song.id" target="_blank">
                <span class="icon">
                    <img src="https://cdn.myanimelist.net/images/favicon.ico" />
                </span>
                <span class="text">MAL</span>
            </a>
            <a class="button" :href="song.op" target="_blank">
                <span class="icon">
                    <font-awesome-icon icon="play"></font-awesome-icon>
                </span>
                <span class="text">Opening</span>
            </a>
        </div>
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faPlay);

export default {
    components: {
        FontAwesomeIcon
    },
    props: ["song"],
};
</script>

<style lang="scss" scoped>
.content {
    flex-grow: 1;
}

.title {
    font-size: 1.1em;
}

.took {
    display: block;
    font-size: 0.9em;
}

.buttons {
    display: flex;
    margin-top: 8px;
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

.text {
    font-size: .9em;
}

.icon {
    padding-right: 6px;
    font-size: 12px;

    display: inline-flex;
    justify-content: center;

    img {
        width: 16px;
    }
}
</style>