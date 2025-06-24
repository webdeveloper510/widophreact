import React, { useState } from "react";
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import global from "../../utils/global";
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";

const Contactus = () => {
    const [loading, setLoading] = useState(false);

    const notify = () => toast.success("Message Sent Successfully!");

    const handleNumericOnly = (event) => {
        const result = event.target.value.replace(/[^0-9]/, "")
        formik.setFieldValue(event.target.name, result)
    }

    const initialValues = {
        email: "",
        name: "",
        message: "",
        // mobile: ""
    };

    const signSchema = Yup.object().shape({
        message: Yup.string().required().transform((originalValue) => originalValue.trim()),
        name: Yup.string().required().transform((originalValue) => originalValue.trim()),
        email: Yup.string().matches(/^[\w-+\.]+@([\w-]+\.)+[\w-]{2,10}$/, "Invalid email format").min(6).max(50).required("Email is required"),
        // mobile: Yup.string().min(9, "Minimum 9 digits").required("Mobile is required")
    });

    const formik = useFormik({
        initialValues,
        validationSchema: signSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                let mno = parseInt(values.mobile, 10);
                let data = { ...values, mobile: mno };
                // console.log(data);
                const response = await axios.post(global.serverUrl + '/contact-us/', data, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                notify();
                formik.resetForm();
            } catch (error) {
                setLoading(false);
                if (error.response.data.status) {
                    toast.error(error.response.data.message || error.response.data.password[0]);
                }
            } finally {
                setLoading(false);
            }
        }

    });

    return (
        <section className="sigupsec" style={{ minHeight: "100vh" }}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="row">
                            <div className="col-lg-5">
                                <div className="sign-image-sec">
                                    <img src="assets/img/home/signup-left.webp" className="signup" alt="alt_image" />
                                </div>
                            </div>
                            <div className="col-lg-7 d-flex align-items-center">
                                <div className="row w-100">
                                    <div className="col-lg-12">
                                        <div className="card1 card-signup1">
                                            <div className="card-body">
                                                <h2 className="Sign-heading">Contact Us</h2>
                                                <div className="form_login">
                                                    <form onSubmit={formik.handleSubmit} autoComplete="on">
                                                        <div className="row">
                                                            <Form.Group className="mb-2 form_label">
                                                                <Form.Label>Name <span style={{ color: 'red' }} >*</span> </Form.Label>
                                                                <div className="email-phone">
                                                                    <div className="row">
                                                                        <div className="col-md-12 padding-dd mobiletext">
                                                                            <Form.Control
                                                                                type={'text'}
                                                                                autoComplete="off"
                                                                                name="name"
                                                                                size="lg"
                                                                                {...formik.getFieldProps('name')}
                                                                                className={clsx(
                                                                                    'form-control email-mobile-input',
                                                                                    { 'is-invalid': formik.touched.name && formik.errors.name },
                                                                                    { 'is-valid': formik.touched.name && !formik.errors.name }
                                                                                )}
                                                                                placeholder="Name"
                                                                            />
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {formik.errors.name}
                                                                            </Form.Control.Feedback>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Form.Group>

                                                            {/* <Form.Group className="mb-2 form_label" >
                                                                <Form.Label>Your Phone<span style={{ color: 'red' }} >*</span> </Form.Label>
                                                                <div className="email-phone">
                                                                    <div className="row">
                                                                        <div className="col-md-12 padding-dd mobiletext">
                                                                            <Form.Control
                                                                                type="text"
                                                                                name="mobile"
                                                                                value={formik.values.mobile}
                                                                                id="mobile"
                                                                                maxLength="10"
                                                                                onChange={(e) => handleNumericOnly(e)}
                                                                                className={clsx(
                                                                                    'form-control email-mobile-input',
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
                                                                </div>
                                                            </Form.Group> */}

                                                            <Form.Group className="mb-2 form_label" >
                                                                <Form.Label>Your Email<span style={{ color: '#FD6063' }} >*</span> </Form.Label>
                                                                <div className="email-phone">
                                                                    <div className="row">
                                                                        <div className="col-md-12 padding-dd mobiletext">
                                                                            <Form.Control
                                                                                type="email"
                                                                                name="email"
                                                                                placeholder="Enter Your Email..."
                                                                                {...formik.getFieldProps('email')}
                                                                                className={clsx(
                                                                                    'form-control email-mobile-input',
                                                                                    { 'is-invalid': formik.touched.mobile && formik.errors.mobile },
                                                                                    {
                                                                                        'is-valid': formik.touched.mobile && !formik.errors.mobile,
                                                                                    }
                                                                                )}
                                                                                autoComplete="off"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {formik.touched.email && formik.errors.email && (
                                                                    <div className='fv-plugins-message-container mt-1'>
                                                                        <div className='fv-help-block'>
                                                                            <span role='alert' className="text-danger">{formik.errors.email}</span>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                            </Form.Group>

                                                            <Form.Group className="mb-2 form_label">
                                                                <Form.Label>Message <span style={{ color: 'red' }} >*</span> </Form.Label>
                                                                <div className="email-phone1">
                                                                    <div className="row">
                                                                        <div className="col-md-12 padding-dd mobiletext">

                                                                            <Form.Control
                                                                                as="textarea"

                                                                                {...formik.getFieldProps('message')}
                                                                                className={clsx(
                                                                                    'form-control textArea',
                                                                                    { 'is-invalid': formik.touched.message && formik.errors.message },
                                                                                    {
                                                                                        'is-valid': formik.touched.message && !formik.errors.message,
                                                                                    }
                                                                                )}
                                                                                placeholder="Message ....."
                                                                                rows={4}
                                                                                aria-label="With textarea"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {formik.touched.message && formik.errors.message && (
                                                                    <div className='fv-plugins-message-container mt-1'>
                                                                        <div className='fv-help-block'>
                                                                            <span role='alert' className="text-danger">{formik.errors.message}</span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Form.Group>

                                                        </div>




                                                        <button variant="primary"
                                                            type="submit"
                                                            className="login_button wid"
                                                        >
                                                            Send Message <img src="assets/img/home/Union.png" className="vission_image" alt="alt_image" />
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
                        </div>
                    </div>
                </div>
            </div>
        </section>




    )
}



export default Contactus;