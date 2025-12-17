import axios from 'axios';
// import swal from "sweetalert";
import Swal from "sweetalert2";
import {
    loginConfirmedAction,
    Logout,
} from '../store/actions/AuthActions';
import { auth } from '../firebase/config'; 

export function signUp(email, password) {
    //axios call
    const postData = {
        email,
        password,
        returnSecureToken: true,
    };
    return axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD3RPAp3nuETDn9OQimqn_YF6zdzqWITII`,
        postData,
    );
}

export function login(email, password) {
    const postData = {
        email,
        password,
        returnSecureToken: true,
    };
    return axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD3RPAp3nuETDn9OQimqn_YF6zdzqWITII`,
        postData,
    );
}

export function formatError(errorResponse) {
    switch (errorResponse.error.message) {
        case 'EMAIL_EXISTS':
            //return 'Email already exists';
            // swal("Oops", "Email already exists", "error");
              Swal.fire({
                icon: 'error',
                title: 'Oops',
                text: 'Email already exists',                        
              })
            break;
        case 'EMAIL_NOT_FOUND':
             Swal.fire({
                icon: 'error',
                title: 'Oops',
                text: 'Email not found',                        
              })
            //return 'Email not found';
                //swal("Oops", "Email not found", "error",{ button: "Try Again!",});
           break;
        case 'INVALID_PASSWORD':
            //return 'Invalid Password';
            // swal("Oops", "Invalid Password", "error",{ button: "Try Again!",});
            Swal.fire({
                icon: 'error',
                title: 'Oops',
                text: 'Invalid Password',                        
            })
            break;
        case 'USER_DISABLED':
            return 'User Disabled';

        default:
            return '';
    }
}

export function saveTokenInLocalStorage(tokenDetails) {
    tokenDetails.expireDate = new Date(
        new Date().getTime() + tokenDetails.expiresIn * 1000,
    );
    localStorage.setItem('userDetails', JSON.stringify(tokenDetails));
}

export function runLogoutTimer(dispatch, timer, navigate) {
    setTimeout(() => {
        //dispatch(Logout(history));
        dispatch(Logout(navigate));
    }, timer);
}

export function checkAutoLogin(dispatch, navigate) {
    // Firebase Auth 상태 확인
    const user = auth.currentUser;
    
    if (user) {
        console.log('🔥 Firebase 로그인 확인됨:', user.email);
        dispatch(loginConfirmedAction({
            email: user.email,
            uid: user.uid,
            idToken: user.accessToken  // 토큰도 저장
        }));
    } else {
        console.log('❌ 로그인되지 않음');
        dispatch(Logout(navigate));
    }
}