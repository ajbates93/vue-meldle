const state = {
  showSettings: false
}

const actions = {
  
}

const mutations = {
  SHOW_SETTINGS: (state, value) => {
    state.showSettings = value
  }
}

const getters = {

}

export default { 
  namespaced: true,
  state,
  actions,
  mutations,
  getters  
}