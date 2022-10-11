interface State {
  showSettings: boolean
}

const state: State = {
  showSettings: false
}

const actions = {
  
}

const mutations = {
  SHOW_SETTINGS: (state: State, value: boolean) => {
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