<template>
  <view class="container">
    <view v-if="historyList.length">
      <u-cell-group v-for="(dayData, dayIdx) in historyList" :title="dayData.dayTime" class="list">
        <u-cell-item v-for="(item, vIdx) in dayData.playList" @click="showDetail(dayIdx,vIdx)" :title="item.vi.name"
          :label="item.ep+' '+item.vi.apiName" :arrow="false" />
        </u-swipe-action>
      </u-cell-group>
    </view>
    <view v-else>
      <u-empty class="u-m-t-80" text="暂无播放记录" mode="history"></u-empty>
    </view>
  </view>
</template>

<script>
  var tvCore = require('./assets/js/core.js');

  export default {
    data() {
      return {
        historyList: []
      }
    },
    onLoad() {
      let that = this;
      uni.getStorage({
        key: 'tv_history',
        success: function(res) {
          let data = JSON.parse(res.data);
          let arr = [];
          for (let k in data) {
            arr.push(data[k]);
          }
          if (arr.length == 0) return;
          // 升序排列
          arr.sort((a, b) => a.ts - b.ts);
          // 保留前 50 个
          arr.splice(0, Math.max(0, arr.length - 50));
          // 头插法
          let pre = '';
          let dataObj = {};
          let curTs = new Date().getTime();
          let daySpan = 86400000;
          let monthSpan = 30 * daySpan;
          let quarterSpan = 3 * monthSpan;

          function tsFmt(ts) {
            let dt = curTs - ts;
            if (dt <= 3 * daySpan) {
              return '3 天之内';
            } else if (dt <= 3 * daySpan) {
              return '1 周之内';
            } else if (dt <= monthSpan) {
              return '1 个月内';
            } else if (dt <= quarterSpan) {
              return '3 个月内';
            } else {
              return '更多';
            }
          }
          arr.forEach(o => {
            let k = o.vi.apiName + '-' + o.vi.channelIdx + '-' + o.vi.id + '-' + o.vi.name;
            dataObj[k] = JSON.parse(JSON.stringify(o));
            o.show = false;
            let cur = tsFmt(o.ts);
            if (pre != cur) {
              pre = cur;
              that.historyList.unshift({
                dayTime: cur,
                playList: [o]
              })
            } else {
              that.historyList[0].playList.unshift(o);
            }
          });
          // 存入缓存
          uni.setStorage({
            key: 'tv_history',
            data: JSON.stringify(dataObj),
          })
        }
      });
    },
    methods: {
      showDetail(dayIdx, vIdx) {
        let vi = this.historyList[dayIdx].playList[vIdx].vi;
        let idx = tvCore.cms.findIndex(o => o.name == vi.apiName);
        tvCore.setRssNet(idx);
        this.$store.dispatch('setTv', {
          apiIdx: idx
        });
        uni.navigateTo({
          url: '/pages/tv/detail?' + Object.keys(vi)
            .map(k => `${k}=${encodeURIComponent(vi[k])}`)
            .join("&"),
        });
      }
    }
  }
</script>

<style>

</style>
