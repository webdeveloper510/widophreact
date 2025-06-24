import React from 'react'
import { useFormik } from 'formik';
import * as Yup from "yup";
import clsx from 'clsx';
import { useState } from 'react';
import { Modal, Table } from 'react-bootstrap';
import countryList from "../../utils/recipientCountries.json"
import { useEffect } from 'react';

import PhoneInput from "react-phone-input-2";
import { createRecipient, createTransaction, updateUserRecipient } from '../../utils/Api';
import Bank_list from '../../utils/Bank_list';
import Select, { components } from 'react-select';
import { toast } from 'react-toastify';

const BankDetails = ({ handleBankDetail, handleStep, step }) => {
  const [city_list, setCityList] = useState([])
  const [state_list, setStateList] = useState([])
  const [inConfirmation, setInConfirmation] = useState(false)

  const [data, setData] = useState({
    bank: null, other_name: "", acc_name: "", acc_no: "",
    f_name: "", l_name: "", m_name: "",
    email: "", mobile: "", flat: "",
    build_no: "", street: "", city: "",
    post_code: "", state: "", country: "", country_code: "AU"
  })

  const initialValues = {
    bank: null, other_name: "", acc_name: "", acc_no: "",
    f_name: "", l_name: "", m_name: "",
    email: "", mobile: "", flat: "",
    build_no: "", street: "", city: "",
    post_code: "", state: "", country: ""
  }

  const [show, setShow] = useState(false)


  useEffect(() => {
    if (sessionStorage.getItem("transfer_data")) {
      let tdata = JSON.parse(sessionStorage.getItem("transfer_data"))
      if (tdata?.recipient) {
        setData(tdata?.recipient)
        formik.setValues({ ...tdata?.recipient })
      } else if (tdata?.amount) {
        setData({ ...data, bank: tdata?.amount?.part_type, other_name: tdata?.amount?.payout_part })
        formik.setValues({ ...formik.values, bank: tdata?.amount?.part_type, other_name: tdata?.amount?.payout_part })
      }
    }

  }, [])

  useEffect(() => {
    const value = data.country !== "" ? data.country : countryList[0]?.name
    if (data.country == "") {
      setData({ ...data, country: countryList[0]?.name, country_code: countryList[0]?.iso2 })
      formik.setFieldValue("country", countryList[0]?.name)
    }
    countryList?.map((item) => {
      if (item?.name === value) {
        setStateList(item?.states);
        if (item.states.length > 0) {
          setData({ ...data, state: item?.states[0].name })
          formik.setFieldValue("state", item?.states[0].name)
        } else {
          setData({ ...data, state: "" })
          formik.setFieldValue("state", "")
        }
      }
    })
  }, [data.country])

  useEffect(() => {
    const value = data.state !== "" ? data.state : state_list[0]?.name
    state_list?.map((item) => {
      if (item?.name === value) {
        setCityList(item?.cities);
        if (item.cities.length > 0) {
          setData({ ...data, city: item?.cities[0].name })
          formik.setFieldValue("city", item?.cities[0].name)
        } else {
          setData({ ...data, city: "" })
          formik.setFieldValue("city", "")
        }
      }
    })
  }, [data.state])


  const bankSchema = Yup.object().shape({
    bank: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Email is required').trim().notOneOf([null]),
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
    acc_name: Yup.string().min(1).max(50).required().trim(),
    acc_no: Yup.string().min(5).max(18).required(),
    f_name: Yup.string().min(1).max(25).required().trim(),
    l_name: Yup.string().min(1).max(25).required().trim(),
    email: Yup.string().matches(/^[\w-+\.]+@([\w-]+\.)+[\w-]{2,5}$/, "Invalid email format").max(50).required(),
    mobile: Yup.string().min(11).max(18).required(),
    flat: Yup.string().min(1).max(30).notRequired(),
    build_no: Yup.string().min(1).max(30).required().trim(),
    street: Yup.string().min(1).max(30).required().trim(),
    city: Yup.string().min(1).max(35).required(),
    post_code: Yup.string().max(5).notRequired(),
    state: Yup.string().min(1).max(35).required(),
    country: Yup.string().min(2).max(30).required()
  })

  const formik = useFormik({
    initialValues,
    validationSchema: bankSchema,
    onSubmit: async (values) => {
      setData({ ...values, country_code: data.country_code })
      handleBankDetail(data)
      setInConfirmation(true)
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      })
    }
  })

  const handlePhone = (e, coun) => {
    formik.setFieldValue('mobile', e);
    formik.setFieldTouched('mobile', true);
    formik.setFieldValue('country', coun.name)
    setData({ ...data, country: coun.name, mobile: e })
  }

  const updateTransaction = (id) => {
    let storage = JSON.parse(sessionStorage.getItem('transfer_data'))
    let payload = {
      transaction_id: sessionStorage.getItem("transaction_id"),
      amount: {
        send_amount: storage?.amount?.send_amt,
        receive_amount: storage?.amount?.exchange_amt,
        send_currency: storage?.amount?.from_type,
        receive_currency: storage?.amount?.to_type,
        receive_method: "Bank transfer",
        payout_partner: data?.bank === "other" ? data.other_name : data.bank,
        reason: "none",
        exchange_rate: storage?.amount?.exchange_rate
      },
      recipient_id: id
    }
    createTransaction(payload).then(res => {
      if (res.code === "200") {
        sessionStorage.setItem("transaction_id", res.data.transaction_id)
        const local = JSON.parse(sessionStorage.getItem("transfer_data"))
        local.recipient = { ...data }
        local.amount = { ...local.amount, part_type: data.bank, payout_part: data.other_name }
        sessionStorage.removeItem("transfer_data")
        sessionStorage.setItem("transfer_data", JSON.stringify(local))
        if (sessionStorage.getItem("send-step")) {
          sessionStorage.removeItem("send-step")
        }
        sessionStorage.setItem("send-step", Number(step) + 1)
        handleStep(Number(step) + 1)
      }
    })

  }

  const handleReciept = (e) => {
    let storage = JSON.parse(sessionStorage.getItem('transfer_data'))
    let d = {
      bank_name: data.bank === "other" ? data.other_name : data.bank
      , account_name: data.acc_name, account_number: data.acc_no,
      first_name: data.f_name, last_name: data.l_name, middle_name: data.m_name,
      email: data.email, mobile: data.mobile, flat: data.flat,
      building: data.build_no, street: data.street, city: data.city,
      postcode: data.post_code, state: data.state, country: data.country, country_code: data.country_code
    }
    if (d.middle_name == "" || d.middle_name == undefined) {
      delete d["middle_name"]
    }
    if (d.flat == "" || d.flat == undefined) {
      delete d["flat"]
    }
    if (d.postcode === "" || d.postcode === undefined) {
      delete d['postcode'];
    }
    if (sessionStorage.getItem("rid")) {
      var id = sessionStorage.getItem("rid")
      updateUserRecipient(id, d).then(res => {
        if (res.code === "200") {
          updateTransaction(id)
        } else {
          toast.error(res.message, { autoClose: 2000, position: "bottom-right", hideProgressBar: true })
        }
      })
    } else {
      createRecipient(d).then(res => {
        if (res.code === "200") {
          sessionStorage.setItem("rid", res.data.id)
          updateTransaction(res.data.id)
        }
        else {
          toast.error(res.message, { autoClose: 2000, position: "bottom-right", hideProgressBar: true })
        }
      })
    }
  }

  const handlePrevious = () => {
    if (sessionStorage.getItem("send-step")) {
      sessionStorage.removeItem("send-step")
    }
    sessionStorage.setItem("send-step", Number(step) - 1)
    handleStep(Number(step) - 1)
  }

  const handleCancel = () => {
    sessionStorage.removeItem("transfer_data")
    sessionStorage.removeItem("send-step")
    window.location.reload(true)
  }

  const handleChange = (e) => {
    if (e.target.name === 'country') {
      countryList.map((item) => {

        if (item.name === e.target.value) {
          setData({ ...data, country_code: item.iso2 })
        }
      })
    }
    setData({ ...data, [e.target.name]: e.target.value })
    formik.setFieldValue(e.target.name, e.target.value)
    formik.setFieldTouched(e.target.name, true)
  }

  const handleKeyDown = (e, max) => {
    if (e.key === 'Backspace' || e.key === 'Enter' || e.key === 'Tab' || e.key === 'Shift' || e.key === 'ArrowLeft' || e.key === "ArrowRight" || e.key === "Escape" || e.key === "Delete" || e.key === " ") {
      setData({ ...data, [e.target.name]: e.target.value })
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
          setData({ ...data, [e.target.name]: e.target.value })
          formik.setFieldValue(`${[e.target.name]}`, e.target.value)
          formik.setFieldTouched(`${[e.target.name]}`, true)
        }
      }
    }
  }

  const handleEmail = (e, max) => {
    if (e.key === 'Backspace' || e.key === 'Enter' || e.key === 'Tab' || e.key === 'Shift' || e.key === 'ArrowLeft' || e.key === "ArrowRight" || e.key === "Escape" || e.key === "Delete") {
      setData({ ...data, [e.target.name]: e.target.value })
      formik.setFieldValue(`${[e.target.name]}`, e.target.value)
      formik.setFieldTouched(`${[e.target.name]}`, true)
    } else {
      const value = e.target.value.toString()
      if (value.length >= max) {
        e.stopPropagation()
        e.preventDefault()

      } else {
        setData({ ...data, [e.target.name]: e.target.value })
        formik.setFieldValue(`${[e.target.name]}`, e.target.value)
        formik.setFieldTouched(`${[e.target.name]}`, true)
      }
    }
  }

  function validateInput(event) {
    const regex = event.target.name === "bank" ? /^[A-Za-z\s]*$/ : /^[A-Za-z\s\W]*$/;
    let userInput = event.target.value;
    if (!regex.test(userInput)) {
      if (event.target.name === "bank") {
        const filteredInput = userInput.replace(/[^A-Za-z\s]/g, '');
        userInput = filteredInput
      } else {
        const filteredInput = userInput.replace(/[^A-Za-z\s\W]/g, '');
        userInput = filteredInput
      }
    }
    setData({ ...data, [event.target.name]: userInput })
    formik.setFieldValue(event.target.name, userInput)
    formik.setFieldTouched(event.target.name, true)
  }

  function validateNumber(event) {
    const regex = /^[0-9]*$/;
    let userInput = event.target.value;
    if (!regex.test(userInput)) {
      const filteredInput = userInput.replace(/[^0-9]/g, '');
      userInput = filteredInput
    }
    setData({ ...data, [event.target.name]: userInput })
    formik.setFieldValue(event.target.name, userInput)
    formik.setFieldTouched(event.target.name, true)
  }

  function validateAddress(event) {
    const regex = /^[0-9A-z#-/]*$/;
    let userInput = event.target.value;
    if (!regex.test(userInput)) {
      const filteredInput = userInput.replace(/[^0-9A-z#-/]/g, '');
      userInput = filteredInput
    }
    setData({ ...data, [event.target.name]: userInput })
    formik.setFieldValue(event.target.name, userInput)
    formik.setFieldTouched(event.target.name, true)
  }

  function validateEmail(event) {
    const regex = /^[A-Za-z0-9._%+-@]*$/;
    let userInput = event.target.value;
    if (!regex.test(userInput)) {
      const filteredInput = userInput.replace(/[^A-Za-z0-9._%+-@]/g, '');
      userInput = filteredInput;
    } else {
      userInput = userInput.replace(/^[\s]/g, '');
    }
    setData({ ...data, [event.target.name]: userInput });
    formik.setFieldValue(event.target.name, userInput);
    formik.setFieldTouched(event.target.name, true);
  }

  const handleBank = (val) => {
    formik.setFieldValue("bank", val?.value)
    formik.handleChange(val.value)
    setData({ ...data, bank: val?.value })
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

  return (
    <div>

      {
        inConfirmation ? (
          <div className='form_body py-5'>
            <div className="header my-3">
              <h1>Recipient details Summary</h1>
            </div>
            <Table className='recipint-details-popup py-5'>
              <thead>
                <tr>
                  <th colSpan={2} className="popup-heading">Bank Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Bank Name</th>
                  <td>{data.bank === "other" ? data.other_name : data?.bank}</td>
                </tr>
                <tr>
                  <th>Account Name</th>
                  <td>{data.acc_name}</td>
                </tr>
                <tr>
                  <th>Account number</th>
                  <td>{data.acc_no}</td>
                </tr>
              </tbody>
              <thead>
                <tr>
                  <th colSpan={2} className="popup-heading">Recipient Details</th>
                </tr>
              </thead>
              <tbody >
                <tr>
                  <th>First Name</th>
                  <td>{data.f_name}</td>
                </tr>
                <tr>
                  <th>Last Name</th>
                  <td>{data.l_name}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{data.email}</td>
                </tr>
                <tr>
                  <th>Mobile</th>
                  <td>{data.mobile}</td>
                </tr>
              </tbody>
            </Table>
            <div className="row mt-5">
              <div className="col-md-4 need_space">
                <button className="start-form-button" variant="secondary" onClick={() => setInConfirmation(false)}>
                  Go back to Edit
                </button>
              </div>
              <div className="col-md-8 full-col">
                <button className="form-button detail_buttoon" type="button" variant="primary" onClick={(e) => handleReciept(e)}>Continue</button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit}>

            <div className="form_body">
              <div className="header">
                <h1>Recipient Bank Details</h1>
              </div>
              <div className="col-md-12">
                <div className="input_field">
                  <p className="get-text">
                    Bank Name
                    <span style={{ color: 'red' }} >*</span>
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
                  <div className="row">
                    <div className="col-md-12">
                      <div className="input_field">
                        <p className="get-text">Other Bank Name<span style={{ color: 'red' }} >*</span></p>
                        <input
                          type="text"
                          name="other_name"
                          value={formik.values?.other_name}
                          onChange={validateInput}
                          maxLength={50}
                          className={clsx(
                            'form-control bg-transparent',
                            { 'is-invalid': formik.touched.other_name && formik.errors.other_name },
                            {
                              'is-valid': formik.touched.other_name && !formik.errors.other_name,
                            }
                          )}
                          onBlur={formik.handleBlur}
                        />
                      </div>
                    </div>
                  </div>
                ) : <></>
              }
              <div className="row">
                <div className="col-md-12">
                  <div className="input_field">
                    <p className="get-text">Account Name<span style={{ color: 'red' }} >*</span></p>
                    <input
                      type="text"
                      name="acc_name"
                      value={formik.values?.acc_name}
                      onChange={validateInput}
                      maxLength={50}
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': formik.touched.acc_name && formik.errors.acc_name },
                        {
                          'is-valid': formik.touched.acc_name && !formik.errors.acc_name,
                        }
                      )}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="input_field">
                    <p className="get-text">Account Number<span style={{ color: 'red' }} >*</span></p>
                    <input
                      type="text"
                      name="acc_no"
                      value={formik.values?.acc_no}
                      onChange={validateNumber}
                      maxLength={18}
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': formik.touched.acc_no && formik.errors.acc_no },
                        {
                          'is-valid': formik.touched.acc_no && !formik.errors.acc_no,
                        }
                      )}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                </div>
              </div>
              <div className="row each-row">
                <h5>Recipient Details</h5>
                <div className="col-md-4 need_space">
                  <div className="input_field">
                    <p className="get-text">First Name<span style={{ color: 'red' }} >*</span></p>
                    <input
                      type="text"
                      name="f_name"
                      value={formik.values?.f_name}
                      onChange={validateInput}
                      maxLength={25}
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': formik.touched.f_name && formik.errors.f_name },
                        {
                          'is-valid': formik.touched.f_name && !formik.errors.f_name,
                        }
                      )}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                </div>
                <div className="col-md-4 need_space">
                  <div className="input_field">
                    <p className="get-text">Middle Name</p>
                    <input
                      type="text"
                      name="m_name"
                      className='form-control'
                      value={formik.values?.m_name}
                      onChange={validateInput}
                      maxLength={25}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="input_field">
                    <p className="get-text">Last Name<span style={{ color: 'red' }} >*</span></p>
                    <input
                      type="text"
                      name="l_name"
                      value={formik.values?.l_name}
                      onChange={validateInput}
                      maxLength={25}
                      onBlur={formik.handleBlur}
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
                <div className="col-md-6 need_space">
                  <div className="input_field">
                    <p className="get-text">Email<span style={{ color: 'red' }} >*</span></p>
                    <input
                      type="email"
                      name="email"
                      value={formik.values?.email}
                      onChange={validateEmail}
                      maxLength={50}
                      onBlur={formik.handleBlur}
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': formik.touched.email && formik.errors.email },
                        {
                          'is-valid': formik.touched.email && !formik.errors.email,
                        }
                      )}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className='fv-plugins-message-container mt-1'>
                        <div className='fv-help-block'>
                          <span role='alert' className="text-danger" style={{ fontSize: "13px" }}>{formik.errors.email}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6 need_space">
                  <div className="input_field">
                    <p className="get-text">Mobile<span style={{ color: 'red' }} >*</span></p>
                    <PhoneInput
                      onlyCountries={["au", "gh", "ke", "ng", "nz", "ph", "th", "vn"]}
                      country={data.country_code ? data.country_code.toLowerCase() : "au"}
                      name="mobile"
                      value={formik.values.mobile}
                      inputStyle={{ border: "none", margin: "none" }}
                      inputClass="userPhone w-100"
                      defaultCountry={"au"}
                      onBlur={formik.handleBlur}
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
                <div className="col-md-4 need_space" id="country">
                  <div className="input_field">
                    <p className="get-text">Country<span style={{ color: 'red' }} >*</span></p>
                    <select
                      value={formik.values?.country}
                      name="country"
                      onChange={(e) => handleChange(e)}
                      className='form-control form-select bg-transparent'
                      onBlur={formik.handleBlur}
                    >
                      {
                        countryList && countryList.length > 0 ?
                          countryList?.map((opt) => {
                            return (
                              <option value={opt?.name} key={opt?.id} id={opt?.id}>{opt?.name}</option>
                            )
                          }) : ""
                      }

                    </select>
                  </div>
                </div>
                <div className="col-md-4 need_space" id="state">
                  <div className="input_field">
                    <p className="get-text">State<span style={{ color: 'red' }} >*</span></p>
                    {
                      state_list && state_list.length > 0 ?
                        (<select
                          value={formik.values?.state}
                          name="state"
                          onChange={(e) => handleChange(e)}
                          className='form-control form-select bg-transparent'
                          onBlur={formik.handleBlur}
                        >
                          {state_list?.map((opt) => {
                            return (
                              <option value={opt?.name} key={opt?.id} id={opt?.id}>{opt?.name}</option>
                            )
                          })
                          }
                        </select>) :
                        (<input
                          type="text"
                          name="state"
                          value={formik.values?.state}
                          onKeyDown={(e) => { handleKeyDown(e, 30) }}
                          {...formik.getFieldProps("state")}
                          onBlur={formik.handleBlur}
                          className={clsx(
                            'form-control bg-transparent',
                            { 'is-invalid': formik.touched.state && formik.errors.state },
                            {
                              'is-valid': formik.touched.state && !formik.errors.state,
                            }
                          )}
                        />)
                    }
                  </div>
                </div>
                <div className="col-md-4" id="city">
                  <div className="input_field">
                    <p className="get-text">City/Suburb<span style={{ color: 'red' }} >*</span></p>
                    {
                      city_list && city_list.length > 0 ? (
                        <select
                          value={formik.values?.city}
                          name="city"
                          onChange={(e) => handleChange(e)}
                          className='form-control form-select bg-transparent'
                          onBlur={formik.handleBlur}
                        >

                          {city_list?.map((opt) => {
                            return (
                              <option value={opt?.name} id={opt?.id} key={opt?.id}>{opt?.name}</option>
                            )
                          })
                          }
                        </select>
                      ) : (
                        <input
                          type="text"
                          name="city"
                          value={formik.values?.city}
                          onKeyDown={(e) => { handleKeyDown(e, 35) }}
                          {...formik.getFieldProps("city")}
                          onBlur={formik.handleBlur}
                          className={clsx(
                            'form-control bg-transparent',
                            { 'is-invalid': formik.touched.city && formik.errors.city },
                            {
                              'is-valid': formik.touched.city && !formik.errors.city,
                            }
                          )}
                        />
                      )
                    }
                  </div>

                </div>
              </div>
              <div className="row each-row remove_mb">
                <div className="col-md-4 need_space" id="street">
                  <div className="input_field">
                    <p className="get-text">Street Name<span style={{ color: 'red' }} >*</span></p>
                    <input
                      type="text"
                      name="street"
                      value={formik.values?.street}
                      {...formik.getFieldProps("street")}
                      maxLength={30}
                      onBlur={formik.handleBlur}
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': formik.touched.street && formik.errors.street },
                        {
                          'is-valid': formik.touched.street && !formik.errors.street,
                        }
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-4 need_space" id="post">
                  <div className="input_field">
                    <p className="get-text">
                      Zip/Postal Code
                    </p>
                    <input
                      type="text"
                      name="post_code"
                      value={formik.values?.post_code}
                      onChange={validateNumber}
                      maxLength={5}
                      onBlur={formik.handleBlur}
                      className={clsx(
                        'form-control bg-transparent'
                      )}
                    />

                  </div>
                </div>
                <div className="col-md-4" id="build">
                  <div className="input_field">
                    <p className="get-text">Building No.<span style={{ color: 'red' }} >*</span></p>
                    <input
                      type="text"
                      name="build_no"
                      value={formik.values?.build_no}
                      maxLength={30}
                      onBlur={formik.handleBlur}
                      onKeyDown={(e) => { handleEmail(e, 30) }}
                      {...formik.getFieldProps("build_no")}
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': formik.touched.build_no && formik.errors.build_no },
                        {
                          'is-valid': formik.touched.build_no && !formik.errors.build_no,
                        }
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="row each-row remove_mb">
                <div className="col-md-4 need_space" id='flat'>
                  <div className="input_field">
                    <p className="get-text">Flat/Unit No.</p>
                    <input
                      type="text"
                      name="flat"
                      value={formik.values?.flat}
                      onChange={validateAddress}
                      onBlur={formik.handleBlur}
                      maxLength={15}
                      className='form-control bg-transparent'
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 need_space">
                  <button type="button" className="start-form-button full-col" onClick={() => handleCancel()}>Cancel</button>
                </div>
                <div className="col-md-8 full-col">
                  <button type="submit" className="form-button">Continue</button>
                  <button type="button" className="form-button" onClick={() => { handlePrevious() }}>Previous</button>
                </div>
              </div>
            </div>
          </form >
        )
      }


      {/* <Modal show={show} onHide={() => setShow(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>


        </Modal.Body>
        <Modal.Footer className='full-col'>



        </Modal.Footer>
      </Modal> */}

    </div >
  )
}

export default BankDetails
