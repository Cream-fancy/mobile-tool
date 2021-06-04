<template>
  <view class="container">
    <view class="config">
      <u-form-item label="当前搜索来源" label-width="200">
        <u-input v-model="apiName" type="select" border @click="config.show = true" />
      </u-form-item>
      <u-select v-model="config.show" :default-value="[apiIdx]" :list="config.list" @confirm="setApi"></u-select>
      <u-search v-model="keyword" placeholder="搜索影片" maxlength="10" height="80" shape="square" :show-action="false"
        @search="searchByKeyword" />
    </view>
    <view v-if="!vList.length" class="result">
      <u-empty class="empty" text="找不到该影片" mode="search" />
    </view>
    <scroll-view v-else scroll-y>
      <u-cell-group title="搜索结果">
        <u-cell-item v-for="(item, index) in vList" :title="item.name" :label="item.last" :value="item.note"
          @click="showDetail(index)" />
      </u-cell-group>
    </scroll-view>
  </view>
</template>

<script>
  var tvCore = require('./assets/js/core.js');

  export default {
    data() {
      return {
        keyword: '',
        vList: [],
        config: {
          show: false,
          list: []
        },
      };
    },
    computed: {
      apiIdx() {
        return this.$store.state.tv.apiIdx;
      },
      apiName: {
        get: function() {
          return this.config.list[this.apiIdx].label;
        },
        set: function(val) {}
      }
    },
    onLoad() {
      this.config.list = tvCore.cms.map((o, i) => {
        return {
          label: (o.name ? o.name : `未知${i}`) + ` [${o['type']}]`,
          value: i
        }
      });
      tvCore.setRssNet(this.apiIdx);
    },
    methods: {
      setApi(arr) {
        const idx = arr[0].value;
        tvCore.setRssNet(idx);
        this.$store.dispatch('setTv', {
          apiIdx: idx
        });
      },
      async searchByKeyword() {
        uni.hideKeyboard();
        uni.showLoading({
          mask: true,
          title: '搜索中'
        });
        let data = await tvCore.findByKeyword(this.keyword);
        uni.hideLoading();
        this.vList = data.vList || [];
      },
      showDetail(index) {
        let obj = this.vList[index];
        uni.navigateTo({
          url: '/pages/tv/detail?' + Object.keys(obj)
            .map(k => `${k}=${encodeURIComponent(obj[k])}`)
            .join("&"),
        });
      }
    },
  }
</script>

<style lang="scss" scoped>
  .config {
    padding: 0 20rpx;
  }

  .result {
    min-height: 500rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
