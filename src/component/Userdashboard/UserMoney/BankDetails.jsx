import React from 'react'
import { useFormik } from 'formik';
import * as Yup from "yup";
import clsx from 'clsx';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { BsChevronDoubleRight } from 'react-icons/bs';
import { BsFillPersonPlusFill } from 'react-icons/bs';
import norecipients from '../../../assets/img/userdashboard/hidden.avif';
import { useEffect } from 'react';
import axios from "axios"
import { toast } from 'react-toastify';
import PhoneInput from 'react-phone-input-2';
import { checkExistingAccount, createTransaction, getDiscountedPrice } from '../../../utils/Api';
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import TransactionConfirm from '../../modals/TransactionConfirm';
import Bank_list from '../../../utils/Bank_list';
import Select, { components } from "react-select"
import ReviewYourTransfer from '../../modals/ReviewYourTransfer';
import Autocomplete from "react-google-autocomplete";


const BankDetails = ({ handleStep, step }) => {
  const [isActive, setActive] = useState("false");
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [isAfrican, setIsAfrican] = useState(true)
  const [display_confirm, setDisplayConfirm] = useState({ toggle: false, data: null })
  const [countryCode, setCountryCode] = useState("AU");
  const [is_account_existing, setAccountExisting] = useState(false)

  const serverUrl = process.env.REACT_APP_API_URL

  const [data, setData] = useState({
    bank: null, other_name: "",
    acc_no: "",
    f_name: "", l_name: "", m_name: "",
    mobile: "+61", flat: "",
    building: "", street: "", city: "",
    postcode: "", state: "", country: "Australia", country_code: "AU"
  })

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
    bank: null, other_name: "",
    acc_no: "",
    f_name: "", l_name: "", m_name: "",
    mobile: "+61", flat: "",
    building: "", street: "", city: "",
    postcode: "", state: "", country: "Australia", country_code: "AU", address: ""
  }

  const [phone_code, setPhoneCode] = useState("")

  const handleToggle = () => {
    setActive(!isActive);
  };

  const bankSchema = Yup.object().shape({
    bank: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Bank name is required').trim().notOneOf([null]),
    other_name: Yup.string().min(3).max(50).test("value-test", (value, validationcontext) => {
      const {
        createError,
        parent: {
          bank,
        },
      } = validationcontext;
      if (bank === "other" && (value?.length < 3 || value === undefined || value === null || value === " ")) {
        return createError({ message: "Please enter bank name" })
      } else {
        return true
      }
    }).trim(),
    acc_no: Yup.string().min(5).max(18).required(),
    address: Yup.string().trim(),
    f_name: Yup.string().min(2).max(25).required().trim(),
    l_name: Yup.string().min(2).max(25).required().trim(),
    m_name: Yup.string().max(25).notRequired().trim(),
    mobile: Yup.string().min(11).max(18).required(),
    flat: Yup.string().min(1).max(30).notRequired(),
    building: Yup.string().min(1).max(30).required().trim(),
    street: Yup.string().min(1).max(100).required().trim(),
    city: Yup.string().min(1).max(35).required().trim(),
    postcode: Yup.string().max(7).notRequired(),
    state: Yup.string().min(2).max(35).required(),
    country: Yup.string().min(2).max(30).required()
  })

  const formik = useFormik({
    initialValues,
    validationSchema: bankSchema,
    onSubmit: async (values) => {
      let storage = JSON.parse(sessionStorage.getItem("transfer_data"))
      storage.amount.part_type = values?.bank;
      storage.amount.payout_part = values?.other_name
      sessionStorage.setItem("transfer_data", JSON.stringify(storage))
      setLoading(true)
      const d = {
        bank_name: values.bank === "other" ? values?.other_name : values.bank,
        account_number: values.acc_no,
        first_name: values.f_name,
        middle_name: values.m_name,
        last_name: values.l_name,
        mobile: values.mobile,
        flat: values.flat,
        building: values.building,
        street: values.street,
        postcode: values.postcode,
        city: values.city,
        state: values.state,
        address: values.address,
        // country_code: data.country_code,
        country: values.country
      }
      if (d.flat === "" || d.flat === undefined || d.flat === " ") {
        delete d['flat'];
      }
      if (d.postcode === "" || d.postcode === undefined || d.postcode === " ") {
        delete d['postcode'];
      }
      if (d.address === "" || d.address === undefined || d.address === " ") {
        delete d['address'];
      }
      if (phone_code !== "") {
        let mno;
        if (phone_code.toString().length > 2) mno = d.mobile.substring(3)
        else mno = d.mobile.substring(2)
        d.mobile = phone_code + parseInt(mno, 10)
      }
      d.country_code = countryCode

      axios.post(`${serverUrl}/payment/recipient-create/`, d, {
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
        },

      })
        .then(function (response) {
          if (response.data.code == "200") {
            setLoading(false)
            selectRecipient({ ...response.data.data })
          } else if (response.data.code == "400") {
            setLoading(false)
            toast.error(response.data.message, { autoClose: 2000, hideProgressBar: true })
          }
        })
        .catch(function (error, message) {
          setLoading(false);
        })

    }
  })

  useEffect(() => {
    let storage = JSON.parse(sessionStorage.getItem("transfer_data"))
    if (storage?.amount) {
      formik.setValues({ ...formik.values, bank: storage?.amount?.part_type, other_name: storage?.amount?.payout_part })
    }

  }, [])


  const handleChange = (e) => {
    if (e.target.name === 'country') {


      const previousSelected = countryList.filter((country) => {
        return country.code.toLowerCase() === countryCode.toLowerCase()
      })

      const selected = countryList.filter((country) => {
        return country.name === e.target.value
      })

      let mobileValue = "+" + selected[0].dialCode + formik.values.mobile.replace("+", "").substring(previousSelected[0].code.length)

      formik.setFieldValue('mobile', mobileValue);
      formik.setFieldTouched('mobile', true);
      formik.setFieldValue('country', selected[0].name)


      setCountryCode(selected[0].code.toLowerCase())
      setPhoneCode(selected[0].dialCode)
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

  const handlePhone = (e, coun) => {
    formik.setFieldValue('mobile', e);
    formik.setFieldTouched('mobile', true);
    formik.setFieldValue('country', coun.name)
    setPhoneCode(coun.dialCode)
    setCountryCode(coun.countryCode)
    // console.log(coun.dialCode)
    // setData({ ...data, country: coun.name, mobile: e })
  }

  const handleKeyDown = (e, max) => {
    if (e.key === 'Backspace' || e.key === 'Enter' || e.key === 'Tab' || e.key === 'Shift' || e.key === 'ArrowLeft' || e.key === "ArrowRight" || e.key === "Escape" || e.key === "Delete" || e.key === " ") {
      // setData({ ...data, [e.target.name]: e.target.value })
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
          // setData({ ...data, [e.target.name]: e.target.value })/
          formik.setFieldValue(`${[e.target.name]}`, e.target.value)
          formik.setFieldTouched(`${[e.target.name]}`, true)
        }
      }
    }
  }

  const handleEmail = (e, max) => {
    if (e.key === 'Backspace' || e.key === 'Enter' || e.key === 'Tab' || e.key === 'Shift' || e.key === 'ArrowLeft' || e.key === "ArrowRight" || e.key === "Escape" || e.key === "Delete") {
      // setData({ ...data, [e.target.name]: e.target.value })
      formik.setFieldValue(`${[e.target.name]}`, e.target.value)
      formik.setFieldTouched(`${[e.target.name]}`, true)
    } else {
      const value = e.target.value.toString()
      if (value.length >= max) {
        e.stopPropagation()
        e.preventDefault()
      } else {
        // setData({ ...data, [e.target.name]: e.target.value })
        formik.setFieldValue(`${[e.target.name]}`, e.target.value)
        formik.setFieldTouched(`${[e.target.name]}`, true)
      }
    }
  }

  const handlePostCode = (event, max) => {
    const pattern = /^[0-9]+$/;
    if (event.key === 'Backspace' || event.key === 'Enter' || event.key === 'Tab' || event.key === 'Shift' || event.key === 'ArrowLeft' || event.key === "ArrowRight") {
      // setData({ ...data, [event.target.name]: event.target.value })
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
          // setData({ ...data, [event.target.name]: event.target.value })
          formik.setFieldValue(event.target.name, event.target.value)
          formik.setFieldTouched(event.target.name, true)
        }
      }
    }
  }

  const handlePrevious = () => {
    sessionStorage.removeItem("send-step")
    sessionStorage.setItem("send-step", Number(step) - 1)
    handleStep(Number(step) - 1);
  }

  const handleClear = () => {
    sessionStorage.removeItem("transfer_data")
    sessionStorage.removeItem("send-step")
    window.location.reload()
  }

  const handleCancel = () => {
    formik.resetForm({
      values: { ...initialValues, bank: formik.values.bank }
    })
    setCountryCode("AU")
    setActive(!isActive)
  }

  const nextStep = () => {
    const value = display_confirm?.data?.recipient
    let storage = JSON.parse(sessionStorage.getItem('transfer_data'))
    let payload = {
      transaction_id: sessionStorage.getItem("transaction_id"),
      amount: {
        send_amount: storage?.amount?.send_amt,
        receive_amount: storage?.amount?.exchange_amt,
        send_currency: storage?.amount?.from_type,
        receive_currency: storage?.amount?.to_type,
        receive_method: "Bank transfer",
        reason: "none",
        payout_partner: storage?.amount?.part_type === "other" ? storage?.amount?.payout_part : storage?.amount?.part_type,
        exchange_rate: storage?.amount?.exchange_rate
      },
      recipient_id: value.id
    }
    createTransaction(payload).then(res => {
      if (res.code === "200") {
        sessionStorage.setItem("transaction_id", res.data.transaction_id)
        sessionStorage.setItem("rid", value.id)
        const local = JSON.parse(sessionStorage.getItem("transfer_data"))
        sessionStorage.removeItem("transfer_data")
        local.recipient = { ...value, bank_name: storage?.amount?.part_type === "other" ? storage?.amount?.payout_part : storage?.amount?.part_type }
        sessionStorage.setItem("transfer_data", JSON.stringify(local))

        if (sessionStorage.getItem("send-step")) {
          sessionStorage.removeItem("send-step")
        }
        sessionStorage.setItem("send-step", Number(step) + 1)
        handleStep(Number(step) + 1);
      }
    })
  }

  const selectRecipient = (value) => {
    let storage = JSON.parse(sessionStorage.getItem("transfer_data"))
    let transaction_id = sessionStorage.getItem("transaction_id")
    setDisplayConfirm({ toggle: true, data: { amount: storage?.amount, recipient: value } })
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    })
  }

  useEffect(() => {
    setLoading(true); // Set loading before sending API request	
    axios.post(`${serverUrl}/payment/recipient-list/`, {}, {
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
      }
    })
      .then((res) => {
        if (res.data.code == 200) {
          setList(res.data.data);
        }
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
      })
  }, [isActive])


  const handleBank = (val, event) => {
    formik.setFieldValue("bank", val?.value)
    formik.handleChange(val.value)
    // setData({ ...data, bank: val?.value })
  }

  const customStyles = {
    control: (base) => ({
      ...base,
      borderColor: formik.errors.bank && formik.touched.bank ? 'red' : base.borderColor,
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
    if (e.target.value !== "") {
      checkExistingAccount({ account_number: e.target.value }).then(res => {
        if (res.code === "400") {
          setAccountExisting(true)
        } else {
          setAccountExisting(false)
        }
      })
      formik.handleBlur(e)
    }
  }


  return (
    <section>
      {
        display_confirm.toggle === false ? (
          <>
            <div className={isActive ? "col-md-12 add-recipent-section" : "col-md-12 remove-add-recipent-section"}>

              {loading ? <>
                <div className="loader-overly">
                  <div className="loader" >
                  </div>
                </div></> :
                <>
                  <div className="form-head d-flex mb-4">
                    <h2 className="text-black font-w600 mb-0 align-self-center"><b>Select a recipient to send money</b>
                    </h2>
                    <button type="button" className="form-button ms-auto m-0" onClick={() => handleToggle()} style={{ float: "right" }}><BsFillPersonPlusFill /> Add Recipient
                    </button>
                  </div>
                  <div className="card">
                    <div className="card-body">
                      {list?.length != 0 ? (
                        <div>
                          {
                            list?.map((item, index) => {
                              return (
                                <ul key={item.id}>
                                  <a onClick={() => { selectRecipient(item) }}>
                                    <li><a>{item?.first_name} {item?.last_name}<BsChevronDoubleRight /></a></li>
                                  </a>
                                </ul>
                              )
                            })}
                        </div>
                      ) : (
                        <>
                          <h4 className='text-center py-5'>No Recipients Found</h4>
                        </>
                      )
                      }
                      <div className="add- row">
                        <div className='col-md-4'>
                          <button type="button" className="start-form-button full-col" onClick={() => { handleClear() }} style={{ "float": "left" }}>Cancel</button>
                        </div>
                        <div className='col-md-8'>
                          <button type="button" className="form-button col-md-12 full-col" onClick={() => { handlePrevious() }} style={{ "float": "right" }}>Previous</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              }
            </div>
            <div className={isActive ? "removerecepient" : "showrecepient"} >
              <div className="form-head mb-4">
                <h2 className="text-black font-w600 mb-0"><b>Recipient Bank Details</b>
                </h2>
              </div>
              <form noValidate onSubmit={formik.handleSubmit}>
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
                            value={formik.values.bank !== null ? { label: formik.values.bank, value: formik.values.bank } : ""}
                            name='bank'
                            styles={customStyles}
                            components={{ Placeholder }}
                            placeholder=""
                          />
                        </div>
                      </div>
                      {
                        formik.values.bank === "other" ? (
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
                          <p className="get-text">Account Number<span style={{ color: 'red' }} >*</span></p>
                          <input
                            type="text"
                            name="acc_no"
                            value={formik.values?.acc_no}
                            onKeyDown={(e) => { handlePostCode(e, 17) }}
                            onChange={formik.handleChange}
                            onBlur={(e) => validateAccount(e)}
                            className={clsx(
                              'form-control bg-transparent',
                              { 'is-invalid': (formik.touched.acc_no && formik.errors.acc_no) || is_account_existing },
                              {
                                'is-valid': formik.touched.acc_no && !formik.errors.acc_no,
                              }
                            )}
                          />
                          {
                            is_account_existing && (
                              <p className="text-danger fs-6 mt-1 ms-2">Account number already exists</p>
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
                            name="f_name"
                            value={formik.values.f_name}
                            onKeyDown={(e) => { handleKeyDown(e, 25) }}
                            {...formik.getFieldProps("f_name")}
                            className={clsx(
                              'form-control bg-transparent',
                              { 'is-invalid': formik.touched.f_name && formik.errors.f_name },
                              {
                                'is-valid': formik.touched.f_name && !formik.errors.f_name,
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
                            name="m_name"
                            className={clsx(
                              'form-control bg-transparent',
                              { 'is-invalid': formik.touched.m_name && formik.errors.m_name && formik.values.m_name !== "" },
                              {
                                'is-valid': formik.touched.m_name && !formik.errors.m_name && formik.values.m_name !== "",
                              }
                            )}
                            value={formik.values.m_name}
                            onKeyDown={(e) => { handleKeyDown(e, 25) }}
                            {...formik.getFieldProps("m_name")}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="input_field">
                          <p className="get-text">Last Name<span style={{ color: 'red' }} >*</span></p>
                          <input
                            type="text"
                            name="l_name"
                            value={formik.values.l_name}
                            onKeyDown={(e) => { handleKeyDown(e, 25) }}

                            {...formik.getFieldProps("l_name")}

                            className={clsx(
                              'form-control bg-transparent',
                              { 'is-invalid': formik.touched.l_name && formik.errors.l_name },
                              {
                                'is-valid': formik.touched.l_name && !formik.errors.l_name,
                              }
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row each-row remove_mb">
                      <div className="col-md-4">
                        <div className="input_field">
                          <p className="get-text">Mobile<span style={{ color: 'red' }} >*</span></p>
                          <PhoneInput
                            onlyCountries={["au", "gh", "ke", "ng", "nz", "ph", "th", "vn"]}
                            country={formik.values.country_code?.toLowerCase()}
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
                              { 'is-invalid': formik.touched.postcode && formik.errors.postcode },
                              {
                                'is-valid': formik.touched.postcode && !formik.errors.postcode,
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
                        <button type="button" className="start-form-button full-col" onClick={() => handleCancel()}>Back</button>
                      </div>
                      <div className="col-md-8 full-col">
                        <button type="submit" className="form-button" style={is_account_existing ? { cursor: "not-allowed" } : {}} disabled={is_account_existing}>Save & Continue  {loading ? <>
                          <div className="loader-overly">
                            <div className="loader" >
                            </div>
                          </div></> : ""}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </>
        ) : (
          <ReviewYourTransfer data={display_confirm} isConfirmation={false} handleCancel={() => { setDisplayConfirm({ toggle: false, data: null }) }} handleContinue={() => nextStep()} />
        )
      }

    </section>
  )
}

export default BankDetails