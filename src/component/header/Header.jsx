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
import logo from '../../assets/img/header/login-logo.png';

// Main CSS File
import '../../assets/css/global.css';
import '../../assets/css/style.css';

// responsive CSS File
import '../../assets/css/responsive.css';

import {
  Container,
  Row,
  Col,
  Nav,
  Navbar,
  Button,
  NavDropdown,
} from "react-bootstrap";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaRss,
  FaRegEnvelope,
  FaPhoneVolume,
  FaWhatsapp,
} from "react-icons/fa6";

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
 <div className="top-navbar">
    <div className="top-strip py-2 text-black">
        <Container>
          <Row className="align-items-center justify-content-between login-header">
            <Col
              xs={12}
              md={6}
              className="d-flex flex-wrap gap-4 align-items-center"
            >
              <span className="d-flex flex-wrap align-items-center">
                <FaPhoneVolume />
                <a href="tel:02 8001 6495">02 8001 6495</a>
              </span>
              <span className="d-flex flex-wrap align-items-center">
                <FaWhatsapp />
                <a href="tel:+61480001611">+61480001611</a>
              </span>
            </Col>
            <Col
              xs={12}
              md={6}
              className="d-flex justify-content-md-end gap-4 mt-2 mt-md-0 align-items-center"
            >
              <span className="d-flex flex-wrap align-items-center">
                <FaRegEnvelope />
                <a href="mailto:support@widophremit.com">
                  support@widophremit.com
                </a>
              </span>
              <div className="d-flex social-icons">
                <a href="https://www.facebook.com/widophRemit">
                  <FaFacebookF />
                </a>
                <a href="https://x.com/WidophRemit">
                  <FaXTwitter />
                </a>
                <a href="https://www.instagram.com/widophremit/">
                  <FaInstagram />
                </a>
                <a href="https://widophremit.com/feed/">
                  <FaRss />
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
        <div className="container d-flex justify-content-between align-items-center">
          <div className="logo">
            <h1 className="text-light">
              <NavLink to="/">
                <img src={logo} alt="logo" />
              </NavLink>
            </h1>
          </div>
        </div>
      
      <div className='spacer-div-he'>
      </div>
      </div>
    </>
  )
}


export default Header;