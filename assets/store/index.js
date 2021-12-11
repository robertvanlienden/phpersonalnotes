import Vue from 'vue'
import Vuex from 'vuex'
import TokenService from '../services/token.service'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        isLoggedIn: TokenService.hasToken(),
        getToken: TokenService.getClaim(),
    },
    mutations: {
        setIsLoggedIn(state, isLoggedIn) {
            state.isLoggedIn = isLoggedIn
        },
        getClaims(state, getToken) {
            state.getToken = getToken
        },
    },
    actions: {
        login({ commit }) {
            return new Promise(() => {
                commit('setIsLoggedIn', true)
            })
        },
        logout({ commit }) {
            return new Promise(() => {
                commit('setIsLoggedIn', false)
            })
        }
    },
    modules: {}
})
