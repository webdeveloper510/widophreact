import React, { Component, useState } from "react";
import { links, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { generateRandomKey } from "../../utils/hook";
import { debounce } from 'lodash';
import { useFormik } from "formik";
import { hitNewsletter } from "../../utils/Api";
import clsx from "clsx";
import * as Yup from "yup";
import { toast } from "react-toastify";
import footerlogo from "../../assets/img/footer/footer-logo.png";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaRss,
  FaRegEnvelope,
  FaPhoneVolume,
  FaWhatsapp,
} from "react-icons/fa6";

const Footer = () => {
    const [accordionOpen, setAccordionOpen] = useState(null);

    const toggleAccordion = (index) => {
        if (accordionOpen === index) {
            setAccordionOpen(null);
        } else {
            setAccordionOpen(index);
        }
    };

    const renderAccordionContent = (data) => {
        return data.map((item, index) => (
            <div key={item.id}>
                <div onClick={() => toggleAccordion(index)}>
                    <NavLink to="#">{item.content}</NavLink>
                </div>
                {accordionOpen === index && (

                    <div>
                        {/* Additional content for the accordion item */}
                    </div>
                )}
            </div>
        ));
    };




    // Navigator Footer Content Start 
    function NavigationFooterArrayObjects() {
        const navigationData = [
            // {
            //     id: 1,
            //     content: "Home",

            // },
            // {
            //     id: 2,
            //     content: "About Us",

            // },
            {
                id: 3,
                content: "What We Do",
            },
            {
                id: 4,
                content: "To The Power of 10",
            },
            {
                id: 5,
                content: "Donate",
            },

        ];

        const NavigationItems = navigationData.map((value) => {
            // console.log(navigationData, "ooook")
            return (
                <li key={value.id}>
                    <NavLink to="#">{value.content}</NavLink>
                </li>
            )
        })

        return (
            <div>
                {NavigationItems}
            </div>
        )
    }
    // Navigator Footer Content End 

    //What We Do Footer content Start
    function WeDoArrayObjects() {
        const data = [
            {
                id: '1',
                title: "Encouraging Testing",
            },
            {
                id: '2',
                title: "Strengthening Advocacy",
            },
            {
                id: '3',
                title: "Sharing Information",
            },
            {
                id: '4',
                title: "Building Leadership",
            },
            {
                id: '5',
                title: "Engaging With Global Fund",
            },
            {
                id: '6',
                title: "Shining a Light",
            },
        ];

        const wedoItems = data.map((element) => {
            return (
                <li key={element.id}>
                    <a href="#">{element.title}</a>
                </li>
            )
        })
        return (
            <div>
                {wedoItems}
            </div>
        )
    }
    //What We Do Footer content End

    //Legal Footer content Start
    function LegalArrayObjects() {
        const legalData = [
            {
                id: 1,
                content: "General Info",
            },
            {
                id: 2,
                content: "Privacy Policy",
            },
            {
                id: 3,
                content: "Terms of Service",
            },
        ];

        const lagalItems = legalData.map((legal) => {
            return (
                <li key={legal.id}>
                    <a href="#">{legal.content}</a>
                </li>

            )
        })
        return (
            <div>
                {lagalItems}
            </div>
        )
    }
    //Legal Footer content End
    const links = () => {
        let user = JSON.parse(sessionStorage.getItem("remi-user-dt"))
        let token = sessionStorage.getItem("token")
        if (token && (user?.is_digital_Id_verified === "True" || user?.is_digital_Id_verified === "true")) {
            return `/user-send-money`
        } else {
            return "/login"
        }
    }
    let location = useLocation()
    let navigate = useNavigate()

    const checkExchangeRate = debounce(() => {

        // Get the target element using document.getElementById
        if (location.pathname !== "/") {
            navigate("/");
        }

        setTimeout(() => {
            const targetSectionId = "pay-box";
            const targetElement = document.getElementById(targetSectionId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            } else {
                // console.error(`Element with id "${targetSectionId}" not found.`);
            }
        }, 500)
    }, 200);

    const blogRedirect = debounce(() => {
        if (location.pathname !== "/") {
            navigate("/");
            setTimeout(() => {
                const targetSectionId = "blog-box";
                const targetElement = document.getElementById(targetSectionId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
            }, 800)
        } else {
                const targetSectionId = "blog-box";
                const targetElement = document.getElementById(targetSectionId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
        }


    }, 200);

    const howItWorks = () => {
        if (location.pathname !== "/") {
            navigate("/");
        }

        setTimeout(() => {
            const targetSectionId = "how-it-works";
            const targetElement = document.getElementById(targetSectionId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            } else {
                // console.error(`Element with id "${targetSectionId}" not found.`);
            }
        }, 500)
    }

    const mobileApps = () => {
        if (location.pathname !== "/") {
            navigate("/");
        }

        setTimeout(() => {
            const targetSectionId = "mobile-apps";
            const targetElement = document.getElementById(targetSectionId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            } else {
                // console.error(`Element with id "${targetSectionId}" not found.`);
            }
        }, 600);

    }

    const [message, setMessage] = useState(null)

    const formik = useFormik({
        initialValues: {
            email: ""
        },
        validationSchema: Yup.object().shape({
            email: Yup.string().matches(/^[\w-+\.]+@([\w-]+\.)+[\w-]{2,10}$/, "Invalid email format").min(6).max(50).required("Email is required"),
        }),
        onSubmit: (value) => {
            hitNewsletter({ email: value.email }).then((res) => {
                if (res.code === "200") {
                    setMessage(res.message)
                    setTimeout(() => {
                        formik.resetForm();
                        setMessage(null)
                    }, 3000)
                } else {
                    setMessage(res.message)
                    setTimeout(() => {
                        formik.resetForm();
                        setMessage(null)
                    }, 3000)
                }
            })
        }
    })

    return (
        <>
            {/* <!-- ======= Footer ======= --> */}
         
                <footer class="footer"
                
                 style={{
        backgroundColor: "#c6dc0e",
        paddingTop: "4rem",
        paddingBottom: "2rem",
      }}>

<Container>
        <Row className="mb-4">
          <Col md={3}>
            <img src={footerlogo} alt="image" />
            <p style={{ fontSize: "14px" }} className="mt-2">
              In publishing and graphic design, Lorem Ipsum is a placeholder
              text commonly...
            </p>
            <div className="d-flex gap-2 social-icons">
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

          <Col md={3}>
            <h6>
              <strong>Quick Links</strong>
            </h6>
            <ul className="list-unstyled">
              <li>
                <a href="https://widophremit.com/">Home</a>
              </li>
              <li>
                <a href="https://widophremit.com/notify-me/">
                  International Money Transfer
                </a>
              </li>
              <li>
                <a href="https://widophremit.com/blog/">Blog</a>
              </li>
              <li>
                <a href="https://widophremit.com/transfer-money-online-from-australia-to-nigeria/">
                  Transfer Money online from Australia to Nigeria
                </a>
              </li>
              <li>
                <a href="https://widophremit.com/community-responsibility/">
                  Social Responsibility
                </a>
              </li>
            </ul>
          </Col>

          <Col md={3}>
            <h6>
              <strong>Contact</strong>
            </h6>
            <ul className="list-unstyled" style={{ fontSize: "14px" }}>
              <li>
                <FaRegEnvelope />{" "}
                <a href="mailto:support@widophremit.com">
                  support@widophremit.com
                </a>
              </li>
              <li>
                <FaPhoneVolume />
                <a href="tel:02 8001 6495"> 02 8001 6495, 0480 001 611</a>
              </li>
              <li>
                <FaWhatsapp /> <a href="tel:+61480001611">+61480001611</a>
              </li>
            </ul>
          </Col>

          <Col md={3}>
            <h6>
              <strong>Join Our Newsletter</strong>
            </h6>

             <form onSubmit={formik.handleSubmit} className="mb-2">
                <div className="d-flex">
                                        <div className="input-news me-2">
                                            <input
                                                type="text"
                                                {...formik.getFieldProps('email')}
                                                className={clsx(
                                                    'form-control',
                                                    { 'is-invalid': formik.touched.email && formik.errors.email },
                                                    {
                                                        'is-valid': formik.touched.email && !formik.errors.email,
                                                    }
                                                )}
                                                placeholder="Email address"
                                            />
                                        </div>
                                        
                                            <button type="submit">Subscribe</button>
                                        </div>
                                        <div>
                                            {
                                                formik.errors.email && (
                                                    <p>{formik.errors.email}</p>
                                                )
                                            }
                                            {
                                                message && (
                                                    <p>{message}</p>
                                                )
                                            }
                                        </div>
                                    </form>
            <div style={{ fontSize: "14px" }}>
              <h6 className="mt-4">
                <strong>Address</strong>
              </h6>
              <p>
                Level 14, 275 Alfred Street North
                <br />
                Sydney, NEW SOUTH WALES, 2060
                <br />
                Australia
              </p>
            </div>
          </Col>
        </Row>

        <hr />

        <Row
          className="justify-content-between align-items-center sitelinks"
          style={{ fontSize: "14px" }}
        >
          <Col md="auto">
            © Copyright Widoph Remit 2024. All Rights Reserved
          </Col>
          <Col md="auto">
            <a href="https://widophremit.com/widophremit-terms-and-conditions/">
              Terms
            </a>
            &nbsp; | &nbsp;
            <a href="https://widophremit.com/widoph-remit-privacy-policy/">
              Privacy
            </a>
            &nbsp; | &nbsp;
            <a href="https://widophremit.com/contact-us/">Contact</a>
          </Col>
        </Row>
      </Container>

        {/* <Container className="mobile-footer">
        <Row className="mb-4">
                  
                    <div className=" footer-top1  ">

                         <img src={footerlogo} alt="image" />
            <p style={{ fontSize: "14px" }} className="mt-2">
              In publishing and graphic design, Lorem Ipsum is a placeholder
              text commonly...
            </p>
            <div className="d-flex gap-2 social-icons">
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
                        <div onClick={() => toggleAccordion(0)}>
                            <h4>Quick Links  {accordionOpen === 0 ? <img src="assets/img/home/up.png" alt="logo" /> : <img src="assets/img/home/down.png" alt="logo" />} </h4>
                        </div>
                        {accordionOpen === 0 && (
                            <ul className="list-unstyled">
              <li>
                <a href="https://widophremit.com/">Home</a>
              </li>
              <li>
                <a href="https://widophremit.com/notify-me/">
                  International Money Transfer
                </a>
              </li>
              <li>
                <a href="https://widophremit.com/blog/">Blog</a>
              </li>
              <li>
                <a href="https://widophremit.com/transfer-money-online-from-australia-to-nigeria/">
                  Transfer Money online from Australia to Nigeria
                </a>
              </li>
              <li>
                <a href="https://widophremit.com/community-responsibility/">
                  Social Responsibility
                </a>
              </li>
            </ul>
                        )}

                        <div onClick={() => toggleAccordion(1)}>
                            <h4>Contact {accordionOpen === 1 ? <img src="assets/img/home/up.png" alt="logo" /> : <img src="assets/img/home/down.png" alt="logo" />}</h4>
                        </div>
                        {accordionOpen === 1 && (
                             <ul className="list-unstyled" style={{ fontSize: "14px" }}>
              <li>
                <FaRegEnvelope />{" "}
                <a href="mailto:support@widophremit.com">
                  support@widophremit.com
                </a>
              </li>
              <li>
                <FaPhoneVolume />
                <a href="tel:02 8001 6495"> 02 8001 6495, 0480 001 611</a>
              </li>
              <li>
                <FaWhatsapp /> <a href="tel:+61480001611">+61480001611</a>
              </li>
            </ul>
                        )}

                        <div onClick={() => toggleAccordion(2)}>
                            <h4>Legal {accordionOpen === 2 ? <img src="assets/img/home/up.png" /> : <img src="assets/img/home/down.png" alt="logo" />}</h4>
                        </div>
                        {accordionOpen === 2 && (

                            <ul>
                                <li><NavLink to="https://widophremit.com/widophremit-terms-and-conditions">Terms And Conditions</NavLink></li>
                                <li> <NavLink to="https://widophremit.com/widoph-remit-privacy-policy/">Privacy Policy</NavLink></li>
                                <li> <NavLink to="https://widophremit.com/contact-us/">Contact Us</NavLink></li>
                            </ul>
                        )}


                        <div onClick={() => toggleAccordion(3)}>
                            <h4>Join our newsletter {accordionOpen === 2 ? <img src="assets/img/home/up.png" alt="logo" /> : <img src="assets/img/home/down.png" alt="logo" />}</h4>
                        </div>
                        {accordionOpen === 3 && (
                            <div className="newsletterform">
                                <div className="form-ffoter">
                                      <form onSubmit={formik.handleSubmit} className="mb-2">
                <div className="d-flex">
                                        <div className="input-news me-2">
                                            <input
                                                type="text"
                                                {...formik.getFieldProps('email')}
                                                className={clsx(
                                                    'form-control',
                                                    { 'is-invalid': formik.touched.email && formik.errors.email },
                                                    {
                                                        'is-valid': formik.touched.email && !formik.errors.email,
                                                    }
                                                )}
                                                placeholder="Email address"
                                            />
                                        </div>
                                        
                                            <button type="submit">Subscribe</button>
                                        </div>
                                        <div>
                                            {
                                                formik.errors.email && (
                                                    <p>{formik.errors.email}</p>
                                                )
                                            }
                                            {
                                                message && (
                                                    <p>{message}</p>
                                                )
                                            }
                                        </div>
                                    </form>
                                    <div style={{ fontSize: "14px" }}>
              <h6 className="mt-4">
                <strong>Address</strong>
              </h6>
              <p>
                Level 14, 275 Alfred Street North
                <br />
                Sydney, NEW SOUTH WALES, 2060
                <br />
                Australia
              </p>
            </div>
                                </div>
                            </div>
                        )}
                    </div>
 </Row>
      </Container> */}



                </footer>
            
            {/* <!-- ======= End-footer ======= --> */}
        </>
    )
}


export default Footer;