import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Scrollbar from '../scrollbar/Scrollbar';

// card carousel start
const Card = (props) => {
    return (
        <li className="card li_card ">
            <img src="assets/img/home/quote-up.svg" alt="quote-up" className="quotup_icons" />
            <div className="row">
                <div className="col-lg-4">
                    <img src="assets/img/home/boy.svg" alt="boy_icons" className="boy_icons" />
                    <p className="boy_icons_text">Worldtraveler</p>
                </div>
                <div className="col-8">
                    <span className="material-icons">{props.heading}</span>
                    <p className="material-heading">{props.paragraph}</p>
                    <img src="assets/img/help/star.png" />

                </div>
            </div>
            <img src="assets/img/home/quote-down.svg" alt="quote-up" className="quotdown_icons" />
        </li>
    )
}

const Working = () => {

    // Aboutus-Our-Vission-Icons function Start
    function OurVissionArrayObjects() {
        const vissionData = [
            {
                id: 1,
                vission_src: "assets/img/about/1st_icons.svg",
                vission_content: "Our essence is to serve our customers. We are committed to going above and beyond in our quest to ensure the satisfaction of our customers.",
            },
            {
                id: 2,
                vission_src: "assets/img/about/02nd_icons.svg",
                vission_content: "RemitAssure offers customers secure, efficient and cost-effective remittance services.",
            },
            {
                id: 3,
                vission_src: "assets/img/about/03thired_icons.svg",
                vission_content: "We offer very competitive foreign exchange rates due to our lean business model.",
            },
            {
                id: 4,
                vission_src: "assets/img/about/04four_icons.svg",
                vission_content: "Through our digital channels we are able to serve customers irrespective of their location, 24 hours a day, 7 days a week (24/7).",
            },

        ];

        const VissionItems = vissionData.map((vission) => {
            return (
                <li key={vission.id}>
                    <img src={vission.vission_src} className="vission_image" alt="alt_image" />
                    <p className="vission_content">{vission.vission_content}</p>
                </li>
            )
        })
        return (
            <div>
                {VissionItems}
            </div>
        )
    }

    // Aboutus-Our-Vission-Icons function End

    //    Why Function Start 
    function WhyIconsRenderingArrayOfObjects() {
        const whydata = [
            {
                id: 1,
                icon_src: "assets/img/home/Vector02.svg",
                icon_title: "We're Secure",
                icon_content: "We use industry-leading technology to secure your money.",
            },
            {
                id: 2,
                icon_src: "assets/img/home/Vector01.svg",
                icon_title: "We're Fast",
                icon_content: "95% of our transfers are completed in minutes…",
            },
            {
                id: 3,
                icon_src: "assets/img/home/Vector03.svg",
                icon_title: "We’re Cost-effective",
                icon_content: "Our rates are competitive compared to banks and other remittance services.",
            },
            {
                id: 4,
                icon_src: "assets/img/about/Vector04.svg",
                icon_title: "We’re Innovative",
                icon_content: "We're committed to researching new ideas and technology to serve you better.",
            }
        ]
        const ArrayIconsIttems = whydata.map((icon) => {
            return (

                <li key={icon.id}>
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
    //    Why Function End 


    //    Carousel  Function Start 

    const items = [
        {
            heading: "Best on the market 1.",
            paragraph: '1.At ultrices mi tempus imperdiet nulla. Risus nullam eget felis eget nunc lobortis. Fusce id velit ut tortor pretium viverra suspendisse...'
        }, {
            heading: "Best on the market 2.",
            paragraph: '2.B.At ultrices mi tempus imperdiet nulla. Risus nullam eget felis eget nunc lobortis. Fusce id velit ut tortor pretium viverra suspendisse...'
        }, {
            heading: "Best on the market 3.",
            paragraph: '3. At ultrices mi tempus imperdiet nulla. Risus nullam eget felis eget nunc lobortis. Fusce id velit ut tortor pretium viverra suspendisse...'
        }, {
            heading: "Best on the market 4.",
            paragraph: '4.At ultrices mi tempus imperdiet nulla. Risus nullam eget felis eget nunc lobortis. Fusce id velit ut tortor pretium viverra suspendisse...'
        }, {
            heading: "Best on the market 5.",
            paragraph: '5. At ultrices mi tempus imperdiet nulla. Risus nullam eget felis eget nunc lobortis. Fusce id velit ut tortor pretium viverra suspendisse...'
        }, {
            heading: "Best on the market 6.",
            paragraph: '6. At ultrices mi tempus imperdiet nulla. Risus nullam eget felis eget nunc lobortis. Fusce id velit ut tortor pretium viverra suspendisse...'
        }
    ];
    const [moveClass, setMoveClass] = useState('');
    const [carouselItems, setCarouselItems] = useState(items);
    //console.log(items, "carouselItemscarouselItemscarouselItemscarouselItemscarouselItems")

    useEffect(() => {
        document.documentElement.style.setProperty('--num', carouselItems.length);
    }, [carouselItems])

    //  const handleAnimationEnd = () => {
    //    if(moveClass === 'prev'){
    //      shiftNext([...carouselItems]);
    //    }else if(moveClass === 'next'){
    //      shiftPrev([...carouselItems]);
    //    }
    //    setMoveClass('')

    //  }

    //  const shiftPrev = (paragraph) => {
    //    let lastcard = paragraph.pop();
    //    paragraph.splice(0, 0, lastcard);
    //    setCarouselItems(paragraph);
    //  }

    //  const shiftNext = (paragraph) => {
    //    let firstcard = paragraph.shift();
    //    paragraph.splice(paragraph.length, 0, firstcard);
    //    setCarouselItems(paragraph);
    //  }

    // End carousel End


    return (
        <>
  <div className="site-content">
            {/* <!-- ======= AboutUs Our vission and mission-Section  start======= --> */}
            <section className="top_sections11"><div className="container">
<div className="row"><div className="col-md-7 extra-large">
<div className=" headabout">
<h1 className="about-heading">How it <span className="grading-color">Works</span></h1>
</div></div></div></div></section>
            {/* <!-- ======= AboutUs Our vission and mission-Section  End======= --> */}





            <section className="why-us_section homepage-why-us hows-section-light transs ">
                <div className="container">
                    <div className="row custom-row-hows">
                        <div className="col-lg-6 text-start">
                            <img src="assets/img/footer/how-work.webp" />
                        </div>
                        <div className="col-lg-6">
                            <div className="vl about_v1 working-h">
                                <h1 className="vl-heading">Create a RemitAssure account</h1>
                            </div>
                            <div className="vl-content">

                                <p>Provide some personal information and sign up online or via the RemitAssure app.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>



            <section className="why-us_section homepage-why-us hows-section bg-grey">
                <div className="container">

                    <div className="row custom-row-hows">

                        <div className="col-lg-6">
                            <div className="vl about_v1">
                                <h1 className="vl-heading">Verify your Identity</h1>
                            </div>
                            <div className="vl-content">
                                <p>We verify your identity as part of our AML/CTF obligation. Verifying your identity also helps also safeguard your account against potential fraudulent activities.</p>
                            </div>
                        </div>
                        <div className="col-lg-6 text-end">
                            <img src="assets/img/footer/trans2.png" alt="background-images" />
                        </div>

                    </div>

                </div>
            </section>



            <section className="why-us_section homepage-why-us hows-section-light ">
                <div className="container">
                    <div className="row custom-row-hows">
                        <div className="col-lg-6 align-left">
                            <img src="assets/img/footer/trans3.png" alt="background-images" />
                        </div>
                        <div className="col-lg-6">
                            <div className="vl about_v1">
                                <h1 className="vl-heading">Enter your transaction details</h1>
                            </div>
                            <div className="vl-content">
                                <p>Enter the amount you want to send or that you want the recipient to receive. Then, provide the recipient account details. Review and confirm transfer details.
                                </p>
                            </div>
                        </div>

                    </div>


                </div>
            </section>


            <section className="why-us_section homepage-why-us hows-section bg-grey">
                <div className="container">


                    <div className="row custom-row-hows">

                        <div className="col-lg-6">
                            <div className="vl about_v1">
                                <h1 className="vl-heading">Pay for your transaction</h1>
                            </div>
                            <div className="vl-content">
                                <p>We offer different payment rails for our customers. You can pay through:</p>
                                <ul className="new-work">
                                    <li><img src="assets/img/zai/payid_light.svg" alt="background-images" /><p>PayID</p></li>
                                    <li><img src="assets/img/zai/payto_light.svg" alt="background-images" /><p>PayTo</p></li>
                                    <li><img src="assets/img/zai/card.png" alt="background-images" /><p>Debit / Credit Card</p></li>
                                </ul>
                                <p>All three options are real-time so you can rest assured that your funds will be sent once payment is received for your transfer. </p>
                            </div>
                        </div>
                        <div className="col-lg-6 text-end">
                            <img src="assets/img/footer/trans5.png" alt="background-images" />
                        </div>

                    </div>

                </div>
            </section>

            <section className="why-us_section homepage-why-us hows-section-light ">
                <div className="container">

                    <div className="row custom-row-hows">
                        <div className="col-lg-6 text-start">
                            <img src="assets/img/footer/trans4.png" alt="background-images" />
                        </div>
                        <div className="col-lg-6">
                            <div className="vl about_v1">
                                <h1 className="vl-heading">Track the status of your transfer</h1>
                            </div>
                            <div className="vl-content">
                                <p>We notify you at each stage of your transfer through email and SMS. The main stages are:</p>
                                <ul className="new-work1">
                                    <li><img src="assets/img/zai/arrows.png" alt="background-images" /><p>Creation of a Transfer</p></li>
                                    <li><img src="assets/img/zai/transfer.png" alt="background-images" /><p>Receipt of Funds</p></li>
                                    <li><img src="assets/img/zai/transfer1.png" alt="background-images" /><p>Transfer Processed</p></li>
                                    <li><img src="assets/img/zai/account.png" alt="background-images" /><p>Transfer Paid out to Beneficiary</p> </li>
                                </ul>
                            </div>
                        </div>

                    </div>

                </div>
            </section>


            {/* <!-- ======= AboUs Why RemitAssure-Section  start======= --> */}

            {/* <!-- ======= AboUs Why RemitAssure-Section  End======= --> */}

            {/* <!-- ======= Testimonial-Section  start======= --> */}
            {/* <section className="why-us section-bgba why_banner aos-init aos-animate" data-aos="fade-up" date-aos-delay="200">
                <div className="container">
==
                    <div className="row">

                        <div className="testimonial_vl">
                            <h1 className="chose-heading">What customers say about us</h1>



             
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12">
                            <p className="review_content">We do our best to provide you the best experience ever
                            </p>
                        </div>
                    </div>
=
                    <div className="row">
                        <div className="col-lg-12">

                            <Scrollbar />

                          =
                        </div>

                    </div>
          =

                </div>
            </section> */}
            {/* <!-- ======= Home Testimonial-Section End ======= --> */}





            </div>


        </>
    )
}

export default Working; 