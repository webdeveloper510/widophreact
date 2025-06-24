import React, { useEffect } from 'react'
import * as Yup from "yup"
import { useFormik } from 'formik';
import clsx from 'clsx';
import { useState } from 'react';
import { createTransaction, exchangeRate, setPreferredCurrency } from '../../utils/Api';
import { toast } from 'react-toastify';
import Bank_list from '../../utils/Bank_list';
import { FormCheck } from 'react-bootstrap';
import { commaRemover, commaSeperator } from '../../utils/hook';
import Select, { components } from "react-select"

const AmountDetail = ({ handleStep, step, handleAmtDetail }) => {

    const [loader, setLoader] = useState(false)
    const [exch_rate, setExchRate] = React.useState("");
    const [amt_detail, setAmtDetail] = useState({
        send_amt: "",
        exchange_amt: "",
        from_type: "AUD",
        to_type: "NGN",
        recieve_meth: "Bank Transfer",
        part_type: null
    })



    const curr_in = ["AUD", "NZD"]
    const curr_out = ["USD", "NGN", "GHS", "KES", "PHP", "THB", "VND"]
    const [defaultExchange, setDefaultExchange] = useState("")
    const [blur_off, setBlurOff] = useState(false)

    const amtSchema = Yup.object().shape({
        send_amt: Yup.string("Please enter a valid amount").notOneOf([".", ""]).test("value-test", (value, validationcontext) => {
            const {
                createError,
            } = validationcontext;
            if (Number(value) < 100) {
                return createError({ message: "Minimum $100 required" })
            } else {
                return true
            }
        }).required(),
        exchange_amt: Yup.string("Please enter a valid amount").notOneOf([".", ""]).required(),
        from_type: Yup.string(),
        to_type: Yup.string().required(),
        part_type: Yup.string().required().notOneOf([null]).trim(),
        payout_part: Yup.string().min(3).max(50).test("value-test", (value, validationcontext) => {
            const {
                createError,
                parent: {
                    part_type,
                },
            } = validationcontext;
            if (part_type === "other" && (value?.length < 3 || value === undefined || value === null || value === " ")) {
                return createError({ message: "Please enter bank name" })
            } else {
                return true
            }
        }).trim(),
    })

    const initialValues = {
        send_amt: "",
        exchange_amt: "",
        from_type: "AUD",
        to_type: "NGN",
        recieve_meth: "Bank Transfer",
        part_type: null,
        payout_part: ""
    }

    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        validateOnChange: false,
        validateOnBlur: false,
        validationSchema: amtSchema,
        onSubmit: async (values) => {

            if (amt_detail.part_type === "Services" || amt_detail.recieve_meth === "Mobile Wallet") {
                toast.warn("THIS SERVICE OPTION IS CURRENTLY UNAVAILABLE", { hideProgressBar: true, autoClose: 2000, position: "bottom-right" })
            } else {
                let local = {}
                var transaction_id = sessionStorage.getItem("transaction_id")
                let payload = {
                    transaction_id: transaction_id,
                    amount: {
                        send_amount: commaRemover(values.send_amt),
                        receive_amount: commaRemover(values.exchange_amt),
                        send_currency: values.from_type,
                        receive_currency: values.to_type,
                        receive_method: "Bank transfer",
                        reason: "none",
                        payout_partner: values.part_type !== "other" ? values.part_type : values.payout_part,
                        exchange_rate: exch_rate
                    }
                }
                if (transaction_id === null || transaction_id === "undefined" || transaction_id === "") {
                    delete payload["transaction_id"]
                }
                createTransaction(payload).then(res => {
                    if (res.code === "200") {
                        sessionStorage.setItem("transaction_id", res.data.transaction_id)
                        if (sessionStorage.getItem("transfer_data")) {
                            local = JSON.parse(sessionStorage.getItem("transfer_data"))
                        }
                        local.amount = { ...values, send_amt: commaRemover(values.send_amt), exchange_amt: commaRemover(values.exchange_amt), exchange_rate: exch_rate, defaultExchange: defaultExchange }
                        handleAmtDetail({ ...values, send_amt: commaRemover(values.send_amt), exchange_amt: commaRemover(values.exchange_amt), payout_part: values.part_type !== "other" ? values.part_type : values.payout_part })
                        sessionStorage.setItem("transfer_data", JSON.stringify(local))
                        if (sessionStorage.getItem("send-step")) {
                            sessionStorage.removeItem("send-step")
                        }
                        sessionStorage.setItem("send-step", Number(step) + 1)
                        handleStep(Number(step) + 1)
                    }
                })

            }
        },
    })

    const myTotalAmount = (event, direction) => {

        event.preventDefault();
        if (event.target.value.length > 0) {
            let value = commaRemover(event.target.value !== 0 ? event.target.value : "1");
            setLoader(true)
            exchangeRate({ amount: value, from: formik.values.from_type, to: formik.values.to_type, direction: direction })
                .then(function (response) {
                    let data = commaSeperator(response?.amount)
                    if (direction === "From") {
                        formik.setFieldValue("exchange_amt", data)
                        setAmtDetail({ ...amt_detail, exchange_amt: data })
                        setDefaultExchange(response?.default_exchange)
                    } else {
                        formik.setFieldValue("send_amt", data)
                        setAmtDetail({ ...amt_detail, send_amt: data })
                    }
                    setLoader(false)
                    setExchRate(response.rate)
                    setBlurOff(true)
                })
                .catch(function (error, message) {
                    setLoader(false)
                    setBlurOff(true)
                })
        } else {
            formik.setFieldValue("exchange_amt", "")
            setAmtDetail({ ...amt_detail, exchange_amt: "" })
            setBlurOff(true)
        }
    }


    const inputvalidation = (event) => {
        var data = event.target.value;
        if (data.length > 0) {
            if (data.includes(',')) {
                let value = data.split(",")
                data = value.join("")
            }
            if (/^\d*\.?\d{0,2}$/.test(data)) {
                const [integerPart, decimalPart] = data.split('.')
                const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                if (decimalPart !== undefined) {
                    data = formattedIntegerPart + "." + decimalPart
                } else {
                    data = formattedIntegerPart
                }
                formik.setFieldValue(event.target.name, data);
                formik.setFieldTouched(event.target.name, true);
                setAmtDetail({ ...amt_detail, [event.target.name]: data });
                setBlurOff(false)
            } else {
                event.preventDefault();
            }
        } else {
            setAmtDetail({ ...amt_detail, send_amt: "", exchange_amt: "" })
            formik.setValues({ ...formik.values, send_amt: "", exchange_amt: "" })
        }
    };

    const amountDown = (e, direction) => {
        if (e.key === "Enter") {
            amountBlur(e, direction)
        }
    }

    const amountBlur = (e, direction) => {
        if (e.target.value !== "." && blur_off === false) {
            myTotalAmount(e, direction)
        }
    }

    const myTotalAmountFrom = (e) => {
        setAmtDetail({ ...amt_detail, from_type: e.target.value })
        formik.setFieldValue("from_type", e.target.value)
        formik.setFieldTouched("from_type", true)
        setLoader(true)
        const amt = commaRemover(formik.values.send_amt != undefined && formik.values.send_amt != 0 && formik.values.send_amt != "" ? formik.values.send_amt : "100")
        exchangeRate({ amount: amt, from: e.target.value, to: formik.values.to_type })
            .then(function (response) {
                setExchRate(response.rate)
                if (formik.values.send_amt != 0 && formik.values.send_amt != "" && formik.values.send_amt != undefined) {
                    formik.setFieldValue("exchange_amt", commaSeperator(response.amount))
                    setAmtDetail({ ...amt_detail, exchange_amt: commaSeperator(response.amount) })
                }
                setDefaultExchange(response?.default_exchange)
                setBlurOff(true)
                setLoader(false)
            })
            .catch(function (error, message) {
                setBlurOff(true)

                setLoader(false)
            })
    }

    const myTotalAmountTo = (e) => {
        setAmtDetail({ ...amt_detail, to_type: e.target.value })
        formik.setFieldValue("to_type", e.target.value)
        formik.setFieldTouched("to_type", true)
        setLoader(true)
        const amt = commaRemover(formik.values.send_amt != undefined && formik.values.send_amt != 0 && formik.values.send_amt != "" ? formik.values.send_amt : "1")
        exchangeRate({ amount: amt, from: formik.values.from_type, to: e.target.value })
            .then(function (response) {
                setExchRate(response.rate)
                setDefaultExchange(response?.default_exchange)
                if (formik.values.send_amt != 0 && formik.values.send_amt != undefined && formik.values.send_amt != "") {
                    formik.setFieldValue("exchange_amt", commaSeperator(response.amount))
                    setAmtDetail({ ...amt_detail, exchange_amt: commaSeperator(response.amount) })
                }
                setLoader(false)
                setBlurOff(true)

            })
            .catch(function (error, message) {
                setLoader(false)
                setBlurOff(true)

            })
    }

    const handleClear = () => {
        sessionStorage.removeItem("transfer_data")
        sessionStorage.removeItem("send-step")
        window.location.reload(true)
    }


    const handleRecieveMethod = (e) => {
        if (e.target.value === "Mobile Wallet") {
            toast.warn("THIS SERVICE OPTION IS CURRENTLY UNAVAILABLE", { hideProgressBar: true, autoClose: 500, position: "bottom-right" })
            setAmtDetail({ ...amt_detail, recieve_meth: "Bank Transfer" })
            formik.setFieldValue("recieve_meth", "Bank Transfer")
        } else {
            setAmtDetail({ ...amt_detail, recieve_meth: e.target.value })
            formik.setFieldValue("recieve_meth", e.target.value)
        }

    }

    const handlePayoutPart = (e, name) => {
        if (name === "Services") {
            toast.warn("THIS SERVICE OPTION IS CURRENTLY UNAVAILABLE", { hideProgressBar: true, autoClose: 1000, position: "bottom-right" })
        } else {
            setAmtDetail({ ...amt_detail, part_type: e.value })
            formik.setValues({ ...formik.values, part_type: e.value, payout_part: "" })
        }

    }

    useEffect(() => {
        if (sessionStorage.getItem("transfer_data")) {
            let tdata = JSON.parse(sessionStorage.getItem("transfer_data"))
            if (tdata?.amount) {
                setAmtDetail({ ...tdata?.amount, recieve_meth: tdata?.amount?.recieve_meth || "Bank Transfer", part_type: tdata?.amount?.part_type || null, send_amt: commaSeperator(tdata?.amount?.send_amt), exchange_amt: commaSeperator(tdata?.amount?.exchange_amt) })
                formik.setValues({ ...tdata?.amount, recieve_meth: tdata?.amount?.recieve_meth || "Bank Transfer", part_type: tdata?.amount?.part_type || null, send_amt: commaSeperator(tdata?.amount?.send_amt), exchange_amt: commaSeperator(tdata?.amount?.exchange_amt) })
                setExchRate(tdata?.amount?.exchange_rate)
                setDefaultExchange(tdata?.amount?.defaultExchange)
            }
        } else {
            let data = JSON.parse(sessionStorage?.getItem("exchange_curr"))
            setAmtDetail({ ...amt_detail, send_amt: "", exchange_amt: "", recieve_meth: "Bank Transfer", part_type: null, from_type: data?.from_type, to_type: data?.to_type })
            setExchRate(data?.exch_rate)
            setDefaultExchange(data?.defaultExchange)
            formik.setValues({ ...formik.values, send_amt: "", exchange_amt: "", recieve_meth: "Bank Transfer", part_type: null, from_type: data?.from_type, to_type: data?.to_type })
        }
    }, [])

    const customBank = (e) => {
        let value = e.target.value;
        if (value.length > 0) {
            if (/^[A-z '-.]+$/.test(value)) {
                formik.setValues({ ...formik.values, payout_part: value })
            } else {
                e.preventDefault();
            }
        } else {
            formik.setValues({ ...formik.values, payout_part: value })
        }
    }
    const customStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: formik.errors.part_type && formik.touched.part_type ? 'red' : base.borderColor, // Change the border color when it's invalid
        }),
    };

    const Placeholder = (props) => {
        return <components.Placeholder {...props} />;
    };

    return (
        <form noValidate className='pb-5'>
            <div className="form_body">
                <div className="header exchangemoney-header">
                    <h1>Amount & delivery</h1>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="input_field rate-value">
                            <p className="get-text Exchange_rate">Exchange Rate</p>
                            <p className="exchange-rate exchange_value" >1 <span>{formik.values.from_type}</span> = {commaSeperator(exch_rate)} <span>{formik.values.to_type}</span> </p>
                        </div>
                    </div>
                </div>
                <div className="row  each-row">
                    <div className="col-md-6">
                        <div className="input_field">
                            <p className="get-text">From<span style={{ color: 'red' }} >*</span></p>
                            <select
                                aria-label="Select a reason"
                                onChange={(e) => { myTotalAmountFrom(e) }}
                                value={formik.values.from_type}
                                className='mb-3 bg-transparent form-control form-select rate_input '
                            >
                                <option value="AUD">AUD</option>
                                <option value="NZD">NZD</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="input_field">
                            <p className="get-text">To<span style={{ color: 'red' }} >*</span></p>
                            <select
                                aria-label="Select a reason"
                                className="mb-3 bg-transparent form-control form-select rate_input"
                                onChange={(e) => { myTotalAmountTo(e) }}
                                value={formik.values.to_type}
                            >
                                {
                                    curr_out.map((item) => {
                                        return (
                                            <option key={item} value={item}>{item}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row each-row">
                    <div className="col-md-6">
                        <div className="input_field">
                            <p className="get-text">Amount Send<span style={{ color: 'red' }} >*</span></p>
                            <input
                                type="text"
                                name="send_amt"
                                value={amt_detail?.send_amt}
                                onChange={(e) => inputvalidation(e)}
                                onKeyDown={(e) => amountDown(e, "From")}
                                className={clsx(
                                    `mb-3 bg-transparent form-control rate-input`,
                                    { 'is-invalid': formik.touched.send_amt && formik.errors.send_amt },
                                    {
                                        'is-valid': formik.touched.send_amt && !formik.errors.send_amt,
                                    }
                                )}
                                onBlurCapture={(e) => amountBlur(e, "From")}
                                placeholder='100'
                            />
                            {formik.touched.send_amt && formik.errors.send_amt === "Minimum $100 required" && (
                                <div className='fv-plugins-message-container mt-1'>
                                    <div className='fv-help-block'>
                                        <span role='alert' className="text-danger" style={{ fontSize: "13px" }}>{formik.errors.send_amt}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="input_field">
                            <p className="get-text">
                                Exchange Amount<span style={{ color: 'red' }} >*</span>
                            </p>
                            <input
                                type="text"
                                name="exchange_amt"
                                value={amt_detail?.exchange_amt}
                                onChange={(e) => inputvalidation(e)}
                                onKeyDown={(e) => amountDown(e, "To")}
                                className={clsx(
                                    `mb-3 bg-transparent form-control rate-input`,
                                    { 'is-invalid': formik.touched.exchange_amt && formik.errors.exchange_amt },
                                    {
                                        'is-valid': formik.touched.exchange_amt && !formik.errors.exchange_amt,
                                    }
                                )}
                                onBlurCapture={(e) => amountBlur(e, "To")}
                                placeholder={defaultExchange !== "" && undefined ? commaSeperator(defaultExchange) : defaultExchange}
                            />
                        </div>
                    </div>
                </div>
                <div className="row each-row">
                    <h5>Receive Method</h5>
                    <div className="col-md-12">
                        <label className="container-new">
                            <span className="radio-tick">Bank Transfer</span>
                            <input
                                className="form-check-input"
                                type="radio"
                                name="recivedMethod"
                                value="Bank Transfer"
                                checked={amt_detail.recieve_meth == "Bank Transfer"}
                                onChange={(e) => { handleRecieveMethod(e) }}
                            />
                            <span className="checkmark"></span>
                        </label>
                    </div>
                    <div className="col-md-12">
                        <label className="container-new">
                            <span className="radio-tick">Mobile Wallet <span className='small'>(coming soon)</span></span>
                            <input
                                className="form-check-input"
                                type="radio"
                                name="recivedMethod"
                                value="Mobile Wallet"
                                checked={amt_detail.recieve_meth == "Mobile Wallet"}
                                onChange={(e) => { handleRecieveMethod(e) }}
                            />
                            <span className="checkmark"></span>
                        </label>
                    </div>

                </div>
                <div className="row each-row">
                    <h5>Payout Partners</h5>
                    <div className="col-md-12">
                        <label className="container-new">
                            <span className="radio-tick">Services <span className='small'>(coming soon)</span></span>
                            <input
                                className="form-check-input"
                                type="radio"
                                name="payOutPartner"
                                checked={amt_detail.part_type == "Services"}
                                value="Services"
                                onChange={(e) => { handlePayoutPart(e, "Services") }}
                            />
                            <span className="checkmark"></span>
                        </label>
                    </div>
                    <div className="col-md-12 ">
                        <Select
                            options={Bank_list}
                            onChange={handlePayoutPart}
                            value={formik.values.part_type !== null ? { label: formik.values.part_type, value: formik.values.part_type } : ""}
                            name='part_type'
                            styles={customStyles}
                            className='payout_part'
                            components={{ Placeholder }}
                            placeholder=""
                        />
                    </div>
                    <div className='col-md-12 '>
                        {
                            formik.values.part_type === "other" ? (
                                <input
                                    type="text"
                                    name="payout_part"
                                    value={formik.values?.payout_part}
                                    maxLength={50}
                                    placeholder='Enter the bank name'
                                    onChange={(e) => customBank(e)}
                                    className={clsx(
                                        'my-3 bg-transparent form-control rate_input',
                                        { 'is-invalid': formik.touched.payout_part && formik.errors.payout_part },
                                        {
                                            'is-valid': formik.touched.payout_part && !formik.errors.payout_part,
                                        }
                                    )}
                                />
                            ) : <></>
                        }
                    </div>
                </div>
                <div className="row ">
                    <div className="col-md-4">
                        <button
                            type='button'
                            className="start-form-button full-col"
                            onClick={() => handleClear()}
                        >Cancel</button>
                    </div>
                    <div className="col-md-8 full-col">
                        <button
                            type="button"
                            onClick={() => formik.handleSubmit()}
                            className="form-button"
                        >
                            Continue
                        </button>
                    </div>
                    {loader ? <>
                        <div className="loader-overly">
                            <div className="loader" >
                            </div>
                        </div>
                    </> : ""}
                </div>
            </div>
        </form>
    );
}

export default AmountDetail