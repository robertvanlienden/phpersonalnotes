import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../views/Home';
import Notebooks from '../views/Notebooks';
import AddNote from "../views/AddNote";
import AddNotebook from "../views/AddNotebook";
import Register from "../views/Register";
import Login from "../views/Login";
import NotFound from "../views/NotFound";
import TokenService from "../services/token.service";
import store from '../store';
import Notes from "../views/Notes";
import Note from "../views/Note";

const requireAuth = function (to, from, next) {
    if (!TokenService.hasToken()) {
        next({name: 'home'})
    } else {
        next()
    }
}

const requireGuest = function (to, from, next) {
    if (TokenService.hasToken()) {
        next({name: 'home'})
    } else {
        next()
    }
}

const logout = function (to, from, next) {
    TokenService.removeToken()
    sessionStorage.removeItem('userName');
    store.dispatch('logout')
    next({name: 'home'})
}

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: '/', name: 'home', component: Home},
        {path: '/register', name: 'register', component: Register, beforeEnter: requireGuest},
        {path: '/login', name: 'login', component: Login, beforeEnter: requireGuest},
        {path: '/logout', name: 'logout', beforeEnter: logout},
        {path: '/notebooks', name: 'notebooks', component: Notebooks, beforeEnter: requireAuth},
        {path: '/notes', name: 'notes', component: Notes, beforeEnter: requireAuth},
        {path: '/note/:noteId', name: 'note', component: Note, beforeEnter: requireAuth},
        {path: '/notes/:notebookId', name: 'notesFromNotebook', component: Notes, beforeEnter: requireAuth},
        {path: '/add-note', name: 'addNote', component: AddNote, beforeEnter: requireAuth},
        {path: '/add-notebook', name: 'AddNotebook', component: AddNotebook, beforeEnter: requireAuth},
        {path: '*', name: 'NotFound', component: NotFound, beforeEnter: requireAuth},
    ]
});

export default router;
