import React, { useEffect, useState } from "react";

import { Form, FloatingLabel, Col ,Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

import { toast } from "react-toastify";

import clsx from "clsx";
import * as Yup from "yup";
import { resendOtp, resetEmail } from "../../utils/Api";

import PhoneInput from "react-phone-input-2";
import { useFormik } from "formik";
import LoginImage from "../../assets/img/header/login-image.png";


const ForgotPassword = () => {


    const [loading, setLoading] = useState(false);
    const navigate = useNavigate('');
    const initialValues = { mobile: "" }



    const handlePhone = (val, coun) => {
        let mno = val.substring(2);
        const mobileNumber = parseInt(mno, 10)
        formik.setFieldValue('mobile', coun.dialCode + mobileNumber);
        formik.setFieldTouched('mobile', true);
    }

    const forgetSchema = Yup.object().shape({
        mobile: Yup.string().min(11).max(18).required()
    })

    let sessionID;
    setTimeout(
        function () {
            sessionID = sessionStorage.getItem("SessionID");
        }, 3000
    );

    useEffect(() => {
        if (sessionStorage.getItem("token") && sessionStorage.getItem("remi-user-dt")) {
            navigate("/dashboard")
        }
    }, [])

    const formik = useFormik({
        initialValues,
        validationSchema: forgetSchema,
        onSubmit: async (values) => {
            setLoading(true);
            resetEmail({ mobile: "+" + values.mobile }).then((res) => {
                setLoading(false);
                sessionStorage.setItem("token_forgot", res.data.token)
                if (res.data.code == "200") {
                    toast.success(res.data.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
                    navigate('/reset-password', { state: { customer_id: res.data.data.customer_id } })
                } else if (res.data.code === "400") {
                    toast.error(res.data.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
                }
            }).catch((err) => {
                setLoading(false)
            })
        }
    })


    return (
        <>
            <section className="sigupsec" style={{ minHeight: "100vh" }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-5">
                            <div className="sign-image-sec">
                                         <img src={LoginImage} alt="Login Art" className="signup" />
                            </div>
                        </div>
                        <div className="col-lg-7 d-flex align-items-center">
                            <div className="card-body forgot-pass">
 <div className="exchange-title">
              Forgot  <br></br>password?
              <span className="exchange_rate">To send money securely.</span>
            </div>
                               
                                <form onSubmit={formik.handleSubmit} className="exchange-form" noValidate>
                                    <Form.Group className="mb-3 form_label" controlId="formBasicEmail">
                                        {/* <Form.Label>Your Mobile Number<span style={{ color: 'red' }} >*</span></Form.Label> */}
                                        <FloatingLabel
                                                  as={Col}
                                                  label="Your Mobile Number"
                                                 >
                                        <PhoneInput
                                            onlyCountries={["au", "nz"]}
                                            country={"au"}
                                            name="mobile"
                                            inputStyle={{ border: "none", margin: "none" }}
                                            inputClass="userPhone w-100"
                                            defaultCountry={"au"}
                                            countryCodeEditable={false}
                                            onChange={(val, coun) => { handlePhone(val, coun) }}
                                            className={clsx(
                                                'form-control form-control-sm bg-transparent',
                                                { 'is-invalid': formik.touched.mobile && formik.errors.mobile },
                                                {
                                                    'is-valid': formik.touched.mobile && !formik.errors.mobile,
                                                }
                                            )}

                                        />
                                        </FloatingLabel>
                                    </Form.Group>
                                    
                                    <Button variant="primary"
                                        type="submit"
                                        className="custom-signin-btn"
                                    >
                                        Reset

                                        
                                        {loading ? <>
                                            <div className="loader-overly">
                                                <div className="loader" >

                                                </div>

                                            </div>
                                        </> : <></>}
                                    </Button>
                                </form>
                                <div className="backlogin mt-4">
                                    Back to Login  <a href="/login">Go Back</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}



export default ForgotPassword;