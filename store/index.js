import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    tv: {
      apiIdx: 0
    },
  },
  mutations: {
    setTv(state, obj) {
      Object.keys(obj).forEach(k => {
        state.tv[k] = obj[k];
      })
    },
  },
  actions: {
    setTv({
      commit
    }, obj) {
      this.commit('setTv', obj);
    },
  }
})

export default store
