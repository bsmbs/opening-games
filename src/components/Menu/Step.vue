<template>
    <div class="step">
        <span class="badge" :class="{ current: current }">{{ i }}</span>
        <span class="name"><slot></slot></span>
    </div>
</template>

<script>
export default {
    props: ["i", "current"]
}
</script>

<style lang="scss" scoped>
.step {
    padding: 20px;
    flex-grow: 1;
    flex-basis: 0;
    text-align: center;
    
    cursor: pointer;
    transition: 500ms;
    border-radius: 6px;

    &:hover {
        background: #1b2435;
    }
}

.badge {
    width: 20px;
    height: 20px;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    background: #243047;
    padding: 10px;
    text-align: center;
    border-radius: 100px;

    font-weight: 600;
}

.name {
    font-weight: 500;
    padding: 10px;
}

.current {
    background: #2c704b;
    transition: 200ms;

    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.3)
}

@media screen and (max-width: 644px) {
.name {
    display: block;
    padding: 10px 0;
}
}

</style>