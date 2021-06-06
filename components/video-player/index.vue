<template>
  <view class="container">
    <web-view :src="src" />
  </view>
</template>

<script>
  export default {
    data() {
      return {
        src: '',
      }
    },
    onLoad(options) {
      this.src = decodeURIComponent(options.src);
      uni.setNavigationBarTitle({
        title: decodeURIComponent(options.name)
      })
      if (this.src.endsWith('.m3u8')) {
        this.src = `https://cream-fancy.gitee.io/web-player/?src=${encodeURIComponent(this.src)}&name=${options.name}`;
      }
    },
    methods: {}
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
