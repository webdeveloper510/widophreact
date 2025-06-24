import React, { useState } from "react";
import Form from 'react-bootstrap/Form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { resetPassword } from "../../utils/Api";
import { useFormik } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as Yup from "yup";
import clsx from "clsx";

const RecentPassword = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false)
    const { customer_id } = useLocation().state
    const navigate = useNavigate();


    const toggleShowPassword = () => setShowPassword(prevState => !prevState);
    const toggleShowConfirmPassword = () => setShowConfirmPassword(prevState => !prevState)

    const loginSchema = Yup.object().shape({
        reset_password_otp: Yup.string().length(6, "O.T.P must be of 6 digits")
            .required('O.T.P is required'),
        password: Yup.string().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,30}$/, 'Password must contain uppercase, lowercase, symbols, digits, minimum 6 characters').required("Password is required"),
        confirm_password: Yup.string().oneOf([Yup.ref("password")], "Passwords did not match").required("Password confirmation is required"),
    })

    const initialValues = {
        reset_password_otp: '',
        password: '',
        confirm_password: ""
    }

    const formik = useFormik({
        initialValues,
        validationSchema: loginSchema,
        onSubmit: async (values) => {
            setLoading(true);
            resetPassword({ customer_id: customer_id, password: values.password, reset_password_otp: values.reset_password_otp }).then((res) => {
                setLoading(false)
                if (res.code === "200") {
                    toast.success("Password Reset Successfully, please login to continue", { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
                    formik.resetForm()
                    navigate("/login")
                } else if (res.code === "400") {
                    toast.error(res.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true });
                }
            }).catch((error) => {
                if (error.response.code) {
                    toast.error(error.response.message || error.response.non_field_errors);
                }
                if (error.response.status === 400) {
                    toast.error(error.response.data.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true });
                }
                setLoading(false)
            })
        },
    })

    const handleChange = (event) => {
        const regex = /^[0-9]*$/;
        let userInput = event.target.value;
        if (!regex.test(userInput)) {
            const filteredInput = userInput.replace(/[^0-9]/g, '');
            userInput = filteredInput
        }
        formik.setFieldValue(event.target.name, userInput)
    }


    return (
        <>
            <section className="sigupsec" style={{ minHeight: "100vh", backgroundColor: "transparent" }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-5">
                            <div className="sign-image-sec">
                                <img src="assets/img/home/signup-left.webp" className="signup" alt="alt_image" />

                            </div>
                        </div>
                        <div className="col-lg-7 d-flex align-items-center">
                            <div className="card-body forgot-pass resetpass">
                                <h2 className="Sign-heading mb-5">Reset Password</h2>
                                <form onSubmit={formik.handleSubmit}>
                                    <Form.Group className="mb-3 form_label" >
                                        <Form.Label>Reset Password OTP<span style={{ color: 'red' }} >*</span></Form.Label>
                                        <input
                                            type="text"
                                            placeholder="Enter Reset password OTP"
                                            name="reset_password_otp"
                                            value={formik.values.reset_password_otp}
                                            onChange={handleChange}
                                            onBlur={formik.handleBlur}
                                            maxLength="6"
                                            className={clsx(
                                                'form-control bg-transparent',
                                                { 'is-invalid': formik.touched.reset_password_otp && formik.errors.reset_password_otp },
                                                {
                                                    'is-valid': formik.touched.reset_password_otp && !formik.errors.reset_password_otp,
                                                }
                                            )}
                                        />
                                        {formik.touched.reset_password_otp && formik.errors.reset_password_otp && (
                                            <div className='fv-plugins-message-container mt-1'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className="text-danger">{formik.errors.reset_password_otp}</span>
                                                </div>
                                            </div>
                                        )}
                                    </Form.Group>
                                    <Form.Group className="mb-3 form_label" >
                                        <Form.Label>New Password<span style={{ color: 'red' }} >*</span></Form.Label>
                                        <Form.Control
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            autoComplete="off"
                                            {...formik.getFieldProps('password')}
                                            placeholder="Password"
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
                                        {formik.touched.password && formik.errors.password && (
                                            <div className='fv-plugins-message-container mt-1'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className="text-danger">{formik.errors.password}</span>
                                                </div>
                                            </div>
                                        )}
                                    </Form.Group>
                                    <Form.Group className="mb-3 form_label" >
                                        <Form.Label>Confirm Password<span style={{ color: 'red' }} >*</span></Form.Label>
                                        <Form.Control
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="confirm Password"
                                            autoComplete="off"
                                            placeholder="Confirm Password"
                                            {...formik.getFieldProps('confirm_password')}
                                            className={`${clsx(
                                                'form-control bg-transparent',
                                                { 'is-invalid': formik.touched.confirm_password && formik.errors.confirm_password },
                                                {
                                                    'is-valid': formik.touched.confirm_password && !formik.errors.confirm_password,
                                                }
                                            )} rate_input form-control`}
                                        />
                                        <span onClick={toggleShowConfirmPassword} className="pass_icons">
                                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                        {formik.touched.confirm_password && formik.errors.confirm_password && (
                                            <div className='fv-plugins-message-container mt-1'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className="text-danger">{formik.errors.confirm_password}</span>
                                                </div>
                                            </div>
                                        )}
                                    </Form.Group>
                                    <button variant="primary"
                                        type="submit"
                                        className="login_button"
                                    >
                                        Reset Password
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
            </section>
            {/* <section className="why-us section-bgba">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card card-recent-password">
                                        <div className="card-body">
                                            <h5 className="Sign-heading">Reset Password </h5>
                                            <div className="form_login">
                                              
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}
        </>

    )
}



export default RecentPassword;