<template>
  <scroll-view scroll-y="true" class="content">
    <u-cell-group v-for="(list) in menu" :title="list.label">
      <u-cell-item v-for="(item, index) in list.data" :title="item.label" :index="index" @click="loadModule">
      </u-cell-item>
    </u-cell-group>
  </scroll-view>
</template>

<script>
  export default {
    data() {
      return {
        menu: [{
          label: '娱乐',
          data: [{
            label: '影视厅',
            url: '/pages/tv/index',
          }]
        }],
      }
    },
    methods: {
      loadModule(index) {
        let mod = this.menu[0].data[index];
        uni[mod.linkType || 'navigateTo']({
          url: mod.url
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    height: 100vh;
  }
</style>
