import React, { useState, useRef } from 'react';
import Cookies from 'universal-cookie';
import Swal from 'sweetalert2';

const cookies = new Cookies();

const initialState = {
    fullName: "",
    userName: "",
    avatharURL: "",
    password: "",
    confirmPassword: "",
}

const Auth = () => {
    const [isSignIn, setIsSignIn] = useState(true);
    const [formData, setformData] = useState(initialState);
    const [disableSubmitBtn, setdisableSubmitBtn] = useState(true);
    const [showPasswordIncorrect, setshowPasswordIncorrect] = useState(false)

    const fullNameRef = useRef(null);
    const userNameRef = useRef(null);
    const passwordRef = useRef(null);
    const avatharRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const handleKeyDown = (event, ReftToNexTInput) => {
        if (event.key === "Enter") {
            event.preventDefault();
            ReftToNexTInput.current.focus();
        }
    }

    const handleChange = (event) => {
        setformData((prevFormData) => {
            const updatedFormData = { ...prevFormData, [event.target.name]: event.target.value };
            if (isSignIn) {
                if (updatedFormData.userName.length > 4 && updatedFormData.password.length > 4) {
                    setdisableSubmitBtn(false);
                } else {
                    setdisableSubmitBtn(true);
                }
            } else {
                if (updatedFormData.confirmPassword.length > 3 && updatedFormData.confirmPassword !== updatedFormData.password) {
                    setshowPasswordIncorrect(true);
                } else {
                    setshowPasswordIncorrect(false);
                }
                if (
                    updatedFormData.userName.length > 4 &&
                    updatedFormData.avatharURL.length > 4 &&
                    updatedFormData.confirmPassword.length > 4 &&
                    updatedFormData.password.length > 4 &&
                    (updatedFormData.confirmPassword === updatedFormData.password)
                ) {
                    setdisableSubmitBtn(false);
                } else {
                    setdisableSubmitBtn(true);
                }
            }
            return updatedFormData;
        });
    };

    const switchMode = (mode) => {
        if (mode === 'signIn') {
            setIsSignIn(true);
        } else {
            setIsSignIn(false);
        }
    }


    const apicall = async (requestOptions, avatharURL) => {
        try {

            // const URL = 'https://medlinkbackend.onrender.com/auth';
            const URL = 'http://localhost:5000/auth';
            // https://medlinkbackend.onrender.com

            setdisableSubmitBtn(true)
            // conects and fetch datas from db
            const response = await fetch(`${URL}/${isSignIn ? 'login' : 'signup'}`, requestOptions);
            const data = response.json();
            const { token, userId, fullName, userName, hashedPassword, message } = await data;
            if (message === 'INCORRECT_PASSWORD') {
                setdisableSubmitBtn(false);
                Swal.fire({
                    customClass: {
                        title: "reactanimTitle",
                        confirmButton: "reactanimifirmButton",
                    },
                    title:
                        "Incorrect password",
                    icon: "error",
                });
                return;
            }
            if (message === 'USER_NOT_FOUND') {
                setdisableSubmitBtn(false);
                Swal.fire({
                    customClass: {
                        title: "reactanimTitle",
                        confirmButton: "reactanimifirmButton",
                    },

                    title:
                        "User not found! <br><a id='createAccountLink'>Create an account</a>",
                    icon: "warning",
                    iconHtml: '!',
                }).then(() => {

                });
                const createAccountLink = document.getElementById("createAccountLink");
                createAccountLink?.addEventListener("click", function (event) {
                    event.preventDefault();
                    setIsSignIn((previsSignup) => !previsSignup);
                    Swal.close();
                });
                return;
            }

            // stores the datas to cookies(local storage as cookies)
            if (token && token.length > 5) {
                cookies.set('token', token);
                cookies.set('userId', userId);
                cookies.set('fullName', fullName);
                cookies.set('userName', userName);

                if (!isSignIn) {
                    cookies.set('avatharURL', avatharURL);
                    cookies.set('hashedPassword', hashedPassword);
                }

                window.location.reload();
            }
        }

        catch (error) {
            console.log(error)
            setdisableSubmitBtn(false)
            Swal.fire(
                {
                    title: 'Oops Something went wrong!',
                    text: 'Refused to connect server \n Check your connection',
                    html: ' <b>Refused to connect server</b> <br> \n Check your connection',
                    icon: 'error'
                }
            )
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const { fullName, userName, password, avatharURL } = formData;

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userName,
                password,
                fullName,
                avatharURL,
            }),
        };

        apicall(requestOptions, avatharURL);
    };

    return (
        <>
            <div className="auth_wrapper_main">
                {/* left */}
                <div className="project_company_name">
                    <span><p><b>M</b>ed<b style={{ color: "#1e6ffb" }}>Link</b></p></span>
                </div>
                <div className="auth_wrapper_left_main" ></div>
                {/* right */}
                <div className="auth_wrapper_right_main_wrapper">
                    <div className="auth_wrapper_right_main">
                        <div className="auth_wrapper_right_mode_switch">
                            <div onClick={() => switchMode("signIn")} className={`auth_wrapper_right_mode_sign_in  ${isSignIn ? "selected_border" : ""}`}>
                                <p >Sign in</p>
                            </div>
                            <div onClick={() => switchMode("signUp")} className={`auth_wrapper_right_mode_create_account ${isSignIn ? "" : "selected_border"}`}>
                                <p >Create Account</p>
                            </div>
                        </div>
                        <h6 className='auth_wrapper_right_form_title'>  {isSignIn ? `Sign in to your account to continue.` : `Sign up to your account to continue.`}</h6>
                        {/* form */}
                        <form onSubmit={handleSubmit}>
                            {
                                !isSignIn &&
                                <div className="auth_wrapper_right_form_input">
                                    <input type="text"
                                        ref={fullNameRef}
                                        onKeyDown={(e) => handleKeyDown(e, userNameRef)}
                                        className='formAnimInput'
                                        placeholder=' '
                                        name='fullName'
                                        onChange={handleChange}
                                        required
                                        pattern="[A-Za-z]*"
                                        style={{ textTransform: "capitalize" }}
                                        id='fullName'
                                        value={formData.fullName}
                                    />
                                    <label className='formLabel' htmlFor='fullName'>Full Name</label>
                                </div>
                            }
                            <div className="auth_wrapper_right_form_input">
                                <input type="text"
                                    ref={userNameRef}
                                    onKeyDown={e => handleKeyDown(e, isSignIn ? passwordRef : avatharRef)}
                                    className='formAnimInput'
                                    placeholder=' '
                                    name='userName'
                                    onChange={handleChange}
                                    required
                                    id='userName'
                                    pattern="[A-Za-z]*"
                                    value={formData.userName}
                                />
                                <label className='formLabel' htmlFor='userName'>User Name</label>
                            </div>
                            {
                                !isSignIn &&
                                <div className="auth_wrapper_right_form_input">
                                    <input type="text"
                                        ref={avatharRef}
                                        onKeyDown={(e) => handleKeyDown(e, passwordRef)}
                                        className='formAnimInput'
                                        placeholder=' '
                                        name='avatharURL'
                                        onChange={handleChange}
                                        required
                                        id='avatharUrl'
                                        value={formData.avatharURL}
                                    />
                                    <label className='formLabel' htmlFor='avatharUrl'>Avathar URL</label>
                                </div>
                            }
                            <div className="auth_wrapper_right_form_input">
                                <input
                                    ref={passwordRef}
                                    onKeyDown={e => handleKeyDown(e, isSignIn ? "" : confirmPasswordRef)}
                                    type="password"
                                    className='formAnimInput'
                                    placeholder=' '
                                    name='password'
                                    onChange={handleChange}
                                    required
                                    id='password'
                                    value={formData.password}
                                />
                                <label className='formLabel' htmlFor='password'>Password</label>
                            </div>
                            {!isSignIn &&
                                <>
                                    <div className="auth_wrapper_right_form_input">
                                        <input
                                            ref={confirmPasswordRef}
                                            type="password"
                                            className='formAnimInput'
                                            placeholder=' '
                                            name='confirmPassword'
                                            onChange={handleChange}
                                            required
                                            id='confirmPassword'
                                            value={formData.confirmPassword}
                                        />
                                        <label className='formLabel' htmlFor='confirmPassword'>Confirm Password</label>
                                    </div>
                                    <div className="show_password_incorrect">
                                        {
                                            showPasswordIncorrect &&
                                            <p>Passwords not match</p>
                                        }
                                    </div>
                                </>
                            }
                            <div onClick={handleSubmit} className={`auth_wrapper_right_form_button  ${disableSubmitBtn ? 'disable_submit_button' : ''}`}>
                                <p> {isSignIn ? ' Sign In' : ' Sign Up'}</p>
                            </div>
                        </form>
                    </div>
                    <div className="auth_wrapper_right_footer">
                        {isSignIn
                            ? <p>Don't have an account? <b onClick={() => switchMode("signUp")}>Create Account</b></p>
                            : <p className='auth_wrapper_right_footer_2ndP' onClick={() => switchMode("signIn")}>Already have an account?</p>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Auth