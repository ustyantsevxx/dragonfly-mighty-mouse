const state = {
  loading: false,
  error: null,
  success: null
}


const getters = {
  error: state => state.error,
  success: state => state.success,
  loading: state => state.loading
}


const mutations = {
  setLoading: state => state.loading = true,
  unsetLoading: state => state.loading = false,

  setSuccess: (state, msg) => state.success = msg,
  unsetSuccess: state => state.success = null,

  setError: (state, err) => state.error = err,
  unsetError: state => state.error = null,
}


const actions = {}

export default { state, getters, mutations, actions }