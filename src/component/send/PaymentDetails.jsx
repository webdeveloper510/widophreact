import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useEffect, useState } from 'react'
import { Button, Form, Modal, NavLink, Table } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { loadStripe } from '@stripe/stripe-js'
import { useRef } from 'react'
import { useNavigate } from 'react-router'
import { useFormik } from 'formik'
import * as Yup from 'yup';
import clsx from 'clsx'
import { createAgreement, createPayId, createTransaction, getAgreementList, updateAgreement } from '../../utils/Api'
import { Line } from 'rc-progress'
import { PayIDInst, PayToInst } from '../modals/guideLines'

const PaymentDetails = ({ handleStep, step }) => {

  const [data, setData] = useState({ payment_type: "PayByID", reason: "none" })
  const [modal, setModal] = useState(false)
  const [pay_id_modal, setPayIdModal] = useState({ toggle: false, id: null, payment_id: null })
  const [error, setError] = useState(false)
  const [message, setMessage] = useState('')
  const [pay_to_modal, setPayToModal] = useState(false)
  const [loader, setLoader] = useState(false)
  const [error_modal, setErrorModal] = useState(false)
  const [other_reason, setOtherReason] = useState("")
  const [error_other, setErrorOther] = useState(false)
  const [showIDinst, setShowIDinst] = useState(false)
  const [showToinst, setShowToinst] = useState(false)

  const reason_list = ["Family Support", "Education", "Tax Payment", "Loan Payment", "Travel Payment", "Utility Payment", "Personal Use", "Other"]

  const stripe_key = process.env.REACT_APP_STRIPE_KEY

  const payRef = useRef(null)

  const handleChange = (e) => {
    if (e.target.name === "reason") {
      if (e.target.value === "none") {
        setError(true)
        setMessage("Please select a valid reason")
      } else if (e.target.value !== "Other") {
        setErrorOther(false)
        setOtherReason("")
        setMessage("")
      } else {
        setError(false)
        setMessage("")
      }
      setData({ ...data, reason: e.target.value })
    } else {
      setData({ ...data, payment_type: e.target.value })
    }
  }

  const handleOther = (event) => {
    const result = event.target.value.replace(/[^A-Za-z!@#$%^&*()_+\-=[\]{};':"\\|,.<>/? ]/gi, "");
    setOtherReason(result)
    setErrorOther(false)
    setMessage("")
  }

  const handlePayType = () => {
    if (data.reason !== "none") {
      if (data.reason === "Other" && other_reason.trim() === "") {
        setErrorOther(true)
      } else {
        if (data.payment_type === "Debit/Credit Card") {
          // setModal(true)
          toast.warn("THIS PAYMENT OPTION IS CURRENTLY UNAVAILABLE", { hideProgressBar: true, autoClose: 500, position: "bottom-right" })
        } else if (data.payment_type === "PayByID") {
          setLoader(true)
          let transaction_id = sessionStorage.getItem("transaction_id")
          createPayId({ transaction_id: transaction_id }).then((res) => {
            setLoader(false)
            if (res.code === "200") {
              setPayIdModal({ toggle: true, id: res.data.payid, payment_id: res.data.transaction_id })
            } else if (res.code === "400") {
              toast.error(res.message, { autoClose: 3000, hideProgressBar: true, position: "bottom-right" })
            }
          })
        } else {
          setPayToModal(true)
        }
        let local = JSON.parse(sessionStorage.getItem('transfer_data'))
        let payload = {
          transaction_id: sessionStorage.getItem("transaction_id"),
          amount: {
            send_amount: local?.amount?.send_amt,
            receive_amount: local?.amount?.exchange_amt,
            send_currency: local?.amount?.from_type,
            receive_currency: local?.amount?.to_type,
            receive_method: "Bank transfer",
            payout_partner: local?.amount?.part_type === "other" ? local?.amount?.payout_part : local?.amount?.part_type,
            reason: data.reason !== "Other" ? data.reason : other_reason,
            exchange_rate: local?.amount?.exchange_rate
          },
          recipient_id: sessionStorage.getItem("rid")
        }
        createTransaction(payload)
      }
    } else {
      setError(true)
      setMessage("Please select a valid reason")
    }

  }

  const stripePromise = loadStripe(`${stripe_key}`);

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

  return (
    <>
      <div>

        <div className="form_body">
          <div className="header">
            <h1>Payment details</h1>
          </div>
          <div className="row each-row">
            <h5>Payment type</h5>
            <div className="col-md-12">
              <label className="container-new">
                <span className="radio-tick"><img src="/assets/img/zai/payto.svg" height={24} /> &nbsp;<a onClick={() => setShowToinst(true)}>(click here to learn more...)</a></span>
                <input
                  className="form-check-input"
                  type="radio"
                  name="payment_type"
                  defaultChecked={data.payment_type == "PayTo"}
                  value="PayTo"
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
              </label>
            </div>
            <div className="col-md-12">
              <label className="container-new">
                <span className="radio-tick"><img src="/assets/img/zai/payid.svg" height={25} /> &nbsp;<a onClick={() => setShowIDinst(true)}>(click here to learn more...)</a></span>
                <input
                  className="form-check-input"
                  type="radio"
                  name="payment_type"
                  defaultChecked={data.payment_type == "PayByID"}
                  value="PayByID"
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
              </label>
            </div>
            <div className={`row each-row ${data.reason === "Other" ? "" : "mb-3"}`}>
              <div className="col-md-5">
                <div className="input_field">
                  <p className="get-text">Reason for sending money<span style={{ color: 'red' }} >*</span></p>
                  <select
                    aria-label="Select a reason"
                    name="reason"
                    value={data.reason}
                    onChange={(e) => handleChange(e)}
                    className={`${error && data.reason === "none" ? "is-invalid" : !error && data.reason !== "none" ? "is-valid" : ""} form-control form-select`}
                  >
                    <option value="none">Select a reason</option>
                    {
                      reason_list?.map((item) => (
                        <option value={item}>{item}</option>
                      ))
                    }
                  </select>
                </div>
                <div className='fv-plugins-message-container mt-1'>
                  <div className='fv-help-block'>
                    <span role='alert' className="text-danger">{message}</span>
                  </div>
                </div>
              </div>
              {
                data.reason === "Other" ?
                  (
                    <div className="col-md-5">
                      <div className="input_field">
                        <p className="get-text">Specify the reason<span style={{ color: 'red' }} >*</span></p>
                        <textarea
                          type="text"
                          name="other_reason"
                          value={other_reason}
                          onChange={handleOther}
                          maxLength={50}
                          className={clsx(
                            'form-control bg-transparent',
                            { 'is-invalid': error_other }
                          )}
                        />
                      </div>
                    </div>
                  ) : <></>
              }
            </div>

          </div>
          <div className="row">
            <div className="col-md-4">
              <button className="start-form-button full-col" onClick={() => handleCancel()}>Cancel</button>
            </div>
            <div className="col-md-8 full-col">
              <button className="form-button" onClick={() => handlePayType()}>Continue</button>
              <button className="form-button" onClick={() => handlePrevious()}>Previous</button>
            </div>
          </div>
        </div>
        {
          !loader ? <></> : <div className="loader-overly">
            <div className="loader" >
            </div>
          </div>
        }
      </div>

      <Modal className="modal-card" show={modal} onHide={() => setModal(false)} centered backdrop="static">
        <Modal.Header>
          <Modal.Title className='fs-5'>Debit/Credit Card</Modal.Title>
        </Modal.Header>
        <Modal.Body className='my-4'>
          <Elements stripe={stripePromise}>
            <CheckoutForm
              payRef={payRef}
              method={data.payment_type}
              handleStep={handleStep}
              step={step}
              handleModal={() => setModal(false)}
            />
          </Elements>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModal(false)} >
            Cancel
          </Button>
          <Button type="submit" variant="primary" onClick={() => payRef.current.click()}>
            Continue
          </Button>
        </Modal.Footer>
      </Modal>

      <PayToModal modal={pay_to_modal} handler={(value) => { setPayToModal(value) }} method={data.payment_type} handleStep={handleStep} step={step} authModal={(value) => setErrorModal(value)} />

      <PayIDModal modal={pay_id_modal.toggle} handler={(value) => { setPayIdModal(value) }} data={pay_id_modal} method={data.payment_type} handleStep={handleStep} step={step} />

      <ErrorModal show={error_modal} handleStep={handleStep} step={step} handler={(value) => setErrorModal(value)} />

      <PayIDInst show={showIDinst} handler={() => { setShowIDinst(false) }} />
      <PayToInst show={showToinst} handler={() => { setShowToinst(false) }} />

    </>
  )
}

//---------------------***********-Modal's-***********---------------------//

const CheckoutForm = ({ payRef, method, step, handleStep, handleModal }) => {

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (elements == null) {
      return;
    }
    const token = await stripe.createToken(elements.getElement(CardElement))
    if (token.token) {
      handleModal()
      const local = JSON.parse(sessionStorage.getItem("transfer_data"))
      local.payment = { ...token, payment_type: method }
      sessionStorage.removeItem("transfer_data")
      sessionStorage.setItem("transfer_data", JSON.stringify(local))
      if (sessionStorage.getItem("send-step")) {
        sessionStorage.removeItem("send-step")
      }
      sessionStorage.setItem("send-step", Number(step) + 1)
      handleStep(Number(step) + 1)
    } else if (token.error.code === "card_declined") {
      toast.error("Card Declined", { position: "bottom-right", hideProgressBar: true, autoClose: 2000 })
    } else {
      toast.error("Enter card details to continue", { position: "bottom-right", hideProgressBar: true, autoClose: 2000 })
    }

  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={{ hidePostalCode: true }} />

      <button type="submit" ref={payRef} style={{ display: "none" }} disabled={!stripe || !elements}>
        Pay
      </button>
    </form>
  );
};

