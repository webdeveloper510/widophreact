

import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "react-phone-input-2/lib/bootstrap.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { exchangeRate, registerOtpResend, sendEmail, userRegisterCheck, userRegisterVerify } from "../../utils/Api";
import { useFormik } from "formik";
import * as Yup from "yup"
import clsx from "clsx";
import countryList from "../../utils/senderCountries.json"
import { Alert, Modal, Button, ModalBody } from "react-bootstrap";
import OtpInput from "react18-input-otp";
import { senderAreaList as areaList } from "../../utils/ArealList";
import moment from "moment";
const Signup = () => {
    const [isOn, setOn] = useState(false);
    const handleToggle = () => {
        setOn(!isOn);
    };

    const search = useLocation()
    const [show, setShow] = useState(false);
    const [country_code, setCountryCode] = useState("AU")
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [referral_code, setrReferral_code] = useState('');
    const [promo_marketing, setPromo_marketing] = useState("0");
    const [isGetOtp, setIsGetOtp] = useState(false)
    const [otp, setOtp] = useState("");
    const [count_invalid, setCountInvalid] = useState(0);
    const [open_modal, setOpenModal] = useState(false)
    const [show_alert, setShowAlert] = useState(1)
    const navigate = useNavigate();
    const toggleShowPassword = () => setShowPassword(prevState => !prevState);
    const toggleShowConfirmPassword = () => setShowConfirmPassword(prevState => !prevState)
    const [selected_area_code, setSelectedAreaCode] = useState("61")

    const initialValues = {
        location: "Australia",
        email: "",
        password: "",
        confirmPassword: "",
        referral_code: "",
        mobile: ""
    }

    const signSchema = Yup.object().shape({
        location: Yup.string().required(),
        email: Yup.string().matches(/^[\w-+\.]+@([\w-]+\.)+[\w-]{2,10}$/, "Invalid email format").min(6).max(50).required("Email is required"),
        password: Yup.string().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,30}$/, 'Password must contain uppercase, lowercase, symbols, digits, minimum 6 characters').required("Password is required"),
        confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Passwords did not match").required("Password confirmation is required"),
        referral_code: isOn ? Yup.string().min(1, "Referral code should contain atleast 8 characters").max(15, "Referral code can't be more than 15 characters").required("Referral Code is required") : Yup.string().notRequired(),
        mobile: Yup.string().min(9, "Minimum 9 digits").required("Mobile is required")
    })

    useEffect(() => {
        exchangeRate({ amount: "1", from: "AUD", to: "NGN" }).then(res => {
            const data = { send_amt: "1", exchange_amt: res.amount, from_type: "AUD", to_type: "NGN", exch_rate: res.rate }
            sessionStorage.removeItem("exchange_curr")
            sessionStorage.setItem("exchange_curr", JSON.stringify(data))
        })
        if (sessionStorage.getItem("token") && sessionStorage.getItem("remi-user-dt")) {
            navigate("/dashboard")
        }
    }, [])

    useEffect(() => {
        formik.resetForm()
        setIsGetOtp(false)
    }, [search])

    const formik = useFormik({
        initialValues,
        validationSchema: signSchema,
        validateOnChange: false,
        onSubmit: async (values) => {
            setLoading(true)
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth"
            })
            let mno = parseInt(values.mobile, 10)
            let data = { ...values, promo_marketing: promo_marketing, country_code: country_code, mobile: "+" + selected_area_code + mno }
            if (data.referral_code === "" || isOn === false) {
                delete data["referral_code"]
            }
            userRegisterCheck(data).then((res) => {
                if (res.code === "200") {
                    toast.success(res.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true });

                    setIsGetOtp(true)

                } else if (res.code == '400') {
                    toast.error(res.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true });
                }
                else if (res.code == '201') {
                    toast.success(res.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true });
                    setIsGetOtp(true)
                }
                setLoading(false)
            }).catch((error) => {
                if (error.response.code == "400") {
                    toast.error(error.response.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
                }
                setLoading(false)
            })
        }

    })

    useEffect(() => {
        const search1 = search.search;
        const term = new URLSearchParams(search1).get('ref');
        if (term) {
            setrReferral_code(term)
            setShow(true)
        }

    }, [referral_code, show]);

    const handlePromo_marketing = (e) => {
        const { checked } = e.target;
        if (checked) {
            setPromo_marketing("1")
        } else {
            setPromo_marketing("0")
        }
    };

    const handleChange = (e) => {
        formik.setFieldValue("location", e.target.value)
        formik.setFieldTouched("location", true)
        countryList.map((item) => {
            if (item.name === e.target.value) {
                // console.log(item.iso2)
                setCountryCode(item.iso2)
                setSelectedAreaCode(item.phone_code)
            }
        })
    }

    const handleRef = (event) => {
        const result = event.target.value.replace(/[^A-z0-9_-]/gi, "")
        formik.setFieldValue(event.target.name, result)
        formik.handleChange(event)
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

    const handleEmailVerification = (event) => {
        event.preventDefault();
        let length = otp.toString()
        if (length.length == 6) {
            setLoading(true)
            let mno = parseInt(formik.values.mobile, 10)
            let data = { ...formik.values, promo_marketing: promo_marketing, country_code: country_code, mobile: "+" + selected_area_code + mno, otp: otp }
            if (data.referral_code === "" || isOn === false) {
                delete data["referral_code"]
            }
            userRegisterVerify(data).then((res) => {
                if (res.code === "200") {
                    toast.success(res.message,
                        { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
                    let d = new Date()
                    d.setDate(d.getDate() + 1);
                    sessionStorage.setItem('token', res.access_token)
                    setLoading(false)
                    sessionStorage.setItem('lastIteractionTime', moment())
                    const user = res?.data
                    user.is_digital_Id_verified = "Pending"
                    sessionStorage.setItem("remi-user-dt", JSON.stringify(user))
                    navigate('/complete-kyc')
                    sendEmail()
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
            toast.error("Please enter the valid OTP", { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
        }
    }

    const handleResendOtp = (e) => {
        e.preventDefault()
        setLoading(true)
        setOtp(null)
        let mno = parseInt(formik.values.mobile, 10)
        registerOtpResend({ mobile: "+" + selected_area_code + mno }).then(res => {
            if (res.code === "200") {
                setShowAlert(2)
            } else {
                setShowAlert(3)
            }
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

    const handleOtpChange = (enteredOtp) => {
        setOtp(enteredOtp);
    }

    const handleNumericOnly = (event) => {
        const result = event.target.value.replace(/[^0-9]/, "")
        formik.setFieldValue(event.target.name, result)
    }

    useEffect(() => {
        countryList.map((item) => {
            if (item.phone_code === selected_area_code) {
                setCountryCode(item.iso2)
                formik.setFieldValue("location", item.name)
                formik.setFieldTouched("location", true)
            }
        })
    }, [selected_area_code])

    return (
        <>
            <section className="sigupsec" style={{ minHeight: "100vh" }}>
                <div className="container">
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
                                                                        Resend OTP
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
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="card1 card-signup1">
                                                <div className="card-body">
                                                    <h2 className="Sign-heading">Sign Up</h2>
                                                    <p className="money-form">Where are you sending money from?</p>
                                                    <div className="form_signup">
                                                        <form onSubmit={formik.handleSubmit} autoComplete="on">
                                                            <Form.Group className="mb-2 form_label">
                                                                <Form.Label>Location<span style={{ color: '#FD6063' }} >*</span> </Form.Label>
                                                                <Form.Select
                                                                    name="location"
                                                                    value={formik.values.location ? formik.values.location : "Australia"}
                                                                    onChange={handleChange}
                                                                    className='form-control bg-transparent'
                                                                    id="default-select"
                                                                >
                                                                    {
                                                                        countryList && countryList.length > 0 ?
                                                                            countryList?.map((opt) => {
                                                                                return (
                                                                                    <option value={opt?.name} key={opt?.id}><li>{opt?.name}</li></option>
                                                                                )
                                                                            }) : ""
                                                                    }
                                                                </Form.Select>
                                                            </Form.Group>
                                                            <div className="row">
                                                                <div className="col-md-6 phone-row">
                                                                    <Form.Group className="mb-2 form_label" >
                                                                        <Form.Label>Your Phone<span style={{ color: 'red' }} >*</span> </Form.Label>
                                                                        <div className="row kustom_mobile_signup margin0">
                                                                            <div className="col-md-5 px-0">
                                                                                <select
                                                                                    className="form-control form-select bg-transparent"
                                                                                    value={selected_area_code}
                                                                                    onChange={(e) => setSelectedAreaCode(e.target.value)}>
                                                                                    {
                                                                                        areaList?.map((area, index) => {
                                                                                            return (
                                                                                                <option key={index} value={area?.code}>+{area?.code}&nbsp;({area?.name})</option>
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </select>
                                                                            </div>
                                                                            <div className={`col-md-7 px-0`}>
                                                                                <input
                                                                                    type="text"
                                                                                    name="mobile"
                                                                                    value={formik.values.mobile}
                                                                                    id="mobile"
                                                                                    maxLength="10"
                                                                                    onChange={(e) => handleNumericOnly(e)}
                                                                                    className={clsx(
                                                                                        'form-control bg-transparent',
                                                                                        { 'is-invalid': formik.touched.mobile && formik.errors.mobile },
                                                                                        {
                                                                                            'is-valid': formik.touched.mobile && !formik.errors.mobile,
                                                                                        }
                                                                                    )}
                                                                                    placeholder="Enter your mobile"
                                                                                    autoComplete="off"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {formik.touched.mobile && formik.errors.mobile && (
                                                                            <div className='fv-plugins-message-container mt-1'>
                                                                                <div className='fv-help-block'>
                                                                                    <span role='alert' className="text-danger">{formik.errors.mobile}</span>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </Form.Group>
                                                                </div>
                                                                <div className="col-md-6 email-row">
                                                                    <Form.Group className="mb-2 form_label" >
                                                                        <Form.Label>Your Email<span style={{ color: '#FD6063' }} >*</span> </Form.Label>
                                                                        <Form.Control
                                                                            type="email"
                                                                            placeholder="Enter Your Email..."
                                                                            {...formik.getFieldProps('email')}
                                                                            className={clsx(
                                                                                'form-control bg-transparent',
                                                                                { 'is-invalid': formik.touched.email && formik.errors.email },
                                                                                {
                                                                                    'is-valid': formik.touched.email && !formik.errors.email,
                                                                                }
                                                                            )}
                                                                            autoComplete="off"
                                                                        />
                                                                        {formik.touched.email && formik.errors.email && (
                                                                            <div className='fv-plugins-message-container mt-1'>
                                                                                <div className='fv-help-block'>
                                                                                    <span role='alert' className="text-danger">{formik.errors.email}</span>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </Form.Group>
                                                                </div>

                                                            </div>
                                                            <div className="row">
                                                                <div className="col-md-6 pass-row">
                                                                    <Form.Group className="mb-2 form_label">
                                                                        <div className="f-le">
                                                                            <Form.Label> Your Password<span style={{ color: 'red' }} >*</span> </Form.Label>
                                                                            <Form.Control
                                                                                type={showPassword ? 'text' : 'password'}
                                                                                id="password"
                                                                                name="password"
                                                                                autoComplete="off"
                                                                                {...formik.getFieldProps('password')}
                                                                                placeholder="Enter Password..."
                                                                                className={clsx(
                                                                                    'form-control bg-transparent',
                                                                                    { 'is-invalid': formik.touched.password && formik.errors.password },
                                                                                    {
                                                                                        'is-valid': formik.touched.password && !formik.errors.password,
                                                                                    }
                                                                                )}
                                                                            />
                                                                            <span onClick={toggleShowPassword} className="pass_icons">
                                                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                                            </span>
                                                                        </div>
                                                                        {formik.touched.password && formik.errors.password && (
                                                                            <div className='fv-plugins-message-container mt-1'>
                                                                                <div className='fv-help-block'>
                                                                                    <span role='alert' className="text-danger">{formik.errors.password}</span>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </Form.Group>
                                                                </div>
                                                                <div className="col-md-6 cnfirmpass-row">
                                                                    <Form.Group className="mb-2 form_label">
                                                                        <Form.Label> Confirm Password<span style={{ color: 'red' }} >*</span> </Form.Label>
                                                                        <Form.Control
                                                                            type={showConfirmPassword ? 'text' : 'password'}
                                                                            name="confirm Password"
                                                                            autoComplete="off"
                                                                            placeholder="Confirm Password"
                                                                            {...formik.getFieldProps('confirmPassword')}
                                                                            className={`${clsx(
                                                                                'form-control bg-transparent',
                                                                                { 'is-invalid': formik.touched.confirmPassword && formik.errors.confirmPassword },
                                                                                {
                                                                                    'is-valid': formik.touched.confirmPassword && !formik.errors.confirmPassword,
                                                                                }
                                                                            )} rate_input form-control`}
                                                                        />
                                                                        <span onClick={toggleShowConfirmPassword} className="pass_icons">
                                                                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                                                        </span>
                                                                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                                                            <div className='fv-plugins-message-container mt-1'>
                                                                                <div className='fv-help-block'>
                                                                                    <span role='alert' className="text-danger">{formik.errors.confirmPassword}</span>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </Form.Group>
                                                                </div>
                                                            </div>
                                                            <Form.Group className="mb-2 form_on-off">
                                                                Referred by a friend? Use the referral code below.
                                                                <label className={`toggle-container ${isOn ? 'on' : 'off'}`}>
                                                                    <input type="checkbox" checked={isOn} onChange={handleToggle} />
                                                                    <span className="toggle-slider"></span>
                                                                </label>

                                                            </Form.Group>

                                                            {isOn && <div className="referral-code">
                                                                <Form.Group className="mb-3 form_label">
                                                                    <Form.Label>Your Referral Code</Form.Label>
                                                                    <input
                                                                        type="text"
                                                                        name="referral_code"
                                                                        value={formik.values.referral_code}
                                                                        onChange={handleRef}
                                                                        maxLength={15}
                                                                        className={isOn ? clsx(
                                                                            'form-control bg-transparent',
                                                                            { 'is-invalid': formik.touched.referral_code && formik.errors.referral_code },
                                                                            {
                                                                                'is-valid': formik.touched.referral_code && !formik.errors.referral_code,
                                                                            }
                                                                        ) : ""}
                                                                        placeholder="Enter Referral Code"
                                                                    />
                                                                    {formik.touched.referral_code && formik.errors.referral_code && (
                                                                        <div className='fv-plugins-message-container mt-1'>
                                                                            <div className='fv-help-block'>
                                                                                <span role='alert' className="text-danger">{formik.errors.referral_code}</span>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </Form.Group>
                                                            </div>}
                                                            <Form.Group className="mb-3 form_checkbox">
                                                                <Form.Check className="form_label"
                                                                    type="checkbox"
                                                                    onChange={(e) => handlePromo_marketing(e)}
                                                                    label="If you wish to receive marketing information 
                                                                    about out products and special offers, please check this box"
                                                                />
                                                            </Form.Group>
                                                            <button variant="primary"
                                                                type="submit"
                                                                className="signup_button ">
                                                                Sign <b>up</b> <img src="assets/img/home/Union.png" className="vission_image" alt="alt_image" />
                                                                {loading ? <>
                                                                    <div className="loader-overly">
                                                                        <div className="loader" >
                                                                        </div>
                                                                    </div>
                                                                </> : <></>}
                                                            </button>
                                                            <p className="already_content">Already have an account?
                                                                <NavLink to="/login">Sign In</NavLink>
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



export default Signup;