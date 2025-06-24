
import React, { useState, useEffect, useMemo } from "react";
import Form from 'react-bootstrap/Form';
import { toast } from "react-toastify";
import "react-phone-input-2/lib/bootstrap.css";
import { useFormik } from "formik";
import birthCountryList from 'react-select-country-list';
import * as Yup from "yup"
import clsx from "clsx";
import { userProfile, updateProfile, updateAccountUsage } from "../../utils/Api";
import { Button, FormSelect, Modal } from "react-bootstrap";
import PopVerify from "../verification/PopVerify";
import { senderAreaList as areaList } from "../../utils/ArealList";
import Autocomplete from "react-google-autocomplete";
import { BsCheckCircleFill } from "react-icons/bs";

const Profile = () => {
  const [open_modal, setOpenModal] = useState(false)
  const [is_otp_verified, setIsOtpVerfied] = useState(false)
  const [loading, setLoading] = React.useState(false);
  const [is_update, setIsUpdate] = useState({ email: "", mobile: "" })
  const [data, setData] = useState({
    First_name: "", Middle_name: "", Last_name: "",
    Gender: "Male", Country_of_birth: "",
    Date_of_birth: "", flat: "", building: "",
    street: "", city: "none", country: "none",
    postcode: "", state: "none", email: "", mobile: "", occupation: "",
    customer_id: "", country_code: "AU", payment_per_annum: "Tier-1 Less than 5 times", value_per_annum: "Tier-1 Less than $30,000"
  })
  const [account_usage_updater, setAccountUsageUpdater] = useState({
    is_open: false,
    type: null,
    value: null
  })

  const [selected_area_code, setSelectedAreaCode] = useState("61");
  const [user_data, setUserData] = useState()
  const [max_date, setMaxDate] = useState("")
  const [min_date, setMinDate] = useState("")

  const initialValues = {
    First_name: "", Middle_name: "", Last_name: "",
    Gender: "Male", Country_of_birth: "",
    Date_of_birth: "", flat: "", building: "",
    street: "", city: "none", country: "none", country_code: "AU",
    postcode: "", state: "none", email: "", mobile: "", occupation: "", address: "",
    customer_id: "", payment_per_annum: "Tier-1 Less than 5 times", value_per_annum: "Tier-1 Less than $30,000"
  }

  const profileSchema = Yup.object().shape({
    First_name: Yup.string().min(2).max(25).required().trim(),
    Last_name: Yup.string().min(2).max(25).required().trim(),
    Middle_name: Yup.string().trim().notRequired(),
    email: Yup.string().matches(/^[\w-+\.]+@([\w-]+\.)+[\w-]{2,5}$/, "Invalid email format").max(50).required(),
    mobile: Yup.string().min(9).max(10).required(),
    address: Yup.string(),
    flat: Yup.string().max(30).trim().notRequired(),
    building: Yup.string().min(1).max(30).required().trim(),
    street: Yup.string().max(100).required().trim(),
    city: Yup.string().min(1).max(35).required().trim().notOneOf(["none"]),
    postcode: Yup.string().length(4).required(),
    state: Yup.string().min(2).max(35).required().trim().notOneOf(["none"]),
    country: Yup.string().min(2).max(30).required().notOneOf(["none"]),
    Date_of_birth: Yup.date().min(new Date(Date.now() - 3721248000000), "Must be atleast 18 year old").max(new Date(Date.now() - 567648000000), "Must be atleast 18 year old").required("DOB is required"),
    occupation: Yup.string().min(1).max(50).required().trim(),
    Country_of_birth: Yup.string().required().notOneOf(["none"]),
    payment_per_annum: Yup.string().required().notOneOf(["none"]),
    value_per_annum: Yup.string().required().notOneOf(["none"]),
  })

  const handleOtpVerification = (value) => {
    setIsOtpVerfied(value)
  }

  const formik = useFormik({
    initialValues,
    validationSchema: profileSchema,
    onSubmit: async (values) => {
      if (values.country === "Australia") {
        values.country_code = "AU"
      } else {
        values.country_code = "NZ"
      }
      setOpenModal(true)
    }
  })

  const countryOptions = useMemo(() => birthCountryList().getData(), [])

  useEffect(() => {
    setLoading(true)
    userProfile().then((res) => {
      if (res.code == "200") {
        setLoading(false)
        let p = res.data.mobile

        let phone = p.substring(3);

        setSelectedAreaCode(p.substring(1, 3))
        let p_a, v_a;
        if (res.data.payment_per_annum === "" || res.data.payment_per_annum === null) {
          p_a = "Tier-1 Less than 5 times";
        } else {
          p_a = res.data.payment_per_annum
        }
        if (res.data.value_per_annum === "" || res.data.value_per_annum === null) {
          v_a = "Tier-1 Less than $30,000"
        } else {
          v_a = res.data.value_per_annum
        }
        formik.setValues({ ...res.data, mobile: phone, postcode: res.data.postcode, state: res?.data?.state !== null ? res?.data?.state : "", city: res?.data?.city !== null ? res?.data?.city : "", occupation: res?.data?.occupation?.toLowerCase() !== "none" ? res?.data?.occupation : "", payment_per_annum: p_a, value_per_annum: v_a, address: res.data.address != null ? res?.data?.address : "" })
        setUserData(res.data)
        setIsUpdate({ email: res.data.email, mobile: p })
      }
    }).catch((error) => {
      if (error.response.data.code == "400") {
        toast.error(error.response.data.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
      }
      setLoading(false)
    })
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
    setMinDate(minDate)
    setMaxDate(maxDate)
  }, [])

  const handleNumericOnly = (event) => {
    const result = event.target.value.replace(/[^0-9]/, "");
    formik.setFieldValue(event.target.name, result)
  }
  const handleNumericOnlyMobile = (event) => {
    const result = event.target.value.replace(/[^0-9]/, "")
    formik.setFieldValue(event.target.name, result)
  }

  const handleChange = (e) => {
    if (e.target.name === "country") {
      formik.setValues({ ...formik.values, country: e.target.value, state: "", city: "", street: "" })
    } else {
      formik.setFieldValue(`${[e.target.name]}`, e.target.value)
      formik.setFieldTouched(`${[e.target.name]}`, true)

    }

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

  const handleSubmit = () => {
    let d = formik.values
    d.mobile = "+" + selected_area_code + parseInt(formik.values.mobile, 10)
    d.country_code = formik.values.country_code
    d.location = formik.values.country
    d.Gender = "NA"

    if (formik.values.Middle_name === "" || formik.values.Middle_name === undefined || formik.values.Middle_name === " ") {
      delete d['Middle_name'];
    }
    if (formik.values.flat === "" || formik.values.flat === null || formik.values.flat === undefined || formik.values.flat === " ") {
      delete d['flat'];
    }
    if (is_update.email === d.email) {
      delete d['email']
    }
    if (is_update.mobile === d.mobile) {
      delete d['mobile']
    }
    if (d.address === "" || d.address === undefined || d.address === " ") {
      delete d['address'];
    }
    delete d["customer_id"];
    delete d["stripe_customer_id"];
    delete d["referred_by"];
    delete d["referral_code"];
    delete d["mobile_verified"];
    delete d["is_verified"];
    delete d["is_digital_Id_verified"];
    delete d["destination_currency"];
    delete d["created_at"];
    delete d["profile_completed"];
    delete d["value_per_annum"];
    delete d["payment_per_annum"];
    delete d["documents"];



    setLoading(true)
    updateProfile(d).then(res => {
      setLoading(false)
      if (res.code === "200") {
        let user = JSON.parse(sessionStorage.getItem("remi-user-dt"))
        let local = { ...res.data, is_digital_Id_verified: user?.is_digital_Id_verified }
        sessionStorage.removeItem("remi-user-dt")
        sessionStorage.setItem("remi-user-dt", JSON.stringify(local))
        setLoading(false)
        toast.success("Profile updated successfully", { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
        formik.resetForm()
        setLoading(true)
        userProfile().then((res) => {
          if (res.code == "200") {
            setLoading(false)
            let p = res.data.mobile
            let phone = p.substring(3)
            formik.setValues({ ...res.data, mobile: phone })
            setIsUpdate({ email: res.data.email, mobile: p })
          }
        }).catch((error) => {
          if (error.response.data.code == "400") {
            toast.error(error.response.data.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
          }
          setLoading(false)
        })
      } else if (res.code === "400") {
        toast.error(res.message, { position: "bottom-right", hideProgressBar: true, autoClose: 2000 })
      }
    }).catch((err) => {
      setLoading(false)
      toast.error(err.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
    })

  }

  useEffect(() => {
    if (is_otp_verified === true) {
      handleSubmit()
      setIsOtpVerfied(false)
    }
  }, [is_otp_verified])

  const onKeyBirth = (event) => {
    if (formik.values.Date_of_birth !== "" || null || undefined) {
      if (event.key === " ") {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }

  const getSelectedStreet = async (place) => {
    let country = "", state = "", city = "", postcode = "", street = "", building = "";
    await place?.address_components?.forEach((component) => {
      if (component?.types?.includes("street_number")) {
        // street = component?.long_name + " " + street;
      } else if (component?.types?.includes('postal_code')) {
        postcode = component?.long_name;
      } else if (component?.types?.includes('route') || component.types.includes('street_name')) {
        street = component?.long_name;
      } else if (component?.types?.includes('locality')) {
        city = component?.long_name;
      } else if (component?.types?.includes('administrative_area_level_1')) {
        state = component?.long_name;
      } else if (component?.types?.includes('country')) {
        country = component?.long_name;
      } else if (component?.types?.includes('subpremise') || component?.types?.includes('building') || component?.types?.includes('building_number')) {
        building = component?.long_name;
      }
    })
    formik.setFieldValue("country", country)
    formik.setFieldValue("state", state)
    formik.setFieldValue("postcode", postcode)
    formik.setFieldValue("city", city)
    formik.setFieldValue("street", street.trim())
    formik.setFieldValue("building", building)
    formik.setFieldValue("address", place?.formatted_address);
  }

  return (
    <>
      <section className="edit_recipient_section">
        <div className="form-head mb-4">
          <span className="text-black font-w600 mb-0 h2"><b>Profile Information</b>
          </span>
          {
            user_data?.is_digital_Id_verified?.toString().toLowerCase() === "approved" ? (
              <span className="verified_text px-2 py-1 fs-5 mx-3">
                KYC Approved
              </span>
            ) : user_data?.is_digital_Id_verified?.toString().toLowerCase() === "declined" ? (
              <span className="unverified_text px-2 py-1 fs-5 mx-3">
                KYC Declined
              </span>
            ) : user_data?.is_digital_Id_verified?.toString().toLowerCase() === "pending" || user_data?.is_digital_Id_verified?.toString().toLowerCase() === "abandoned" ? (
              <span className="pending_verified_text px-2 py-1 fs-5 mx-3">
                KYC Pending
              </span>
            ) : user_data?.is_digital_Id_verified?.toString().toLowerCase() === "resubmission_requested" ? (
              <span className="pending_verified_text px-2 py-1 fs-5 mx-3">
                KYC Resubmission Required
              </span>
            ) : (
              <span className="pending_verified_text px-2 py-1 fs-5 mx-3">
                KYC Submitted
              </span>
            )
          }
        </div>
        <form onSubmit={formik.handleSubmit} noValidate className="single-recipient">
          <div className="card">
            <div className="card-body">
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
                      readOnly={user_data?.is_digital_Id_verified?.toString().toLowerCase() === "approved"}
                      disabled={user_data?.is_digital_Id_verified?.toString().toLowerCase() === "approved"}
                      maxLength="25"
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': user_data?.is_digital_Id_verified?.toString().toLowerCase() !== "approved" && formik.touched.First_name && formik.errors.First_name },
                        {
                          'is-valid': user_data?.is_digital_Id_verified?.toString().toLowerCase() !== "approved" && formik.touched.First_name && !formik.errors.First_name
                        }
                      )}
                      onBlurCapture={formik.handleBlur}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="input_field">
                    <p className="get-text">Middle Name</p>
                    <input
                      type="text"
                      name="Middle_name"
                      maxLength="25"
                      onChange={handleOnlyAplha}
                      value={formik.values.Middle_name}
                      readOnly={user_data?.is_digital_Id_verified?.toString().toLowerCase() === "approved"}
                      disabled={user_data?.is_digital_Id_verified?.toString().toLowerCase() === "approved"}
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': user_data?.is_digital_Id_verified?.toString().toLowerCase() !== "approved" && formik.touched.Middle_name && formik.errors.Middle_name && formik.values.Middle_name !== "" && null },
                        {
                          'is-valid': user_data?.is_digital_Id_verified?.toString().toLowerCase() !== "approved" && formik.touched.Middle_name && !formik.errors.Middle_name && formik.values.Middle_name !== "" && null
                        }
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="input_field">
                    <p className="get-text">Last Name<span style={{ color: 'red' }} >*</span></p>
                    <input
                      type="text"
                      name="Last_name"
                      value={formik.values.Last_name}
                      maxLength="25"
                      onChange={handleOnlyAplha}
                      readOnly={user_data?.is_digital_Id_verified?.toString().toLowerCase() === "approved"}
                      disabled={user_data?.is_digital_Id_verified?.toString().toLowerCase() === "approved"}
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': user_data?.is_digital_Id_verified?.toString().toLowerCase() !== "approved" && formik.touched.Last_name && formik.errors.Last_name },
                        {
                          'is-valid': user_data?.is_digital_Id_verified?.toString().toLowerCase() !== "approved" && formik.touched.Last_name && !formik.errors.Last_name,
                        }
                      )}
                      onBlurCapture={formik.handleBlur}
                    />
                  </div>
                </div>
              </div>
              <div className="row each-row">
                <div className="col-md-4">
                  <div className="input_field">
                    <p className="get-text">Customer Id</p>
                    <input
                      type="text"
                      value={formik.values.customer_id}
                      style={{ backgroundColor: "rgba(252, 253, 255, 0.81)" }}
                      className='form-control'
                      readOnly
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="input_field">
                    <p className="get-text">Email<span style={{ color: 'red' }} >*</span></p>
                    <input
                      type="email"
                      value={formik.values.email}
                      style={{ backgroundColor: "rgba(252, 253, 255, 0.81)" }}
                      onKeyDown={(e) => { handleEmail(e, 50) }}
                      {...formik.getFieldProps("email")}
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': formik.touched.email && formik.errors.email },
                        {
                          'is-valid': formik.touched.email && !formik.errors.email,
                        }
                      )}
                      readOnly={user_data?.is_digital_Id_verified?.toString().toLowerCase() === "approved"}
                      disabled={user_data?.is_digital_Id_verified?.toString().toLowerCase() === "approved"}
                    />
                  </div>
                </div>
                <div className="col-md-4 ">
                  <div className="input_field">
                    <p className="get-text">Mobile<span style={{ color: 'red' }} >*</span></p>
                    <div className="row kustom_mobile">
                      <div className="col-md-5 px-0 select-padding">
                        <select
                          className="form-control form-select bg-transparent"
                          value={selected_area_code}
                          onChange={(e) => setSelectedAreaCode(e.target.value)}
                          readOnly={user_data?.is_digital_Id_verified?.toString().toLowerCase() === "approved"}
                          disabled={user_data?.is_digital_Id_verified?.toString().toLowerCase() === "approved"}
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
                      <div className={`col-md-7 px-0`}>
                        <input
                          type="text"
                          name="mobile"
                          value={formik.values.mobile}
                          id="mobile"
                          maxLength="10"
                          onChange={(e) => handleNumericOnlyMobile(e)}
                          className={clsx(
                            'form-control bg-transparent',
                            { 'is-invalid': formik.touched.mobile && formik.errors.mobile },
                            {
                              'is-valid': formik.touched.mobile && !formik.errors.mobile,
                            }
                          )}
                          readOnly={user_data?.is_digital_Id_verified?.toString().toLowerCase() === "approved"}
                          disabled={user_data?.is_digital_Id_verified?.toString().toLowerCase() === "approved"}
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
                      value={formik.values.Date_of_birth}
                      id="dob"
                      onChange={(e) => handleChange(e)}
                      onKeyDown={(event) => { onKeyBirth(event) }}
                      readOnly={user_data?.is_digital_Id_verified?.toString().toLowerCase() === "approved"}
                      disabled={user_data?.is_digital_Id_verified?.toString().toLowerCase() === "approved"}
                      min={min_date}
                      max={max_date}
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': user_data?.is_digital_Id_verified?.toString().toLowerCase() !== "approved" && formik.touched.Date_of_birth && formik.errors.Date_of_birth },
                        {
                          'is-valid': user_data?.is_digital_Id_verified?.toString().toLowerCase() !== "approved" && formik.touched.Date_of_birth && !formik.errors.Date_of_birth,
                        }
                      )}
                      onBlurCapture={formik.handleBlur}
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
                <div className="col-md-4">
                  <div className="input_field">
                    <p className="get-text">Country Of Birth<span style={{ color: 'red' }} >*</span></p>
                    <select
                      value={formik.values.Country_of_birth}
                      name="Country_of_birth"
                      onChange={(e) => handleChange(e)}
                      readOnly={user_data?.is_digital_Id_verified?.toString().toLowerCase() === "approved"}
                      disabled={user_data?.is_digital_Id_verified?.toString().toLowerCase() === "approved"}
                      className={clsx(
                        'form-control form-select bg-transparent',
                        { 'is-invalid': user_data?.is_digital_Id_verified?.toString().toLowerCase() !== "approved" && formik.touched.Country_of_birth && formik.errors.Country_of_birth },
                        {
                          'is-valid': user_data?.is_digital_Id_verified?.toString().toLowerCase() !== "approved" && formik.touched.Country_of_birth && !formik.errors.Country_of_birth,
                        }
                      )}
                      onBlurCapture={formik.handleBlur}
                    >
                      <option>Select a country</option>
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
                      value={formik.values.occupation}
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
                      onBlurCapture={formik.handleBlur}
                    />
                  </div>
                </div>
              </div>
              <div className="row each-row">
                <p className="mb-3"><span className="h5">Account Usage</span><span className='small'>&nbsp;(Utilization above tier 1 requires additional verification documents.)</span></p>
                <div className="col-md-6">
                  <div className="input_field">
                    <p className="get-text">Projected frequency of payments per annum<span style={{ color: 'red' }} >*</span></p>
                    <input
                      type="text"
                      name="payment_per_anmum"
                      value={formik.values.payment_per_annum}
                      {...formik.getFieldProps("payment_per_annum")}
                      disabled
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': formik.touched.payment_per_annum && formik.errors.payment_per_annum && formik.values.payment_per_annum !== "" && null },
                        {
                          'is-valid': formik.touched.payment_per_annum && !formik.errors.payment_per_annum && formik.values.payment_per_annum !== "" && null,
                        }
                      )}
                    />
                    <button className="form-button" type="button" onClick={() => setAccountUsageUpdater({ is_open: true, type: "payment_per_annum", value: formik.values.payment_per_annum })}>Update</button>
                    {/* <select
                      value={formik.values.payment_per_annum}
                      name="payment_per_annum"
                      onChange={(e) => handleChange(e)}
                      className={clsx(
                        'form-control form-select bg-transparent',
                        { 'is-invalid': formik.touched.payment_per_annum && formik.errors.payment_per_annum },
                        {
                          'is-valid': formik.touched.payment_per_annum && !formik.errors.payment_per_annum,
                        }
                      )}
                      onBlurCapture={formik.handleBlur}
                    >
                      <option value="Tier-1 Less than 5 times" key="Less than 5 times">Tier-1 Less than 5 times</option>
                      <option value="Tier-2 5-10 Times" key="5-10 times">Tier-2 5-10 Times</option>
                      <option value="Tier-3 Greater than 10 Times" key="Greater than 10 times">Tier-3 Greater than 10 Times</option>
                    </select> */}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="input_field">
                    <p className="get-text">Projected value of payments per annum<span style={{ color: 'red' }} >*</span></p>
                    <input
                      type="text"
                      name="value_per_annum"
                      value={formik.values.value_per_annum}
                      {...formik.getFieldProps("value_per_annum")}
                      disabled
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': formik.touched.value_per_annum && formik.errors.value_per_annum && formik.values.value_per_annum !== "" && null },
                        {
                          'is-valid': formik.touched.value_per_annum && !formik.errors.value_per_annum && formik.values.value_per_annum !== "" && null,
                        }
                      )}
                    />
                    <button className="form-button" type="button" onClick={() => setAccountUsageUpdater({ is_open: true, type: "value_per_annum", value: formik.values.value_per_annum })}>Update</button>
                    {/* <select
                      value={formik.values.value_per_annum}
                      name="value_per_annum"
                      onChange={(e) => handleChange(e)}
                      className={clsx(
                        'form-control form-select bg-transparent',
                        { 'is-invalid': formik.touched.value_per_annum && formik.errors.value_per_annum },
                        {
                          'is-valid': formik.touched.value_per_annum && !formik.errors.value_per_annum,
                        }
                      )}
                      onBlurCapture={formik.handleBlur}
                    >
                      <option value="Tier-1 Less than $30,000" key="Less than $30,000">Tier-1 Less than $30,000</option>
                      <option value="Tier-2 $30,000 - $100,000" key="$30,000-$100,000">Tier-2 $30,000 - $100,000</option>
                      <option value="Tier-3 Greater than $100,000" key="Greater than $100,000">Tier-3 Greater than $100,000</option>
                    </select> */}
                  </div>
                </div>
              </div>
              <div className="row each-row">
                <h5>Your Address</h5>
                <div className="col-md-6 mb-3">
                  <Form.Group className="form_label" controlId="country">
                    <p className="get-text">Country<span style={{ color: 'red' }} >*</span></p>
                    <FormSelect
                      value={formik.values.country}
                      name="country"
                      id="country"
                      onChange={handleChange}
                      className={clsx(
                        'bg-transparent',
                        { 'is-invalid': formik.touched.country && formik.errors.country },
                        {
                          'is-valid': formik.touched.country && !formik.errors.country,
                        }
                      )}
                    >
                      <option value="Australia">Australia</option>
                      <option valu="New Zealand">New Zealand</option>
                    </FormSelect>
                  </Form.Group>
                </div>
              </div>
              <div className="row each-row">
                <div className="col-md-12 mb-3">
                  <Form.Group className="form_label" controlId="address">
                    <p className="get-text">Address</p>
                    <Autocomplete
                      apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                      onPlaceSelected={getSelectedStreet}
                      placeholder="Street Address, Company or P.O. box.. "
                      id="address"
                      name="address"
                      className="form-control"
                      options={{
                        types: [],
                        componentRestrictions: { country: formik.values.country === "New Zealand" ? "nz" : "au" },
                      }}
                      onChange={formik.handleChange}
                      value={formik.values.address}
                    />
                  </Form.Group>
                </div>
              </div>
              <div className="row each-row">
                <div className="col-md-4 mb-3">
                  <Form.Group className="form_label" controlId="flat">
                    <p className="get-text">Unit/Apt No.</p>
                    <input
                      type="text"
                      name="flat"
                      value={formik.values.flat}
                      onKeyDown={(e) => { handleEmail(e, 15) }}
                      {...formik.getFieldProps("flat")}
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': formik.touched.flat && formik.errors.flat && formik.values.flat !== "" && null },
                        {
                          'is-valid': formik.touched.flat && !formik.errors.flat && formik.values.flat !== "" && null,
                        }
                      )}
                      onBlur={formik.handleBlur}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-4 mb-3">
                  <Form.Group className="form_label" controlId="building">
                    <p className="get-text">Building No.<span style={{ color: 'red' }} >*</span></p>
                    <input
                      type="text"
                      name="building"
                      value={formik.values.building}
                      onKeyDown={(e) => { handleEmail(e, 30) }}
                      {...formik.getFieldProps("building")}
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': formik.touched.building && formik.errors.building },
                        {
                          'is-valid': formik.touched.building && !formik.errors.building,
                        }
                      )}
                      onBlur={formik.handleBlur}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-4 mb-3">
                  <Form.Group className="form_label" controlId="street_name">
                    <p className="get-text">Street Name<span style={{ color: 'red' }} >*</span></p>
                    <input
                      type="text"
                      name="street"
                      value={formik.values.street}
                      onKeyDown={(e) => { handleEmail(e, 100) }}
                      {...formik.getFieldProps("street")}
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': formik.touched.street && formik.errors.street },
                        {
                          'is-valid': formik.touched.street && !formik.errors.street,
                        }
                      )}
                      onBlur={formik.handleBlur}
                    />
                  </Form.Group>
                </div>
              </div>
              <div className="row each-row">
                <div className="col-md-4 mb-3">
                  <Form.Group className="form_label" controlId="city">
                    <p className="get-text">City/Suburb<span style={{ color: 'red' }} >*</span></p>
                    <input
                      type="text"
                      name="city"
                      value={formik.values.city}
                      maxLength="35"
                      onChange={handleOnlyAplha}
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': formik.touched.city && formik.errors.city },
                        {
                          'is-valid': formik.touched.city && !formik.errors.city,
                        }
                      )}
                      placeholder="city or suburb .."
                      onBlur={formik.handleBlur}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-4 mb-3">
                  <Form.Group className="form_label" controlId="postal">
                    <p className="get-text">Zip/Postal Code<span style={{ color: 'red' }} >*</span></p>
                    <input
                      type="text"
                      name="postcode"
                      value={formik.values.postcode}
                      maxLength="4"
                      onChange={handleNumericOnly}
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': formik.touched.postcode && formik.errors.postcode },
                        {
                          'is-valid': formik.touched.postcode && !formik.errors.postcode,
                        }
                      )}
                      onBlur={formik.handleBlur}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-4 mb-3">
                  <Form.Group className="form_label statess" controlId="state">
                    <p className="get-text">State<span style={{ color: 'red' }} >*</span></p>
                    <input
                      type="text"
                      name="state"
                      value={formik.values.state}
                      maxLength="30"
                      onChange={handleOnlyAplha}
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': formik.touched.state && formik.errors.state },
                        {
                          'is-valid': formik.touched.state && !formik.errors.state,
                        }
                      )}
                      placeholder="state or province .."
                      onBlur={formik.handleBlur}
                    />
                  </Form.Group>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                </div>
                <div className="col-md-8 full-col">
                  <button
                    type="submit"
                    className="form-button"
                  >
                    Update
                    {loading ? <>
                      <div className="loader-overly">
                        <div className="loader" >
                        </div>
                      </div>
                    </> : <></>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section >

      <Modal show={open_modal} onHide={() => setOpenModal(false)} backdrop="static" centered>
        <PopVerify handler={handleOtpVerification} close={() => { setOpenModal(false) }} phone={is_update.mobile} new_mobile={is_update.mobile !== "+" + selected_area_code + data.mobile ? "+" + selected_area_code + data.mobile : null} />
      </Modal>
      <Modal show={account_usage_updater.is_open} onHide={() => setAccountUsageUpdater({ is_open: false, type: null, value: null })} backdrop="static" centered>
        <AccountUsageUpdator data={account_usage_updater} close={() => { setAccountUsageUpdater({ is_open: false, type: null, value: null }) }} />
      </Modal>
    </>
  )
}