const PayIDModal = ({ modal, handler, data, method, step, handleStep }) => {

  const [copied, setCopied] = useState(false)

  const submit = () => {
    handler({ toggle: false, id: null, payment_id: null })
    const local = JSON.parse(sessionStorage.getItem("transfer_data"))
    local.payment = { pay_id: data?.id, payment_id: data?.payment_id, payment_type: method }
    sessionStorage.removeItem("transfer_data")
    sessionStorage.setItem("transfer_data", JSON.stringify(local))
    if (sessionStorage.getItem("send-step")) {
      sessionStorage.removeItem("send-step")
    }
    sessionStorage.setItem("send-step", Number(step) + 1)
    handleStep(Number(step) + 1)
  }

  const copyToClipboard = (value, state) => {
    navigator.clipboard.writeText(value)
    setCopied(state)
  }

  const handleCancel = () => {
    handler({ toggle: false, id: null, payment_id: null })
  }

  return (
    <Modal className="modal-card" show={modal} onHide={() => handler({ toggle: false, id: null, payment_id: null })} centered backdrop="static">
      <Modal.Header>
        <Modal.Title className='fs-5'><img src="/assets/img/zai/payid.svg" height={30} /></Modal.Title>
      </Modal.Header>
      <Modal.Body className='my-4'>
        <div>
          <Table borderless>
            <tbody className='text-start'>
              <tr>
                <th>PayID:</th>
                <td className='text-lowercase text-start'>{data.id}<span>
                  {
                    copied === "payid" ? (
                      <Button type='button' className='mx-2 px-2 py-0 clipboard-button' variant='outline-success' onClick={() => copyToClipboard(data.id, "payid")}>
                        <i className="bi bi-clipboard-check"></i>
                        <span className="tooltip-clipboard">Copied!</span>
                      </Button>
                    ) : (
                      <Button type='button' className='mx-2 px-2 py-0 clipboard-button' variant='outline-secondary' onClick={() => copyToClipboard(data.id, "payid")}>
                        <i className="bi bi-clipboard"></i>
                        <span className="tooltip-clipboard">Copy</span>
                      </Button>
                    )
                  }
                </span></td>
              </tr>
              <tr>
                <th>Transaction ID:</th>
                <td className='text-lowercase text-start'>{data.payment_id}<span>
                  {
                    copied === "payment_id" ? (
                      <Button type='button' className='mx-2 px-2 py-0 clipboard-button' variant='outline-success' onClick={() => copyToClipboard(data.payment_id, "payment_id")}>
                        <i className="bi bi-clipboard-check"></i>
                        <span className="tooltip-clipboard">Copied!</span>
                      </Button>
                    ) : (
                      <Button type='button' className='mx-2 px-2 py-0 clipboard-button' variant='outline-secondary' onClick={() => copyToClipboard(data.payment_id, "payment_id")}>
                        <i className="bi bi-clipboard"></i>
                        <span className="tooltip-clipboard">Copy</span>
                      </Button>
                    )
                  }
                </span></td>
              </tr>
            </tbody>
          </Table>
          <p className='ms-2 small mt-4'>Use your PayID to transfer funds from your online banking platform.<br />Make sure to include the transaction ID in the reference field of your transfer.<span className='text-danger'>*</span>
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => handleCancel()} >
          Previous
        </Button>
        <Button type="click" variant="primary" onClick={() => submit()}>
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

const PayToModal = ({ modal, method, handler, handleStep, step }) => {

  const [disabled, setDisabled] = useState(null)
  const [stage, setStage] = useState(1)
  const [loader, setLoader] = useState(false)
  const [agreement_list, setAgreementList] = useState({})

  const { handleSubmit, handleBlur, values, errors, touched, resetForm, setFieldValue, handleChange, setErrors, getFieldProps } = useFormik({
    initialValues: {
      pay_id: "",
      payid_type: "none",
      bsb: "",
      account_number: "",
      agreement_amount: "1000",
      start_date: "",
    },
    validationSchema: Yup.object().shape({
      payid_type: Yup.string(),
      pay_id: Yup.string().test("value-test", (value, validationcontext) => {
        const {
          createError,
          parent: {
            payid_type,
          },
        } = validationcontext;
        let email_regex = /^[\w-+\.]+@([\w-]+\.)+[\w-]{2,10}$/;
        let teli_regex = /^([0-9]{0,10})$/;
        let aubn_regex = /^[0-9]*$/;
        let orgn_regex = /^(?!.*\s)[a-z]{0,256}$/;
        if (payid_type === "EMAL") {
          if (!email_regex.test(value)) {
            return createError({ message: "Invalid format" })
          } else {
            return true
          }
        } else if (payid_type === "TELI") {
          if (!teli_regex.test(value) || value?.length < 9) {
            return createError({ message: "Invalid format" })
          } else {
            return true
          }
        } else if (payid_type === "AUBN") {
          if (!aubn_regex.test(value) || (value?.length !== 9 && value?.length !== 11)) {
            return createError({ message: "AUBN must be of 9 or 11 digits" })
          } else {
            return true
          }
        } else if (payid_type === "ORGN") {
          if (!orgn_regex.test(value)) {
            return createError({ message: "Invalid format" })
          } else {
            return true
          }
        } else if (payid_type === "none") {
          return true;
        }
      }),
      bsb: Yup.string().length(6, 'BSB must be of 6 digits'),
      account_number: Yup.string().min(5).max(18),
      agreement_amount: Yup.string().notOneOf(['none']),
      start_date: Yup.string(),
    }),
    onSubmit: async (values) => {
      if (Object.keys(agreement_list).length > 0) {
        if (Number(local?.amount?.send_amt) <= Number(values.agreement_amount)) {
          if (agreement_list?.max_amount !== values.agreement_amount) {
            setLoader(true)
            const d = {
              agreement_amount: values.agreement_amount,
              agreement_uuid: agreement_list.agreement_uuid
            }
            handler(false)
            updateAgreement(d).then(res => {
              setLoader(false)
              if (res.code === "200") {
                setLoader(false)
                const local = JSON.parse(sessionStorage.getItem("transfer_data"))
                local.payment = { agreement_uuid: res.data.agreement_uuid, payment_type: method }
                sessionStorage.removeItem("transfer_data")
                sessionStorage.setItem("transfer_data", JSON.stringify(local))
                toast.success(res.message, { position: "bottom-right", autoClose: 3000, hideProgressBar: true })
                getAgreementList().then(res => {
                  if (res.code === "200") {

                    if (sessionStorage.getItem("send-step")) {
                      sessionStorage.removeItem("send-step")
                    }
                    sessionStorage.setItem("send-step", Number(step) + 1)
                    handleStep(Number(step) + 1)

                  }
                })
              } else if (res.code === "400") {

                toast.error(res.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
              }
              else {
                setLoader(false)
                toast.error(res.message, { position: "bottom-right", autoClose: 3000, hideProgressBar: true })
              }
            }).catch((res) => {
              setLoader(false)
              toast.error(res?.message, { position: "bottom-right", autoClose: 3000, hideProgressBar: true })

            })
          } else {
            setLoader(false)
            handler(false)
            const local = JSON.parse(sessionStorage.getItem("transfer_data"))
            local.payment = { agreement_uuid: agreement_list?.agreement_uuid, payment_type: method }
            sessionStorage.removeItem("transfer_data")
            sessionStorage.setItem("transfer_data", JSON.stringify(local))
            if (sessionStorage.getItem("send-step")) {
              sessionStorage.removeItem("send-step")
            }
            sessionStorage.setItem("send-step", Number(step) + 1)
            handleStep(Number(step) + 1)
          }
        } else {
          setErrors({ agreement_amount: "Transfer amount seems to be more than the limit. Please increase the limit" })
        }
      } else {
        if (stage === 1) {
          if ((values.pay_id.length === 0 && values.bsb.length === 0 && values.account_number.length === 0) || (values.bsb.length !== 0 && values.account_number.length === 0) || (values.bsb.length === 0 && values.account_number.length !== 0)) {
            setErrors({ pay_id: "PayID or BSB and Account number is required", bsb: "BSB is required", account_number: "Account number is required" });
          } else if (disabled === "payid" && values.bsb.length < 6) {
            setErrors({ pay_id: "BSB code must be of 6 digits" })
          } else if (disabled === "payid" && values.account_number.length < 5) {
            setErrors({ pay_id: "Account number should be atleast 5 digits" })
          } else {
            setStage(2)
          }
        } else if (stage === 2) {
          if (Number(local?.amount?.send_amt) <= Number(values.agreement_amount)) {
            setStage(3)
          } else {
            setErrors({ agreement_amount: "Transfer amount seems to be more than the limit. Please increase the limit" })
          }
        } else {
          let d = values
          if (disabled === "payid") {
            delete d["pay_id"]
            delete d["payid_type"]
          } else {
            delete d["bsb"]
            delete d["account_number"]
            if (d.payid_type === "TELI") {
              let pay_id = parseInt(d.pay_id, 10)
              d.pay_id = pay_id
            }
          }
          let local = JSON.parse(sessionStorage.getItem("transfer_data"));
          setLoader(true)
          createAgreement(d).then(res => {
            if (res.code === "200") {
              setLoader(false)
              handler(false)
              const local = JSON.parse(sessionStorage.getItem("transfer_data"))
              local.payment = { agreement_uuid: res.data.agreement_uuid, payment_type: method }
              sessionStorage.removeItem("transfer_data")
              sessionStorage.setItem("transfer_data", JSON.stringify(local))
              toast.success(res.message, { position: "bottom-right", autoClose: 3000, hideProgressBar: true })
              getAgreementList().then(res => {
                if (sessionStorage.getItem("send-step")) {
                  sessionStorage.removeItem("send-step")
                }
                sessionStorage.setItem("send-step", Number(step) + 1)
                handleStep(Number(step) + 1)
              })
            } else if (res.code === "400") {
              setLoader(false)
              toast.error(res.message, { position: "bottom-right", autoClose: 3000, hideProgressBar: true })
            } else {
              setLoader(false)
              toast.error(res.message, { position: "bottom-right", autoClose: 3000, hideProgressBar: true })
            }
          }).catch((res) => {
            setLoader(false)
            toast.error(res?.message, { position: "bottom-right", autoClose: 3000, hideProgressBar: true })

          })
        }
      }
    }
  })

  const payIdRef = useRef()
  let local = JSON.parse(sessionStorage.getItem("transfer_data"))

  useEffect(() => {
    if (values.pay_id === "" && values.account_number === "" && values.bsb === "") {
      setDisabled(null)
    } else if (values.pay_id === "" && (values.account_number !== "" || values.bsb !== "")) {
      setDisabled("payid")
    } else if (values.pay_id !== "" && (values.account_number === "" || values.bsb === "")) {
      setDisabled("bsb")
    }
  }, [values])


  const startDate = () => {
    var dtToday = new Date().toLocaleString("en-IN", { timeZone: "Australia/Sydney" }).replace(/\//g, "-").split(",")
    var date = dtToday[0].split("-")
    var month = date[1]
    var day = date[0];
    var year = date[2]
    if (month < 10)
      month = '0' + month.toString();
    if (day < 10)
      day = '0' + day.toString()
    var maxDate = year + '-' + month + '-' + day;
    setFieldValue("start_date", maxDate)
  }

  const agreementList = () => {
    getAgreementList().then(res => {
      if (res.code === "200") {
        setAgreementList(res.data)
        setFieldValue("agreement_amount", res?.data?.max_amount)
      } else {
        setAgreementList({})
      }
    })
  }

  useEffect(() => {
    agreementList()
    startDate()
  }, [modal])

  const handleBSB = (event) => {
    const regex = /^[0-9]*$/;
    let userInput = event.target.value;
    if (!regex.test(userInput)) {
      const filteredInput = userInput.replace(/[^0-9]/g, '');
      userInput = filteredInput
    }
    setFieldValue(event.target.name, userInput)
    setFieldValue("payid_type", "none")

  }

  const displayStart = () => {
    if (agreement_list?.agreement_start_date) {
      let date = agreement_list.agreement_start_date.split("-");
      return date[2] + "-" + date[1] + "-" + date[0]
    } else {
      let date = values.start_date.split("-");
      return date[2] + "-" + date[1] + "-" + date[0]
    }
  }

  const handleCancel = () => {
    resetForm()
    setStage(1)
    setDisabled(null)
    handler(false)
    // agreementList()
  }

  const handlePayID = (event) => {
    let target = event.target
    if (values.payid_type === "EMAL") {
      const regex = /^[A-Za-z0-9._%+-@]*$/;
      let userInput = event.target.value;
      if (!regex.test(userInput)) {
        const filteredInput = userInput.replace(/[^A-Za-z0-9._%+-@]/g, '');
        userInput = filteredInput;
      } else {
        userInput = userInput.replace(/^[\s]/g, '');
      }
      setFieldValue(target.name, userInput)
    } else if (values.payid_type === "TELI") {
      let regex = /^([0-9]{0,10})$/
      if (regex.test(target.value)) {
        setFieldValue("pay_id", target.value)
      }
    } else if (values.payid_type === "AUBN" && target.value.length <= 11) {
      const regex = /^[0-9]*$/;
      let userInput = event.target.value;
      if (!regex.test(userInput)) {
        const filteredInput = userInput.replace(/[^0-9]/g, '');
        userInput = filteredInput
      }
      setFieldValue(event.target.name, userInput)
    } else if (values.payid_type === "ORGN") {
      let regex = /^(?!.*\s)[a-z]{0,256}$/
      if (regex.test(target.value)) {
        setFieldValue("pay_id", target.value)
      }
    }
  }

  const handleType = (event) => {
    setFieldValue("payid_type", event.target.value)
    setFieldValue("pay_id", "")
  }

  // const createNew = () => {
  //   resetForm()
  //   setAgreementList([])
  //   setStage(1)
  //   startDate()
  // }

  return (
    <>
      {loader ? <>
        < div className="loader-overly" >
          <div className="loader" >
          </div>
        </div >
      </> : (
        <Modal className="modal-card" show={modal} onHide={() => handleCancel()} centered backdrop="static">
          <Modal.Header>
            <Modal.Title className='fs-5'><img src="/assets/img/zai/payto.svg" height={30} /></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              Object.keys(agreement_list).length > 0 ? (
                <>
                  <h5 style={{ color: "#6414E9" }} className='my-3'>PayTo Agreement Details</h5>
                  <Table className='agreement_table'>
                    <tbody>
                      {
                        agreement_list?.account_id_type === "PAYID" ? (
                          <tr>
                            <th>
                              PayID
                            </th>
                            <td className='text-start'>{agreement_list?.payid}</td>
                          </tr>
                        ) : (
                          <>
                            <tr>
                              <th>
                                BSB Code
                              </th>
                              <td className='text-start'>{agreement_list?.bsb_code}</td>
                            </tr>
                            <tr>
                              <th>Account Number</th>
                              <td className='text-start'>{agreement_list?.account_number}</td>
                            </tr>
                          </>
                        )
                      }
                      <tr>
                        <th>Transfer Amount</th>
                        <td className='text-start'>{local?.amount?.from_type} {local?.amount?.send_amt}</td>
                      </tr>
                      <tr>
                        <th>Amount Limit</th>
                        <td className='text-start'>
                          <form onSubmit={handleSubmit}>
                            <select
                              name='agreement_amount'
                              value={values.agreement_amount}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={clsx(
                                'form-control w-100',
                                { 'is-invalid': touched.agreement_amount && errors.agreement_amount }
                              )}
                            >
                              <option value="1000">Upto AUD 1k per transaction</option>
                              <option value="5000">Upto AUD 5k per transaction</option>
                              <option value="10000">Upto AUD 10k per transaction</option>
                              <option value="30000">Upto AUD 30k per transaction</option>
                            </select>
                            <button type="submit" ref={payIdRef} style={{ display: "none" }}>submit</button>
                          </form>
                        </td>
                      </tr>
                      <tr>
                        <th>Start Date</th>
                        <td className='text-start'>{displayStart()}</td>
                      </tr>
                    </tbody>
                  </Table>
                </>
              ) : (
                <>
                  <div className='my-2'>

                    {stage === 1 || stage === 2 ? (
                      <>
                        <p className='small mb-3'>Set up a PayTo agreement to pay directly from your bank account. Use PayID or BSB and account number.</p>
                        <form onSubmit={handleSubmit} noValidate>
                          {
                            stage === 1 ? (
                              <>
                                <div className="input_field">
                                  <p className="get-text fs-6 mb-1">PayID type<span style={{ color: 'red' }} >*</span></p>
                                  <select
                                    name='payid_type'
                                    value={values.payid_type}
                                    onChange={handleType}
                                    onBlur={handleBlur}
                                    disabled={disabled === "payid"}
                                    placeholder='Select payID type'
                                    className={clsx(
                                      'form-control mx-2 w-75',
                                      { 'is-invalid': touched.payid_type && errors.payid_type && disabled !== "payid" }
                                    )}
                                  >
                                    <option value="none">Select PayID type</option>
                                    <option value="EMAL">EMAIL - Email Address</option>
                                    <option value="TELI">TEL - Telephone Number</option>
                                    <option value="AUBN">AUBN - Australian Business Number</option>
                                    <option value="ORGN">ORGN - Organisational Identifier</option>
                                  </select>

                                </div>
                                <div className="input_field">
                                  <p className="get-text fs-6 mb-1">PayID<span style={{ color: 'red' }} >*</span></p>
                                  <input
                                    type="text"
                                    maxLength={values.payid_type === "EMAL" || "ORGN" ? "256" : values.payid_type === "TELI" ? "10" : "11"}
                                    name='pay_id'
                                    value={values.pay_id}
                                    onChange={handlePayID}
                                    onBlur={handleBlur}
                                    readOnly={disabled === "payid" || values.payid_type === "none"}
                                    placeholder={values.payid_type === "none" ? "Select a payID type" : "Enter Your PayID"}
                                    className={clsx(
                                      'form-control mx-2 w-75',
                                      { 'is-invalid': touched.pay_id && errors.pay_id && disabled !== "payid" }
                                    )}
                                  />

                                </div>
                                <p className='text-center'>OR</p>
                                <div className="input_field">
                                  <p className="get-text fs-6 mb-1">BSB<span style={{ color: 'red' }} >*</span></p>
                                  <input
                                    type="text"
                                    maxLength="6"
                                    name='bsb'
                                    value={values.bsb}
                                    onChange={handleBSB}
                                    onBlur={handleBlur}
                                    readOnly={disabled === "bsb"}
                                    placeholder='Enter Your BSB number'
                                    className={clsx(
                                      'form-control mx-2 w-75',
                                      { 'is-invalid': touched.bsb && errors.bsb && disabled !== "bsb" }
                                    )}
                                  />
                                </div>
                                <div className="input_field">
                                  <p className="get-text fs-6 mb-1">Account No.<span style={{ color: 'red' }} >*</span></p>
                                  <input
                                    type="text"
                                    maxLength="18"
                                    name='account_number'
                                    value={values.account_number}
                                    onChange={handleBSB}
                                    onBlur={handleBlur}
                                    readOnly={disabled === "bsb"}
                                    placeholder='Enter Your account number'
                                    className={clsx(
                                      'form-control mx-2 w-75',
                                      { 'is-invalid': touched.account_number && errors.account_number && disabled !== "bsb" }
                                    )}
                                  />
                                </div>
                                {errors.pay_id && (
                                  <div className='fv-plugins-message-container small mx-3 mt-1'>
                                    <div className='fv-help-block'>
                                      <span role='alert' className="text-danger">{errors.pay_id}</span>
                                    </div>
                                  </div>
                                )}
                              </>
                            ) : (
                              <>
                                {
                                  disabled === "payid" ? (
                                    <> <div className="input_field">
                                      <p className="get-text fs-6 mb-1">BSB<span style={{ color: 'red' }} >*</span></p>
                                      <input
                                        type="text"
                                        maxLength="6"
                                        name='bsb'
                                        value={values.bsb}
                                        onChange={handleBSB}
                                        onBlur={handleBlur}
                                        readOnly
                                        placeholder='Enter Your BSB number'
                                        className={clsx(
                                          'form-control mx-2 w-75',
                                          { 'is-invalid': touched.bsb && errors.bsb && disabled !== "bsb" }
                                        )}
                                      />
                                    </div>
                                      <div className="input_field">
                                        <p className="get-text fs-6 mb-1">Account No.<span style={{ color: 'red' }} >*</span></p>
                                        <input
                                          type="text"
                                          maxLength="40"
                                          name='account_number'
                                          value={values.account_number}
                                          onChange={handleBSB}
                                          onBlur={handleBlur}
                                          readOnly
                                          placeholder='Enter Your account number'
                                          className={clsx(
                                            'form-control mx-2 w-75',
                                            { 'is-invalid': touched.account_number && errors.account_number && disabled !== "bsb" }
                                          )}
                                        />
                                      </div> </>
                                  ) : (
                                    <>
                                      <div className="input_field">
                                        <p className="get-text fs-6 mb-1">PayID<span style={{ color: 'red' }} >*</span></p>
                                        <input
                                          type="text"
                                          maxLength="40"
                                          name='pay_id'
                                          value={values.pay_id}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          readOnly
                                          placeholder='Enter Your PayID'
                                          className={clsx(
                                            'form-control mx-2 w-75',
                                            { 'is-invalid': touched.pay_id && errors.pay_id && disabled !== "payid" }

                                          )}
                                        />
                                        {errors.pay_id}
                                      </div>
                                    </>
                                  )
                                }
                                <div className="input_field">
                                  <p className="get-text fs-6 mb-1">Amount Limit<span style={{ color: 'red' }} >*</span></p>
                                  <select
                                    name='agreement_amount'
                                    value={values.agreement_amount}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={clsx(
                                      'form-control mx-2 w-75',
                                      { 'is-invalid': touched.agreement_amount && errors.agreement_amount }
                                    )}
                                  >
                                    <option value="1000">Upto AUD 1k per transaction</option>
                                    <option value="5000">Upto AUD 5k per transaction</option>
                                    <option value="10000">Upto AUD 10k per transaction</option>
                                    <option value="30000">Upto AUD 30k per transaction</option>
                                  </select>
                                </div>
                                <div className="input_field">
                                  <p className="get-text fs-6 mb-1">Start Date<span style={{ color: 'red' }} >*</span></p>
                                  <input
                                    type="date"
                                    value={values.start_date}
                                    readOnly
                                    className={clsx(
                                      'form-control mx-2 w-75'
                                    )}
                                  />
                                </div>

                              </>
                            )
                          }
                          <button type="submit" ref={payIdRef} style={{ display: "none" }}>submit</button>
                        </form>
                      </>
                    ) : (
                      <>
                        <h5 style={{ color: "#6414E9" }} className='my-3'>PayTo Agreement Details</h5>
                        <p className='small my-3'>Please check the PayTo agreement details below before submitting.</p>
                        <form onSubmit={handleSubmit}>
                          <Table className='agreement_table'>
                            <tbody>
                              {
                                disabled === "payid" ? (
                                  <>
                                    <tr>
                                      <th>BSB</th>
                                      <td className='text-start'>{values.bsb}</td>
                                    </tr>
                                    <tr>
                                      <th>Account No.</th>
                                      <td className='text-start'>{values.account_number}</td>
                                    </tr>
                                  </>
                                ) : (
                                  <>
                                    <tr>
                                      <th>PayID</th>
                                      <td className='text-start'>{values.pay_id}</td>
                                    </tr>
                                  </>
                                )
                              }
                              <tr>
                                <th>Amount Limit</th>
                                <td className='text-start'>Upto AUD {
                                  values.agreement_amount === '1000' ? '1k' :
                                    values.agreement_amount === '5000' ? '5k' :
                                      values.agreement_amount === '10000' ? '10k' :
                                        '30k'
                                } per transaction</td>
                              </tr>
                              <tr>
                                <th>Agreement Type</th>
                                <td className='text-start'>Variable</td>
                              </tr>
                              <tr>
                                <th>Frequency</th>
                                <td className='text-start'>Ad-hoc</td>
                              </tr>
                              <tr>
                                <th>Start Date</th>
                                <td className='text-start'>{displayStart()}</td>
                              </tr>
                            </tbody>
                          </Table>
                          <button type="submit" ref={payIdRef} style={{ display: "none" }}>submit</button>
                        </form>
                      </>
                    )
                    }
                  </div>
                </>
              )
            }
            {errors.agreement_amount && (
              <div className='fv-plugins-message-container small mx-3 mt-1'>
                <div className='fv-help-block'>
                  <span role='alert' className="text-danger">{errors.agreement_amount}</span>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => handleCancel()} >
              Cancel
            </Button>
            {/* {

              Object.keys(agreement_list).length > 0 ? (
                <Button type="click" variant='primary' onClick={() => createNew()}>
                  Create New
                </Button>
              ) : <></>
            } */}
            <Button type="click" variant="primary" onClick={() => payIdRef.current.click()}>
              {Object.keys(agreement_list).length > 0 && Number(agreement_list?.max_amount) !== Number(values.agreement_amount) ? "Update Agreement" : stage === 3 ? "Create Agreement" : "Continue"}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  )
}

const ErrorModal = ({ show, handler, handleStep, step }) => {

  const [bar_fill, setBarFill] = useState(0)
  var timer;

  useEffect(() => {
    if (bar_fill <= 100 && show === true) {
      setTimeout(() => {
        setBarFill(bar_fill + 1);
      }, 9000)
    } else if (show === true) {
      clearInterval(timer)
      handler(false)
      handleContinue()
    }
  }, [bar_fill, show])

  useEffect(() => {
    let timer;
    if (show === true) {
      timer = setInterval(() => {
        getAgreementList().then(res => {
          if (res.code === "200") {
            if (res.data.status === "active") {
              clearInterval(timer)
              toast.success("Agreement authorized", { position: "bottom-right", hideProgressBar: true, autoClose: 3000 })
              handleContinue()
            }
          }
        })
      }, 5000)
    } else {
      clearInterval(timer)
    }

    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [show])

  const handleContinue = () => {
    clearInterval(timer)
    handler(false)
    if (sessionStorage.getItem("send-step")) {
      sessionStorage.removeItem("send-step")
    }
    sessionStorage.setItem("send-step", Number(step) + 1)
    handleStep(Number(step) + 1)
  }

  const handlePrevious = () => {
    clearInterval(timer)
    handler(false)
  }

  return (
    <>
      <Modal show={show} backdrop="static" centered>
        <Modal.Body className='text-center ' >
          <div className='py-5 border'>
            <h4 style={{ color: "#6414e9" }} className='fw-bold'>Authorization pending</h4>
            <p className='my-3'>Please authorize your PayTo agreement on your respective banking portal.</p>
            <div className='my-2 px-2'>
              <Line percent={bar_fill} strokeWidth={2} trailWidth={2} strokeColor={"#6414E9"} />
            </div>
            <p>Waiting time : <b>15 minutes.</b></p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => handlePrevious()} >
            Previous
          </Button>
          <Button type="click" variant="primary" onClick={() => handleContinue()}>
            Continue
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default PaymentDetails