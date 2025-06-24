import React, { useEffect, useState, useRef } from 'react'
import { Table } from 'react-bootstrap'
import { BsCheckCircleFill } from 'react-icons/bs'
import AmountDetail from './AmountDetail'
import BankDetails from './BankDetails'
import PaymentDetails from './PaymentDetails'
import SenderDetails from './SenderDetails'
import PaymentSummary from './PaymentSummary'
import { useLocation, useNavigate } from 'react-router-dom'
import authDashHelper from '../../utils/AuthDashHelper'
import { pendingTransactions } from '../../utils/Api'
import { commaSeperator } from '../../utils/hook'

const SendMoney = () => {

  const [activeStep, setActiveStep] = useState(1);
  const progressBarRefs = useRef([]);

  const data = useLocation()?.state

  const [step, setStep] = useState(0)
  const [final_amount, setFinalAmount] = useState("")

  const [amt_detail, setAmtDetail] = useState({
    send_amt: data?.send_amt || "", exchange_amt: data?.exchange_amt || "", from_type: data?.from_type || "", to_type: data?.to_type || "", recieve_meth: data?.recieve_meth || "", payout_part: ""
  })

  const [bank_detail, setBankDetail] = useState({
    bank: "", acc_name: "", acc_no: "", f_name: "", l_name: "", m_name: "", email: "", mobile: "",
    flat: "", build_no: "", street: "", city: "", post: "", state: "", country: "", reason: ""
  })

  const handleAmtDetail = (data) => {
    setAmtDetail({ ...data })
  }
  const navigate = useNavigate()

  const handleBankDetail = (data) => {
    setBankDetail(data)
  }

  const handleStep = (data) => {
    setStep(Number(data))
  }

  useEffect(() => {

    if (authDashHelper('dashCheck')) {
      navigate(`/user-send-money`)
    } else if (authDashHelper('authCheck')) {
      navigate("/login")
    } else {
      pendingTransactions().then(res => {
        if (res.code === "200") {
          sessionStorage.setItem("transaction_id", res.data[0].transaction_id)
          if (res?.data[0]?.recipient) {
            sessionStorage.setItem("rid", res?.data[0]?.recipient)
          }
        }
      })
    }
  }, [])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    })
    if (sessionStorage.getItem("transfer_data")) {
      const local = JSON.parse(sessionStorage.getItem("transfer_data"))
      if (local?.amount) {
        setAmtDetail({
          ...local.amount,
          send_amt: local?.amount.send_amt,
          exchange_amt: local?.amount.exchange_amt,
          from_type: local?.amount.from_type,
          to_type: local?.amount.to_type,
          payout_part: local?.amount.part_type !== "other" ? local?.amount.part_type : local?.amount.payout_part
        })
      }
      if (local?.recipient) {
        setBankDetail(local.recipient)
      }
    }

    const s = step;
    let n = s;
    while (n > 0) {
      progressBarRefs.current[n - 1].style.transform = "translateX(100%)";
      n--
    }
    setActiveStep(Number(s) + 1)



  }, [step])


  // window.addEventListener('beforeunload', function (e) {
  //   if (window.location.pathname === "/send-money") {
  //     e.preventDefault();
  //     e.returnValue = ''
  //     let data = {
  //       transfer_data: sessionStorage.getItem("transfer_data"),
  //       step: sessionStorage.getItem("send-step")
  //     }
  //   }
  // })


  return (
    <>
      <div className="site-content-money">
        {
          1 ? (
            <div className="form send_money_section">
              <>
                <section className="why-us section-bgba user_dashboard_banner">
                  <div className="container">
                    <div className="row">
                      <div className='col-12'>
                        <ul className="multi-steps">
                          <li className={`step ${activeStep === 1 ? "is-active" : ""}`}>
                            <div className="step-label text-light">
                              Amount & Delivery
                              <div className="progress-bar progress-bar--success">
                                <div
                                  className="progress-bar__bar"
                                  ref={(ref) => (progressBarRefs.current[0] = ref)}
                                ></div>
                              </div>
                            </div>
                          </li>
                          <li className={`step ${activeStep === 2 ? "is-active" : ""}`}>
                            <div className="step-label text-light">
                              Recipient Details
                              <div className="progress-bar progress-bar--success">
                                <div
                                  className="progress-bar__bar"
                                  ref={(ref) => (progressBarRefs.current[1] = ref)}
                                ></div>
                              </div>
                            </div>
                          </li>
                          <li className={`step ${activeStep === 3 ? "is-active" : ""}`}>
                            <div className="step-label text-light">
                              Sender Details
                              <div className="progress-bar progress-bar--success">
                                <div
                                  className="progress-bar__bar"
                                  ref={(ref) => (progressBarRefs.current[2] = ref)}
                                ></div>
                              </div>
                            </div>
                          </li>
                          <li className={`step ${activeStep === 4 ? "is-active" : ""}`}>
                            <div className="step-label text-light">
                              Payment Method
                              <div className="progress-bar progress-bar--success">
                                <div
                                  className="progress-bar__bar"
                                  ref={(ref) => (progressBarRefs.current[3] = ref)}
                                ></div>
                              </div>
                            </div>
                          </li>
                          <li className={`step ${activeStep === 5 ? "is-active" : ""}`}>
                            <div className="step-label text-light">
                              Summary
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className={`row ${(step === 0 || step === 4) ? "d-flex justify-content-center" : ""}`}>
                      <div className="col-md-8">
                        {
                          step === 0 ? <AmountDetail handleAmtDetail={handleAmtDetail} handleStep={handleStep} step={step} />
                            :
                            step === 1 ? <BankDetails handleBankDetail={handleBankDetail} handleStep={handleStep} step={step} />
                              :
                              step === 2 ? <SenderDetails handleStep={handleStep} step={step} />
                                :
                                step === 3 ? <PaymentDetails handleStep={handleStep} step={step} />
                                  :
                                  step === 4 ? <PaymentSummary handleStep={handleStep} step={step} />
                                    : <></>
                        }
                      </div>
                      <div className={step > 0 && step < 4 ? "col-md-4" : ""}>


                        <Table>
                          {
                            step > 0 && step < 4 ? (
                              <div className="summary">
                                <BsCheckCircleFill color='#6414E9' />
                                <h5>Summary</h5>
                                <tbody>
                                  <tr>
                                    <td><b>Amount : </b>{amt_detail?.from_type + " " + commaSeperator(amt_detail?.send_amt) + " ⇒ " + amt_detail?.to_type + " " + commaSeperator(amt_detail?.exchange_amt)}</td>
                                  </tr>
                                  <tr>
                                    <td><b>Received Method : </b>{amt_detail?.recieve_meth}</td>
                                  </tr>
                                  <tr>
                                    <td><b>Payout Partners : </b>{amt_detail?.payout_part}</td>
                                  </tr>
                                </tbody>
                              </div>
                            ) : (
                              <>
                              </>
                            )
                          }
                          {
                            step > 1 && step < 4 && bank_detail?.bank != '' ? (
                              <div className="summary1">
                                <BsCheckCircleFill color='#6414E9' />
                                <h5>Recipient details Summary</h5>
                                <tbody>
                                  <tr>
                                    <td><b>Full Name : </b>{bank_detail?.f_name} <span>{bank_detail?.l_name}</span></td>
                                  </tr>
                                  <tr>
                                    <td><b>Mobile : </b>+{bank_detail?.mobile}</td>
                                  </tr>
                                </tbody>
                              </div>
                            ) : (
                              <>
                              </>
                            )
                          }
                        </Table>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            </div>
          ) : (
            <>
            </>
          )
        }
      </div>
    </>
  )
}

export default SendMoney