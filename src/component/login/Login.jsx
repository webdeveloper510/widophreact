import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { userLogin, resendOtp, verifyEmail, } from "../../utils/Api";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useFormik } from "formik";
import clsx from "clsx";
import OtpInput from "react18-input-otp";
import { Alert, Button, Modal, ModalBody } from "react-bootstrap";
import * as Yup from "yup"
import * as CountryData from "country-codes-list";
import moment from "moment";


const Login = () => {

    const navigate = useNavigate();
    const myCountryList = CountryData.customArray({ name: '{countryCallingCode} ({countryCode})', value: '{countryCode}' })

    const [isMobile, setIsMobile] = useState(true)
    const [promo_marketing, setPromo_marketing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => setShowPassword(prevState => !prevState);
    const [countryCode, setCountryCode] = useState("+61")

    const [isGetOtp, setIsGetOtp] = useState(false)
    const [otp, setOtp] = useState("");
    const [count_invalid, setCountInvalid] = useState(0);
    const [open_modal, setOpenModal] = useState(false)
    const [show_alert, setShowAlert] = useState(1)

    const loginSchema = Yup.object().shape({
        email: Yup.string().trim("no spaces allowed").required('required'),
        password: Yup.string().required('Password is required'),
    })

    const initialValues = {
        email: '',
        password: '',
    }

    const formik = useFormik({
        initialValues,
        validationSchema: loginSchema,
        onSubmit: async (values) => {
            setLoading(true);
            let data = {}
            if (isMobile === true) {
                const mobileNumber = parseInt(values.email, 10)
                data.mobile = countryCode + mobileNumber
            } else {
                data.email = values.email
            }
            userLogin({ ...data, password: values.password }).then((res) => {
                if (res.code == "200") {
                    toast.success(res.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true });
                    // navigate("/verification", { state: data })
                    setIsGetOtp(true)
                }
                else if (res.code == "201") {
                    toast.error("Please check your inbox to verify email.", { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
                }
                else if (res.code == "400") {
                    toast.error(res.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
                }
                setLoading(false);
            }).catch((err) => {
                setLoading(false);
                if (err.response.data.code === '400') {
                    toast.error('Credetionals Does not match', { position: "bottom-right", autoClose: 2000, hideProgressBar: true });
                }
            })
        },
    })

    const handlePromo_marketing = (e) => {
        const { checked } = e.target;

        setPromo_marketing((promo_marketing) => ({
            ...promo_marketing,
            Active: checked
        }));
    };

    const handleChange = (e) => {
        let element = e.target.value
        if (element.length > 0) {
            let pattern = /^[0-9+ ]+$/
            let result = pattern.test(element)
            if (result) {
                setIsMobile(true)
            } else {
                setIsMobile(false)
            }
        } else {
            setIsMobile(true)
        }
        formik.setFieldValue("email", element)
        formik.setFieldTouched("email", true)

    }

    const handleOtpChange = (enteredOtp) => {
        setOtp(enteredOtp);
    };

    const handleEmailVerification = (event) => {
        event.preventDefault();
        let length = otp.toString()
        if (length.length == 6) {
            setLoading(true)
            let obj = {}
            if (isMobile === true) {
                const mobileNumber = parseInt(formik.values.email, 10)
                obj.mobile = countryCode + mobileNumber
            } else {
                obj.email = formik.values.email
            }
            obj.otp = otp
            verifyEmail(obj).then((res) => {
                if (res.code == 200) {
                    toast.success(res.message,
                        { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
                    let d = new Date()
                    d.setDate(d.getDate() + 1);
                    sessionStorage.setItem('tkn-exp', d)
                    sessionStorage.setItem('token', res.access_token)
                    setLoading(false)
                    sessionStorage.setItem('lastIteractionTime', moment())

                    if (obj.page !== "register") {
                        const user = res?.data
                        user.is_digital_Id_verified = `${res?.data?.is_digital_Id_verified}`
                        sessionStorage.setItem("remi-user-dt", JSON.stringify(user))
                        if (sessionStorage.getItem("transfer_data")) {
                            navigate(`/user-send-money`)
                        } else {
                            navigate("/dashboard")
                        }
                    } else {
                        const user = res?.data
                        user.is_digital_Id_verified = "Pending"
                        sessionStorage.setItem("remi-user-dt", JSON.stringify(user))
                        navigate('/dashboard')
                    }
                } else if (res.code == "400") {
                    toast.error(res.message,
                        { position: "bottom-right", autoClose: 2000, hideProgressBar: true });
                    setCountInvalid(count_invalid + 1)
                    setLoading(false)
                }
            }).catch((error) => {
                if (error.response.status == 400) {
                    toast.error(error.response.data.message,
                        { position: "bottom-right", autoClose: 2000, hideProgressBar: true });
                }
                setLoading(false)
            })
        } else {
            toast.error("Please enter the OTP", { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
        }
    }

    const handleResendOtp = (e) => {
        e.preventDefault()
        setLoading(true)
        let obj = {}
        if (isMobile === true) {
            const mobileNumber = parseInt(formik.values.email, 10)
            obj.mobile = countryCode + mobileNumber
        } else {
            obj.email = formik.values.email
        }
        setLoading(true)
        setOtp(null)
        resendOtp(obj).then((res) => {
            if (res.code == "200") {
                setShowAlert(2)
            } else {
                setShowAlert(3)
            }
            setLoading(false)
        }).catch((error) => {
            setShowAlert(3)
            setLoading(false)
        })
        setLoading(false)
    }

    const handleClose = () => {
        setOpenModal(false)
        navigate("/help")
    }

    useEffect(() => {
        if (count_invalid === 3) {
            setOpenModal(true)
            setOtp("")
        }
    }, [count_invalid])

    useEffect(() => {
        setTimeout(() => {
            setShowAlert(0)
        }, 5000)
        if (sessionStorage.getItem("token") && sessionStorage.getItem("remi-user-dt")) {
            navigate("/dashboard")
        }

    }, [show_alert])

    return (
        <>
            <section className="sigupsec" style={{ minHeight: "100vh" }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            {/* start-- card */}
                            <div className="row">
                                <div className="col-lg-5">
                                    <div className="sign-image-sec">
                                        <img src="assets/img/home/signup-left.webp" className="signup" alt="alt_image" />
                                    </div>
                                </div>
                                <div className="col-lg-7 d-flex align-items-center">
                                    {
                                        isGetOtp ? (
                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <div className="card1 card-signup1">
                                                        <div className="card-body">
                                                            <h2 className="Sign-heading my-3">Verify your Account</h2>
                                                            <div className="form_signup">
                                                                <div className="my-3">
                                                                    {
                                                                        show_alert === 1 ? (
                                                                            <Alert className="m-0" >
                                                                                <span>
                                                                                    A verification code has been sent to your number.
                                                                                </span>
                                                                            </Alert>
                                                                        ) : show_alert === 2 ? (
                                                                            <Alert className="m-0" >
                                                                                <span>The verification code has been resent.</span>
                                                                            </Alert>
                                                                        ) : show_alert === 3 ? (
                                                                            <Alert className="m-0" >
                                                                                <span>There might be an issue in resending, please try again.</span>
                                                                            </Alert>
                                                                        ) : (
                                                                            <Alert className="m-0" >
                                                                                <span> Please enter the verification code to continue.</span>
                                                                            </Alert>
                                                                        )
                                                                    }
                                                                </div>
                                                                <div className="my-3">
                                                                    <form onSubmit={handleEmailVerification} >
                                                                        <OtpInput
                                                                            value={otp}
                                                                            onChange={handleOtpChange}
                                                                            numInputs={6}
                                                                            isInputNum={true}
                                                                            isSuccessed={true}
                                                                            successStyle="success"
                                                                            separator={<span></span>}
                                                                            separateAfter={3}
                                                                            className="verification_input"
                                                                        />
                                                                        <p className="already_content mb-3 my-2">
                                                                            <Link
                                                                                className="float-end"
                                                                                onClick={(e) => { handleResendOtp(e) }}
                                                                            >
                                                                                Resend Otp
                                                                            </Link>
                                                                        </p>
                                                                        <button variant={count_invalid === 3 ? "secondary" : "primary"}
                                                                            type="submit"
                                                                            className="signup_button w-50"
                                                                            disabled={count_invalid === 3 ? true : false}
                                                                        >
                                                                            Continue <img src="assets/img/home/Union.png" className="vission_image" alt="alt_image" />
                                                                            {loading ? <>
                                                                                <div className="loader-overly">
                                                                                    <div className="loader" >
                                                                                    </div>
                                                                                </div>
                                                                            </> : <></>}
                                                                        </button>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="row w-100">
                                                <div className="col-lg-12">
                                                    <div className="card1 card-signup1">
                                                        <div className="card-body">
                                                            <h2 className="Sign-heading">Sign in</h2>
                                                            <div className="form_login">
                                                                <p className="space-div"></p>
                                                                <form onSubmit={formik.handleSubmit} noValidate>
                                                                    <Form.Group className="mb-2 form_label">
                                                                        <Form.Label>Email/Mobile Number<span style={{ color: 'red' }} >*</span></Form.Label>


                                                                        <div className={clsx("email-phone", {

                                                                            'invalid': formik.touched.email && formik.errors.email
                                                                        })}>
                                                                            <div className="row">
                                                                                {
                                                                                    isMobile ? (
                                                                                        <div className="col-md-3 paddingg-l">
                                                                                            <Form.Select className="login-code-select form-select" value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
                                                                                                <option value="+61">+61 (AU)</option>
                                                                                                <option value="+64">+64 (NZ)</option>
                                                                                            </Form.Select>
                                                                                        </div>
                                                                                    ) : ""
                                                                                }
                                                                                <div className={`${isMobile ? "col-md-9" : "col-md-12 padding-dd"}  mobiletext`}>
                                                                                    <Form.Control
                                                                                        type={'text'}
                                                                                        autoComplete="off"
                                                                                        name="id"
                                                                                        size="lg"
                                                                                        onChange={handleChange}
                                                                                        onBlurCapture={(e) => { formik.setFieldTouched("email", true); formik.setFieldValue("email", e.target.value) }}
                                                                                        className={clsx(
                                                                                            'form-control email-mobile-input',
                                                                                            {
                                                                                                'is-invalid': formik.touched.email && formik.errors.email
                                                                                            }
                                                                                        )}
                                                                                        placeholder="Email/Mobile"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </Form.Group>
                                                                    <div className="row">
                                                                        <div className="pass-row">
                                                                            <Form.Group className="mb-2 form_label">
                                                                                <Form.Label> Your Password<span style={{ color: 'red' }} >*</span></Form.Label>
                                                                                <Form.Control
                                                                                    type={showPassword ? 'text' : 'password'}
                                                                                    autoComplete='off'
                                                                                    {...formik.getFieldProps('password')}
                                                                                    className={clsx(
                                                                                        'form-control email-mobile-input',
                                                                                        {
                                                                                            'is-invalid': formik.touched.password && formik.errors.password,
                                                                                        }
                                                                                    )}
                                                                                    placeholder="Enter Password..."
                                                                                />

                                                                                <span className="login_pass_icons" type="button" onClick={() => toggleShowPassword()}>
                                                                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                                                </span>
                                                                                {formik.touched.password && formik.errors.password && (
                                                                                    <div className='fv-plugins-message-container mt-1'>
                                                                                        <div className='fv-help-block'>
                                                                                            <span role='alert' className="text-danger">{formik.errors.password}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                )}


                                                                            </Form.Group>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-lg-6">
                                                                            {/* <Form.Group className="mb-3">
                                                                                <Form.Check
                                                                                    type="checkbox"
                                                                                    value={promo_marketing}
                                                                                    onChange={handlePromo_marketing}
                                                                                    checked={promo_marketing.Active} // <-- set the checked prop of input    
                                                                                    label=" " />
                                                                            </Form.Group> */}
                                                                        </div>
                                                                        <div className="col-lg-6">
                                                                            <NavLink className="forgot_pass" to="/forgot-password"> Forgot password?</NavLink>
                                                                        </div>
                                                                    </div>
                                                                    <button variant="primary"
                                                                        type="submit"
                                                                        className="login_button"
                                                                    >
                                                                        SIGN <b>in</b>   <img src="assets/img/home/Union.png" className="vission_image" alt="alt_image" />
                                                                        {loading ? <>
                                                                            <div className="loader-overly">
                                                                                <div className="loader" >

                                                                                </div>

                                                                            </div>
                                                                        </> : <></>}
                                                                    </button>
                                                                    <p className="already_content">Don't have account?
                                                                        <NavLink to="/sign-up">Sign up</NavLink>
                                                                    </p>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Modal show={open_modal} centered backdrop="static">
                <Modal.Header><b style={{ color: "#6414E9" }}>Maximum limit reached</b></Modal.Header>
                <ModalBody>
                    <h5>Please contact our <b style={{ color: "#6414E9" }}>Customer Service</b> to continue</h5>
                </ModalBody>
                <Modal.Footer className="pt-0">
                    <Button onClick={() => handleClose()} variant="primary" className="continue_button w-50 p-0">Visit Support</Button>
                </Modal.Footer>
            </Modal>
        </>

    )
}



export default Login;