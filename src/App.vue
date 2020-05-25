<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&display=swap');

body {
  font-family: 'Jost', sans-serif;
  background: #161d2b;
  color: white;
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.darken {
    transition: .5s;
    opacity: 0.5;
}
</style>
