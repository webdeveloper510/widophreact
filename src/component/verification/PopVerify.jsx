import React, { useEffect, useState } from "react";
import OtpInput from "react18-input-otp";
import { toast } from "react-toastify";
import { resendOtp, verifyEmail } from "../../utils/Api";
import { NavLink, Alert } from "react-bootstrap";



const myStyle = {
    color: "red",
    fontSize: "13px",
    textTransform: "capitalize",
    marginTop: "4px",
    display: "block",
    textAlign: "center"
}
const successStyle = {
    color: "green",
    fontSize: "13px",
    textTransform: "capitalize",
    marginTop: "4px",
    display: "block",
    textAlign: "center"
}

const PopVerify = ({ handler, close, phone, new_mobile }) => {

    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState("");

    const { mobile } = JSON.parse(sessionStorage.getItem("remi-user-dt"))

    // start Error mesasge states
    const [EnterOtpText, setEnterOtpText] = useState('');
    const [InvalidotpText, setInvalidotpText] = useState('');
    const [AlreadyverifiedText, setAlreadyverifiedText] = useState('');
    const [show_alert, setShowAlert] = useState(1)

    const handleChange = (enteredOtp) => {
        setOtp(enteredOtp);
    };


    useEffect(() => {
        setTimeout(() => {
            setShowAlert(0)
        }, 5000)
    }, [show_alert])

    const handleVerification = (event) => {
        event.preventDefault();
        let length = otp.toString()

        if (length.length == 6) {
            setLoading(true)
            let obj = {}
            if (phone == null || undefined || "") {
                obj.mobile = mobile
            } else {
                obj.mobile = phone
            }

            obj.otp = otp
            verifyEmail(obj).then((res) => {
                if (res.code == 200) {
                    let d = new Date()
                    d.setDate(d.getDate() + 1);
                    sessionStorage.setItem('tkn-exp', d)
                    sessionStorage.setItem('token', res.access_token)
                    setLoading(false)
                    close()
                    handler(true)
                } else if (res.code == "400") {
                    toast.error(res.message,
                        { position: "bottom-right", autoClose: 2000, hideProgressBar: true });
                    setLoading(false)
                    setOtp()
                    handler(false)
                }
            }).catch((error) => {
                if (error.response.status == 400) {
                    toast.error(error.response.data.message,
                        { position: "bottom-right", autoClose: 2000, hideProgressBar: true });
                }
                close()
                setLoading(false)
            })
        } else {
            toast.error("Please enter 6 digit O.T.P", { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
        }
    }

    const handleResendOtp = () => {
        setLoading(true)
        let obj = {}
        if (phone == null || undefined || "") {
            obj.mobile = mobile
        } else {
            obj.mobile = phone
        }
        if (new_mobile !== null) {
            obj.new_mobile = new_mobile
        }
        obj.type = "email"
        setLoading(true)
        setOtp(null)

        resendOtp(obj).then((res) => {
            if (res.code == "200") {
                setShowAlert(2)
            } else {
                setShowAlert(3)
            }
            setLoading(false)
        }).catch((error) => {
            setShowAlert(3)
            setLoading(false)
        })
        setLoading(false)
    }

    useEffect(() => {
        let obj = {}
        if (phone == null || undefined || "") {
            obj.mobile = mobile
        } else {
            obj.mobile = phone
        }
        if (new_mobile !== null) {
            obj.new_mobile = new_mobile
        }
        obj.type = "email"
        resendOtp(obj)
            .then(() => {
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
            })
    }, [])

    return (
        <div className="card-body">
            <span style={successStyle}>{AlreadyverifiedText ? AlreadyverifiedText : ""}</span>
            <h5 className="Sign-heading mb-4">Verify your Account</h5>
            {
                show_alert === 1 ? (
                    <Alert className="m-0" >
                        {/*onClose={() => setShowAlert(0)} dismissible  */}
                        <span>
                            A verification code has been sent to your number.
                        </span>
                    </Alert>
                ) : show_alert === 2 ? (
                    <Alert className="m-0" >
                        <span>The verification code has been resent.</span>
                    </Alert>
                ) : show_alert === 3 ? (
                    <Alert className="m-0" >
                        <span>There might be an issue in resending, please try again.</span>
                    </Alert>
                ) : (
                    <Alert className="m-0" >
                        <span> Please enter the verification code to continue.</span>
                    </Alert>
                )
            }
            <div className="form_verification">
                <form onSubmit={handleVerification} >
                    <OtpInput
                        value={otp}
                        onChange={handleChange}
                        numInputs={6}
                        isInputNum={true}
                        isSuccessed={true}
                        successStyle="success"
                        separator={<span></span>}
                        separateAfter={3}
                        className="verification_input"
                    />
                    <span style={myStyle}>{EnterOtpText ? EnterOtpText : ""}</span>
                    <span style={myStyle}>{InvalidotpText ? InvalidotpText : ""}</span>
                    <NavLink className="resend_otp_link" onClick={() => { handleResendOtp() }}>
                        Resend OTP
                        {
                            loading ? <>
                                <div className="loader-overly">
                                    <div className="loader" >
                                    </div>
                                </div>
                            </> : <></>
                        }
                    </NavLink>
                    <div className="text-center pt-3 Verify_pop">

                        <button variant="primary"
                            type="button"
                            onClick={(e) => { close() }}
                            className="cancel_button "
                        >
                            Cancel
                        </button>
                        <button variant="primary"
                            type="submit"
                            className="continue_button"
                        >
                            Continue
                            {
                                loading ? <>
                                    <div className="loader-overly">
                                        <div className="loader" >
                                        </div>
                                    </div>
                                </> : <></>
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PopVerify