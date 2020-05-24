<template>
    <div class="choice" :title="data.title">
        <img :src="data.cover" class="choice-img">
        <div class="choice-title">{{ data.title }}</div>
    </div>
</template>

<script>
export default {
    props: ['data']
}
</script>

<style lang="scss" scoped>
.choice {
    background: #131a27;
    border: 1px solid #27334d;

    flex: 1 1 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin: 6px;
    padding: 12px;

    border-radius: 6px;

    cursor: pointer;
    transition: 200ms;
    user-select: none;

    &:hover {
        background: #161e2e; 
    }
}

.choice-img {
    min-width: 36px;
    width: 36px;
    height: 36px;
    object-fit: cover;
    border-radius: 3px;
}

.choice-title {
    text-align: center;
    max-height: 46px;
    overflow: hidden;
    flex-grow: 1;
    padding-left: 6px;
}
</style>