import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Scrollbar from '../scrollbar/Scrollbar';
import RemitAssure from "../WhyRemitAssure/RemitAssure";

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

const Mobile = () => {

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

            {/* <!-- ======= AboutUs Our vission and mission-Section  start======= --> */}
            <section className="why-us section-bgba banner_section about_banner innre_about">
                <div id="about">
                    <div className="container">
                        <div className="row custom-height">
                            <div className="col-sm-8">
                                <div className="vl about_v1">
                                    <h1 className="vl-heading">Mobile Apps</h1>
                                    <div className="vl-content about_content">
                                        {/* <p className="our_vission">Our vission and mission statement will go here</p> */}
                                        <br />
                                        <p className="our_vission01">RemitAssure is an innovative Fintech that offers disruptive digital peer-to-peer (P2P) remittance services across the globe.</p>
                                        <p className="our_vission01">Underpinning our Services is our industry leading remittance platform purpose-built to offer robust and scalable digital payment solutions to our clients.</p>
                                        <p className="our_vission01">Leveraging digital technology and emerging service-sharing models, we offer international remittances at very competitive rates. Our lean business structure and exchanging rate hedging know-how affords us marginal cost savings that we happily pass through to customers.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4 right_side">
                                <img src="assets/img/about/right_about.svg" />
                            </div>
                        </div>
                        <div className="bottpm_banner">
                            <div className="row">
                                <ul className="About_why-content">
                                    <OurVissionArrayObjects />
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* <!-- ======= AboutUs Our vission and mission-Section  End======= --> */}

            {/* <!-- ======= AboUs Why RemitAssure-Section  start======= --> */}
            <RemitAssure></RemitAssure>
           
            {/* <!-- ======= AboUs Why RemitAssure-Section  End======= --> */}

            {/* <!-- ======= Testimonial-Section  start======= --> */}
            {/* <section className="why-us section-bgba why_banner aos-init aos-animate" data-aos="fade-up" date-aos-delay="200">
                <div className="container">

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

                    <div className="row">
                        <div className="col-lg-12">

                            <Scrollbar />

                        
                        </div>

                    </div>
                

                </div>
            </section> */}
            {/* <!-- ======= Home Testimonial-Section End ======= --> */}








        </>
    )
}

export default Mobile; 