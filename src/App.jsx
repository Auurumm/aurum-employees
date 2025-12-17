// src/App.jsx
import React, { lazy, Suspense, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';

// Firebase
import { db, auth } from './firebase/config';

// Components
import Index from './jsx/router/index';
import Portal from './jsx/pages/authentication/Portal';

// Actions
import { loginConfirmedAction } from './store/actions/AuthActions';  // ✅ 추가
import { isAuthenticated } from './store/selectors/AuthSelectors';

// Styles
import 'rsuite/dist/rsuite-no-reset.min.css';
import "./assets/css/style.css";

// Firebase 테스트 (나중에 삭제 가능)
console.log('Firebase DB:', db);
console.log('Firebase Auth:', auth);

const SignUp = lazy(() => import('./jsx/pages/authentication/Registration'));
const Login = lazy(() => {
    return new Promise(resolve => {
        setTimeout(() => resolve(import('./jsx/pages/authentication/Login')), 500);
    });
});

function withRouter(Component) {
    function ComponentWithRouterProp(props) {
      let location = useLocation();
      let navigate = useNavigate();
      let params = useParams();
      
      return (
        <Component
          {...props}
          router={{ location, navigate, params }}
        />
      );
    }
    return ComponentWithRouterProp;
}

function App (props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();  // ✅ 추가
    
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                console.log('🔥 Firebase 로그인 감지:', user.email);
                dispatch(loginConfirmedAction({
                    email: user.email,
                    uid: user.uid,
                    idToken: user.accessToken
                }));
                
                // ✅ 로그인 페이지에 있으면 홈으로 이동
                if (location.pathname === '/login') {
                    navigate('/');
                }
            } else {
                console.log('❌ 로그인 안 됨');
            }
        });
        
        return () => unsubscribe();
    }, [dispatch, navigate, location]);  // ✅ location 추가
    
    
    let routeblog = (  
        <Routes>
            <Route path='/' element={<Portal />} />
            <Route path='/login' element={<Portal />} />
            <Route path='/page-register' element={<SignUp />} />
            <Route path='*' element={<Navigate to="/" />} />
        </Routes>
    );
    
    if (props.isAuthenticated) {
        return (
            <>
                <Suspense fallback={
                    <div id="preloader">
                        <div className="sk-three-bounce">
                            <div className="sk-child sk-bounce1"></div>
                            <div className="sk-child sk-bounce2"></div>
                            <div className="sk-child sk-bounce3"></div>
                        </div>
                    </div>  
                   }
                >
                    <Index />
                </Suspense>
            </>
        );
    } else {
        return (
            <div className="vh-100">
                <Suspense fallback={
                    <div id="preloader">
                        <div className="sk-three-bounce">
                            <div className="sk-child sk-bounce1"></div>
                            <div className="sk-child sk-bounce2"></div>
                            <div className="sk-child sk-bounce3"></div>
                        </div>
                    </div>
                  }
                >
                    {routeblog}
                </Suspense>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: isAuthenticated(state),
    };
};

export default withRouter(connect(mapStateToProps)(App));