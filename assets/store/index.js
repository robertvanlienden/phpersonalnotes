import Vue from 'vue'
import Vuex from 'vuex'
import TokenService from '../services/token.service'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        isLoggedIn: TokenService.hasToken(),
        getToken: TokenService.getClaim(),
        notebooks: null,
    },
    mutations: {
        setNotebooks(state, notebooks) {
            state.notebooks = notebooks
        },
        updateNotebook(state, payload) {
            const notebook = state.notebooks.find(object => object.id === payload.id)
            notebook.title = payload.title
        },
        removeNotebook(state, payload) {
            const notebook = state.notebooks.findIndex(object => object.id === payload)
            const lastItem = state.notebooks.at(-1);
            console.log(notebook);
            console.log(lastItem);

            if(notebook === lastItem) {
                state.notebooks.splice(notebook, -1)
            } else {
                state.notebooks.splice(notebook, 1)
            }
        },
        setIsLoggedIn(state, isLoggedIn) {
            state.isLoggedIn = isLoggedIn
        },
        getClaims(state, getToken) {
            state.getToken = getToken
        },
    },
    actions: {
        getNotebooks({ commit }, notebooks) {
            return new Promise(() => {
                commit('setNotebooks', notebooks)
            })
        },
        updateNotebook({ commit }, notebook) {
            return new Promise(() => {
                commit('updateNotebook', notebook)
            })
        },
        removeNotebook({ commit }, notebookId) {
            return new Promise(() => {
                commit('removeNotebook', notebookId)
            })
        },
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
