import React, { useState } from "react";
import OtpInput from "react18-input-otp";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router";
import { resendOtp, verifyEmail } from "../../utils/Api";
import { Alert, Button, Modal, ModalBody } from "react-bootstrap";
import { useEffect } from "react";
import { generateRandomKey } from "../../utils/hook";


{/* start -- css*/ }
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
{/* End -- css*/ }


const Verification = () => {

    /**************************token ************************ */

    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState("");
    const [count_invalid, setCountInvalid] = useState(0);
    const location = useLocation()
    const [open_modal, setOpenModal] = useState(false)
    const data = location.state

    const [show_alert, setShowAlert] = useState(1)

    const handleChange = (enteredOtp) => {
        setOtp(enteredOtp);
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (count_invalid === 3) {
            setOpenModal(true)
            setOtp("")
        }
    }, [count_invalid])

    useEffect(() => {
        setTimeout(() => {
            setShowAlert(0)
        }, 5000)
        if (sessionStorage.getItem("token") && sessionStorage.getItem("remi-user-dt")) {
            navigate("/dashboard")
        }

    }, [show_alert])


    const handleEmailVerification = (event) => {
        event.preventDefault();
        let length = otp.toString()
        if (length.length == 6) {
            setLoading(true)
            let obj = {}
            let keys = Object.keys(data)
            if (keys[0] == 'email') {
                obj.email = data.email
            } else {
                obj.mobile = data.mobile
            }
            obj.otp = otp
            if (keys.length == 2 && keys[1] == 'component') {
                obj.page = 'register'
            }
            verifyEmail(obj).then((res) => {
                if (res.code == 200) {
                    toast.success(res.message,
                        { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
                    let d = new Date()
                    d.setDate(d.getDate() + 1);
                    sessionStorage.setItem('tkn-exp', d)
                    sessionStorage.setItem('token', res.access_token)
                    setLoading(false)
                    if (obj.page !== "register") {
                        const user = res?.data
                        user.is_digital_Id_verified = `${res?.data?.is_digital_Id_verified}`
                        sessionStorage.setItem("remi-user-dt", JSON.stringify(user))
                        if (sessionStorage.getItem("transfer_data")) {
                            navigate(`/user-send-money`)
                        } else {
                            navigate("/dashboard")
                        }
                    } else {
                        const user = res?.data
                        user.is_digital_Id_verified = "false"
                        sessionStorage.setItem("remi-user-dt", JSON.stringify(user))
                        navigate('/dashboard')
                    }
                } else if (res.code == "400") {
                    toast.error(res.message,
                        { position: "bottom-right", autoClose: 2000, hideProgressBar: true });
                    setCountInvalid(count_invalid + 1)
                    setLoading(false)
                }
            }).catch((error) => {
                if (error.response.status == 400) {
                    toast.error(error.response.data.message,
                        { position: "bottom-right", autoClose: 2000, hideProgressBar: true });
                }
                setLoading(false)
            })
        } else {

            toast.error("Please enter the OTP", { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
        }
    }

    const handleResendOtp = (e) => {
        e.preventDefault()
        setLoading(true)
        let obj = {}
        let keys = Object.keys(data)
        if (keys[0] == 'email') {
            obj.email = data.email
        } else {
            obj.mobile = data.mobile
        }
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

    const handleClose = () => {
        setOpenModal(false)
        navigate("/help")
    }

    return (
        <>
            <section className="why-us section-bgba verification_banner">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card card-verification">
                                <div className="card-body">
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
                                        <form onSubmit={handleEmailVerification} >
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
                                            <div className="text-center pt-3">
                                                <button variant={count_invalid === 3 ? "secondary" : "primary"}
                                                    type="submit"
                                                    className="continue_button w-75"
                                                    disabled={count_invalid === 3 ? true : false}
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
                                                <button variant="primary"
                                                    type="button"
                                                    onClick={(e) => { handleResendOtp(e) }}
                                                    className="continue_button w-75"
                                                >
                                                    Resend OTP
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
                            </div>

                        </div>
                    </div>
                </div>
                <Modal show={open_modal} centered backdrop="static">
                    <Modal.Header><b style={{ color: "#6414E9" }}>Maximum limit reached</b></Modal.Header>
                    <ModalBody>
                        <h5>Please contact our <b style={{ color: "#6414E9" }}>Customer Service</b> to continue</h5>
                    </ModalBody>
                    <Modal.Footer className="pt-0">
                        <Button onClick={() => handleClose()} variant="primary" className="continue_button w-50 p-0">Visit Support</Button>
                    </Modal.Footer>
                </Modal>
            </section>
        </>
    )
}



export default Verification;