const AccountUsageUpdator = ({ data, close }) => {
  const [value, setValue] = useState("");
  const [type, setType] = useState(data.type);
  const [is_submitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    setValue(data.value)
  }, [data])

  const handleCancel = () => {
    close()
  }

  const submit = async () => {
    if (value !== data?.value) {
      setLoading(true)
      await updateAccountUsage({ type: type, value: value }).then(res => {
        setLoading(false)
        if (res.code === "200") {
          userProfile().then(res => {
            let user = JSON.parse(sessionStorage.getItem("remi-user-dt"))
            let local = { ...res.data, is_digital_Id_verified: user?.is_digital_Id_verified }
            sessionStorage.removeItem("remi-user-dt")
            sessionStorage.setItem("remi-user-dt", JSON.stringify(local))
          })
          setIsSubmitted(true)

        } else {
          toast.error(res.message)
        }
      })
    } else {
      close();
    }
  }

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  return (
    <>
      {loading ? <>
        <div className="loader-overly">
          <div className="loader" >
          </div>
        </div>
      </> : <></>}
      {
        !is_submitted ? (
          <>
            <Modal.Header>
              Update Account Usage
            </Modal.Header>
            <Modal.Body className='mb-5 mt-3'>
              <div>
                {
                  type === "payment_per_annum" ? (
                    <>
                      <p className="get-text">Projected frequency of payments per annum</p>

                      <select
                        value={value}
                        name="payment_per_annum"
                        onChange={(e) => handleChange(e)}
                        className={clsx(
                          'form-control form-select bg-transparent'
                        )}
                      >
                        <option value="Tier-1 Less than 5 times" key="Less than 5 times" disabled={data.value !== "Tier-1 Less than 5 times"}>Tier-1 Less than 5 times</option>
                        <option value="Tier-2 5-10 Times" key="5-10 times" disabled={data.value === "Tier-3 Greater than 10 Times"}>Tier-2 5-10 Times</option>
                        <option value="Tier-3 Greater than 10 Times" key="Greater than 10 times">Tier-3 Greater than 10 Times</option>
                      </select>
                    </>
                  ) : (
                    <>
                      <p className="get-text">Projected value of payments per annum</p>
                      <select
                        value={value}
                        name="value_per_annum"
                        onChange={(e) => handleChange(e)}
                        className={clsx(
                          'form-control form-select bg-transparent'
                        )}
                      >
                        <option value="Tier-1 Less than $30,000" key="Less than $30,000" disabled={data.value !== "Tier-1 Less than $30,000"}>Tier-1 Less than $30,000</option>
                        <option value="Tier-2 $30,000 - $100,000" key="$30,000-$100,000" disabled={data.value === "Tier-3 Greater than $100,000"}>Tier-2 $30,000 - $100,000</option>
                        <option value="Tier-3 Greater than $100,000" key="Greater than $100,000">Tier-3 Greater than $100,000</option>
                      </select>
                    </>
                  )
                }
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={() => handleCancel()} >
                Cancel
              </Button>
              <Button type="click" variant="primary" onClick={() => submit()}>
                Submit
              </Button>
            </Modal.Footer>
          </>
        ) : (
          <>
            <Modal.Header closeButton>
              Update Account Usage
            </Modal.Header>
            <Modal.Body className='my-4 text-center'>
              <h1 className='text-success text-bold display-3'><BsCheckCircleFill /></h1>
              <h5>Your request has been submitted</h5>
              <p className="my-3"><span className="text-danger text-bold">*</span>Please mail your documents at <a href="mailto:ankur@codenomad.net" target="_blank">ankur@codenomad.net</a> to update your account usage successfully. </p>
            </Modal.Body>
          </>
        )
      }
    </>
  )
}



export default Profile;