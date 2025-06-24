import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup"
import clsx from "clsx";
import { changePassword } from "../../utils/Api";
import { Modal } from "react-bootstrap";
import PopVerify from "../verification/PopVerify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Profile = () => {

  const [loading, setLoading] = useState(false);
  const [open_modal, setOpenModal] = useState(false)
  const [is_otp_verified, setIsOtpVerfied] = useState(false)
  const [show_old, setShowOld] = useState(false)
  const [show_new, setShowNew] = useState(false);
  const [show_confirm, setShowConfirm] = useState(false);

  const updateSchema = Yup.object().shape({
    old_password: Yup.string().required("Current password is required"),
    new_password: Yup.string().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,30}$/, 'Password must contain uppercase, lowercase, symbols, digits, minimum 6 characters').required("Password is required"),
    confirmPassword: Yup.string().oneOf([Yup.ref("new_password")], "Passwords did not match").required("Password confirmation is required")
  })

  const initialValues = {
    old_password: '',
    new_password: '',
    confirmPassword: ""
  }

  const formik = useFormik({
    initialValues,
    validationSchema: updateSchema,
    onSubmit: async (values) => {
      setOpenModal(true)
    }
  })

  const handleOtpVerification = (value) => {
    setIsOtpVerfied(value)
  }

  const handleCancel = () => {
    formik.setValues({ old_password: "", new_password: "", confirmPassword: "" })
  }

  const handleSubmit = () => {
    setLoading(true)
    changePassword(formik.values).then((response) => {
      if (response.code == "200") {
        toast.success('Password Succesfully Updated', { position: "bottom-right", autoClose: 2000, hideProgressBar: true });

      } else if (response.code == "400") {

        toast.error(response.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true });
      }
      setLoading(false)
      formik.resetForm()
    }).catch((error) => {
      if (error.response.code == "400") {

        toast.error(error.response.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true });
      }
      setLoading(false)
    })
  }

  useEffect(() => {
    if (is_otp_verified === true) {
      handleSubmit()
      setIsOtpVerfied(false)
    }
  }, [is_otp_verified])


  return (
    <>

      <div className="col-md-12">
        <section className="change-password">

          <div className="form-head mb-4">
            <h2 className="text-black font-w600 mb-0"><b>Change Password</b>
            </h2>
          </div>
          <div className="card">
            <div className="card-body">
              <div className="update-profile">

                <form onSubmit={formik.handleSubmit} noValidate >
                  <div className="row each-row">
                    <div className="col-md-4">
                      <Form.Group className="form_label" >
                        <p className="get-text">Current Password<span style={{ color: 'red' }} >*</span></p>
                        <Form.Control
                          type={show_old ? "text" : "password"}
                          placeholder="Current password"
                          autoComplete='off'
                          {...formik.getFieldProps('old_password')}
                          className={clsx(
                            'form-control bg-transparent',
                            { 'is-invalid': formik.touched.old_password && formik.errors.old_password },
                            {
                              'is-valid': formik.touched.old_password && !formik.errors.old_password,
                            }
                          )}
                        />
                        <span onClick={() => setShowOld(!show_old)} className="eye_iconn">
                          {show_old ? <FaEyeSlash /> : <FaEye />}
                        </span>
                        {formik.touched.old_password && formik.errors.old_password && (
                          <div className='fv-plugins-message-container mt-1'>
                            <div className='fv-help-block'>
                              <span role='alert' className="text-danger">{formik.errors.old_password}</span>
                            </div>
                          </div>
                        )}
                      </Form.Group>
                    </div>
                    <div className="col-md-4">
                      <Form.Group className="form_label" >
                        <p className="get-text">New Password<span style={{ color: 'red' }} >*</span></p>
                        <Form.Control
                          type={show_new ? "text" : "password"}
                          placeholder="New password"
                          autoComplete='off'
                          {...formik.getFieldProps('new_password')}
                          className={clsx(
                            'form-control bg-transparent',
                            { 'is-invalid': formik.touched.new_password && formik.errors.new_password },
                            {
                              'is-valid': formik.touched.new_password && !formik.errors.new_password,
                            }
                          )}
                        />
                        <span onClick={() => setShowNew(!show_new)} className="eye_iconn">
                          {show_new ? <FaEyeSlash /> : <FaEye />}
                        </span>
                        {formik.touched.new_password && formik.errors.new_password && (
                          <div className='fv-plugins-message-container mt-1'>
                            <div className='fv-help-block'>
                              <span role='alert' className="text-danger">{formik.errors.new_password}</span>
                            </div>
                          </div>
                        )}
                      </Form.Group>
                    </div>
                    <div className="col-md-4">
                      <Form.Group className="form_label" >
                        <p className="get-text">Confirm Password<span style={{ color: 'red' }} >*</span></p>
                        <Form.Control
                          type={show_confirm ? "text" : "password"}
                          placeholder="Confirm password"
                          autoComplete='off'
                          {...formik.getFieldProps('confirmPassword')}
                          className={clsx(
                            'form-control bg-transparent',
                            { 'is-invalid': formik.touched.confirmPassword && formik.errors.confirmPassword },
                            {
                              'is-valid': formik.touched.confirmPassword && !formik.errors.confirmPassword,
                            }
                          )}
                        />
                        <span onClick={() => setShowConfirm(!show_confirm)} className="eye_iconn">
                          {show_confirm ? <FaEyeSlash /> : <FaEye />}
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
                  <div className="row each-row">
                    <div className="col-md-4">
                      <button
                        type="button"
                        className="start-form-button full-col"
                        onClick={() => handleCancel()}
                      >Cancel</button>
                    </div>
                    <div className="col-md-8 full-col">
                      <button
                        type="submit"
                        className="profile-form-button"
                      >
                        Change Password
                        {loading ? <>
                          <div className="loader-overly">
                            <div className="loader" >
                            </div>
                          </div>
                        </> : <></>}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Modal show={open_modal} onHide={() => setOpenModal(false)} backdrop="static" centered>
        <PopVerify handler={handleOtpVerification} close={() => { setOpenModal(false) }} />
      </Modal>
    </>
  )
}



export default Profile;