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

const ApiLoginService = {
    // Register
    register (data) {
        return new Promise((resolve, reject) => {
            axios.post('api/register', data).then(resolve).catch(reject);
        })
    },
    login (data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/login_check', data).then(response => {
                let data = response.data;
                let accessToken = data.access_token || data.token || null

                if (accessToken) {
                    TokenService.setToken(accessToken)
                    resolve(response.data);
                } else {
                    reject();
                }
            }).catch(reject);
        })
    },
}

export default ApiLoginService;
