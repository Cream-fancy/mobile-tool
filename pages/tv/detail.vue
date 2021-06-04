<template>
  <view>
    <u-cell-item title="名称" :value="source.name" :arrow="false" hover-class="none" />
    <u-cell-item title="备注" :value="source.note" :arrow="false" hover-class="none" />
    <u-cell-item title="更新" :value="source.last" :arrow="false" hover-class="none" />
    <u-cell-item title="内容简介" :label="source.des" :arrow="false" hover-class="none" />
    <u-cell-group title="选集" class="list">
      <u-cell-item v-for="(item, index) in vList" :title="item.label" :label="item.src" @click="playReady(index)"
        :arrow="false" />
    </u-cell-group>
    <u-action-sheet :list="action.list" v-model="action.show" :mask-close-able="true" @click="onPlay"></u-action-sheet>
  </view>
</template>

<script>
  var tvCore = require('./assets/js/tv.js');

  export default {
    data() {
      return {
        source: {
          id: "",
          name: "",
          last: "",
          note: "",
          pic: "",
          des: "",
        },
        vList: [],
        video: null,
        action: {
          show: false,
          list: [{
              text: '浏览器观看',
              subText: '调用系统默认浏览器打开'
            },
            {
              text: '播放器观看',
              subText: '无倍速'
            }
          ]
        }
      }
    },
    onLoad(options) {
      if(options.id){
        this.source.id = options.id;
        this.source.name = options.name;
        this.source.last = options.last;
        this.source.note = options.note;
        tvCore.setRssNet(this.$store.state.tv.apiIdx);
        this.searchById();
      }
    },
    methods: {
      async searchById() {
        uni.showLoading({
          mask: true,
          title: '搜索中'
        });
        const res = await tvCore.findByIds(this.source.id);
        this.source.des = res.des;
        this.source.pic = res.pic;
        this.vList = res.list;
        uni.hideLoading();
      },
      playReady(index) {
        this.video = this.vList[index];
        this.action.show = true;
      },
      onPlay(index) {
        if (index) {
          uni.navigateTo({
            url: '/components/video-player/index?src=' + this.video.src
          })
        } else {
          plus.runtime.openURL(this.video.src, e => {
            uni.showToast({
              title: e
            })
          })
        }
      },
    }
  }
</script>

<style lang="scss">
</style>
