import React, { useState, useEffect } from 'react' 
import { connect, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { loadingToggleAction,loginAction,
} from '../../../store/actions/AuthActions';

// 🔥 Firebase 추가
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase/config';  

// image
// import logoFull from "../../../assets/images/logo-full.png";
import { IMAGES } from '../../constant/theme';

function Login (props) {
	const date = new Date();
  	const [email, setEmail] = useState('demo@example.com');
    let errorsObj = { email: '', password: '' };
    const [errors, setErrors] = useState(errorsObj);
    const [password, setPassword] = useState('123456');

    const dispatch = useDispatch();
	const navigate = useNavigate();

    // 🧪 Firebase 테스트 useEffect (function 안으로 이동)
    useEffect(() => {
        console.log('🔥 Firebase Auth 객체:', auth);
        console.log('🔥 현재 로그인된 사용자:', auth.currentUser);
    }, []);

    // ✅ testFirebaseLogin 함수를 onLogin 밖으로 이동
    const testFirebaseLogin = async (e) => {
        e.preventDefault();
        console.log('🧪 Firebase 로그인 테스트 시작...');
        
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth, 
                email, 
                password
            );
            console.log('✅ Firebase 로그인 성공!');
            console.log('사용자 정보:', userCredential.user);
            alert('Firebase 로그인 성공! 콘솔을 확인하세요.');

				navigate('/dashboard')

        } catch (error) {
            console.error('❌ Firebase 로그인 실패:', error.message);
            alert(`로그인 실패: ${error.message}`);
        }
    };

    function onLogin(e) {
        e.preventDefault();
        let error = false;
        const errorObj = { ...errorsObj };
        
        if (email === '') {
            errorObj.email = 'Email is Required';
            error = true;
        }
        if (password === '') {
            errorObj.password = 'Password is Required';
            error = true;
        }
        setErrors(errorObj);
        if (error) {
			return ;
		}
		dispatch(loadingToggleAction(true));	
        dispatch(loginAction(email, password, navigate));
    }

  	return (
		<div className="fix-wrapper">
			<div className="container-fluid">
				<div className="row h-100 align-items-center justify-contain-center">
					{/* <div className="col-lg-5 col-md-6">
						<div className="card mb-0 h-auto">
							<div className="card-body">
								<div className="text-center mb-2">
									<Link to={"/dashboard"}>
										<img src={logoFull} alt="logo" />                                                                              
									</Link>
								</div>
									
								<h4 className="text-center mb-4">Sign in your account</h4>														
								{props.errorMessage && (
									<div className='text-danger p-1 my-2'>
										{props.errorMessage}
									</div>
								)}
								{props.successMessage && (
									<div className='text-danger p-1 my-2'>
										{props.successMessage}
									</div>
								)}
								<form onSubmit={onLogin}>
									<div className="mb-3">
										<label className="mb-1"><strong>Email</strong></label>												
										<input type="email" className="form-control"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											placeholder="Type Your Email Address"
										/>									
										{errors.email && <div className="text-danger fs-12">{errors.email}</div>}
									</div>
									<div className="mb-3">
										<label className="mb-1"><strong>Password</strong></label>
										<input
											type="password"
											className="form-control"
											value={password}
											placeholder="Type Your Password"
											onChange={(e) =>
												setPassword(e.target.value)
											}
										/>
										{errors.password && <div className="text-danger fs-12">{errors.password}</div>}
									</div>
									<div className="row d-flex justify-content-between mt-4 mb-2">
										<div className="mb-3">
										<div className="form-check custom-checkbox ms-1">
												<input type="checkbox" className="form-check-input" id="basic_checkbox_1" />
												<label className="form-check-label" htmlFor="basic_checkbox_1">Remember my preference</label>
											</div>
										</div>										
									</div>
									<div className="text-center">
										<button type="submit" className="btn btn-primary btn-block">Sign Me In</button>
									</div>
								</form>
								<div className="new-account mt-3">
									<p>Don't have an account? <Link  to="/page-register" className="text-primary">Sign up</Link></p>
								</div>
									
								
							</div>
						</div>
					</div> */}
					<div className="col-xl-12">
						<div className="card main-width">
							<div className="card-body  p-0">
								<div className="row m-0">
									<div className="col-xl-4 col-lg-4">
										<div className="card">
											<div className="card-body">								
												<div className="d-flex align-items-center justify-content-between mb-4">
													<Link to={"#"}>
														<svg width="136" height="57" viewBox="0 0 136 57" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path fillRule="evenodd" clipRule="evenodd" d="M2.54005 18.87C0.803374 36.494 11.2722 42.3515 16.6309 45.1505C16.7135 45.1082 16.7976 45.0653 16.8832 45.0216C22.0336 42.3892 32.2346 37.1758 30.7217 18.9219L16.6309 10.3172L2.54005 18.87ZM5.46839 20.8242C4.11209 34.571 12.4369 39.3387 16.6218 41.5221C16.6751 41.4949 16.7293 41.4671 16.7842 41.4391C20.803 39.3864 29.1089 35.1439 27.924 20.8647L16.6218 14.153L5.46839 20.8242Z" fill="#2696FD"/>
															<path d="M27.099 30.6366L14.0005 22.654L16.6798 20.8916L27.8432 27.7339L27.099 30.6366Z" fill="#2696FD"/>
															<path d="M27.099 30.6366L14.0005 22.654L16.6798 20.8916L27.8432 27.7339L27.099 30.6366Z" fill="#2696FD" stroke="#2696FD"/>
															<path d="M5.26833 24.7274L19.0119 32.8137L16.7295 34.9908L4.52411 27.6301L5.26833 24.7274Z" fill="#2696FD"/>
															<path d="M5.26833 24.7274L19.0119 32.8137L16.7295 34.9908L4.52411 27.6301L5.26833 24.7274Z" fill="#2696FD" stroke="#2696FD"/>
															<path d="M44.8726 38.0501C43.2811 38.0501 41.9092 37.7819 40.7568 37.2451C39.6227 36.6894 38.5801 35.8556 37.6288 34.7439L40.4275 31.8401C41.0495 32.5876 41.7355 33.1721 42.4854 33.5939C43.2537 33.9964 44.1408 34.1976 45.147 34.1976C46.0615 34.1976 46.7658 34.0251 47.2597 33.6801C47.772 33.3351 48.028 32.8559 48.028 32.2426C48.028 31.6869 47.8634 31.2364 47.5341 30.8914C47.2049 30.5464 46.7658 30.2494 46.2171 30.0001C45.6867 29.7509 45.0921 29.5114 44.4336 29.2814C43.7934 29.0514 43.153 28.7926 42.5129 28.5051C41.8727 28.1984 41.2781 27.8246 40.7293 27.3839C40.1989 26.9239 39.769 26.3584 39.4397 25.6876C39.1105 24.9976 38.9458 24.1351 38.9458 23.1001C38.9458 21.8544 39.2293 20.7809 39.7964 19.8801C40.3817 18.9793 41.1867 18.2989 42.211 17.8389C43.2353 17.3597 44.4152 17.1201 45.7506 17.1201C47.1042 17.1201 48.3389 17.3693 49.4548 17.8676C50.5889 18.366 51.5218 19.0464 52.2536 19.9089L49.4548 22.8126C48.8695 22.1801 48.275 21.7106 47.6713 21.4039C47.086 21.0971 46.4182 20.9439 45.6683 20.9439C44.9184 20.9439 44.3238 21.0971 43.8848 21.4039C43.4458 21.6914 43.2263 22.1131 43.2263 22.6689C43.2263 23.1864 43.3909 23.6081 43.7202 23.9339C44.0494 24.2406 44.4794 24.5089 45.0098 24.7389C45.5585 24.9689 46.1531 25.1989 46.7933 25.4289C47.4518 25.6589 48.1013 25.9271 48.7414 26.2339C49.3816 26.5406 49.9671 26.9334 50.4975 27.4126C51.0463 27.8726 51.4853 28.4669 51.8145 29.1951C52.1438 29.9044 52.3084 30.7859 52.3084 31.8401C52.3084 33.7759 51.6499 35.2996 50.3329 36.4114C49.0158 37.5039 47.1958 38.0501 44.8726 38.0501ZM60.158 38.0214C58.9324 38.0214 57.8348 37.7051 56.8654 37.0726C55.9141 36.4401 55.1551 35.5776 54.588 34.4851C54.0392 33.3926 53.7648 32.1469 53.7648 30.7476C53.7648 29.3484 54.0392 28.1026 54.588 27.0101C55.1551 25.9176 55.9141 25.0551 56.8654 24.4226C57.8348 23.7901 58.9324 23.4739 60.158 23.4739C61.0544 23.4739 61.8592 23.6559 62.5726 24.0201C63.3044 24.3844 63.8987 24.8921 64.3561 25.5439C64.8135 26.1764 65.0695 26.9046 65.1244 27.7289L65.1244 33.7664C65.0695 34.5906 64.8135 35.3284 64.3561 35.9801C63.9171 36.6126 63.3318 37.1109 62.6001 37.4751C61.8683 37.8394 61.0544 38.0214 60.158 38.0214ZM61.0086 34.0539C61.905 34.0539 62.6275 33.7471 63.1763 33.1339C63.725 32.5014 63.9994 31.7059 63.9994 30.7476C63.9994 30.0959 63.8713 29.5209 63.6153 29.0226C63.3774 28.5244 63.03 28.1409 62.5726 27.8726C62.1336 27.5851 61.6213 27.4414 61.0361 27.4414C60.4508 27.4414 59.9295 27.5851 59.4721 27.8726C59.033 28.1409 58.6763 28.5244 58.402 29.0226C58.1459 29.5209 58.0178 30.0959 58.0178 30.7476C58.0178 31.3801 58.1459 31.9456 58.402 32.4439C58.658 32.9421 59.0147 33.3351 59.4721 33.6226C59.9295 33.9101 60.4415 34.0539 61.0086 34.0539ZM63.8348 37.7339L63.8348 33.9676L64.4659 30.5751L63.8348 27.1826L63.8348 23.7614L67.9506 23.7614L67.9506 37.7339L63.8348 37.7339ZM70.9066 37.7339L70.9066 16.8614L75.1047 16.8614L75.1047 37.7339L70.9066 37.7339ZM78.0609 37.7339L78.0609 23.7614L82.259 23.7614L82.259 37.7339L78.0609 37.7339ZM82.259 30.0576L80.5029 28.6201C80.8505 26.9909 81.4358 25.7259 82.259 24.8251C83.0821 23.9244 84.2255 23.4739 85.6888 23.4739C86.329 23.4739 86.887 23.5794 87.3626 23.7901C87.8565 23.9819 88.2864 24.2884 88.6522 24.7101L86.1553 28.0164C85.9723 27.8056 85.7437 27.6426 85.4693 27.5276C85.1949 27.4126 84.884 27.3551 84.5364 27.3551C83.8414 27.3551 83.2833 27.5851 82.8626 28.0451C82.4601 28.4859 82.259 29.1569 82.259 30.0576ZM95.9807 38.0501C94.5355 38.0501 93.2459 37.7434 92.1118 37.1301C90.9959 36.4976 90.1179 35.6256 89.4777 34.5139C88.8373 33.4021 88.5174 32.1469 88.5174 30.7476C88.5174 29.3484 88.8283 28.1026 89.4503 27.0101C90.0904 25.8984 90.9501 25.0264 92.0295 24.3939C93.1087 23.7614 94.3251 23.4451 95.6789 23.4451C96.9959 23.4451 98.1574 23.7421 99.1636 24.3364C100.169 24.9306 100.956 25.7546 101.523 26.8089C102.109 27.8631 102.401 29.0706 102.401 30.4314C102.401 30.6806 102.383 30.9489 102.346 31.2364C102.328 31.5046 102.282 31.8209 102.209 32.1851L90.7125 32.2139L90.7125 29.1951L100.426 29.1664L98.6148 30.4314C98.5964 29.6264 98.4776 28.9651 98.2581 28.4476C98.0386 27.9109 97.7093 27.5084 97.2703 27.2401C96.8494 26.9526 96.3281 26.8089 95.7063 26.8089C95.0478 26.8089 94.4716 26.9719 93.9777 27.2976C93.5019 27.6044 93.1271 28.0451 92.8527 28.6201C92.5964 29.1951 92.4685 29.8946 92.4685 30.7189C92.4685 31.5431 92.6057 32.2521 92.8801 32.8464C93.1726 33.4214 93.5751 33.8719 94.0874 34.1976C94.6178 34.5044 95.2398 34.6576 95.9532 34.6576C96.6118 34.6576 97.2061 34.5426 97.7367 34.3126C98.2671 34.0634 98.7336 33.6994 99.1361 33.2201L101.441 35.6351C100.782 36.4401 99.9867 37.0439 99.0538 37.4464C98.1209 37.8489 97.0964 38.0501 95.9807 38.0501ZM110.848 38.0501C109.476 38.0501 108.232 37.7339 107.117 37.1014C106.019 36.4496 105.15 35.5681 104.51 34.4564C103.87 33.3446 103.55 32.0989 103.55 30.7189C103.55 29.3389 103.87 28.1026 104.51 27.0101C105.15 25.9176 106.019 25.0551 107.117 24.4226C108.214 23.7709 109.458 23.4451 110.848 23.4451C112.238 23.4451 113.482 23.7614 114.58 24.3939C115.678 25.0264 116.546 25.8984 117.187 27.0101C117.827 28.1026 118.147 29.3389 118.147 30.7189C118.147 32.0989 117.827 33.3446 117.187 34.4564C116.546 35.5681 115.678 36.4496 114.58 37.1014C113.482 37.7339 112.238 38.0501 110.848 38.0501ZM110.848 34.0539C111.452 34.0539 111.982 33.9196 112.44 33.6514C112.897 33.3639 113.245 32.9709 113.482 32.4726C113.738 31.9551 113.867 31.3706 113.867 30.7189C113.867 30.0671 113.738 29.5019 113.482 29.0226C113.226 28.5244 112.869 28.1409 112.412 27.8726C111.973 27.5851 111.452 27.4414 110.848 27.4414C110.263 27.4414 109.741 27.5851 109.284 27.8726C108.827 28.1409 108.47 28.5244 108.214 29.0226C107.958 29.5209 107.83 30.0959 107.83 30.7476C107.83 31.3801 107.958 31.9551 108.214 32.4726C108.47 32.9709 108.827 33.3639 109.284 33.6514C109.741 33.9196 110.263 34.0539 110.848 34.0539Z" fill="#2696FD"/>
														</svg>
													</Link>
													<span className="mt-xl-0 mt-3"><Link to={"#"} className="text-primary font-w500">Try For Free</Link></span>
												</div>
												<h2>Hi,Welcome Back!</h2>
												<span>Lorem Ipsum is simply dummy text of the printing and type setting industry.</span>
												{props.errorMessage && (
													<div className='text-danger p-1 my-2'>
														{props.errorMessage}
													</div>
												)}
												{props.successMessage && (
													<div className='text-danger p-1 my-2'>
														{props.successMessage}
													</div>
												)}
												<form className="mt-4" onSubmit={onLogin}>
													<div className="form-group mb-4">
														<label htmlFor="exampleInputEmail1">Email address</label>														
														<input type="email" className="form-control"
															value={email}
															onChange={(e) => setEmail(e.target.value)}
															placeholder="Type Your Email Address"
														/>									
														{errors.email && <div className="text-danger fs-12">{errors.email}</div>}
													</div>
													<div className="form-group mb-4">
														<label htmlFor="exampleInputPassword1">Password</label>														
														<input
															type="password"
															className="form-control"
															value={password}
															placeholder="Type Your Password"
															onChange={(e) =>
																setPassword(e.target.value)
															}
														/>
														{errors.password && <div className="text-danger fs-12">{errors.password}</div>}
													</div>
													<div className="d-flex align-items-center justify-content-between mb-4 flex-wrap"> 
														<div className="form-check">
															<input type="checkbox" className="form-check-input" id="exampleCheck1" />
															<label className="form-check-label font-w400" htmlFor="exampleCheck1">keep me signed in</label>
														</div>
														<span><Link to={"/page-register"} className="text-primary font-w500 c-pointer">Register</Link></span>
													</div>

													{/* 🧪 테스트 버튼 */}
													<button 
														type="button" 
														className="btn btn-warning btn-block mb-2"
														onClick={testFirebaseLogin}
													>
														🧪 Firebase 로그인 테스트
													</button>
													
													{/* <Link to={"#"} className="btn btn-primary btn-block mb-4"><i className="fa-solid fa-lock text-white me-2" />Submit</Link> */}
													<button type="submit" className="btn btn-primary btn-block mb-4">
														<i className="fa-solid fa-lock text-white me-2" />Submit
													</button>
												</form>
												<div className="position-relative social-log text-center mb-4">
													<span>Or, login with your email</span>
												</div>
												<div className="text-center mb-4">	
													<button className="btn btn-outline-light text-center">
														<svg version="1.1" width="20" height="20" id="Layer_1" xmlns="http://www.w3.org/2000/svg" 															
															x="0px" y="0px"
															viewBox="0 0 512 512" style={{enableBackground:'new 0 0 512 512'}}															
														>
															<path style={{fill:"#167EE6"}} d="M492.668,211.489l-208.84-0.01c-9.222,0-16.697,7.474-16.697,16.696v66.715
																c0,9.22,7.475,16.696,16.696,16.696h117.606c-12.878,33.421-36.914,61.41-67.58,79.194L384,477.589
																c80.442-46.523,128-128.152,128-219.53c0-13.011-0.959-22.312-2.877-32.785C507.665,217.317,500.757,211.489,492.668,211.489z"/>
															<path style={{fill:"#12B347"}} d="M256,411.826c-57.554,0-107.798-31.446-134.783-77.979l-86.806,50.034
																C78.586,460.443,161.34,512,256,512c46.437,0,90.254-12.503,128-34.292v-0.119l-50.147-86.81
																C310.915,404.083,284.371,411.826,256,411.826z"/>
															<path style={{fill:"#0F993E"}} d="M384,477.708v-0.119l-50.147-86.81c-22.938,13.303-49.48,21.047-77.853,21.047V512
																C302.437,512,346.256,499.497,384,477.708z"/>
															<path style={{fill:"#FFD500"}} d="M100.174,256c0-28.369,7.742-54.91,21.043-77.847l-86.806-50.034C12.502,165.746,0,209.444,0,256
																s12.502,90.254,34.411,127.881l86.806-50.034C107.916,310.91,100.174,284.369,100.174,256z"/>
															<path style={{fill:"#FF4B26"}} d="M256,100.174c37.531,0,72.005,13.336,98.932,35.519c6.643,5.472,16.298,5.077,22.383-1.008
																l47.27-47.27c6.904-6.904,6.412-18.205-0.963-24.603C378.507,23.673,319.807,0,256,0C161.34,0,78.586,51.557,34.411,128.119
																l86.806,50.034C148.202,131.62,198.446,100.174,256,100.174z"/>
															<path style={{fill:"#D93F21"}} d="M354.932,135.693c6.643,5.472,16.299,5.077,22.383-1.008l47.27-47.27
															c6.903-6.904,6.411-18.205-0.963-24.603C378.507,23.672,319.807,0,256,0v100.174C293.53,100.174,328.005,113.51,354.932,135.693z"/>
														</svg>
														{" "}Sign In With Google
													</button>
												</div>
												<div className="text-center">
													<span className="">Do not have account Yet? <Link to={"#"} className="text-primary font-w500">Try for free!</Link></span>	
												</div>
											</div>
										</div>
									</div>
									<div className='col-xl-8 col-lg-8 position-relative bg-secondary login-border'>
										<div className="d-flex flex-column justify-content-between h-100">
											<div className="content text-center py-4">
												<h2 className="text-white mb-0">Welcome To Your AURUM System.</h2>
												<p className="text-white">Lorem Ipsum is simply dummy text of the printing and typesetting industry<br/>Lorem Ipsum has been the industry's</p>
											</div>
											<div className="login-media-1">
												<img src={IMAGES.login_index} alt="" />
												<svg className="dot-svg" width="40" height="40" viewBox="0 0 89 90" fill="none" xmlns="http://www.w3.org/2000/svg">
													<circle cx="2.5" cy="2.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="23.5" cy="2.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="44.5" cy="2.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="65.5" cy="2.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="86.5" cy="2.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="2.5" cy="87.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="23.5" cy="87.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="44.5" cy="87.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="65.5" cy="87.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="86.5" cy="87.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="2.5" cy="70.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="23.5" cy="70.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="44.5" cy="70.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="65.5" cy="70.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="86.5" cy="70.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="2.5" cy="19.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="23.5" cy="19.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="44.5" cy="19.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="65.5" cy="19.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="86.5" cy="19.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="2.5" cy="36.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="23.5" cy="36.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="44.5" cy="36.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="65.5" cy="36.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="86.5" cy="36.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="2.5" cy="53.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="23.5" cy="53.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="44.5" cy="53.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="65.5" cy="53.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="86.5" cy="53.5" r="2.5" fill="#D9D9D9"/>
												</svg>
												<svg className="dot-svg-end" width="40" height="40" viewBox="0 0 89 90" fill="none" xmlns="http://www.w3.org/2000/svg">
													<circle cx="2.5" cy="2.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="23.5" cy="2.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="44.5" cy="2.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="65.5" cy="2.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="86.5" cy="2.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="2.5" cy="87.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="23.5" cy="87.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="44.5" cy="87.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="65.5" cy="87.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="86.5" cy="87.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="2.5" cy="70.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="23.5" cy="70.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="44.5" cy="70.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="65.5" cy="70.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="86.5" cy="70.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="2.5" cy="19.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="23.5" cy="19.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="44.5" cy="19.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="65.5" cy="19.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="86.5" cy="19.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="2.5" cy="36.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="23.5" cy="36.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="44.5" cy="36.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="65.5" cy="36.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="86.5" cy="36.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="2.5" cy="53.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="23.5" cy="53.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="44.5" cy="53.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="65.5" cy="53.5" r="2.5" fill="#D9D9D9"/>
													<circle cx="86.5" cy="53.5" r="2.5" fill="#D9D9D9"/>
												</svg>
												<svg className="t-svg" width="50" height="50" viewBox="0 0 192 169" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M61.5393 0.840397L191.627 0.840258L101.714 168.846L-4.87743e-05 113.076L61.5393 0.840397Z" fill="#2696FD" fillOpacity="0.22"/>
												</svg>												
											</div>
											<div className="login-media-2">
												<img src={IMAGES.login_dark} alt="" />
											</div>
											<div className="d-flex align-items-center justify-content-between text-white pb-3 px-2">
												<span><Link to={"#"} className="text-white d-xl-block d-none">Privacy policy and Terms of use</Link></span>
												<span className="text-center">
													<Link to={"#"} className="text-white">Copyright © Designed &amp; Developed by</Link> 
													<Link className="text-white" to="https://dexignzone.com/" target="_blank">DexignZone</Link> {date.getFullYear()}
												</span>
												<span><Link to={"#"} className="text-white d-xl-block d-none"> Privacy policy</Link></span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>		
		</div>
  	);
};

const mapStateToProps = (state) => {
    return {
        errorMessage: state.auth.errorMessage,
        successMessage: state.auth.successMessage,
        showLoading: state.auth.showLoading,
    };
};
export default connect(mapStateToProps)(Login);
