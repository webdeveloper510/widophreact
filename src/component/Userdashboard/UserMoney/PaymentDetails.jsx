import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useState } from 'react'
import { Button, Modal, Table } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { loadStripe } from '@stripe/stripe-js'
import { useRef } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { NavLink } from 'react-bootstrap'
import { BsCheckCircleFill } from 'react-icons/bs'
import { useEffect } from 'react'
import PopVerify from '../../verification/PopVerify'
import { useFormik } from 'formik'
import * as Yup from 'yup';
import clsx from 'clsx'
import { ZaiPayId, ZaiPayTo, createAgreement, createPayId, createTransaction, getAgreementList, getDiscountedPrice, updateAgreement, userCharge, userProfile, validatePayId, verifyPayTo } from '../../../utils/Api'
import { Line } from 'rc-progress'
import { commaSeperator } from '../../../utils/hook'
import TransactionConfirm from '../../modals/TransactionConfirm'
import { Link } from 'react-router-dom'
import { PayIdInstructions, PayToInstructions } from '../../modals/Instructions'
import { PayIDInst, PayToInst } from '../../modals/guideLines'
import ReviewYourTransfer from '../../modals/ReviewYourTransfer'


const stripe_key = process.env.REACT_APP_STRIPE_KEY
const serverUrl = process.env.REACT_APP_API_URL
const PaymentDetails = ({ handleStep, step }) => {

  const [data, setData] = useState({ payment_type: "PayByID", reason: "none" })
  const [modal, setModal] = useState(false)
  const [pay_id_modal, setPayIdModal] = useState({ toggle: false, id: null, payment_id: null })
  const [pay_to_modal, setPayToModal] = useState(false)
  const [pay_id_data, setPayIdData] = useState({ id: "", payment_id: null })
  const [pay_to_data, setPayToData] = useState({ agreement_uuid: "" })
  const [userData, setUserData] = useState({})
  const [open_modal, setOpenModal] = useState(false)
  const [is_otp_verified, setIsOtpVerfied] = useState(false)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState("")
  const payRef = useRef(null)
  const navigate = useNavigate()
  const [transaction, setTransaction] = useState({ id: "", status: "", amount: "", curr: "", pay_id: "", type: "" })
  const [modalView, setModalView] = useState(false)
  const [loader, setLoader] = useState(false)
  const [token, setToken] = useState({})
  const [error_modal, setErrorModal] = useState(false)
  const [other_reason, setOtherReason] = useState("")
  const [error_other, setErrorOther] = useState(false)
  const [display_confirm, setDisplayConfirm] = useState({ toggle: false, data: null })
  let local = JSON.parse(sessionStorage.getItem("transfer_data"))
  const [display_value, setDisplayValue] = useState({ amount: local?.amount?.send_amt || "", currency: local?.amount?.from_type || "", first_name: local?.recipient?.first_name || "", last_name: local?.recipient?.last_name || "" })
  const [show_payid_inst, setShowIDinst] = useState(false)
  const [show_payto_inst, setShowToinst] = useState(false)
  const [discounts, setDiscounts] = useState({})

  const stripePromise = loadStripe(`${stripe_key}`);

  const reason_list = ["Family Support", "Education", "Tax Payment", "Loan Payment", "Travel Payment", "Utility Payment", "Personal Use", "Other"]



  useEffect(() => {
    if (transaction.id) {
      setModalView(true)
    }
  }, [transaction])

  const handleOther = (event) => {
    const result = event.target.value.replace(/[^A-Za-z!@#$%^&*()_+\-=[\]{};':"\\|,.<>/? ]/gi, "");
    setOtherReason(result)
    setErrorOther(false)
    setMessage("")
  }

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

  const handlePayType = () => {

    if (data.reason !== "none") {

      if (data.reason === "Other" && (other_reason.trim() === "")) {
        setErrorOther(true)
      } else {
        if (data.payment_type === "Debit/Credit Card") {
          // setModal(true)
          toast.warn("THIS PAYMENT OPTION IS CURRENTLY UNAVAILABLE", { hideProgressBar: true, autoClose: 500, position: "bottom-right" })
        } else if (data.payment_type === "PayByID") {
          setLoader(true)
          let local = JSON.parse(sessionStorage.getItem("transfer_data"))
          let transaction_id = sessionStorage.getItem("transaction_id")
          let d = {}
          if (transaction_id) {
            d = {
              payment_id: transaction_id,
              recipient_id: local?.recipient?.id,
              amount: {
                send_amount: Number(local?.amount?.send_amt),
                receive_amount: local?.amount?.exchange_amt,
                send_currency: local?.amount?.from_type,
                receive_currency: local?.amount?.to_type,
                send_method: "PayByID",
                receive_method: "Bank transfer",
                payout_partner: local?.amount?.payout_part,
                reason: data.reason !== "Other" ? data.reason : other_reason,
                exchange_rate: local?.amount?.exchange_rate
              }
            }
          } else {
            d = {
              recipient_id: local?.recipient?.id,
              sender: {
                First_name: userData?.First_name,
                Middle_name: userData?.Middle_name,
                Last_name: userData?.Last_name,
                Date_of_birth: userData?.Date_of_birth,
                Gender: "M",
                Country_of_birth: userData?.Country_of_birth,
                occupation: userData?.occupation,
                payment_per_annum: userData?.payment_per_annum,
                value_per_annum: userData?.value_per_annum,
              },
              sender_address: {
                flat: userData?.flat,
                building: userData?.building,
                street: userData?.street,
                postcode: userData?.postcode,
                city: userData?.city,
                state: userData?.state,
                country: userData?.country,
                country_code: userData?.country_code
              },
              amount: {
                send_amount: Number(local?.amount?.send_amt),
                receive_amount: local?.amount?.exchange_amt,
                send_currency: local?.amount?.from_type,
                receive_currency: local?.amount?.to_type,
                send_method: "stripe",
                receive_method: "Bank transfer",
                payout_partner: local?.amount?.payout_part,
                reason: data.reason !== "Other" ? data.reason : other_reason,
                exchange_rate: local?.amount?.exchange_rate
              }
            }
          }
          if (d?.sender?.Middle_name === "" || d?.sender?.Middle_name === undefined || d?.sender?.Middle_name === null) {
            delete d?.sender?.Middle_name
          }
          if (d?.sender_address?.flat === "" || d?.sender_address?.flat === null || d?.sender_address?.flat === undefined) {
            delete d?.sender_address?.flat
          }
          createPayId({ transaction_id: sessionStorage.getItem("transaction_id") }).then((res) => {
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
        let storage = JSON.parse(sessionStorage.getItem('transfer_data'))
        let payload = {
          transaction_id: sessionStorage.getItem("transaction_id"),
          amount: {
            send_amount: storage?.amount?.send_amt,
            receive_amount: storage?.amount?.exchange_amt,
            send_currency: storage?.amount?.from_type,
            receive_currency: storage?.amount?.to_type,
            receive_method: "Bank transfer",
            payout_partner: storage?.amount?.part_type === "other" ? storage?.amount?.payout_part : storage?.amount?.part_type,
            reason: data.reason !== "Other" ? data.reason : other_reason,
            exchange_rate: storage?.amount?.exchange_rate
          },
          recipient_id: storage?.recipient?.id
        }
        createTransaction(payload)
      }
    } else {
      setError(true)
      setMessage("Please select a valid reason")
    }
  }

  const handleOtpVerification = (value) => {
    setIsOtpVerfied(value)
  }
  const handleCancel = () => {
    sessionStorage.removeItem("send-step")
    sessionStorage.removeItem("transfer_data")
    sessionStorage.removeItem("reason")
    window.location.reload()
  }

  const handlePrevious = () => {
    sessionStorage.removeItem("send-step")
    sessionStorage.setItem("send-step", Number(step) - 1)
    handleStep(Number(step) - 1);
  }

  const handleModals = () => {
    setModal(!modal)
    setOpenModal(true)
  }

  const OpenConfirmation = (value) => {
    let storage = JSON.parse(sessionStorage.getItem("transfer_data"))
    // console.log(data)
    setDisplayConfirm({ toggle: true, data: { amount: storage?.amount, recipient: storage?.recipient, receive_method: data?.payment_type, reason: data?.reason === "Other" ? other_reason : data.reason, pay_id: value } })
  }

  useEffect(() => {
    userProfile().then(res => {
      if (res.code === "200") {
        setUserData(res.data)
      }
    })
    let transaction_id = sessionStorage.getItem("transaction_id")
    // getDiscountedPrice(transaction_id).then(res => {
    //   setDiscounts(res.data)
    // })
  }, [])

  useEffect(() => {
    if (is_otp_verified) {
      const local = JSON.parse(sessionStorage.getItem("transfer_data"))

      if (data.payment_type === "PayByID" || data.payment_type === "PayTo") {
        setLoader(true)

        if (data.payment_type === "PayByID") {
          let discount_value = JSON.parse(sessionStorage.getItem("discApp"))
          ZaiPayId({ transaction_id: pay_id_data.payment_id, referral_meta_id: discount_value?.value?.referral_meta_id }).then(res => {
            if (res.code === "200") {
              setTransaction({ id: res.data.transaction_id, pay_id: pay_id_data.id, status: res?.message, amount: local?.amount?.send_amt, curr: local?.amount?.from_type, type: "pay_id" })
              setDiscounts({ final_amount: res.data.final_amount })
              sessionStorage.removeItem("transfer_data")
              sessionStorage.removeItem("discApp")
              sessionStorage.removeItem("conversion_data")
              if (sessionStorage.getItem("send-step")) {
                sessionStorage.removeItem("send-step")
              }
              sessionStorage.removeItem("transaction_id")
              sessionStorage.removeItem("rid")
              setIsOtpVerfied(false)
              setLoader(false)
            } else if (res.code === "400") {
              toast.error(res.message, { position: "bottom-right", autoClose: 3000, hideProgressBar: true })
            }
            else {
              setLoader(false)
              setIsOtpVerfied(false)
              toast.error(res.message, { position: "bottom-right", autoClose: 3000, hideProgressBar: true })
              sessionStorage.removeItem("transfer_data")
              sessionStorage.removeItem("conversion_data")
              if (sessionStorage.getItem("send-step")) {
                sessionStorage.removeItem("send-step")
              }
              sessionStorage.removeItem("transaction_id")
              sessionStorage.removeItem("rid")
              setTimeout(() => {
                window.location.reload()
              }, 3 * 1000)
            }
          }).catch((err) => {
            setLoader(false)
            setIsOtpVerfied(false)
            toast.error("Transaction failed, please try again", { position: "bottom-right", autoClose: 3000, hideProgressBar: true })
            sessionStorage.removeItem("transfer_data")
            sessionStorage.removeItem("transaction_id")
            sessionStorage.removeItem("rid")
            if (sessionStorage.getItem("send-step")) {
              sessionStorage.removeItem("send-step")
            }
            setTimeout(() => {
              window.location.reload()
            }, 3 * 1000)
          })
        } else {
          let discount_value = JSON.parse(sessionStorage.getItem("discApp"))

          ZaiPayTo({ agreement_uuid: pay_to_data.agreement_uuid, transaction_id: sessionStorage.getItem("transaction_id"), referral_meta_id: discount_value?.value?.referral_meta_id }).then(res => {
            setLoader(false)
            if (res.code == "200") {
              setTransaction({ id: res.data.transaction_id, pay_id: null, status: res?.message, amount: local?.amount?.send_amt, curr: local?.amount?.from_type, type: "pay_to" })
              setDiscounts({ final_amount: res.data.final_amount })
              sessionStorage.removeItem("transfer_data")
              sessionStorage.removeItem("conversion_data")
              sessionStorage.removeItem("discApp")
              if (sessionStorage.getItem("send-step")) {
                sessionStorage.removeItem("send-step")
              }
              setIsOtpVerfied(false)
              sessionStorage.removeItem("transaction_id")
              sessionStorage.removeItem("rid")
              setLoader(false)
            } else if (res.code === "400") {
              setTransaction({ id: res.data.transaction_id, pay_id: null, status: res?.message, amount: local?.amount?.send_amt, curr: local?.amount?.from_type, type: "pay_to" })
              // toast.error(res.message, { position: "bottom-right", hideProgressBar: true, autoClose: 3000 })
              setDiscounts({ final_amount: res.data.final_amount })
              sessionStorage.removeItem("transfer_data")
              sessionStorage.removeItem("conversion_data")
              if (sessionStorage.getItem("send-step")) {
                sessionStorage.removeItem("send-step")
              }
              sessionStorage.removeItem("transaction_id")
              sessionStorage.removeItem("rid")
              setIsOtpVerfied(false)
              setLoader(false)
            }
            else {
              setLoader(false)
              setIsOtpVerfied(false)
              toast.error(res.message, { position: "bottom-right", autoClose: 3000, hideProgressBar: true })
              sessionStorage.removeItem("transfer_data")
              sessionStorage.removeItem("conversion_data")
              if (sessionStorage.getItem("send-step")) {
                sessionStorage.removeItem("send-step")
              }
              sessionStorage.removeItem("transaction_id")
              sessionStorage.removeItem("rid")
              setTimeout(() => {
                window.location.reload()
              }, 3 * 1000)
            }
          }).catch((err) => {

            setLoader(false)
            setIsOtpVerfied(false)
            toast.error("Transaction failed, please try again", { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
            sessionStorage.removeItem("transfer_data")
            sessionStorage.removeItem("conversion_data")
            if (sessionStorage.getItem("send-step")) {
              sessionStorage.removeItem("send-step")
            }
            setTimeout(() => {
              window.location.reload()
            }, 3 * 1000)
          })
        }
      } else {
        setLoader(true)
        userCharge({ card_token: token.id, transaction_id: sessionStorage.getItem("transaction_id") }).then(res => {
          setLoader(false)
          if (res.code == "200") {
            setTransaction({ id: res?.data?.transaction_id, pay_id: null, status: res?.message, amount: local?.amount?.send_amt, curr: local?.amount?.from_type, type: "stripe" })

            sessionStorage.removeItem("transfer_data")
            sessionStorage.removeItem("conversion_data")
            if (sessionStorage.getItem("send-step")) {
              sessionStorage.removeItem("send-step")
            }
            setIsOtpVerfied(false)
            sessionStorage.removeItem("transaction_id")
            sessionStorage.removeItem("rid")
          } else if (res.code === "400") {
            toast.error(res.message, { position: "bottom-right", autoClose: 5000, hideProgressBar: true })
            sessionStorage.removeItem("transaction_id")
            sessionStorage.removeItem("rid")
          } else {
            toast.error("We are looking into the issue , please try later", { position: "bottom-right", autoClose: 3000, hideProgressBar: true })
            sessionStorage.removeItem("transaction_id")
            sessionStorage.removeItem("rid")
          }
        }).catch((err) => {
          setLoader(false)
          setIsOtpVerfied(false)
          sessionStorage.removeItem("transfer_data")
          sessionStorage.removeItem("conversion_data")
          if (sessionStorage.getItem("send-step")) {
            sessionStorage.removeItem("send-step")
          }
          toast.error("Transaction failed, please try again", { position: "bottom-right", autoClose: 3000, hideProgressBar: true })
          setTimeout(() => {
            window.location.reload()
          }, 3 * 1000)
          sessionStorage.removeItem("transaction_id")
          sessionStorage.removeItem("rid")
        })
      }
    }
  }, [is_otp_verified])

  const handleConfirmation = () => {
    setOpenModal(true)
  }

  return (
    <>
      {
        !loader ?
          (
            <>
              {
                display_confirm.toggle === false && modalView === false ? (
                  <section>
                    <div className="form-head mb-4">
                      <h2 className="text-black font-w600 mb-0"><b>Payment details</b>
                      </h2>
                    </div>
                    <div className="form_body">
                      <p className='float-end text-capitalize col-12 fw-bold' style={{ color: "#6414E9" }}> Sending ⇒  {display_value?.currency} {display_value?.amount !== "" ? commaSeperator(display_value?.amount) : display_value?.amount}</p>
                      <p className='float-end text-capitalize col-12 fw-bold' style={{ color: "#6414E9" }}> To  ⇒ {display_value?.first_name} {display_value?.last_name}</p>
                      <br></br>
                      <br></br>
                      <div className="row each-row">
                        <h5>Payment type</h5>
                        <div className="col-md-12">
                          <label className="container-new">
                            <span className="radio-tick"><img src="/assets/img/zai/payto.svg" height={25} /> &nbsp;&nbsp;<a onClick={() => setShowToinst(true)}>(click here to learn more about PayTO)</a></span>
                            <input
                              className="form-check-input"
                              type="radio"
                              name="Payment Type"
                              defaultChecked={data.payment_type == "PayTo"}
                              value="PayTo"
                              onChange={handleChange}
                            />
                            <span className="checkmark"></span>
                          </label>
                        </div>
                        <div className="col-md-12">
                          <label className="container-new">
                            <span className="radio-tick"><img src="/assets/img/zai/payid.svg" height={25} />&nbsp;&nbsp;<a onClick={() => setShowIDinst(true)}>(click here to learn more about PayID)</a></span>
                            <input
                              className="form-check-input"
                              type="radio"
                              name="Payment Type"
                              defaultChecked={data.payment_type == "PayByID"}
                              value="PayByID"
                              onChange={handleChange}
                            />
                            <span className="checkmark"></span>
                          </label>
                        </div>
                      </div>
                      <div className="row each-row mb-3">
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
                      {
                        modalView === true ? (
                          <></>
                        ) : (
                          <div className="row">
                            <div className="col-md-4">
                              <button type="button" className="start-form-button full-col" onClick={() => handleCancel()}>Cancel</button>
                            </div>
                            <div className="col-md-8 full-col">
                              <button className="form-button" onClick={() => handlePayType()}>Continue</button>
                              <button className="form-button" onClick={() => handlePrevious()}>Previous</button>
                            </div>
                          </div>
                        )
                      }
                    </div>
                  </section>
                ) : display_confirm.toggle === true && modalView === false ? (
                  <section>
                    <ReviewYourTransfer data={display_confirm} isConfirmation={true} handleCancel={() => setDisplayConfirm({ toggle: false, data: null })} handleContinue={() => { handleConfirmation() }} />
                  </section>
                ) : (
                  <section>
                    <TransactionRecipiet transaction={transaction} modalView={modalView} final_amount={discounts?.final_amount} />
                  </section>
                )
              }
              <PayIDModal modal={pay_id_modal.toggle} handler={(value) => { setPayIdModal(value) }} otp={(value) => OpenConfirmation(value)} data={pay_id_modal} setData={(data) => setPayIdData(data)} />

              <PayToModal modal={pay_to_modal} handler={(value) => { setPayToModal(value) }} otp={(value) => OpenConfirmation(value)} setData={(data) => setPayToData(data)} handleLoader={(value) => { setLoader(value) }} />

              {/* ---------------STRIPE------------- */}
              <Modal className="modal-card" show={modal} onHide={() => setModal(false)} backdrop="static" centered>
                <Modal.Header>
                  <Modal.Title>Debit/Credit Card</Modal.Title>
                </Modal.Header>
                <Modal.Body className='my-4'>
                  <Elements stripe={stripePromise}>
                    <CheckoutForm payRef={payRef} handleModal={() => handleModals()} handleToken={(value) => setToken(value)} />
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

              {/* -----------OTP verification */}
              <Modal show={open_modal} onHide={() => setOpenModal(false)} backdrop="static" centered>
                <PopVerify handler={handleOtpVerification} close={() => { setOpenModal(false) }} />
              </Modal>

              <ErrorModal show={error_modal} handler={(value) => setErrorModal(value)} otp={(value) => OpenConfirmation(null)} />
              <PayIDInst show={show_payid_inst} handler={() => { setShowIDinst(false) }} />
              <PayToInst show={show_payto_inst} handler={() => { setShowToinst(false) }} />
            </>

          ) : (
            <div className="loader-overly">
              <div className="loader" >
              </div>
            </div>
          )
      }
    </>
  )
}

const CheckoutForm = ({ payRef, handleModal, handleToken }) => {

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (elements == null) {
      return;
    }
    const token = await stripe.createToken(elements.getElement(CardElement))
    if (token.token) {
      handleToken(token.token)
      handleModal()

    } else if (token.error.code === "card_declined") {
      toast.error("Card Declined", { position: "bottom-right", hideProgressBar: true, autoClose: 2000 })
    } else {
      toast.error("Enter card details to continue", { position: "bottom-right", hideProgressBar: true, autoClose: 2000 })
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <CardElement options={{ hidePostalCode: true }} />

        <button type="submit" ref={payRef} style={{ display: "none" }} disabled={!stripe || !elements}>
          Pay
        </button>
      </form>

    </>
  );
};

const PayIDModal = ({ modal, handler, otp, data, setData, }) => {
  const [copied, setCopied] = useState(false)

  const submit = () => {
    setData({ id: data.id, payment_id: data.payment_id });
    handler({ toggle: false, id: null, payment_id: null });
    handler(false)
    otp(data.id)
  }

  const copyToClipboard = (value, state) => {
    navigator.clipboard.writeText(value)
    setCopied(state)
  }

  const handleCancel = () => {
    handler({ toggle: false, id: null, payment_id: null })
  }


  return (
    <>
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
                  <td className='text-lowercase text-start'>{data.id}<span>{
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
                  }</span></td>
                </tr>
                <tr>
                  <th>Transaction ID:</th>
                  <td className='text-lowercase text-start'>{data.payment_id}<span>{
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
                  }</span></td>
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
    </>
  )
}

const PayToModal = ({ modal, handler, setData, otp, handleLoader, authModal }) => {

  const [agreement_list, setAgreementList] = useState({})
  const [disabled, setDisabled] = useState(null)
  const [stage, setStage] = useState(1);
  const [expired_message, setExpiredMessage] = useState("")

  const { handleSubmit, handleBlur, handleChange, values, errors, touched, resetForm, setFieldValue, setErrors } = useFormik({
    initialValues: {
      pay_id: "",
      bsb: "",
      account_number: "",
      agreement_amount: "1000",
      start_date: "",
      payid_type: "none"
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
            handleLoader(true)
            const d = {
              agreement_amount: values.agreement_amount,
              agreement_uuid: agreement_list.agreement_uuid
            }
            handler(false)
            updateAgreement(d).then(res => {
              handleLoader(false)
              if (res.code === "200") {
                toast.success(res.message, { position: "bottom-right", autoClose: 3000, hideProgressBar: true })
                setData({ agreement_uuid: res.data.agreement_uuid })
                getAgreementList().then(res => {
                  if (res.code === "200") {
                    otp(true)
                  }
                })
              } else if (res.code === "400") {
                toast.error(res.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
              }
              else {
                handleLoader(false)
                toast.error(res.message, { position: "bottom-right", autoClose: 3000, hideProgressBar: true })
              }
            }).catch((res) => {
              handleLoader(false)
              toast.error(res?.message, { position: "bottom-right", autoClose: 3000, hideProgressBar: true })

            })
          } else {
            handler(false)
            setData({ agreement_uuid: agreement_list?.agreement_uuid })
            getAgreementList().then(res => {
              if (res.code === "200") {
                otp(true)
              }
            })
          }
        } else {
          if (Number(values.agreement_amount) === 30000) {
            setErrors({ agreement_amount: "Transfer amount seems to be more than the limit." })
          } else {
            setErrors({ agreement_amount: "Transfer amount seems to be more than the limit. Please increase the limit." })

          }
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
            // if(values.pay_id.length !== 0 && (values.payid_type==="EMAL"||values.payid_type==="TELI")){
            //   await validatePayId({
            //     payid: values.pay_id,
            //     payid_type: values.payid_type
            //   }).then(res=>{
            //     if(res.code === "200"){
            //       setStage(2)
            //     }else{
            //       setErrors({ pay_id: res.message })
            //     }
            //   })
            // } else {
              setStage(2)
            // }
          }
        } else if (stage === 2) {
          if (Number(local?.amount?.send_amt) <= Number(values.agreement_amount)) {
            setStage(3)
          } else {
            if (Number(values.agreement_amount) === 30000) {
              setErrors({ agreement_amount: "Transfer amount seems to be more than the limit." })
            } else {
              setErrors({ agreement_amount: "Transfer amount seems to be more than the limit. Please increase the limit." })

            }
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
          handleLoader(true)
          createAgreement(d).then(res => {
            if (res.code === "200") {
              handler(false)
              handleLoader(false)
              toast.success(res.message, { position: "bottom-right", autoClose: 3000, hideProgressBar: true })
              setData({ agreement_uuid: res.data.agreement_uuid })
              // getAgreementList().then(res => {
              if (res.code === "200") {
                otp(null)
              }
              // })
            } else if (res.code === "400") {
              handleLoader(false)
              toast.error(res.message, { position: "bottom-right", autoClose: 3000, hideProgressBar: true })
            } else {
              handleLoader(false)
              toast.error(res.message, { position: "bottom-right", autoClose: 3000, hideProgressBar: true })
            }
          }).catch((res) => {

            handleLoader(false)
            toast.error(res?.message, { position: "bottom-right", autoClose: 3000, hideProgressBar: true })

          })
        }
      }
    }
  })

  const payIdRef = useRef()

  const local = JSON.parse(sessionStorage.getItem('transfer_data'));

  const displayStart = () => {
    if (agreement_list?.agreement_start_date) {
      let date = agreement_list.agreement_start_date.split("-");
      return date[2] + "-" + date[1] + "-" + date[0]
    } else {
      let date = values.start_date.split("-");
      return date[2] + "-" + date[1] + "-" + date[0]
    }
  }

  const agreementList = () => {
    getAgreementList().then(res => {
      if (res.code === "200") {
        setAgreementList(res.data)
        setFieldValue("agreement_amount", res?.data?.max_amount)
      } else if (res.code === "400" && res.expired === true) {
        setExpiredMessage(res.message)
        setAgreementList({})
      }
      else {
        setAgreementList({})
      }
    })
  }

  const handleCancel = () => {
    resetForm()
    setStage(1)
    handler(false)
  }



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
      day = '0' + day.toString();
    var maxDate = year + '-' + month + '-' + day;
    setFieldValue("start_date", maxDate)
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
      if (regex.test(userInput)) {
        setFieldValue(event.target.name, userInput)
      }
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



  return (
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
                    <p className='small my-3'>Set up a PayTo agreement to pay directly from your bank account. Use PayID or BSB and account number.</p>
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
                            {
                              expired_message !== "" && (
                                <div className='fv-plugins-message-container small mx-3 mt-1'>
                                  <div className='fv-help-block'>
                                    <span role='alert' className="text-danger">Note*: {expired_message}</span>
                                  </div>
                                </div>
                              )
                            }
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
                                  'form-control mx-2 w-100',
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
          )}
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
  )
}

const ErrorModal = ({ show, handler, otp }) => {

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
      otp(true)
    }
  }, [bar_fill, show])

  useEffect(() => {
    if (show === true) {
      timer = setInterval(() => {
        getAgreementList().then(res => {
          if (res.code === "200") {
            if (res.data.status === "active") {
              clearInterval(timer)
              handler(false)
              handleContinue()
            }
          }
        })
      }, 10 * 1000)
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
    otp(true)
  }

  const handlePrevious = () => {
    clearInterval(timer)
    handler(false)
  }

  return (
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
  )
}

const TransactionRecipiet = ({ transaction, modalView, final_amount }) => {

  let navigate = useNavigate()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    })

  }, [transaction])

  return (
    <section>
      <div className='row d-flex justify-content-center'>
        <div className='col-md-8 col-lg-8 col-sm-12'>
          <div className='form_body'>
            <div className="header mt-3 mb-5">
              <h1 className='text-success'><BsCheckCircleFill />Your transaction is being processed</h1>
            </div>
            <Table style={{ lineHeight: "2" }}>
              <tbody>
                <tr>
                  <th>Transaction Id:</th>
                  <td>{transaction?.id}</td>
                </tr>
                <tr>
                  <th>Transaction Amount</th>
                  <td>{transaction?.curr}&nbsp;{commaSeperator(final_amount)}</td>
                </tr>
                <tr>
                  <th>Transaction Status:</th>
                  <td>{transaction?.status}</td>
                </tr>
              </tbody>
            </Table>
            <div className='my-4'>
              {
                transaction?.type === "pay_id" ? (
                  <PayIdInstructions amount={final_amount} pay_id={transaction.pay_id} currency={transaction.curr} transaction_id={transaction.id} />
                ) : (
                  <PayToInstructions amount={final_amount} currency={transaction.curr} transaction_id={transaction.id} />
                )
              }
            </div>
            <div className='row text-center mt-3'>
              <div className="col-md-6">
                {/* <NavLink target='_blank' href={`${serverUrl}/payment/receipt/${transaction.id}`}> */}
                <button type="button" className="form-button" style={{ "width": '100%' }} onClick={() => navigate(`/transaction-detail/${transaction.id}`)}>View Reciept</button>
                {/* </NavLink> */}
              </div>
              <div className="col-md-6">
                <button type="button" className="form-button" style={{ "width": '100%' }} onClick={() => { navigate("/dashboard") }}>Go To Dashboard</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PaymentDetails