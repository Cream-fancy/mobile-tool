<template>
  <view class="container">
    <u-modal v-model="modal.show" :content="modal.content" show-cancel-button @confirm="clearHistory()"></u-modal>
    <view class="tip">
      <view>仅保留最近的 50 条播放记录</view>
      <u-row justify="around">
        <u-button class="u-m-20" size="medium" @click="showHistory()">播放记录</u-button>
        <u-button class="u-m-20" size="medium" @click="modal.show=true">清空记录</u-button>
      </u-row>
    </view>
    <view class="config">
      <u-form-item label="当前搜索来源" label-width="200">
        <u-input v-model="apiName" type="select" border @click="config.show=true" />
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
        modal: {
          show: false,
          content: '播放记录将会被清空'
        }
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
        if (tvCore.cms[this.apiIdx].type == 'sp') {
          uni.navigateTo({
            url: '/pages/tv/detail?name='
              .concat(encodeURIComponent(this.keyword)),
          });
        } else {
          let data = await tvCore.findByKeyword(this.keyword);
          uni.hideLoading();
          this.vList = data.vList || [];
        }
      },
      showDetail(index) {
        let obj = this.vList[index];
        uni.navigateTo({
          url: '/pages/tv/detail?' + Object.keys(obj)
            .map(k => `${k}=${encodeURIComponent(obj[k])}`)
            .join("&"),
        });
      },
      showHistory() {
        uni.navigateTo({
          url: '/pages/tv/history'
        });
      },
      clearHistory() {
        uni.clearStorage();
      }
    },
  }
</script>

<style lang="scss" scoped>
  .container {
    padding: 20rpx;

    .tip {
      padding: 10rpx;
      color: #721c24;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 6rpx;
    }

    .result {
      min-height: 500rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
