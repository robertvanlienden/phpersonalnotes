import Vue from 'vue'
import Vuex from 'vuex'
import TokenService from '../services/token.service'
import noteService from "../services/note.service";
import NoteService from "../services/note.service";
import NotebookService from "../services/notebook.service";
import notebookService from "../services/notebook.service";

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
        },
        getNote: (state) => (id) => {
            return state.notes.filter(note => note.id === id)[0];
        }
    },
    actions: {
        setNotes({ commit }) {
            return new Promise((resolve, reject) => {
                noteService.getNotes()
                    .then((response) => {
                        commit('setNotes', response);
                        resolve(response);})
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
        setNotebooks({ commit }) {
            return new Promise((resolve, reject) => {
                NotebookService.getNotebooks()
                    .then((response) => {
                        commit('setNotebooks', response)
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    })
            })
        },
        updateNotebook({ commit }, notebook) {
            return new Promise((resolve, reject) => {
                NotebookService.updateNotebook(notebook.id, {
                    title: notebook.title,
                }).then((response) => {
                    commit('updateNotebook', response)
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                })
            })
        },
        updateNote({ commit }, note) {
            return new Promise((resolve, reject) => {
                NoteService.updateNote(note.id, {
                    title: note.title,
                    content: note.content,
                    notebook: note.notebook,
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
                notebookService.deleteNotebook(notebookId)
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
            return new Promise((resolve, reject) => {
                notebookService.deleteNotebook(noteId)
                    .then((response) => {
                        commit('removeNote', noteId)
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    })
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
