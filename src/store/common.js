const state = {
  loadingView: null,
  toastMsg: null
}

const getters = {
  toastMsg: s => s.toastMsg,
  loadingView: s => s.loadingView
}

const mutations = {
  setLoading: (s, view) => s.loadingView = view,
  setToastMsg: (s, msg) => s.toastMsg = msg,
  unsetLoading: s => s.loadingView = null,
  unsetToastMsg: s => s.toastMsg = null,
}

const actions = {}


export default { state, getters, mutations, actions }