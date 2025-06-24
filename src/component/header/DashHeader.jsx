import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from 'react-router-dom';

import Offcanvas from 'react-bootstrap/Offcanvas';
import { toast } from 'react-toastify';

// <!-- Vendor CSS Files -->
import '../../assets/vendor/animatecss/animate.min.css';
import '../../assets/vendor/aos/aos.css';
import '../../assets/vendor/bootstrap/css/bootstrap.min.css';
import '../../assets/vendor/bootstrap-icons/bootstrap-icons.css';
import '../../assets/vendor/boxicons/css/boxicons.min.css';
import '../../assets/vendor/glightbox/css/glightbox.min.css';
import '../../assets/vendor/swiper/swiper-bundle.min.css';
import logo from '../../assets/img/home/logo.svg';

// Main CSS File
import '../../assets/css/style.css';
// responsive CSS File
import '../../assets/css/responsive.css';

import { RxHamburgerMenu } from "react-icons/rx";
import { GoHome } from "react-icons/go";
import { HiInformationCircle } from "react-icons/hi";
import { FaHandsHelping } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineLogin } from "react-icons/ai";
import { FaUserPlus } from "react-icons/fa";

import app from '../../assets/img/home/Group 01.svg';
import { exchangeRate, getVeriffStatus } from "../../utils/Api";
import { Modal, Table } from "react-bootstrap";
import { createVeriffFrame, MESSAGES } from '@veriff/incontext-sdk';
import { Veriff } from '@veriff/js-sdk';


