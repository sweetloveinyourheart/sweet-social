import Cookies from 'js-cookie'

export function saveRefreshToken(token: string) {
    return Cookies.set('refreshToken', token)
}

export function getRefreshToken() {
    return Cookies.get('refreshToken')
}

export function clearRefreshToken() {
    return Cookies.remove('refreshToken')
}