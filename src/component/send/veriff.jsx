import React, { useMemo } from 'react'
import { useFormik } from 'formik'
import clsx from 'clsx'
import * as Yup from "yup";
import { useState } from 'react';
import birthCountryList from 'react-select-country-list';
import { useEffect } from 'react';
import countryList from '../../utils/AuNz.json';
import { createVeriffFrame, MESSAGES } from '@veriff/incontext-sdk';
import { getVeriffStatus } from '../../utils/Api';
import { Veriff } from '@veriff/js-sdk';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';


const SenderDetails = ({ handleStep, step }) => {

    const userd = JSON.parse(sessionStorage.getItem("remi-user-dt"))
    const [display, setDisplay] = useState("none")
    const [city_list, setCityList] = useState([])
    const [state_list, setStateList] = useState([])
    const [loader, setLoader] = useState(false)
    const [postal_list, setPostalList] = useState([])
    const [data, setData] = useState({
        f_name: "", m_name: "", l_name: "",
        occupation: "", country_of_birth: "",
        dob: "", flat: "", build_no: "",
        street: "", city: "none", country: "none", occupation: "",
        post_code: "", state: "none", email: userd.email, mobile: userd.mobile,
        customer_id: userd.customer_id, country_code: "AU", payment_per_annum: "none", value_per_annum: "none"
    })

    const initialValues = {
        f_name: "", m_name: "", l_name: "",
        occupation: "", country_of_birth: "",
        dob: "", flat: "", build_no: "",
        street: "", city: "none", country: "none", occupation: "",
        post_code: "", state: "none", email: userd.email, mobile: userd.mobile,
        customer_id: userd.customer_id, payment_per_annum: "none", value_per_annum: "none"
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
        dob: Yup.date().required(),
        occupation: Yup.string().min(1).max(50).required().trim(),
        country_of_birth: Yup.string().required().notOneOf(["none"]),
        payment_per_annum: Yup.string().required().notOneOf(["none"]),
        value_per_annum: Yup.string().required().notOneOf(["none"]),
    })

    const formik = useFormik({
        initialValues,
        validationSchema: senderSchema,
        onSubmit: async (values) => {
            const local = JSON.parse(sessionStorage.getItem("transfer_data"))
            const user = JSON.parse(sessionStorage.getItem("remi-user-dt"))
            local.sender = { ...values, email: user.email, customer_id: user.customer_id, mobile: user.mobile, country_code: data.country_code }
            sessionStorage.removeItem("transfer_data")
            sessionStorage.setItem("transfer_data", JSON.stringify(local))
            if (sessionStorage.getItem("send-step")) {
                sessionStorage.removeItem("send-step")
            }
            sessionStorage.setItem("send-step", Number(step) + 1)
            handleStep(Number(step) + 1)
        }
    })


    const [isVerified, setIsVerified] = useState(false)
    const [start_verify, setStartVerify] = useState(false)
    const { is_digital_Id_verified } = JSON.parse(sessionStorage.getItem("remi-user-dt"))
    const countryOptions = useMemo(() => birthCountryList().getData(), [])

    useEffect(() => {
        if (sessionStorage.getItem("transfer_data")) {
            let tdata = JSON.parse(sessionStorage.getItem("transfer_data"))
            if (tdata?.sender) {
                setData(tdata?.sender)
                formik.setValues({ ...tdata?.sender })
            }
        }

    }, [step])

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

        // script.src = 'https://digitalid-sandbox.com/sdk/app.js';

        // script.async = true;

        // document.body.appendChild(script);

        // script.onload = () => {
        //   window.digitalId.init({
        //     clientId: 'ctid5xTkDsQVgTySwxhMpKWUTE',
        //     uxMode: 'popup',
        //     onLoadComplete: function () {
        //     },
        //     onComplete: function (res) {

        //       if (res.code != undefined || null) {
        //         formik.handleSubmit()
        //         axios.post(`${global.serverUrl}/digital-verification/`, { code: res.code }, {
        //           headers: {
        //             'Content-Type': 'application/json',
        //             "Authorization": `Bearer ${sessionStorage.getItem("token")}`
        //           }
        //         }).then(res => {
        //           if (res?.data?.code == "200") {
        //             toast.success("Digital Id successfully verified", { position: "bottom-right", hideProgressBar: true })

        //           } else {
        //             toast.error("Digital Id verification failed", { position: "bottom-right", hideProgressBar: true })
        //           }
        //           setLoader(false)
        //         }).catch((error) => {
        //           toast.error("Digital Id verification failed", { position: "bottom-right", hideProgressBar: true })
        //           setLoader(false)
        //         })
        //       }
        //     },
        //     onClick: function () {
        //     },
        //     onKeepAlive: function () {
        //     }
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
        var minDate = year - 100 - (year % 10) + '-' + month + "-" + day
        document.getElementById("dob").setAttribute('max', maxDate);
        document.getElementById("dob").setAttribute('min', minDate);
        setData({ ...data, dob: maxDate })
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

    }, [data.state])

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
    }, [data.city])

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

    return (
        <div className="form_body" >
            <div className="header" >
                <h1>Sender Details </h1>
            </div>
            < form autoComplete='off' >

                {/* -------------------------first , middle , last */}
                < div className="row each-row" >
                    <div className="col-md-4" >
                        <div className="input_field" >
                            <p className="get-text" > First Name < span style={{ color: 'red' }
                            } >* </span></p >
                            <input
                                type="text"
                                name="f_name"
                                value={data.f_name}
                                maxLength="25"
                                onChange={handleOnlyAplha}
                                className={
                                    clsx(
                                        'form-control bg-transparent',
                                        {
                                            'is-invalid': formik.touched.f_name && formik.errors.f_name
                                        },
                                        {
                                            'is-valid': formik.touched.f_name && !formik.errors.f_name
                                        }
                                    )}

                            />
                        </div>
                    </div>
                    < div className="col-md-4" >
                        <div className="input_field" >
                            <p className="get-text" > Middle Name </p>
                            < input
                                type="text"
                                name="m_name"
                                className='form-control'
                                value={data.m_name}
                                maxLength="25"
                                onChange={handleOnlyAplha}
                            />
                        </div>
                    </div>
                    < div className="col-md-4" >
                        <div className="input_field" >
                            <p className="get-text" > Last Name < span style={{ color: 'red' }} >* </span></p >
                            <input
                                type="text"
                                name="l_name"
                                value={data.l_name}
                                maxLength="25"
                                onChange={handleOnlyAplha}
                                className={
                                    clsx(
                                        'form-control bg-transparent',
                                        {
                                            'is-invalid': formik.touched.l_name && formik.errors.l_name
                                        },
                                        {
                                            'is-valid': formik.touched.l_name && !formik.errors.l_name,
                                        }
                                    )}
                            />
                        </div>
                    </div>
                </div>

                {/* --------------------------------dob , cob , occup */}
                <div className="row" >
                    <div className="col-md-4" >
                        <div className="input_field" >
                            <p className="get-text" > Date of birth < span style={{ color: 'red' }} >* </span></p >
                            <input
                                type="date"
                                name="dob"
                                value={data.dob}
                                id="dob"
                                onChange={(e) => handleChange(e)}
                                className={
                                    clsx(
                                        'form-control bg-transparent',
                                        {
                                            'is-invalid': formik.touched.dob && formik.errors.dob
                                        },
                                        {
                                            'is-valid': formik.touched.dob && !formik.errors.dob,
                                        }
                                    )}
                            />
                        </div>
                    </div>
                    < div className="col-md-4" >
                        <div className="input_field" >
                            <p className="get-text" > Country of Birth < span style={{ color: 'red' }} >* </span></p >
                            <select
                                value={data.country_of_birth}
                                name="country_of_birth"
                                onChange={(e) => handleChange(e)}
                                className={
                                    clsx(
                                        'form-control form-select bg-transparent',
                                        {
                                            'is-invalid': formik.touched.country_of_birth && formik.errors.country_of_birth
                                        },
                                        {
                                            'is-valid': formik.touched.country_of_birth && !formik.errors.country_of_birth,
                                        }
                                    )}
                            >
                                <option value="none" > Select a country </option>
                                {
                                    countryOptions && countryOptions.length > 0 ?
                                        countryOptions?.map((opt) => {
                                            return (
                                                <option value={opt.label} > {opt.label} </option>
                                            )
                                        }) : ""
                                }
                            </select>
                        </div>
                    </div>
                    < div className="col-md-4" >
                        <div className="input_field" >
                            <p className="get-text" > Occupation < span style={{ color: 'red' }} >* </span></p >
                            <input
                                type="text"
                                name="occupation"
                                value={data.occupation}
                                id="occupation"
                                maxLength="50"
                                onChange={(e) => handleOnlyAplha(e)}
                                className={
                                    clsx(
                                        'form-control bg-transparent',
                                        {
                                            'is-invalid': formik.touched.occupation && formik.errors.occupation
                                        },
                                        {
                                            'is-valid': formik.touched.occupation && !formik.errors.occupation,
                                        }
                                    )}
                            />
                        </div>
                    </div>
                </div>

                {/*-------------------------------- account usage */}
                <div className="row each-row" >
                    <h5>Account Usage </h5>
                    < div className="col-md-6" >
                        <div className="input_field" >
                            <p className="get-text" > Projected frequency of the payments per annum < span style={{ color: 'red' }} >* </span></p >
                            <select
                                value={data.payment_per_annum}
                                name="payment_per_annum"
                                onChange={(e) => handleChange(e)}
                                className={
                                    clsx(
                                        'form-control form-select bg-transparent',
                                        {
                                            'is-invalid': formik.touched.payment_per_annum && formik.errors.payment_per_annum
                                        },
                                        {
                                            'is-valid': formik.touched.payment_per_annum && !formik.errors.payment_per_annum,
                                        }
                                    )}
                            >
                                <option value="none" key="none" > Select a frequency </option>
                                < option value="Less than 5 times" key="Less than 5 times" > Less than 5 times </option>
                                < option value="5-10 times" key="5-10 times" > 5 - 10 times </option>
                                < option value="Greater then 10 times" key="Greater then 10 times" > Greater then 10 times </option>
                            </select>
                        </div>
                    </div>
                    < div className="col-md-6" >
                        <div className="input_field" >
                            <p className="get-text" > Projected frequency of the value per annum < span style={{ color: 'red' }} >* </span></p >
                            <select
                                value={data.value_per_annum}
                                name="value_per_annum"
                                onChange={(e) => handleChange(e)}
                                className={
                                    clsx(
                                        'form-control form-select bg-transparent',
                                        {
                                            'is-invalid': formik.touched.value_per_annum && formik.errors.value_per_annum
                                        },
                                        {
                                            'is-valid': formik.touched.value_per_annum && !formik.errors.value_per_annum,
                                        }
                                    )}
                            >
                                <option value="none" key="none" > Select a frequency </option>
                                < option value="Less than $30,000" key="Less than $30,000" > Less than $30,000 </option>
                                < option value="$30,000-$100,000" key="$30,000-$100,000" > $30,000 - $100,000 </option>
                                < option value="Greater than $100,000" key="Greater than $100,000" > Greater than $100,000 </option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* <div className="row each-row">
          <div className="col-md-6">
            <div className="input_field">
              <p className="get-text">Email<span style={{ color: 'red' }} >*</span></p>
              <input
                type="email"
                value={data.email}
                style={{ backgroundColor: "rgba(252, 253, 255, 0.81)" }}
                className='form-control'
                readOnly
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="input_field">
              <p className="get-text">Mobile<span style={{ color: 'red' }} >*</span></p>
              <input
                type="text"
                style={{ backgroundColor: "rgba(252, 253, 255, 0.81)" }}
                value={data.mobile}
                className='form-control'
                readOnly
              />

            </div>
          </div>
        </div> */}

                {/*-------------------------------- Address */}
                <div className="row each-row" >
                    <h5>Address </h5>
                    < div className="col-md-4" >
                        <div className="input_field" >
                            <p className="get-text" > Country Name < span style={{ color: 'red' }} >* </span></p >
                            <select
                                value={data.country}
                                name="country"
                                onChange={(e) => handleChange(e)}
                                className={
                                    clsx(
                                        'form-control bg-transparent',
                                        {
                                            'is-invalid': formik.touched.country && formik.errors.country
                                        },
                                        {
                                            'is-valid': formik.touched.country && !formik.errors.country,
                                        }
                                    )}
                            >
                                <option value={"none"} > Select a country </option>
                                < option value={"Australia"} > Australia </option>
                                < option value={"New Zealand"} > New Zealand </option>
                            </select>
                        </div>
                    </div>
                    {
                        data.country !== "none" ? (
                            <>
                                <div className="col-md-4" >
                                    <div className="input_field" >
                                        <p className="get-text" > State < span style={{ color: 'red' }
                                        } >* </span></p >
                                        {
                                            state_list && state_list?.length > 0 ?
                                                (<select
                                                    value={data?.state}
                                                    name="state"
                                                    onChange={(e) => handleChange(e)}
                                                    className={
                                                        clsx(
                                                            'form-control bg-transparent',
                                                            {
                                                                'is-invalid': formik.touched.state && formik.errors.state
                                                            },
                                                            {
                                                                'is-valid': formik.touched.state && !formik.errors.state,
                                                            }
                                                        )}
                                                >
                                                    <option value={"none"} key={"none"} > Select a state </option>
                                                    {
                                                        state_list?.map((opt, index) => {
                                                            if (opt?.state !== state_list[index - 1]?.state) {
                                                                return (
                                                                    <option value={opt?.state} key={index} > {opt?.state} </option>
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
                                < div className="col-md-4" >
                                    <div className="input_field" >
                                        <p className="get-text " > City / Suburb < span style={{ color: 'red' }} >* </span></p >
                                        {
                                            city_list && city_list.length > 0 ? (
                                                <select
                                                    value={data.city}
                                                    name="city"
                                                    onChange={(e) => handleChange(e)}
                                                    className={
                                                        clsx(
                                                            'form-control bg-transparent',
                                                            {
                                                                'is-invalid': formik.touched.city && formik.errors.city
                                                            },
                                                            {
                                                                'is-valid': formik.touched.city && !formik.errors.city,
                                                            }
                                                        )}
                                                >
                                                    <option value="none" key="none" > Select a city </option>
                                                    {
                                                        city_list?.map((opt, index) => {
                                                            if (city_list[index]?.city !== city_list[index - 1]?.city && opt?.city !== "") {
                                                                return (
                                                                    <option value={opt?.city} key={index} > {opt?.city} </option>
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
                                < div className="col-md-4" >
                                    <div className="input_field" >
                                        <p className="get-text" > Zip / Postal Code < span style={{ color: 'red' }} >* </span></p >
                                        <input
                                            type="text"
                                            name="post_code"
                                            value={data.post_code}
                                            maxLength="4"
                                            list='postal_list'
                                            onChange={handleNumericOnly}
                                            className={
                                                clsx(
                                                    'form-control bg-transparent',
                                                    {
                                                        'is-invalid': formik.touched.post_code && formik.errors.post_code
                                                    },
                                                    {
                                                        'is-valid': formik.touched.post_code && !formik.errors.post_code,
                                                    }
                                                )}
                                        />
                                        <datalist id="postal_list" >
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
                    <div className="col-md-4" >
                        <div className="input_field" >
                            <p className="get-text" > Street Name < span style={{ color: 'red' }} >* </span></p >
                            <input
                                type="text"
                                name="street"
                                value={data.street}
                                onChange={handleAddress}
                                maxLength="30"
                                className={
                                    clsx(
                                        'form-control bg-transparent',
                                        {
                                            'is-invalid': formik.touched.street && formik.errors.street
                                        },
                                        {
                                            'is-valid': formik.touched.street && !formik.errors.street,
                                        }
                                    )}
                            />
                        </div>
                    </div>
                    < div className="col-md-4" >
                        <div className="input_field" >
                            <p className="get-text" > Flat / Unit No.</p>
                            < input
                                type="text"
                                name="flat"
                                value={data.flat}
                                onChange={handleAddress}
                                maxLength="10"
                                className='form-control bg-transparent'
                            />
                        </div>
                    </div>
                    < div className="col-md-4" >
                        <div className="input_field" >
                            <p className="get-text" > Building No.< span style={{ color: 'red' }} >* </span></p >
                            <input
                                type="text"
                                name="build_no"
                                value={data.build_no}
                                onChange={handleAddress}
                                maxLength="30"
                                className={
                                    clsx(
                                        'form-control bg-transparent',
                                        {
                                            'is-invalid': formik.touched.build_no && formik.errors.build_no
                                        },
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
                    {isVerified === false ? (
                        // <>
                        //   <div className='digital_verification full-col' style={{ display: `${display == "none" ? "none" : "block"}` }}>
                        //     <div id='veriff-root'></div>
                        //   </div>
                        // </>
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
                    <Verification handler={() => setStartVerify(false)} submit={formik.handleSubmit} toggleLoader={() => setLoader(!loader)} />
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
    )
}

const Verification = ({ handler, handleSubmit, toggleLoader }) => {

    let { customer_id } = JSON.parse(sessionStorage.getItem("remi-user-dt"))

    useEffect(() => {
        const veriff = Veriff({
            apiKey: '55bdee3e-850a-4930-a7e6-e713a86a3cc9',
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
                                toggleLoader()
                                const interval = setInterval(() => {
                                    getVeriffStatus({ session_id: response.verification.id }).then(res => {
                                        if (res.code === "200") {
                                            handler()
                                            toggleLoader()
                                            clearInterval(interval)
                                            toast.success("Successfully Verified", { position: "bottom-right", hideProgressBar: true })
                                            // handleSubmit()
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
            vendorData: `${customer_id}`
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