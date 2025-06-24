import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { getReferral, getReferralAmount } from "../../utils/Api";



// card carousel start
const Card = (props) => {
    return (
        <li className="card li_card ">
            <img src="assets/img/referral/Group.svg" alt="quote-up" className="Group_icons" />
            <div className="row">
                <div className="col-md-12">
                    <div className="testimonial-text">
                        <p className="material_heading_card">{props.paragraph}</p>
                        <img src={props.crad_icons} alt="group_card" className="group_card_icon" />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12 col-lg-12 testimonial-client">
                    <div className="testimonial-inner">
                        <img src="assets/img/referral/girl.svg" alt="boy_icons" className="testimonial-icons" />
                        <h3 className="kevin_content">Kevin Rich</h3>
                        <p className="testimonial_icons_text">Lorem Ipsum is simply</p>
                    </div>
                </div>
            </div>
            {/* <img src="assets/img/home/quote-down.png" alt="quote-up" className="quotdown_icons" />    */}
        </li>
    )
}


const Referral = () => {

    const token = sessionStorage.getItem("token");
    // console.log("TOKEN", token);

    const signup_token = sessionStorage.getItem("signup_token")
    // console.log("signup_token", signup_token);

    const verification_otp = sessionStorage.getItem("verification_otp");
    // console.log("Verification Message", verification_otp)

    /**************************Recipient of state ************************ */
    const [dataRefferal, setDataRefferal] = useState({});
    const [referral_cost, setReferralCost] = useState(() => {
        if (sessionStorage.getItem("ref-x-2-rem")) {
            let obj = JSON.parse(sessionStorage.getItem("ref-x-2-rem"))
            return { referred_by_amount: obj?.rb, referred_to_amount: obj?.rt }
        }
    })


    /**************************************************************************
   * ************** Start  Start Referral Code ********************
   * ***********************************************************************/

    useEffect(() => {
        getReferral().then(res => {
            // console.log(res)
            setDataRefferal(res.data)
        })
        getReferralAmount().then(res => {
            // console.log(res)
            setReferralCost(res?.data)
        })
    }, [])

    // Social Function start
    function SocialArrayObjects() {
        const socialdata = [
            {
                id: 1,
                links: "https://twitter.com/remitassure",
                src: "assets/img/referral/twitter.svg"
            }, {
                id: 2,
                links: "https://www.facebook.com/remitassure",
                src: "assets/img/referral/facebook.svg"
            },
            {
                id: 3,
                links: "https://www.instagram.com/media.remitassure/",
                src: "assets/img/referral/instagram.svg"
            },
            {
                id: 4,
                links: "https://www.linkedin.com/company/remitassure/",
                src: "assets/img/referral/linkedin.svg"
            },

        ];

        const socialItems = socialdata.map((social) => {
            return (
                <li>
                    <div>
                        <a href={social.links} target="_blank" >
                            <img src={social.src} alt="can't show image" />
                        </a>
                    </div>
                </li>
            )
        });
        return (
            <div>
                {socialItems}
            </div>
        )
    }
    // Social Function End

    //    Why Function Start 
    function WhyIconsRenderingArrayOfObjects() {
        const whydata = [
            {
                id: "1",
                icon_src: "assets/img/referral/Vector01.svg",
                icon_title: "We're Secure",
                icon_content: "We use industry-leading technology to secure your money.",

            },
            {
                id: "2",
                icon_src: "assets/img/referral/Vector02.svg",
                icon_title: "We're Fast",
                icon_content: "95% of our transfers are completed in minutes…",

            },
            {
                id: "3",
                icon_src: "assets/img/referral/Vector04.svg",
                icon_title: "We’re Cost-effective",
                icon_content: "Our rates are competitive compared to banks and other remittance services.",

            },
            {
                id: "4",
                icon_src: "assets/img/referral/Vector03.svg",
                icon_title: "We’re Innovative",
                icon_content: "We're committed to researching new ideas and technology to serve you better.",

            },
        ];
        const ArrayIconsIttems = whydata.map((icon) => {
            return (

                <li>
                    <div className="circle-icons">
                        <img src={icon.icon_src} alt="circle-image" />
                    </div>
                    <div className="circle-content">
                        <p className="why_text">{icon.icon_title}</p>
                        <p className="why_texto1">{icon.icon_content}</p>
                    </div>

                </li>

            )
        })
        return (
            <div>
                {ArrayIconsIttems}
            </div>
        )
    }


    //    Why Function Start 

    const items = [

        {
            crad_icons: "assets/img/referral/Group_star.png",
            paragraph: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the'
        }, {
            crad_icons: "assets/img/referral/Group_star.png",
            paragraph: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the'
        }, {
            crad_icons: "assets/img/referral/Group_star.png",
            paragraph: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the'
        }, {
            crad_icons: "assets/img/referral/Group_star.png",
            paragraph: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the'
        }, {
            crad_icons: "assets/img/referral/Group_star.png",
            paragraph: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the'
        }, {
            crad_icons: "assets/img/referral/Group_star.png",
            paragraph: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the'
        }
    ];

    const [moveClass, setMoveClass] = useState('');
    const [carouselItems, setCarouselItems] = useState(items);
    //console.log(items, "carouselItemscarouselItemscarouselItemscarouselItemscarouselItems")

    useEffect(() => {
        document.documentElement.style.setProperty('--num', carouselItems.length);
    }, [carouselItems])

    const handleAnimationEnd = () => {
        if (moveClass === 'prev') {
            shiftNext([...carouselItems]);
        } else if (moveClass === 'next') {
            shiftPrev([...carouselItems]);
        }
        setMoveClass('')
    }

    const shiftPrev = (paragraph) => {
        let lastcard = paragraph.pop();
        paragraph.splice(0, 0, lastcard);
        setCarouselItems(paragraph);
    }

    const shiftNext = (paragraph) => {
        let firstcard = paragraph.shift();
        paragraph.splice(paragraph.length, 0, firstcard);
        setCarouselItems(paragraph);
    }

    const [is_copied, setIsCopied] = useState(false)

    const copyToClip = (value) => {
        navigator.clipboard.writeText(value)
        setIsCopied(true)
        setTimeout(() => {
            setIsCopied(false)
        }, 3000)
    }

    // End carousel End

    return (
        <>
            <div className="site-content">

                {/* <!-- ======= GBP for friends Remitassur -Section  start======= --> */}
                <section className="section-img">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-7">
                                <div className=" headabout">
                                    <h1 className="about-heading">{referral_cost?.referred_by_amount} AUD For You And <br></br><span className="grading-color">{referral_cost?.referred_to_amount} AUD For Your Friends</span></h1>
                                </div>
                                <div className="content_referral">

                                    <p className="our_vission01">Once they’ve sent AUD 100 or more,
                                        you’ll get an AUD {referral_cost?.referred_by_amount} RemitAssure Voucher</p>
                                </div>

                            </div>



                        </div>
                    </div>
                </section>
                {/* <!-- ======= GBP for friends Remitassur -Section  End======= --> */}


                {/* <!-- ======= How do I refer a friend? Remitassur -Section  start======= --> */}
                <section className="why-us section-bgba referal-section">
                    <div className="container">

                        <div className="row">
                            <div className="col-lg-12">
                                <div className="vl04">
                                    <h1 className="vl-heading">How do I refer a friend?</h1>
                                </div>
                                <p className="refer_content">Follow these 4 easy steps</p>
                            </div>
                        </div>


                        <div className="timeline desktop_timeline">

                            <div className="timeline-content col-lg-3">
                                <p className="timeline-text odd">Sign up</p>

                                <div className="popup_content odd-text">
                                    <p className="signup_content">1</p>

                                </div>
                            </div>
                            <div className="timeline-content col-lg-3">
                                <div className="popup_content even-text">
                                    <p className="signup_content">2</p>
                                </div>
                                <p className="timeline-text even">Transfer Funds</p>
                            </div>
                            <div className="timeline-content col-lg-3">
                                <p className="timeline-text odd"> Share your referral code with family and friends</p>
                                <div className="popup_content odd-text">
                                    <p className="signup_content">3</p>
                                </div>
                            </div>
                            <div className="timeline-content col-lg-3">

                                <div className="popup_content even-text">
                                    <p className="signup_content">4</p>
                                </div>
                                <p className="timeline-text even"> When they sign up and send funds through their account, you both receive a voucher</p>
                            </div>

                        </div>


                        <div className="timeline mobile_timeline">

                            <div className="timeline-content col-lg-3">
                                <p className="timeline-text odd">Sign up</p>

                                <div className="popup_content odd-text">
                                    <p className="signup_content">1</p>

                                </div>
                            </div>
                            <div className="timeline-content col-lg-3">
                                <p className="timeline-text odd">Transfer Funds</p>
                                <div className="popup_content odd-text">
                                    <p className="signup_content">2</p>
                                </div>

                            </div>
                            <div className="timeline-content col-lg-3">
                                <p className="timeline-text odd"> Share your referral code with family and friends</p>
                                <div className="popup_content odd-text">
                                    <p className="signup_content">3</p>
                                </div>
                            </div>
                            <div className="timeline-content col-lg-3">
                                <p className="timeline-text odd"> When they sign up and send funds through their account, you both receive a voucher</p>
                                <div className="popup_content odd-text">
                                    <p className="signup_content">4</p>
                                </div>
                            </div>
                        </div>
                        {
                            verification_otp || token != undefined || '' ? (
                                <div className="referal_code">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <p className="share_referal_code">Share your unique referral code:</p>

                                            <InputGroup className="mb-3">
                                                <Form.Control
                                                    aria-label="Recipient's username"
                                                    aria-describedby="basic-addon2"
                                                    value={dataRefferal?.referral_code}
                                                    id="myInput" className="copy_input referral_input"
                                                    readOnly
                                                />
                                                <button variant="outline-secondary" id="button-addon2" className="button_copy" onClick={() => { copyToClip(dataRefferal?.referral_code) }}>
                                                    {is_copied ? "Copied" : "Copy"}
                                                </button>
                                            </InputGroup>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="social_links_change"></div>
                                </>
                            )
                        }

                        {/* <div className="referal_code">
                      <div className="row">
                          <div className="col-lg-12">
                              <p className="share_referal_code">Share your unique referral code:</p>
  
                              <InputGroup className="mb-3">
                                  <Form.Control aria-label="Recipient's username" aria-describedby="basic-addon2" value="275878274565826758367" id="myInput" className="copy_input" />
  
                                  <button variant="outline-secondary" id="button-addon2" className="button_copy">
                                      Copy
                                  </button>
                              </InputGroup>
                          </div>
                      </div>
                  </div>
                             */}

                    </div>
                </section>



            </div>


        </>

    )
}



export default Referral;