const DashHeader = () => {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const mobilemenuShow = () => setShow(true);

    const token = sessionStorage.getItem("token");
    const user = JSON.parse(sessionStorage.getItem("remi-user-dt"));
    const LoginDigitalidVerified = user?.is_digital_Id_verified;
    const [isVerified, setIsVerified] = useState(user?.is_digital_Id_verified?.toString().toLowerCase() || false)
    const [verification, setVerification] = useState(false)
    const [loader, setLoader] = useState(false)
    // console.log(isVerified)
    const navigate = useNavigate();

    const handleLogout = (event) => {
        event.preventDefault();
        sessionStorage.clear();
        sessionStorage.clear()
        toast.success('Logout Successfully', { position: "bottom-right", autoClose: 2000, hideProgressBar: true });
        navigate("/login")
    }

    const start = () => {
        setVerification(true)
    }

    const end = () => {
        setLoader(false)
        setVerification(false)
        setIsVerified(true)
    }

    return (
        <>
            <div className="fixed-top">
                {
                    isVerified !== "true" ? (
                        <div className="verify-banner" >Your Account is not Digitally Verified. <a onClick={() => start()}>Click here</a> to Verify</div>

                    ) : (<></>)
                }
                <header id="header" className=" d-flex align-items-center header-transparent">
                    <div className="container d-flex justify-content-between align-items-center">
                        <div className="logo">
                            <h1 className="text-light">
                                <NavLink to="/">
                                    <img src={logo} alt="logo" />
                                </NavLink>
                            </h1>
                        </div>
                        <nav id="navbar" className="navbar">
                            <ul>
                                <li>
                                    <NavLink className="" to="/">Home</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/about-us"> About us</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/help">Help</NavLink>
                                </li>
                                {/* <li>
                <NavLink to="/referral">Referral</NavLink>
              </li> */}
                                {
                                    token && user ? (
                                        <li className="dropdown">
                                            <span>
                                                My account <IoIosArrowDown style={{ color: 'rgb(20, 34, 224)' }} />
                                            </span>
                                            <ul>
                                                {
                                                    LoginDigitalidVerified == "true" ? (
                                                        <li> <NavLink to="/dashboard">Dashboard</NavLink></li>
                                                    ) : (
                                                        <li> <NavLink to="/send-money">Send Money</NavLink></li>
                                                    )
                                                }
                                                <li><NavLink onClick={handleLogout}>Logout</NavLink></li>
                                            </ul>
                                        </li>
                                    ) : (
                                        <>
                                            <li>
                                                <NavLink to="/sign-up">Signup</NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/login">Login</NavLink>
                                            </li>
                                        </>
                                    )
                                }
                            </ul>
                        </nav>
                        <RxHamburgerMenu onClick={mobilemenuShow} className="mobile-btn" />
                        <Offcanvas show={show} onHide={handleClose}>
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title> <div className="logo">
                                    <h1 className="text-light">
                                        <NavLink to="/">
                                            <img src={logo} alt="logo" />
                                        </NavLink>
                                    </h1>
                                </div></Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <nav id="navbar" className="navbar">
                                    <ul>
                                        <li>
                                            <NavLink className="" to="/" onClick={handleClose}><GoHome /> Home</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/about-us" onClick={handleClose}> <HiInformationCircle /> About us</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/help" onClick={handleClose}><FaHandsHelping />Help</NavLink>
                                        </li>
                                        {/* <li>
                    <NavLink to="/referral" onClick={handleClose}><HiUserGroup />Referral</NavLink>
                  </li> */}
                                        {
                                            token && user ? (
                                                <li className="dropdown">
                                                    <a href="#">
                                                        <span>
                                                            My account <IoIosArrowDown style={{ color: 'rgb(20, 34, 224)' }} />
                                                        </span>
                                                    </a>
                                                    <ul>
                                                        {
                                                            LoginDigitalidVerified == "true" ? (
                                                                <li> <NavLink to="/dashboard" onClick={handleClose}>User Dashboard</NavLink></li>
                                                            ) : (
                                                                <li> <NavLink to="/send-money" onClick={handleClose}>Send Money</NavLink></li>
                                                            )
                                                        }
                                                        <li><NavLink onClick={handleLogout}>Logout</NavLink></li>
                                                    </ul>
                                                </li>
                                            ) : (
                                                <>
                                                    <li>
                                                        <NavLink to="/sign-up" onClick={handleClose}><FaUserPlus />Signup</NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink to="/login" onClick={handleClose}><AiOutlineLogin />Login</NavLink>
                                                    </li>
                                                </>
                                            )
                                        }
                                    </ul>
                                </nav>
                                <div className="row">
                                    <div className="mobile-app-section">
                                        <p>Download the RemitAssure App</p>
                                        <img src={app} alt="app-icons" />
                                    </div>
                                </div>
                            </Offcanvas.Body>
                        </Offcanvas>
                    </div>
                </header>
            </div >
            < Modal show={verification} backdrop="static" onHide={() => setVerification(false)} centered >
                <Modal.Header closeButton >
                    <img src="https://veriff.cdn.prismic.io/veriff/1565ec7d-5815-4d28-ac00-5094d1714d4c_Logo.svg" alt="Veriff logo" width="90" height="25" />
                </Modal.Header>
                < Modal.Body className='w-100 m-auto' >
                    <VerificationModal toggleLoader={(value) => setLoader(value)} handler={() => end()} />
                </Modal.Body>
            </Modal>
            {
                loader ? <>
                    <div className="loader-overly" >
                        <div className="loader" >
                        </div>
                    </div>
                </> : ""}
        </>
    )
}


const VerificationModal = ({ handler, toggleLoader }) => {


    const user = JSON.parse(sessionStorage.getItem("remi-user-dt"))
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
                                toggleLoader(true)
                                const interval = setInterval(() => {
                                    getVeriffStatus({ session_id: response.verification.id }).then(res => {
                                        handler()
                                        if (res.code === "200") {
                                            clearInterval(interval)
                                            if (res?.data?.verification?.status === "approved") {
                                                toast.success("Successfully Verified", { position: "bottom-right", hideProgressBar: true })
                                                let user = JSON.parse(sessionStorage.getItem("remi-user-dt"));
                                                user.is_digital_Id_verified = "true"
                                                sessionStorage.setItem("remi-user-dt", JSON.stringify(user))
                                            } else if (res?.data?.verification?.status === "declined") {
                                                toast.error(res?.message, { position: "bottom-right", hideProgressBar: true })
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
                givenName: `${user?.First_name}`,
                lastName: `${user?.Last_name}`
            }
        });
        veriff.mount({
            formLabel: {
                givenName: 'First name',
                lastName: 'Last name',
                vendorData: 'Unique id/Document id'
            },

            submitBtnText: 'Start Verification',
            loadingText: 'Please wait...'
        })
    }, [])

    return (
        <>
            <div id='veriff-root' style={{ margin: "auto", padding: "25px 0px" }}>
            </div>
        </>
    )
}

export default DashHeader;