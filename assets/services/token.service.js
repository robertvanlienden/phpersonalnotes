const TOKEN_KEY = 'accessToken'

const TokenService = {

    getToken () {
        return sessionStorage.getItem(TOKEN_KEY);
    },

    setToken (accessToken) {
        sessionStorage.setItem(TOKEN_KEY, accessToken);
    },

    removeToken () {
        sessionStorage.removeItem(TOKEN_KEY);
    },

    hasToken () {
        return !!this.getToken()
    },
    getClaims () {
        let token = this.getToken()
        let claims = {}

        if (token) {
            try {
                let [encodedPayload] = token.split('.')
                let buffer = new Uint8Array(encodedPayload, 'base64')
                claims = JSON.parse(buffer.toString('utf-8'))
            } catch (err) {
                claims = {}
            }
        }
        return claims
    },
    getClaim (claim, defaultValue = null) {
        let claims = this.getClaims()
        return claims[claim] || defaultValue
    }
}

export default TokenService
