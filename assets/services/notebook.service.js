import axios from 'axios'
import TokenService from './token.service'

axios.interceptors.request.use(function(config) {
    let accessToken = TokenService.getToken()

    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    config.headers['Accept'] = `application/json`;
    config.headers['Content-Type'] = 'application/json';
    return config

}, function(error) {
    return Promise.reject(error)
})

axios.interceptors.response.use(function(response) {
    return response
}, function(error) {

    if (error.response.status === 401) {
        TokenService.removeToken()
    }
    if (error.request.status === 500 || error.request.status === 403) {
        console.log(error.request)
        console.clear()
        return
    }

    return Promise.reject(error)
})

const NotebookService = {
    createNotebook (data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/v1/notebook', data).then(response => {
                let data = response.data;
                resolve(response.data);
            }).catch(reject);
        })
    },

    updateNotebook (id, data) {
        return new Promise((resolve, reject) => {
            axios.patch('/api/v1/notebook/' + id, data).then(response => {
                let data = response.data;
                resolve(response.data);
            }).catch(reject);
        })
    },

    getNotebooks () {
        return new Promise((resolve, reject) => {
            axios.get('/api/v1/notebook').then(response => {
                let data = response.data;
                resolve(response.data);
            }).catch(reject);
        })
    },

    deleteNotebook (id) {
        return new Promise((resolve, reject) => {
            axios.delete('/api/v1/notebook/' + id).then(response => {
                resolve(response.data);
            }).catch(reject);
        })
    },
}

export default NotebookService;
