// Step1.js
import React, { useEffect, useMemo, useState } from "react";
import "react-phone-input-2/lib/bootstrap.css";
import birthCountryList from 'react-select-country-list';
import clsx from "clsx";
import { senderAreaList as areaList } from "../../utils/ArealList";
import { useFormik } from "formik";
import * as Yup from "yup";
import { userProfile } from "../../utils/Api";
import { toast } from "react-toastify";

const Step1 = ({ skipHandler, nextStep, updateData }) => {

  /* ------------------------------------------- State declaration --------------------------------------------- */

  const countryOptions = useMemo(() => birthCountryList().getData(), [])
  const user_data = JSON.parse(sessionStorage.getItem("remi-user-dt"))

  const [selected_area_code, setSelectedAreaCode] = useState("61")
  const [initial, setInitial] = useState({ mobile: "", email: "" })

  const firstSchema = Yup.object().shape({
    First_name: Yup.string().min(1).max(25).required().trim(),
    Middle_name: Yup.string().max(25).trim(),
    Last_name: Yup.string().min(1).max(25).required().trim(),
    email: Yup.string().matches(/^[\w-+\.]+@([\w-]+\.)+[\w-]{2,5}$/, "Invalid email format").max(50).required(),
    mobile: Yup.string().min(9).max(10).matches(/^[0-9]{9,10}/, "Invalid mobile number").required(),
    Date_of_birth: Yup.date().min(new Date(Date.now() - 3721248000000), "Must be atleast 18 year old").max(new Date(Date.now() - 567648000000), "Must be atleast 18 year old").required("DOB is required"),
    occupation: Yup.string().min(1).max(50).required().trim(),
    Country_of_birth: Yup.string().required().notOneOf(["none"]),
  })

  const formik = useFormik({
    initialValues: {
      customer_id: "",
      mobile_verified: "",
      email: "",
      First_name: "",
      Middle_name: "",
      Last_name: "",
      Date_of_birth: "",
      Country_of_birth: "none",
      mobile: "",
    },
    validationSchema: firstSchema,
    onSubmit: async (values) => {
      let payload = values;
      let mobile = parseInt(values.mobile, 10)
      if (initial.mobile !== "+" + selected_area_code + mobile) {
        payload.mobile = "+" + selected_area_code + mobile
      } else {
        delete payload["mobile"]
      }
      if (initial.email === values.email) {
        delete payload["email"]
      }
      if (/^\s*$/.test(payload.Middle_name)) {
        delete payload['Middle_name']
      }
      nextStep()
      updateData(payload)
    }
  })



  useEffect(() => {
    var dtToday = new Date();
    var month = dtToday.getMonth() + 1;
    var day;
    if (month === 2 && dtToday.getDate() === 29) {
      day = dtToday.getDate() - 1
    } else {
      day = dtToday.getDate();
    }
    var year = dtToday.getFullYear() - 18;
    if (month < 10)
      month = '0' + month.toString();
    if (day < 10)
      day = '0' + day.toString();
    var maxDate = year + '-' + month + '-' + day;
    var minDate = year - 100 + '-' + month + "-" + day
    document.getElementById("dob").setAttribute('max', maxDate);
    document.getElementById("dob").setAttribute('min', minDate);
  }, [])

  const handleNumericOnly = (event) => {
    const result = event.target.value.replace(/[^0-9]/, "");
    formik.setFieldValue(event.target.name, result);
    event.target.value = result;
    formik.handleChange(event)
  }

  const handleChange = (e) => {
    formik.setFieldValue(`${[e.target.name]}`, e.target.value)
    formik.setFieldTouched(`${[e.target.name]}`, true)
    formik.handleChange(e)
  }

  const handleEmail = (e, max) => {
    if (e.key === 'Backspace' || e.key === 'Enter' || e.key === 'Tab' || e.key === 'Shift' || e.key === 'ArrowLeft' || e.key === "ArrowRight" || e.key === "Escape" || e.key === "Delete") {
      formik.setFieldValue(`${[e.target.name]}`, e.target.value)
      formik.setFieldTouched(`${[e.target.name]}`, true)
    } else {
      const value = e.target.value.toString()
      if (value.length >= max) {
        e.stopPropagation()
        e.preventDefault()

      } else {
        formik.setFieldValue(`${[e.target.name]}`, e.target.value)
        formik.setFieldTouched(`${[e.target.name]}`, true)
      }
    }
  }

  const handleOnlyAplha = (event) => {
    const result = event.target.value.replace(/[^A-Za-z!@#$%^&*()_+\-=[\]{};':"\\|,.<>/? ]/gi, "");
    formik.setFieldValue(event.target.name, result)
    formik.setFieldTouched(event.target.name, true)
  }

  const onKeyBirth = (event) => {
    if (formik?.values?.Date_of_birth !== "" || null || undefined) {
      if (event.key === " ") {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }

  useEffect(() => {
    userProfile().then((res) => {
      if (res.code == "200") {
        let p = res.data.mobile
        let phone = p.substring(3);
        setSelectedAreaCode(p.substring(1, 3))
        formik.setValues({
          First_name: res.data.First_name || "",
          Last_name: res.data.Last_name || "",
          Middle_name: res.data.Middle_name || "",
          email: res.data.email || "",
          Country_of_birth: res.data.Country_of_birth || "",
          mobile: phone || "",
          Date_of_birth: res.data.Date_of_birth || "",
          occupation: res.data.occupation || "",
        })
        setInitial({
          mobile: res.data.mobile,
          email: res.data.email
        })
      }
    }).catch((error) => {
      if (error.response.data.code == "400") {
        toast.error(error.response.data.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
      }
    })
  }, [])

  const onSkip = () => {
    let values = formik.values;
    let mobile = parseInt(values.mobile, 10)
    if (initial.mobile !== "+" + selected_area_code + mobile) {
      values.mobile = "+" + selected_area_code + mobile
    } else {
      delete values["mobile"]
    }
    if (initial.email === values.email) {
      delete values["email"]
    }
    if (/^\s*$/.test(values.Middle_name)) {
      delete values['Middle_name']
    }
    skipHandler(values)
  }


  return (
    <>

      <section className="kyc">
        <form onSubmit={formik.handleSubmit} noValidate className="single-recipient">
          <div className="">
            <div className="">
              <div className="row each-row">
                <h5>Personal Details</h5>
                <div className="col-md-4">
                  <div className="input_field">
                    <p className="get-text">First Name<span style={{ color: 'red' }} >*</span></p>
                    <input
                      type="text"
                      name="First_name"
                      value={formik.values.First_name}
                      onChange={handleOnlyAplha}
                      maxLength="25"
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': formik.touched.First_name && formik.errors.First_name },
                        { 'is-valid': formik.touched.First_name && !formik.errors.First_name }
                      )}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="input_field">
                    <p className="get-text">Middle Name</p>
                    <input
                      type="text"
                      name="Middle_name"
                      className='form-control'
                      maxLength="25"
                      onChange={handleOnlyAplha}
                      value={formik.values.Middle_name}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="input_field">
                    <p className="get-text">Last Name<span style={{ color: 'red' }} >*</span></p>
                    <input
                      type="text"
                      name="Last_name"
                      value={formik?.values.Last_name}
                      maxLength="25"
                      onChange={handleOnlyAplha}
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': formik.touched.Last_name && formik.errors.Last_name },
                        { 'is-valid': formik.touched.Last_name && !formik.errors.Last_name, }
                      )}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                </div>
              </div>
              <div className="row each-row">
                <div className="col-md-6">
                  <div className="input_field">
                    <p className="get-text">Email<span style={{ color: 'red' }} >*</span></p>
                    <input
                      type="email"
                      value={formik?.values.email}
                      style={{ backgroundColor: "rgba(252, 253, 255, 0.81)" }}
                      onKeyDown={(e) => { handleEmail(e, 50) }}
                      {...formik.getFieldProps("email")}
                      className={clsx('form-control bg-transparent',
                        { 'is-invalid': formik.touched.email && formik.errors.email },
                        {
                          'is-valid': formik.touched.email && !formik.errors.email,
                        })}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="input_field">
                    <p className="get-text">Mobile<span style={{ color: 'red' }} >*</span></p>
                    <div className="row kustom_mobile">
                      <div className="col-md-4 px-0">
                        <select
                          className="form-control form-select bg-transparent"
                          value={selected_area_code}
                          onChange={(e) => setSelectedAreaCode(e.target.value)}
                        >
                          {
                            areaList?.map((area, index) => {
                              return (
                                <option key={index} value={area?.code}>+{area?.code}&nbsp;({area?.name})</option>
                              )
                            })
                          }
                        </select>
                      </div>
                      <div className={`col-md-8 px-0`}>
                        <input
                          type="text"
                          name="mobile"
                          value={formik.values.mobile}
                          id="mobile"
                          maxLength="10"
                          minLength='9'
                          onChange={(e) => handleNumericOnly(e)}
                          onBlur={formik.handleBlur}
                          className={clsx(
                            'form-control bg-transparent',
                            { 'is-invalid': formik.touched.mobile && formik.errors.mobile },
                            {
                              'is-valid': formik.touched.mobile && !formik.errors.mobile,
                            }
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row each-row">
                <div className="col-md-4">
                  <div className="input_field">
                    <p className="get-text">Date of Birth<span style={{ color: 'red' }} >*</span></p>
                    <input
                      type="date"
                      name="Date_of_birth"
                      value={formik?.values.Date_of_birth}
                      id="dob"
                      onChange={(e) => handleChange(e)}
                      onKeyDown={(event) => { onKeyBirth(event) }}
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': formik.touched.Date_of_birth && formik.errors.Date_of_birth },
                        {
                          'is-valid': formik.touched.Date_of_birth && !formik.errors.Date_of_birth,
                        }
                      )}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.Date_of_birth && formik.errors.Date_of_birth && (
                      <div className='fv-plugins-message-container mt-1'>
                        <div className='fv-help-block'>
                          <span role='alert' className="text-danger">{formik.errors.Date_of_birth}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-4 country-h">
                  <div className="input_field">
                    <p className="get-text">Country of Birth<span style={{ color: 'red' }} >*</span></p>
                    <select
                      value={formik.values.Country_of_birth}
                      name="Country_of_birth"
                      onChange={(e) => handleChange(e)}
                      className={clsx(
                        'form-control form-select bg-transparent',
                        { 'is-invalid': formik.touched.Country_of_birth && formik.errors.Country_of_birth },
                        {
                          'is-valid': formik.touched.Country_of_birth && !formik.errors.Country_of_birth,
                        }
                      )}
                      onBlur={formik.handleBlur}
                    >
                      <option value={"none"} key={"none"}>Select a country</option>
                      {
                        countryOptions && countryOptions.length > 0 ?
                          countryOptions?.map((opt) => {
                            return (
                              <option value={opt.label}>{opt.label}</option>
                            )
                          }) : ""
                      }
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="input_field">
                    <p className="get-text">Occupation<span style={{ color: 'red' }} >*</span></p>
                    <input
                      type="text"
                      name="occupation"
                      value={formik?.values.occupation}
                      id="occupation"
                      maxLength="50"
                      onChange={(e) => handleOnlyAplha(e)}
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': formik.touched.occupation && formik.errors.occupation },
                        {
                          'is-valid': formik.touched.occupation && !formik.errors.occupation,
                        }
                      )}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="next-step">
            <button type="submit" className="login_button">Next <b>Step</b>  <img src="assets/img/home/Union.png" className="vission_image" alt="alt_image" /></button>
            <button type="button" onClick={() => onSkip()} className="SKip">Skip</button>
          </div>
        </form>
      </section>
    </>

  )
}

export default Step1;