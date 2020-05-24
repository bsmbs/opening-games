<template>
  <audio ref="audio" :src="src" @loadeddata="loaded()" v-if="!video"></audio>
  <video ref="audio" :src="src" @loadeddata="loaded()" v-else></video>
</template>

<script>
export default {
  props: ['src', 'video'],
  data: () => ({
    playing: false
  }),
  methods: {
    loaded() {
      this.$emit('ready');
    },
    play() {
      this.playing = true;
      return this.$refs.audio.play()
    },
    pause() {
      this.$refs.audio.pause();
      this.playing = false;
    }
  },
  watch: {
    src() {
      this.playing = false;
    }
  }
}
</script>

<style>

</style>