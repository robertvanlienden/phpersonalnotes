import Vue from 'vue'
import Vuex from 'vuex'
import TokenService from '../services/token.service'
import noteService from "../services/note.service";
import NoteService from "../services/note.service";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        isLoggedIn: TokenService.hasToken(),
        getToken: TokenService.getClaim(),
        notebooks: [],
        notes: [],
    },
    mutations: {
        setNotes(state, notes) {
            state.notes = notes
        },
        updateNote(state, payload) {
            const note = state.notes.find(object => object.id === payload.id)
            note.title = payload.title
            note.content = payload.content
            note.notebook = payload.notebook
        },
        removeNote(state, payload) {
            const note = state.notes.findIndex(object => object.id === payload)
            const lastItem = state.notes.at(-1);

            if(note === lastItem) {
                state.notes.splice(note, -1)
            } else {
                state.notes.splice(note, 1)
            }
        },
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
    getters: {
        getNotes: (state) => (id) => {
            if (id) {
                return state.notes.filter(note => note.notebook.id === id);
            } else {
                return state.notes;
            }
        }
    },
    actions: {
        setNotes({ commit }) {
            return new Promise((resolve, reject) => {
                noteService.getNotes()
                    .then((response) => {
                        return new Promise(() => {
                            commit('setNotes', response);
                            resolve(response);
                        })                })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
        setNotebooks({ commit }, notebooks) {
            return new Promise(() => {
                commit('setNotebooks', notebooks)
            })
        },
        updateNotebook({ commit }, notebook) {
            return new Promise(() => {
                commit('updateNotebook', notebook)
            })
        },
        updateNote({ commit }, note) {
            return new Promise((resolve, reject) => {
                NoteService.updateNote(note.id, {
                    title: note.title,
                    content: note.content,
                    notebook: note.notebook.id,
                }).then((response) => {
                    commit('updateNote', response)
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                })
            })
        },
        removeNotebook({ commit }, notebookId) {
            return new Promise((resolve, reject) => {
                noteService.deleteNote(notebookId)
                    .then((response) => {
                        commit('removeNotebook', notebookId)
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    })
            })
        },
        removeNote({ commit }, noteId) {
            return new Promise(() => {
                commit('removeNote', noteId)
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
