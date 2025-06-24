import React, { useMemo } from 'react'
import { useFormik } from 'formik'
import clsx from 'clsx'
import * as Yup from "yup";
import { useState } from 'react';
import birthCountryList from 'react-select-country-list';
import { useEffect } from 'react';
import countryList from '../../utils/AuNz.json';
import axios from 'axios';
import global from '../../utils/global';
import { toast } from 'react-toastify';
import { createTransaction, updateProfile } from '../../utils/Api';
import { Modal } from 'react-bootstrap';
import { createVeriffFrame, MESSAGES } from '@veriff/incontext-sdk';
import { getVeriffStatus } from '../../utils/Api';
import { Veriff } from '@veriff/js-sdk';

const SenderDetails = ({ handleStep, step }) => {

  const userd = JSON.parse(sessionStorage.getItem("remi-user-dt"))
  const [display, setDisplay] = useState("none")
  const [city_list, setCityList] = useState([])
  const [state_list, setStateList] = useState([])
  const [loader, setLoader] = useState(false)
  const [postal_list, setPostalList] = useState([])
  const [isVerified, setIsVerified] = useState(userd?.is_digital_Id_verified || "false")
  const [start_verify, setStartVerify] = useState(false)
  const { is_digital_Id_verified } = JSON.parse(sessionStorage.getItem("remi-user-dt"))
  const countryOptions = useMemo(() => birthCountryList().getData(), [])

  const serverUrl = process.env.REACT_APP_API_URL
  const div_url = process.env.REACT_APP_DIV_URL
  const div_id = process.env.REACT_APP_DIV_ID

  let localdata = JSON.parse(sessionStorage.getItem("transfer_data"))

  const [data, setData] = useState(localdata?.sender ? localdata?.sender : {
    f_name: "", m_name: "", l_name: "",
    occupation: "", country_of_birth: "",
    dob: "", flat: "", build_no: "",
    street: "", city: "none", country: "none", occupation: "",
    post_code: "", state: "none", email: userd.email, mobile: userd.mobile,
    customer_id: userd.customer_id, country_code: "AU", payment_per_annum: "Tier-1 Less than 5 times", value_per_annum: "Tier-1 Less than $30,000"
  })

  const initialValues = localdata?.sender ? localdata?.sender : {
    f_name: "", m_name: "", l_name: "",
    occupation: "", country_of_birth: "",
    dob: "", flat: "", build_no: "",
    street: "", city: "none", country: "none", occupation: "",
    post_code: "", state: "none", email: userd.email, mobile: userd.mobile,
    customer_id: userd.customer_id, payment_per_annum: "Tier-1 Less than 5 times", value_per_annum: "Tier-1 Less than $30,000"
  }

  const senderSchema = Yup.object().shape({
    f_name: Yup.string().min(1).max(25).required().trim(),
    l_name: Yup.string().min(1).max(25).required().trim(),
    flat: Yup.string().min(1).max(30).notRequired(),
    build_no: Yup.string().min(1).max(30).required().trim(),
    street: Yup.string().min(1).max(30).required().trim(),
    city: Yup.string().required().notOneOf(["none"]),
    post_code: Yup.string().length(4).required(),
    state: Yup.string().required().notOneOf(["none"]),
    country: Yup.string().min(2).max(30).required().notOneOf(["none"]),
    dob: Yup.date().min(new Date(Date.now() - 3721248000000)).max(new Date(Date.now() - 567648000000), "You must be at least 18 years").required(),
    occupation: Yup.string().min(1).max(50).required().trim(),
    country_of_birth: Yup.string().required().notOneOf(["none"]),
    payment_per_annum: Yup.string().required().notOneOf(["none"]),
    value_per_annum: Yup.string().required().notOneOf(["none"]),
  })

  const updateTransaction = (data) => {
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
      recipient_id: sessionStorage.getItem("rid"),
      sender: {
        First_name: data?.First_name,
        Last_name: data?.Last_name,
        Date_of_birth: data?.Date_of_birth,
        Gender: data?.Gender
      },
      sender_address: {
        flat: data?.flat,
        building: data?.building,
        street: data?.street,
        postcode: data?.postcode,
        city: data?.city,
        state: data?.state,
        country: data?.country,
        country_code: data?.country_code
      },
    }
    createTransaction(payload).then(res => {
      setLoader(false)
    })
  }

  const formik = useFormik({
    initialValues,
    validationSchema: senderSchema,
    onSubmit: async (values) => {
      const local = JSON.parse(sessionStorage.getItem("transfer_data"))
      const user = JSON.parse(sessionStorage.getItem("remi-user-dt"))
      local.sender = { ...values, email: user.email, customer_id: user.customer_id, mobile: user.mobile, country_code: data.country_code }
      sessionStorage.removeItem("transfer_data")
      sessionStorage.setItem("transfer_data", JSON.stringify(local))
      let d = {
        First_name: formik.values.f_name, Middle_name: formik.values.m_name, Last_name: formik.values.l_name,
        Gender: "Male", Country_of_birth: values.country_of_birth,
        Date_of_birth: values.dob, flat: values.flat, building: values.build_no,
        street: values.street, city: values.city, country: values.country,
        postcode: values.post_code, state: values.state, occupation: values.occupation,
        payment_per_annum: values.payment_per_annum, value_per_annum: values.value_per_annum
      }
      d.country_code = data.country_code
      d.location = values.country
      delete d['country']
      if (d.Middle_name === "" || d.Middle_name === undefined || d.Middle_name === " ") {
        delete d['Middle_name'];
      }
      if (d.flat === "" || d.flat === undefined || d.flat === " ") {
        delete d['flat'];
      }
      updateProfile(d).then(res => {
        if (sessionStorage.getItem("send-step")) {
          sessionStorage.removeItem("send-step")
        }
        sessionStorage.setItem("send-step", Number(step) + 1)
        handleStep(Number(step) + 1)
        updateTransaction(d)
      })

    }
  })

  const handleChange = (e) => {
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

  useEffect(() => {
    formik.validateForm().then(res => {
      if (Object.keys(res).length == 0) {
        setDisplay("block")
      } else {
        setDisplay("none")
      }
    })
  }, [data])

  useEffect(() => {

    // const script = document.createElement('script');

    // script.src = `${div_url}`;

    // script.async = true;

    // document.body.appendChild(script);

    // script.onload = () => {
    //   window.digitalId.init({
    //     clientId: `${div_id}`,
    //     uxMode: 'popup',
    //     onLoadComplete: function (res) {
    //     },
    //     onComplete: function (res) {
    //       if (res.code != undefined || null) {
    //         if (sessionStorage.getItem("send-step")) {
    //           sessionStorage.removeItem("send-step")
    //         }
    //         sessionStorage.setItem("send-step", Number(step) + 1)
    //         handleStep(Number(step) + 1)
    //         formik.handleSubmit()
    //         axios.post(`${serverUrl}/digital-verification/`, { code: res.code }, {
    //           headers: {
    //             'Content-Type': 'application/json',
    //             "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    //           }
    //         }).then(res => {
    //           if (res?.data?.code == "200") {
    //             window.setTimeout(() => {
    //               setLoader(false)
    //             }, 2000)
    //             const userdt = JSON.parse(sessionStorage.getItem("remi-user-dt"))
    //             userdt.is_digital_Id_verified = "true"
    //             sessionStorage.setItem("remi-user-dt", JSON.stringify(userdt))
    //             toast.success("Digital Id successfully verified", { position: "bottom-right", hideProgressBar: true })
    //           } else {
    //             setLoader(false)
    //             toast.error("Digital Id verification failed", { position: "bottom-right", hideProgressBar: true })
    //           }
    //         }).catch((error) => {
    //           setLoader(false)
    //           toast.error("Digital Id verification failed", { position: "bottom-right", hideProgressBar: true })
    //         })
    //       } else {
    //         setLoader(false)
    //       }
    //     },
    //     onClick: function (res) {
    //       setLoader(true)
    //     },
    //     onKeepAlive: function (res) {
    //     },
    //   });
    // }

    var dtToday = new Date();
    var month = dtToday.getMonth() + 1;
    var day = dtToday.getDate();
    var year = dtToday.getFullYear() - 18;
    if (month < 10)
      month = '0' + month.toString();
    if (day < 10)
      day = '0' + day.toString();
    var maxDate = year + '-' + month + '-' + day;
    var minDate = year - 100 + '-' + month + "-" + day
    document.getElementById("dob").setAttribute('max', maxDate);
    document.getElementById("dob").setAttribute('min', minDate);
    formik.setFieldValue("dob", maxDate)
  }, []);

  useEffect(() => {
    if (data.country !== "none") {
      let array_1 = countryList?.filter((item) => {
        return item?.name === data.country
      })
      let array = array_1[0]?.states;
      setData({ ...data, country_code: array_1[0]?.iso2, state: "none", city: "none", post_code: "" })
      formik.setValues({ ...formik.values, state: "none", city: "none", post_code: "" })
      array.sort((a, b) => (a.state > b.state) ? 1 : -1);
      setStateList(array);
    }
  }, [data.country])

  useEffect(() => {
    if (data.state !== "none") {
      let array = state_list.filter((item) => {
        return item?.state === data?.state
      })
      array.sort((a, b) => (a.city > b.city) ? 1 : -1);

      setCityList(array);
    } else if (data.state === "none") {
      setData({ ...data, city: "none", post_code: "" })
      formik.setValues({ ...formik.values, city: "none", post_code: "" })
    }

  }, [data.state, state_list])

  useEffect(() => {
    if (data.city !== "none") {
      let postals = city_list.filter((item) => {
        return item?.city === data?.city && item?.state === data?.state
      })
      setPostalList(postals)
      setData({ ...data, post_code: postals[0]?.post_code })
      formik.setValues({ ...formik.values, post_code: postals[0]?.post_code })
    } else if (data.city === "none") {
      setData({ ...data, post_code: "" })
      formik.setValues({ ...formik.values, post_code: "" })
    }
  }, [data.city, city_list])

  const handleOnlyAplha = (event) => {
    const result = event.target.value.replace(/[^A-Za-z!@#$%^&*()_+\-=[\]{};':"\\|,.<>/? ]/gi, "");
    setData({ ...data, [event.target.name]: result })
    formik.setFieldValue(event.target.name, result)
    formik.setFieldTouched(event.target.name, true)
  }

  const handleNumericOnly = (event) => {
    const result = event.target.value.replace(/[^0-9]/, "");
    setData({ ...data, [event.target.name]: result })
    formik.setFieldValue(event.target.name, result)
    formik.setFieldTouched(event.target.name, true)
  }

  const handleAddress = (event) => {
    const result = event.target.value.replace(/[^0-9A-z-/#. _]/, "");
    setData({ ...data, [event.target.name]: result })
    formik.setFieldValue(event.target.name, result)
    formik.setFieldTouched(event.target.name, true)
  }

  const handleClear = () => {
    sessionStorage.removeItem("transfer_data")
    sessionStorage.removeItem("send-step")
    sessionStorage.removeItem("DigitalCode")
    window.location.reload(true)
  }


  const handlePrevious = () => {
    if (sessionStorage.getItem("send-step")) {
      sessionStorage.removeItem("send-step")
    }
    sessionStorage.setItem("send-step", Number(step) - 1)
    handleStep(Number(step) - 1)
  }

  const handleContinue = () => {
    if (sessionStorage.getItem("send-step")) {
      sessionStorage.removeItem("send-step")
    }
    sessionStorage.setItem("send-step", Number(step) + 1)
    handleStep(Number(step) + 1)
    formik.handleSubmit()
  }

  return (
    <>

      <div className="form_body">

        <div className="header">
          <h1>Sender Details </h1>
        </div>
        <form autoComplete='off' >
          {/* -------------------------first , middle , last */}
          <div className="row each-row">
            <div className="col-md-4">
              <div className="input_field">
                <p className="get-text">First Name<span style={{ color: 'red' }} >*</span></p>
                <input
                  type="text"
                  name="f_name"
                  value={data.f_name}
                  maxLength="25"
                  onChange={handleOnlyAplha}
                  onBlur={formik.handleBlur}
                  className={clsx(
                    'form-control bg-transparent',
                    { 'is-invalid': formik.touched.f_name && formik.errors.f_name },
                    {
                      'is-valid': formik.touched.f_name && !formik.errors.f_name
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
                  className='form-control'
                  value={data.m_name}
                  maxLength="25"
                  onChange={handleOnlyAplha}
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
                  value={data.l_name}
                  maxLength="25"
                  onChange={handleOnlyAplha}
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

          {/* --------------------------------dob , cob , occup */}
          <div className="row">
            <div className="col-md-4">
              <div className="input_field">
                <p className="get-text">Date of birth<span style={{ color: 'red' }} >*</span></p>
                <input
                  type="date"
                  name="dob"
                  value={data.dob}
                  id="dob"
                  onBlur={formik.handleBlur}
                  onChange={(e) => handleChange(e)}
                  className={clsx(
                    'form-control bg-transparent',
                    { 'is-invalid': formik.touched.dob && formik.errors.dob },
                    {
                      'is-valid': formik.touched.dob && !formik.errors.dob,
                    }
                  )}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="input_field">
                <p className="get-text">Country of Birth<span style={{ color: 'red' }} >*</span></p>
                <select
                  value={data.country_of_birth}
                  name="country_of_birth"
                  onChange={(e) => handleChange(e)}
                  onBlur={formik.handleBlur}
                  className={clsx(
                    'form-control form-select bg-transparent',
                    { 'is-invalid': formik.touched.country_of_birth && formik.errors.country_of_birth },
                    {
                      'is-valid': formik.touched.country_of_birth && !formik.errors.country_of_birth,
                    }
                  )}
                >
                  <option value="none">Select a country</option>
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
                  value={data.occupation}
                  id="occupation"
                  maxLength="50"
                  onChange={(e) => handleOnlyAplha(e)}
                  onBlur={formik.handleBlur}
                  className={clsx(
                    'form-control bg-transparent',
                    { 'is-invalid': formik.touched.occupation && formik.errors.occupation },
                    {
                      'is-valid': formik.touched.occupation && !formik.errors.occupation,
                    }
                  )}
                />
              </div>
            </div>
          </div>

          {/*-------------------------------- account usage */}
          <div className="row each-row">
            <p className="mb-3"><span className="h5">Account Usage</span><span className='small'>&nbsp;(Utilization above tier 1 requires additional verification documents.)</span></p>
            <div className="col-md-6">
              <div className="input_field">
                <p className="get-text">Projected frequency of payments per annum<span style={{ color: 'red' }} >*</span></p>
                <select
                  value={data.payment_per_annum}
                  name="payment_per_annum"
                  onChange={(e) => handleChange(e)}
                  onBlur={formik.handleBlur}
                  className={clsx(
                    'form-control form-select bg-transparent',
                    { 'is-invalid': formik.touched.payment_per_annum && formik.errors.payment_per_annum },
                    {
                      'is-valid': formik.touched.payment_per_annum && !formik.errors.payment_per_annum,
                    }
                  )}
                >
                  <option value="Tier-1 Less than 5 times" key="Less than 5 times">Tier-1 Less than 5 times</option>
                  <option value="Tier-2 5-10 Times" key="5-10 times">Tier-2 5-10 Times</option>
                  <option value="Tier-3 Greater than 10 Times" key="Greater than 10 times">Tier-3 Greater than 10 Times</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="input_field">
                <p className="get-text">Projected value of payments per annum<span style={{ color: 'red' }} >*</span></p>
                <select
                  value={data.value_per_annum}
                  name="value_per_annum"
                  onChange={(e) => handleChange(e)}
                  onBlur={formik.handleBlur}
                  className={clsx(
                    'form-control form-select bg-transparent',
                    { 'is-invalid': formik.touched.value_per_annum && formik.errors.value_per_annum },
                    {
                      'is-valid': formik.touched.value_per_annum && !formik.errors.value_per_annum,
                    }
                  )}
                >
                  <option value="Tier-1 Less than $30,000" key="Less than $30,000">Tier-1 Less than $30,000</option>
                  <option value="Tier-2 $30,000 - $100,000" key="$30,000-$100,000">Tier-2 $30,000 - $100,000</option>
                  <option value="Tier-3 Greater than $100,000" key="Greater than $100,000">Tier-3 Greater than $100,000</option>
                </select>
              </div>
            </div>
          </div>
          <div className="row each-row">
            <h5>Address</h5>
            <div className="col-md-4">
              <div className="input_field">
                <p className="get-text">Country Name<span style={{ color: 'red' }} >*</span></p>
                <select
                  value={data.country}
                  name="country"
                  onChange={(e) => handleChange(e)}
                  onBlur={formik.handleBlur}
                  className={clsx(
                    'form-control bg-transparent',
                    { 'is-invalid': formik.touched.country && formik.errors.country },
                    {
                      'is-valid': formik.touched.country && !formik.errors.country,
                    }
                  )}
                >
                  <option value={"none"} >Select a country</option>
                  <option value={"Australia"} >Australia</option>
                  <option value={"New Zealand"} >New Zealand</option>
                </select>
              </div>
            </div>
            {
              data.country !== "none" ? (
                <>
                  <div className="col-md-4">
                    <div className="input_field">
                      <p className="get-text">State<span style={{ color: 'red' }} >*</span></p>
                      {
                        state_list && state_list?.length > 0 ?
                          (<select
                            value={data?.state}
                            name="state"
                            onChange={(e) => handleChange(e)}
                            onBlur={formik.handleBlur}
                            className={clsx(
                              'form-control bg-transparent',
                              { 'is-invalid': formik.touched.state && formik.errors.state },
                              {
                                'is-valid': formik.touched.state && !formik.errors.state,
                              }
                            )}
                          >
                            <option value={"none"} key={"none"}>Select a state</option>
                            {state_list?.map((opt, index) => {
                              if (opt?.state !== state_list[index - 1]?.state) {
                                return (
                                  <option value={opt?.state} key={index}>{opt?.state}</option>
                                )
                              }
                            })
                            }
                          </select>) :
                          (<input
                            type="text"
                            placeholder='No country selected'
                            className='form-control'
                            readOnly
                          />)
                      }
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="input_field">
                      <p className="get-text ">City/Suburb<span style={{ color: 'red' }} >*</span></p>
                      {
                        city_list && city_list.length > 0 ? (
                          <select
                            value={data.city}
                            name="city"
                            onChange={(e) => handleChange(e)}
                            onBlur={formik.handleBlur}
                            className={clsx(
                              'form-control bg-transparent',
                              { 'is-invalid': formik.touched.city && formik.errors.city },
                              {
                                'is-valid': formik.touched.city && !formik.errors.city,
                              }
                            )}
                          >
                            <option value="none" key="none">Select a city</option>
                            {city_list?.map((opt, index) => {
                              if (city_list[index]?.city !== city_list[index - 1]?.city && opt?.city !== "") {
                                return (
                                  <option value={opt?.city} key={index}>{opt?.city}</option>
                                )
                              }
                            })
                            }
                          </select>
                        ) : (
                          <input
                            type="text"
                            name="city"
                            value='No state selected'
                            className='form-control'
                            readOnly
                          />
                        )
                      }
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="input_field">
                      <p className="get-text">Zip/Postal Code<span style={{ color: 'red' }} >*</span></p>
                      <input
                        type="text"
                        name="post_code"
                        value={data.post_code}
                        onBlur={formik.handleBlur}
                        maxLength="4"
                        list='postal_list'
                        onChange={handleNumericOnly}
                        className={clsx(
                          'form-control bg-transparent',
                          { 'is-invalid': formik.touched.post_code && formik.errors.post_code },
                          {
                            'is-valid': formik.touched.post_code && !formik.errors.post_code,
                          }
                        )}
                      />
                      <datalist id="postal_list">
                        {
                          postal_list.length > 0 && postal_list?.map((opt, index) => {
                            return <option value={opt.post_code} key={index} />
                          })
                        }
                      </datalist>
                    </div>
                  </div>
                </>
              ) : <></>
            }
            <div className="col-md-4">
              <div className="input_field">
                <p className="get-text">Street<span style={{ color: 'red' }} >*</span></p>
                <input
                  type="text"
                  name="street"
                  value={data.street}
                  onChange={handleAddress}
                  onBlur={formik.handleBlur}
                  maxLength="30"
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
            <div className="col-md-4">
              <div className="input_field">
                <p className="get-text">Flat/Unit No.</p>
                <input
                  type="text"
                  name="flat"
                  value={data.flat}
                  onChange={handleAddress}
                  onBlur={formik.handleBlur}
                  maxLength="10"
                  className='form-control bg-transparent'
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="input_field">
                <p className="get-text">Building No.<span style={{ color: 'red' }} >*</span></p>
                <input
                  type="text"
                  name="build_no"
                  value={data.build_no}
                  onChange={handleAddress}
                  onBlur={formik.handleBlur}
                  maxLength="30"
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
        </form>
        < div className="row each-row" >
          <div className="col-md-4 new_buttonss" >
            <button className="start-form-button full-col" onClick={() => handleClear()}> Cancel </button>
          </div>
          < div className="col-md-8 new_buttons" >
            <button type="button" className="form-button" onClick={() => { handlePrevious() }}>Previous</button>
            {isVerified === "false" ? (
              <>
                <button type='button' className="form-button full-col" disabled={display === "none" ? true : false} style={display === "none" ? { cursor: "not-allowed" } : { cursor: "pointer" }} onClick={() => setStartVerify(true)}> Get Verified </button>
              </>
            ) : (
              <>
                <button type='button' className="form-button full-col" onClick={() => formik.handleSubmit()}> Continue </button>
              </>
            )
            }
          </div>
        </div>
        < Modal show={start_verify} backdrop="static" onHide={() => setStartVerify(false)} centered >
          <Modal.Header closeButton >
            <img src="https://veriff.cdn.prismic.io/veriff/1565ec7d-5815-4d28-ac00-5094d1714d4c_Logo.svg" alt="Veriff logo" width="90" height="25" />
          </Modal.Header>
          < Modal.Body className='w-100 m-auto' >
            <Verification handler={() => setStartVerify(false)} submit={formik.handleSubmit} toggleLoader={(value) => setLoader(value)} formdata={formik.values} />
          </Modal.Body>
        </Modal>
        {
          loader ? <>
            <div className="loader-overly" >
              <div className="loader" >
              </div>
            </div>
          </> : ""}
      </div>
    </>

  )
}


const Verification = ({ handler, submit, formdata, toggleLoader }) => {

  let user = JSON.parse(sessionStorage.getItem("remi-user-dt"))


  useEffect(() => {
    const veriff = Veriff({
      apiKey: `${process.env.REACT_APP_VERIFF_KEY}`,
      parentId: 'veriff-root',
      onSession: function (err, response) {
        createVeriffFrame({
          url: response.verification.url,
          onEvent: function (msg) {
            switch (msg) {
              case MESSAGES.CANCELED:
                break;
              case MESSAGES.STARTED:
                break;
              case MESSAGES.FINISHED:
                toggleLoader(true)
                handler()
                const interval = setInterval(() => {
                  getVeriffStatus({ session_id: response.verification.id }).then(res => {
                    if (res.code === "200") {
                      if (res?.data?.verification?.status === "approved") {
                        toggleLoader(false)
                        clearInterval(interval)
                        toast.success("Successfully Verified", { position: "bottom-right", hideProgressBar: true })
                        user.is_digital_Id_verified = "true";
                        sessionStorage.setItem("remi-user-dt", JSON.stringify(user))
                        submit()
                      } else if (res?.data?.verification?.status === "declined") {
                        toggleLoader(false)
                        clearInterval(interval)
                        toast.error(res.message, { position: "bottom-right", hideProgressBar: true })
                      }

                    }
                  })
                }, 10000)
                break;
            }
          }
        });
      }
    });
    veriff.setParams({
      vendorData: `${user?.customer_id}`,
      person: {
        givenName: `${formdata?.f_name}`,
        lastName: `${formdata?.l_name}`
      }
    });
    veriff.mount({
      formLabel: {
        givenName: 'Given name',
        lastName: 'Last name',
        vendorData: 'Unique id of an end-user'
      },
      submitBtnText: 'Get verified',
      loadingText: 'Please wait...'
    });
  }, []);

  return (
    <div id='veriff-root' style={{ margin: "auto", padding: "25px 0px" }
    }> </div>
  )
}

export default SenderDetails