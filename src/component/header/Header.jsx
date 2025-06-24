import React, { useState, useEffect } from 'react';
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
import logo from '../../assets/img/home/logo.webp';

// Main CSS File
import '../../assets/css/global.css';
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
import { exchangeRate } from "../../utils/Api";


const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const scrolledDown = currentScrollPos > prevScrollPos;

      setIsScrolled(currentScrollPos > 50);
      setPrevScrollPos(currentScrollPos);

      // Add className to handle animation when scrolling up
      if (!scrolledDown) {
        setIsScrolled(true);
        setTimeout(() => setIsScrolled(false), 300); // Adjust the delay as needed
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const mobilemenuShow = () => setShow(true);

  const token = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("remi-user-dt"));
  const LoginDigitalidVerified = user?.is_digital_Id_verified

  const navigate = useNavigate();

  const handleLogout = (event) => {
    event.preventDefault();
    sessionStorage.clear();
    sessionStorage.clear();
    toast.success('Logout Successfully', { position: "bottom-right", autoClose: 2000, hideProgressBar: true });
    navigate("/login")
  }
  const commonMenuItems = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/about-us"> About us</NavLink>
      </li>
      <li>
        <NavLink to="/help">Help</NavLink>
      </li>
    </>
  );
  return (
    <>
      <header id="header" style={{ paddingRight: "-17px" }} className={`fixed-top d-flex align-items-center header-transparent ${isScrolled ? 'scrolled1' : ''}`}>
        <div className="container d-flex justify-content-between align-items-center">
          <div className="logo">
            <h1 className="text-light">
              <NavLink to="/">
                <img src={logo} alt="logo" />
              </NavLink>
            </h1>
          </div>



          {
            token && user ? (
              <nav id="navbar" className="navbar">
                <ul>
                  {commonMenuItems}
                  <li>
                    <NavLink to="/referral">Referral</NavLink>
                  </li>
                  <li className="dropdown">
                    <span>
                      My account <IoIosArrowDown style={{ color: 'rgb(20, 34, 224)' }} />
                    </span>
                    <ul>
                      {
                        LoginDigitalidVerified?.toString() === "true" ? (
                          <li> <NavLink to="/dashboard">Dashboard</NavLink></li>
                        ) : (
                          <>
                            <li> <NavLink to="/dashboard">Dashboard</NavLink></li>
                            {/* <li> <NavLink to="/send-money">Send Money</NavLink></li> */}
                          </>
                        )
                      }
                      <li><NavLink onClick={handleLogout}>Logout</NavLink></li>
                    </ul>
                  </li>
                </ul></nav>
            ) : (
              <>
                <nav id="navbar" className="navbar">
                  <ul>
                    {commonMenuItems}
                  </ul>
                </nav>
                <nav id="navbar" className="navbar">

                  <ul className='mobile-hide'>
                    <li>
                      <NavLink to="/sign-up" className="signactin"><b>Sign</b> <b>up</b></NavLink>
                    </li>
                    <li>
                      <NavLink to="/login" className="logactin">Log  <b>in</b></NavLink>
                    </li>
                  </ul>
                </nav>
              </>
            )
          }


          <img src="assets/img/home/mobilemenu.png" onClick={mobilemenuShow} className="mobile-btn" alt="mobile" />

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
                              <>
                                <li> <NavLink to="/dashboard" onClick={handleClose}>User Dashboard</NavLink></li>
                                {/* <li> <NavLink to="/send-money" onClick={handleClose}>Send Money</NavLink></li> */}
                              </>
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
                  <div className="col-md-12">
                    <a href="https://play.google.com/store/apps/details?id=com.remitAssure&pli=1" target="_blank"> <img src="assets/img/home/playstore.svg" alt="home_icons" className="" /></a>
                  </div>
                  <div className="col-md-12">
                    <a href="https://apps.apple.com/us/app/remitassure/id6451420844" target="_blank">  <img src="assets/img/home/appstore.svg" alt="home_icons" className="" /></a>
                  </div>

                </div>
              </div>
            </Offcanvas.Body>
          </Offcanvas>
        </div>
      </header>
      <div className='spacer-div-he'>
      </div>
    </>
  )
}


export default Header;