<template>
    <div class="progress"></div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
.progress {
    position: fixed;
    z-index: 1;
    top: 0;
	left: 0;
    width: 100%;
    border-radius: 1px;
	height: 3px;
    background-color: #028857;
    box-shadow: 1px 0 6px 1px #02885763;
    animation: load 1s;
}

@keyframes load {
    from { width: 0%; }
    to { width: 100%; }
}
</style>