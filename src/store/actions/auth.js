import axios from 'axios'
import * as actionTypes from './actionTypes'


export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (token, userId) => {

    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    }
}

export const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('expirationDate')
        localStorage.removeItem('userId')
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const checkAuthTimeOut = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout())
        },expirationTime * 1000)
    }
}

export const auth = (email, password, isLogin) => dispatch => {
    dispatch(authStart())

    const authData = {
        email: email,
        password: password,
        returnSecureToken: true
    }

    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDF4Au8bh46NKAx6j1nbwg5wr__q1lHf4w'

    if(isLogin) {
        url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDF4Au8bh46NKAx6j1nbwg5wr__q1lHf4w'
    }

    axios.post(url, authData)
        .then(res => {
            
            const expirationDate = new Date(new Date().getTime() + res.data.expiresIn * 1000)
            localStorage.setItem('token', res.data.idToken)
            localStorage.setItem('expirationDate', expirationDate)
            localStorage.setItem('userId', res.data.localId)
            dispatch(authSuccess(res.data.idToken,res.data.localId))
            dispatch(checkAuthTimeOut(res.data.expiresIn))
        })
        .catch(err => dispatch(authFail(err.response.data.error)))
}

export const setAuthRediredctPath = path => {
    return  {
        type:actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}


export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token')
        if(!token) {
            dispatch(logout())
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'))
            if( new Date() >= expirationDate) {
                dispatch(logout())
            } else {
                const userId = localStorage.getItem('userId')

                dispatch(authSuccess(token, userId))
                dispatch(checkAuthTimeOut((expirationDate.getTime() - new Date().getTime()) / 1000))
            }
        }
    }
}