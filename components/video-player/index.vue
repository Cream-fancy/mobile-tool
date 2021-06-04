<template>
  <view class="container">
    <video id="player" class="video" :src="src" autoplay direction="-90" objectFit="contain">
    </video>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        src: '',
        context: null,
      }
    },
    onLoad(options) {
      this.src = options.src;
      this.context = uni.createVideoContext('player', this);
    },
    methods: {
    }
  }
</script>

<style lang="scss">
  .container {
    padding: 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .video {
      width: 100%;
    }
  }
</style>
