import React, { Component, useState } from "react";
import { links, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { generateRandomKey } from "../../utils/hook";
import { debounce } from 'lodash';
import { useFormik } from "formik";
import { hitNewsletter } from "../../utils/Api";
import clsx from "clsx";
import * as Yup from "yup";
import { toast } from "react-toastify";

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
            <div className="container-foter">
                <footer id="footer">
                    <div className="footer-top1 desktop-only">

                        <div className="row">

                            <div className="col-lg-3 col-md-3">
                                <h4>Quick Links</h4>

                                <ul>
                                    <li><NavLink to="/login">Login</NavLink></li>
                                    <li> <NavLink to="/sign-up">Signup</NavLink></li>
                                    <li className="exchange-rate-link" style={{ cursor: "pointer" }} onClick={() => checkExchangeRate()}>Check Exchange Rates</li>
                                    <li className="exchange-rate-link" style={{ cursor: "pointer" }} onClick={() => checkExchangeRate()}>Send Money Overseas</li>
                                    <li className="exchange-rate-link" style={{ cursor: "pointer" }} onClick={() => blogRedirect()}>Blogs</li>
                                    {/* <NavigationFooterArrayObjects  /> */}
                                </ul>
                            </div>

                            <div className="col-lg-2 col-md-2">
                                <h4>Company</h4>
                                <ul>
                                    <li><NavLink to="/about-us">About Us</NavLink></li>
                                    <li className="exchange-rate-link" style={{ cursor: "pointer" }} onClick={() => howItWorks()}>How It Works </li>
                                    <li className="exchange-rate-link" style={{ cursor: "pointer" }} onClick={() => mobileApps()}>Mobile Apps</li>
                                    {/* <li> <NavLink to="/news">News</NavLink></li> */}
                                </ul>
                            </div>

                            <div className="col-lg-2 col-md-2">
                                <h4>Legal</h4>
                                <ul>
                                    <li><NavLink to="/terms-and-condition">Terms And Conditions</NavLink></li>
                                    <li> <NavLink to="/aml-policy">AML Policy </NavLink></li>
                                    <li> <NavLink to="/privacy-policy">Privacy Policy</NavLink></li>
                                    <li> <NavLink to="/anti-bribery-and-corruption-policy">Anti-Bribery and Corruption Policy</NavLink></li>
                                    <li> <NavLink to="/gifts-entertainment-and-hospitality-policy">GEH Policy</NavLink></li>
                                    <li> <NavLink to="/dispute-management-policy">Dispute Management Policy</NavLink></li>
                                    <li> <NavLink to="/whistle-blowing-policy">WhistleBlowing Policy</NavLink></li>
                                </ul>

                            </div>

                            <div className="col-lg-5 col-md-5">

                                <h4>Join our newsletter</h4>

                                <div className="newsletterform">
                                    <div className="form-ffoter">
                                        <form onSubmit={formik.handleSubmit} className="news-ll">
                                            <div className="input-news">
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
                                            <div className="button-new">
                                                <div className="btn-con "><button type="submit">Subscribe</button></div>
                                            </div>
                                            <div className="error_subr">
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
                                    </div>
                                    {/* <p className="content-news">In publishing and graphic design, Lorem ipsum is a placeholder text commonly.</p> */}
                                </div>


                            </div>

                        </div>
                    </div>
                    <div className=" footer-top1  mobile-footer">

                        <div className="footer-info1 footer-last-logo mobile--logo">
                            <div className="icon-ffoter">
                                <img src="assets/img/home/footer-logo.webp" className="logo-foo" alt="logo" />


                            </div>
                        </div>
                        <div onClick={() => toggleAccordion(0)}>
                            <h4>Quick Links  {accordionOpen === 0 ? <img src="assets/img/home/up.png" alt="logo" /> : <img src="assets/img/home/down.png" alt="logo" />} </h4>
                        </div>
                        {accordionOpen === 0 && (
                            <ul>
                                <li><NavLink to="/login">Login</NavLink></li>
                                <li> <NavLink to="/sign-up">Signup</NavLink></li>
                                <li className="exchange-rate-link" style={{ cursor: "pointer" }} onClick={() => checkExchangeRate()}>Check Exchange Rates</li>
                                <li className="exchange-rate-link" style={{ cursor: "pointer" }} onClick={() => checkExchangeRate()}>Send Money Overseas</li>
                                {/* <NavigationFooterArrayObjects  /> */}
                            </ul>
                        )}

                        <div onClick={() => toggleAccordion(1)}>
                            <h4>Company {accordionOpen === 1 ? <img src="assets/img/home/up.png" alt="logo" /> : <img src="assets/img/home/down.png" alt="logo" />}</h4>
                        </div>
                        {accordionOpen === 1 && (
                            <ul>
                                <li><NavLink to="/about-us">About Us</NavLink></li>
                                <li className="exchange-rate-link" style={{ cursor: "pointer" }} onClick={() => howItWorks()}>How It Works</li>
                                <li className="exchange-rate-link" style={{ cursor: "pointer" }} onClick={() => mobileApps()}>Mobile Apps</li>
                                {/* <li> <NavLink to="/news">News</NavLink></li> */}
                            </ul>
                        )}







                        <div onClick={() => toggleAccordion(2)}>
                            <h4>Legal {accordionOpen === 2 ? <img src="assets/img/home/up.png" /> : <img src="assets/img/home/down.png" alt="logo" />}</h4>
                        </div>
                        {accordionOpen === 2 && (
                            <ul>
                                <li><NavLink to="/terms-and-condition">Terms And Conditions</NavLink></li>
                                <li> <NavLink to="/aml-policy">AML Policy </NavLink></li>
                                <li> <NavLink to="/privacy-policy">Privacy Policy</NavLink></li>
                                <li> <NavLink to="/anti-bribery-and-corruption-policy">Anti-Bribery and Corruption Policy</NavLink></li>
                                <li> <NavLink to="/gifts-entertainment-and-hospitality-policy">GEH Policy</NavLink></li>
                                <li> <NavLink to="/dispute-management-policy">Dispute Management Policy</NavLink></li>
                                <li> <NavLink to="/whistle-blowing-policy">WhistleBlowing Policy</NavLink></li>
                            </ul>
                        )}


                        <div onClick={() => toggleAccordion(3)}>
                            <h4>Join our newsletter {accordionOpen === 2 ? <img src="assets/img/home/up.png" alt="logo" /> : <img src="assets/img/home/down.png" alt="logo" />}</h4>
                        </div>
                        {accordionOpen === 3 && (
                            <div className="newsletterform">
                                <div className="form-ffoter">
                                    <form onSubmit={formik.handleSubmit}>
                                        <div className="input-news">
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
                                        <div className="button-new">
                                            <div className="btn-con "><button type="submit">Subscribe</button></div>
                                        </div>
                                        <div >
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
                                </div>
                                {/* <p className="content-news">In publishing and graphic design, Lorem ipsum is a placeholder text commonly.</p> */}
                            </div>
                        )}
                    </div>

                    <div className="bottom-footer">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="footer-info1 footer-logo">
                                    <div className="icon-ffoter ">
                                        <img src="assets/img/home/mail.png" alt="qqt" />

                                    </div>
                                    <div className="infor-content">
                                        <a href="mailto:crm@remitassure.com">crm@remitassure.com</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">

                                <div className="footer-info1 center-content">
                                    <div className="icon-ffoter">
                                        <img src="assets/img/home/footer2.png" alt="logo" />


                                    </div>
                                    <div className="infor-content">
                                        <a href="https://api.whatsapp.com/send/?phone=61421192684&text&type=phone_number&app_absent=0" target="_blank">+61421192684</a>
                                    </div>


                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="footer-info1 right-content">
                                    <div className="icon-ffoter">
                                        <img src="assets/img/home/footer3.png" alt="logo" />


                                    </div>
                                    <div className="infor-content">
                                        <a href="tel:1300284228" target="_blank">1300 284 228 (toll free)</a>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer-divder">
                        <div className="borderdevider"></div>
                    </div>


                    <div className="bottom-footer bottom-none">
                        <div className="row">
                            <div className="col-md-3">
                                <div className="footer-info1 footer-last-logo desktop-onlyy">
                                    <div className="icon-ffoter">
                                        <img src="assets/img/home/footer-logo.webp" className="logo-foo" alt="logo" />


                                    </div>

                                </div>
                            </div>
                            <div className="col-md-6 footer-linksss">

                                <div className="footer-info1 center-content">
                                    <div className="icon-ffoter">

                                        <ul className="footer-bottom-links">
                                            <li><NavLink to="/terms-and-condition">Terms And Conditions</NavLink></li>

                                            <li> <NavLink to="/privacy-policy">Privacy Policy</NavLink></li>
                                            <li> <NavLink to="/aml-policy"> AML Policy  </NavLink></li>
                                        </ul>



                                    </div>



                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="footer-info1 right-content">
                                    <div className="icon-ffoter">
                                        <div className="social-links ">
                                            <a className="twitter" target="_blank" href="https://twitter.com/remitassure" aria-label="twitter">  <img src="assets/img/home/twiter.svg" alt="logo" /></a>
                                            <a className="facebook" target="_blank" href="https://www.facebook.com/remitassure" aria-label="facebook"><img src="assets/img/home/facebook.svg" alt="logo" /></a>
                                            <a className="instagram" target="_blank" href="https://www.instagram.com/media.remitassure/" aria-label="instagram"><img src="assets/img/home/ig.svg" alt="logo" /></a>
                                            <a className="instagram" target="_blank" href="https://www.linkedin.com/company/remitassure/" aria-label="link Us"><img src="assets/img/home/Linkedin Logo.svg" alt="logo" /></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="container pt-4">
                                <div className="row reserved_content">
                                    <div className="copyright">&copy; Copyright &nbsp;
                                        <strong>
                                            <span>RemitAssure</span>
                                        </strong>. All Rights Reserved
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>





                </footer>
            </div>
            {/* <!-- ======= End-footer ======= --> */}
        </>
    )
}


export default Footer;