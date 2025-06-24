
import React, { useState, useEffect, useRef, useMemo } from "react";
import Form from 'react-bootstrap/Form';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { useFormik } from "formik";
import * as Yup from "yup"
import clsx from "clsx";
import { checkExistingAccount, createRecipient, getUserRecipient, updateUserRecipient } from "../../utils/Api";
import Bank_list from "../../utils/Bank_list";
import Select, { components } from "react-select";
import Autocomplete from "react-google-autocomplete";


const Addnewrecipient = () => {
  const navigate = useNavigate()
  const [isAfrican, setIsAfrican] = useState(true)
  const state = useLocation()?.state;
  const id = state?.id || false;
  const [countryCode, setCountryCode] = useState("AU")
  const [is_account_existing, setAccountExisting] = useState(false)
  const [initial_account, setInitialAccount] = useState("")

  const countryList = [
    { name: "Australia", code: "AU", dialCode: "61" },
    { name: "Ghana", code: "GH", dialCode: "233" },
    { name: "Kenya", code: "KE", dialCode: "254" },
    { name: "New Zealand", code: "NZ", dialCode: "64" },
    { name: "Nigeria", code: "NG", dialCode: "234" },
    { name: "Philippines", code: "PH", dialCode: "63" },
    { name: "Thailand", code: "TH", dialCode: "66" },
    { name: "Vietnam", code: "VN", dialCode: "84" },
  ]


  const initialValues = {
    bank_name: null, other_name: "",
    account_number: "",
    first_name: "", last_name: "", middle_name: "",
    mobile: "", flat: "",
    building: "", street: "", city: "",
    postcode: "", state: "", country: "Australia", country_code: "AU", address: "",
  }

  const [phone_code, setPhone_code] = useState("")

  const recipientSchema = Yup.object().shape({
    bank_name: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Bank name is required').trim().notOneOf([null]),
    other_name: Yup.string().min(3).max(50).test("value-test", (value, validationcontext) => {
      const {
        createError,
        parent: {
          bank_name,
        },
      } = validationcontext;
      if (bank_name === "other" && (value?.length < 3 || value === undefined || value === null || value === " ")) {
        return createError({ message: "Please enter bank name" })
      } else {
        return true
      }
    }).trim(),
    account_number: Yup.string().min(5).max(18).required(),
    address: Yup.string().trim(),
    first_name: Yup.string().min(1).max(25).required().trim(),
    last_name: Yup.string().min(1).max(25).required().trim(),
    middle_name: Yup.string().max(25).notRequired().trim(),
    mobile: Yup.string().min(11).max(18).required(),
    flat: Yup.string().min(1).max(30).notRequired(),
    building: Yup.string().min(1).max(30).required().trim(),
    street: Yup.string().min(1).max(100).required().trim(),
    city: Yup.string().min(1).max(35).required().trim(),
    postcode: Yup.string().max(7),
    state: Yup.string().min(1).max(35).required().trim(),
    country: Yup.string().min(2).max(30).required(),
    country_code: Yup.string(),
  })

  const [loading, setLoading] = React.useState(false);

  const handleCancel = () => {
    navigate("/user-recipients")
  }

  const formik = useFormik({
    initialValues,
    validationSchema: recipientSchema,
    onSubmit: async (values) => {
      setLoading(true)
      let d = values
      if (values.bank_name === "other") {
        d.bank_name = values.other_name
      }
      delete d["other_name"]
      if (d.flat == "" || d.flat == undefined || d.flat === " ") {
        delete d["flat"]
      }
      if (d.postcode === "" || d.postcode === undefined || d.postcode === " ") {
        delete d['postcode'];
      }
      if (d.middle_name === "" || d.middle_name === undefined || d.middle_name === " ") {
        delete d['middle_name'];
      }
      if (d.email === "" || d.email === undefined || d.email === " ") {
        delete d['email'];
      }
      if (d.address === "" || d.address === undefined || d.address === " ") {
        delete d['address'];
      }
      if (phone_code !== "") {
        let mno;
        if (phone_code.toString().length > 2) mno = d.mobile.substring(3);
        else mno = d.mobile.substring(2);
        const mobileNumber = parseInt(mno, 10); //(Remove Zeros from beginning)
        d.mobile = phone_code + mobileNumber
      }
      d.country_code = countryCode

      if (id) {
        updateUserRecipient(id, d).then((response) => {
          if (response.code == "200") {
            toast.success("Successfully updated", { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
            navigate("/user-recipients")
          } else if (response.code === "400") {
            toast.error(response.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
          }
          setLoading(false)
        }).catch((error) => {
          setLoading(false)
          if (error.response.data.code == "400") {
            toast.error(error.response.data.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
          }
        })
      } else {
        createRecipient({ ...d }).then((res) => {
          if (res.code === "200") {
            toast.success("Successfuly added new recipient", { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
            navigate("/user-recipients")
          } else if (res.code === "400") {
            toast.error(res.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
          }
          setLoading(false)
        }).catch((error) => {
          if (error.response.data.code == "400") {
            toast.error(error.response.data.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
          }
          setLoading(false)
        })
      }
    }
  })

  useEffect(() => {
    if (id) {
      getUserRecipient(id).then((res) => {
        if (res.code == "200") {
          let values = res.data
          let found = false
          for (let i = 0; i < Bank_list.length; i++) {
            if (Bank_list[i].label === values?.bank_name && Bank_list[i].value === values?.bank_name) {
              found = true
              break;
            }
          }
          if (found !== true) {
            values.other_name = values.bank_name
            values.bank_name = "other"
          }

          setInitialAccount(values.account_number)
          recipientSchema._nodes.map(field => formik.setFieldValue(field, values[field]))
          setCountryCode(values.country_code)
        }
        setLoading(false)
      }).catch((error) => {
        setLoading(false)
      })
    }
  }, [id])

  const handlePhone = (e, coun) => {
    let mobileWithoutDialCode = e.substring(coun.dialCode.length).replace(/[^0-9]/, "")
    formik.setFieldValue('mobile', coun.dialCode + mobileWithoutDialCode);
    formik.setFieldTouched('mobile', true);
    formik.setFieldValue('country', coun.name)
    setPhone_code(coun.dialCode)
    if (countryCode.toLowerCase() != coun.countryCode.toLowerCase()) {
      formik.setFieldValue("street", "")
      formik.setFieldValue("state", "")
      formik.setFieldValue("city", "")
      formik.setFieldValue("postcode", "")
      formik.setFieldValue("building", "")
      formik.setFieldValue("flat", "")
      formik.setFieldValue("address", "")
      setCountryCode(coun.countryCode.toLowerCase())
    }
  }

  const handleChange = (e) => {
    if (e.target.name === 'country') {


      const previousSelected = countryList.filter((country) => {
        return country.code.toLowerCase() === countryCode.toLowerCase()
      })

      const selected = countryList.filter((country) => {
        return country.name === e.target.value
      })

      let mobileValue = selected[0].dialCode + formik.values.mobile.replace("+", "").substring(previousSelected[0].code.length)

      formik.setFieldValue('mobile', mobileValue);
      formik.setFieldTouched('mobile', true);
      formik.setFieldValue('country', selected[0].name)


      setCountryCode(selected[0].code.toLowerCase())
      setPhone_code(selected[0].dialCode)

      formik.setFieldValue("street", "")
      formik.setFieldValue("state", "")
      formik.setFieldValue("city", "")
      formik.setFieldValue("postcode", "")
      formik.setFieldValue("building", "")
      formik.setFieldValue("flat", "")
      formik.setFieldValue("address", "")


    } else {
      formik.setFieldValue(`${e.target.name}`, e.target.value)
      formik.setFieldTouched(`${e.target.name}`, true)
    }
  }

  const handleKeyDown = (e, max) => {
    if (e.key === 'Backspace' || e.key === 'Enter' || e.key === 'Tab' || e.key === 'Shift' || e.key === 'ArrowLeft' || e.key === "ArrowRight" || e.key === "Escape" || e.key === "Delete" || e.key === " ") {
      formik.setFieldValue(`${[e.target.name]}`, e.target.value)
      formik.setFieldTouched(`${[e.target.name]}`, true)
    } else {
      const value = e.target.value.toString()

      if (value.length >= max) {

        e.stopPropagation()
        e.preventDefault()

      } else {
        const pattern = /^[A-Za-z!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/;
        if (!pattern.test(e.key)) {
          e.preventDefault();
          e.stopPropagation()
        } else {
          formik.setFieldValue(`${[e.target.name]}`, e.target.value)
          formik.setFieldTouched(`${[e.target.name]}`, true)
        }
      }
    }
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

  const handlePostCode = (event, max) => {
    const pattern = /^[0-9.]+$/;
    if (event.key === 'Backspace' || event.key === 'Enter' || event.key === 'Tab' || event.key === 'Shift' || event.key === 'ArrowLeft' || event.key === "ArrowRight") {
      formik.setFieldValue(event.target.name, event.target.value)
      formik.setFieldTouched(event.target.name, true)
    } else {

      let value = event.target.value.toString()
      if (value.length > max) {
        event.stopPropagation()
        event.preventDefault()
      } else {
        if (!pattern.test(event.key)) {
          event.preventDefault();
          event.stopPropagation()
        } else {
          formik.setFieldValue(event.target.name, event.target.value)
          formik.setFieldTouched(event.target.name, true)
        }
      }
    }
  }

  const handleBank = (val, event) => {
    formik.setFieldValue("bank_name", val?.value)
    formik.handleChange(val.value)
  }

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: formik.errors.bank_name && formik.touched.bank_name ? 'red' : base.borderColor,
    }),
  };

  const Placeholder = (props) => {
    return <components.Placeholder {...props} />;
  };

  const getSelectedStreet = async (place) => {
    let country = "", state = "", city = "", postcode = "", street = "", building = "";
    await place?.address_components?.forEach((component) => {
      if (component?.types?.includes("street_number")) {
        // street = component?.long_name + " " + street;
      } else if (component?.types?.includes('postal_code')) {
        postcode = component?.long_name;
      } else if (component?.types?.includes('route') || component.types.includes('street_name')) {
        street = street + component?.long_name;
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
    formik.setFieldValue("postcode", postcode)
    formik.setFieldValue("city", city)
    formik.setFieldValue("state", state)
    formik.setFieldValue("street", street.trim())
    formik.setFieldValue("building", building)
    formik.setFieldValue("address", place?.formatted_address)
  }

  const validateAccount = (e) => {
    if (e.target.value !== "" && initial_account !== e.target.value) {
      checkExistingAccount({ account_number: e.target.value }).then(res => {
        if (res.code === "400") {
          setAccountExisting(true)
        } else {
          setAccountExisting(false)
        }
      })
    }
    formik.handleBlur(e)
  }

  return (
    <section className="showrecepient">
      <div className="form-head mb-4">
        <h2 className="text-black font-w600 mb-0"><b>{id ? "Update" : "Add"} Recipient</b>
          <NavLink to="/user-recipients">
            <button className="start-form-button back-btn" >
              <MdOutlineKeyboardBackspace />
              Back
            </button>
          </NavLink>
        </h2>
      </div>
      <form noValidate className="single-recipient">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <h5>Bank Information</h5>
              <div className="col-md-4">
                <div className="input_field">
                  <p className="get-text">
                    Bank Name<span className='text-danger'>*</span>
                  </p>
                  <Select
                    options={Bank_list}
                    onChange={handleBank}
                    value={formik.values.bank_name !== null ? { label: formik.values.bank_name, value: formik.values.bank_name } : ""}
                    name='bank_name'
                    styles={customStyles}
                    components={{ Placeholder }}
                    placeholder=""
                  />
                </div>
              </div>
              {
                formik.values.bank_name === "other" ? (
                  <div className="col-md-4">
                    <div className="input_field">
                      <p className="get-text">Other Bank Name<span style={{ color: 'red' }} >*</span></p>
                      <input
                        type="text"
                        name="other_name"
                        value={formik.values?.other_name}
                        onKeyDown={(e) => { handleKeyDown(e, 50) }}
                        {...formik.getFieldProps("other_name")}
                        className={clsx(
                          'form-control bg-transparent',
                          { 'is-invalid': formik.touched.other_name && formik.errors.other_name },
                          {
                            'is-valid': formik.touched.other_name && !formik.errors.other_name,
                          }
                        )}
                      />
                    </div>
                  </div>
                ) : <></>
              }
              <div className="col-md-4">
                <div className="input_field">
                  <p className="get-text">Account number<span style={{ color: 'red' }} >*</span></p>
                  <input
                    type="text"
                    name="account_number"
                    value={formik.values?.account_number}
                    onKeyDown={(e) => { handlePostCode(e, 17) }}
                    onChange={formik.handleChange}
                    onBlur={(e) => validateAccount(e)}
                    className={clsx(
                      'form-control bg-transparent',
                      { 'is-invalid': (formik.touched.account_number && formik.errors.account_number) || is_account_existing },
                      {
                        'is-valid': formik.touched.account_number && !formik.errors.account_number,
                      }
                    )}
                  />
                  {
                    is_account_existing && (
                      <p className="text-danger fs-6 mt-1 ms-2">Recipient with this account number already exists!</p>
                    )
                  }
                </div>
              </div>
            </div>
            <div className="row each-row">
              <h5>Recipient Details</h5>
              <div className="col-md-4">
                <div className="input_field">
                  <p className="get-text">First Name<span style={{ color: 'red' }} >*</span></p>
                  <input
                    type="text"
                    name="first_name"
                    value={formik.values.first_name}
                    onKeyDown={(e) => { handleKeyDown(e, 25) }}
                    {...formik.getFieldProps("first_name")}
                    className={clsx(
                      'form-control bg-transparent',
                      { 'is-invalid': formik.touched.first_name && formik.errors.first_name },
                      {
                        'is-valid': formik.touched.first_name && !formik.errors.first_name,
                      }
                    )}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="input_field">
                  <p className="get-text">Middle Name</p>
                  <input
                    type="text"
                    name="middle_name"
                    value={formik.values.middle_name}
                    onKeyDown={(e) => { handleKeyDown(e, 25) }}
                    {...formik.getFieldProps("middle_name")}
                    className={clsx(
                      'form-control bg-transparent',
                      { 'is-invalid': formik.touched.middle_name && formik.errors.middle_name && formik.values.middle_name !== "" },
                      {
                        'is-valid': formik.touched.middle_name && !formik.errors.middle_name && formik.values.middle_name !== "",
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
                    name="last_name"
                    value={formik.values.last_name}
                    onKeyDown={(e) => { handleKeyDown(e, 25) }}
                    {...formik.getFieldProps("last_name")}
                    className={clsx(
                      'form-control bg-transparent',
                      { 'is-invalid': formik.touched.last_name && formik.errors.last_name },
                      {
                        'is-valid': formik.touched.last_name && !formik.errors.last_name,
                      }
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="row each-row">
              <div className="col-md-4">
                <div className="input_field">
                  <p className="get-text">Mobile<span style={{ color: 'red' }} >*</span></p>
                  <PhoneInput
                    onlyCountries={["au", "gh", "ke", "ng", "nz", "ph", "th", "vn"]}
                    country={"au"}
                    name="mobile"
                    value={formik.values.mobile}
                    inputStyle={{ border: "none", margin: "none" }}
                    inputClass="userPhone w-100"
                    defaultCountry={"au"}
                    countryCodeEditable={false}
                    onChange={(val, coun) => { handlePhone(val, coun) }}
                    className={clsx(
                      'form-control form-control-sm bg-transparent py-0',
                      { 'is-invalid': formik.touched.mobile && formik.errors.mobile },
                      {
                        'is-valid': formik.touched.mobile && !formik.errors.mobile,
                      }
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="row each-row">
              <h5>Address</h5>
              <div className="col-md-4 mb-3" id="country">
                <Form.Group className="form_label" >
                  <p className="get-text">Country<span style={{ color: 'red' }} >*</span></p>
                  <select
                    value={formik.values.country}
                    name="country"
                    onChange={(e) => handleChange(e)}
                    className='form-control form-select bg-transparent'
                  >
                    {
                      countryList.map((country) => {
                        return (
                          <option key={country.code} value={country.name}>{country.name}</option>
                        )
                      })
                    }
                  </select>
                </Form.Group>
              </div>
              <div className="col-md-12 mb-3" id="Address">
                <Form.Group className="form_label" controlId="Address">
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
                      componentRestrictions: { country: countryCode?.toLowerCase() },
                    }}
                    onChange={formik.handleChange}
                    value={formik.values.address}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row each-row">
              <div className="col-md-4 mb-3" id="flat">
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
                      { 'is-invalid': formik.touched.flat && formik.errors.flat && formik.values.flat !== "" },
                      {
                        'is-valid': formik.touched.flat && !formik.errors.flat && formik.values.flat !== "",
                      }
                    )}
                  />
                </Form.Group>
              </div>
              <div className="col-md-4 mb-3" id="build">
                <Form.Group className="form_label" controlId="build">
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
                  />
                </Form.Group>
              </div>
              <div className="col-md-4 mb-3" id="street">
                <Form.Group className="form_label" controlId="street">
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
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row each-row">

              <div className="col-md-4 mb-3" id="city">
                <Form.Group className="form_label" >
                  <p className="get-text">City/Suburb<span style={{ color: 'red' }} >*</span></p>
                  <input
                    type="text"
                    name="city"
                    value={formik.values.city}
                    onKeyDown={(e) => { handleKeyDown(e, 35) }}
                    {...formik.getFieldProps("city")}
                    className={clsx(
                      'form-control bg-transparent',
                      { 'is-invalid': formik.touched.city && formik.errors.city },
                      {
                        'is-valid': formik.touched.city && !formik.errors.city,
                      }
                    )}
                  />
                </Form.Group>
              </div>
              <div className="col-md-4 mb-3" id="zip">
                <Form.Group className="form_label" >
                  <p className="get-text">
                    Zip/Postal Code
                    {
                      isAfrican === true ? (
                        <></>
                      ) : (
                        <span style={{ color: 'red' }} >*</span>
                      )
                    }
                  </p>
                  <input
                    type="text"
                    name="postcode"
                    value={formik.values.postcode}
                    onKeyDown={(e) => handlePostCode(e, 6)}
                    {...formik.getFieldProps("postcode")}
                    className={clsx(
                      'form-control bg-transparent',
                      { 'is-invalid': formik.touched.postcode && formik.errors.postcode && (formik.values.postcode !== "" || undefined || null) },
                      {
                        'is-valid': formik.touched.postcode && !formik.errors.postcode && (formik.values.postcode !== "" || undefined || null),
                      }
                    )}
                  />

                </Form.Group>
              </div>
              <div className="col-md-4 mb-3" id="state">
                <Form.Group className="form_label" >
                  <p className="get-text">State<span style={{ color: 'red' }} >*</span></p>
                  <input
                    type="text"
                    name="state"
                    value={formik.values.state}
                    onKeyDown={(e) => { handleKeyDown(e, 30) }}
                    {...formik.getFieldProps("state")}
                    className={clsx(
                      'form-control bg-transparent',
                      { 'is-invalid': formik.touched.state && formik.errors.state },
                      {
                        'is-valid': formik.touched.state && !formik.errors.state,
                      }
                    )}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <button
                  type="button"
                  className="start-form-button full-col"
                  onClick={() => handleCancel()}
                >
                  Cancel
                </button>
              </div>
              <div className="col-md-8 full-col">
                <button
                  type="button"
                  className="form-button"
                  onClick={() => { formik.handleSubmit() }}
                  style={is_account_existing ? { cursor: "not-allowed" } : {}}
                  disabled={is_account_existing}
                >
                  {id ? "Update" : "Create"} Recipient
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
    </section>
  )
}

export default Addnewrecipient;