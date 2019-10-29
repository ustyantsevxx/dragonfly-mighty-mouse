const state = {
  loading: false,
  loadingView: null,
  error: null,
  success: null
}


const getters = {
  error: state => state.error,
  success: state => state.success,
  loading: state => state.loading,
  loadingView: state => state.loadingView
}


const mutations = {
  setLoading: (state, view) => {
    state.loading = true
    state.loadingView = view
  },

  unsetLoading: state => {
    state.loading = false
    state.loadingView = null
  },

  setSuccess: (state, msg) => state.success = msg,
  unsetSuccess: state => state.success = null,

  setError: (state, err) => state.error = err,
  unsetError: state => state.error = null,
}


const actions = {}

export default { state, getters, mutations, actions }