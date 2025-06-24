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

const News = () => {

    // Aboutus-Our-Vission-Icons function Start
    function OurVissionArrayObjects() {
        const vissionData = [
            {
                id: 1,
                vission_src: "assets/img/about/1st_icons.svg",
                vission_content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
            },
            {
                id: 2,
                vission_src: "assets/img/about/02nd_icons.svg",
                vission_content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
            },
            {
                id: 3,
                vission_src: "assets/img/about/03thired_icons.svg",
                vission_content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
            },
            {
                id: 4,
                vission_src: "assets/img/about/04four_icons.svg",
                vission_content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
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
                id: "1",
                icon_src: "assets/img/about/Vector01.svg",
                icon_title: "We’re Secure",
                icon_content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

            },
            {
                id: "2",
                icon_src: "assets/img/about/Vector02.svg",
                icon_title: "We're Fast",
                icon_content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

            },
            {
                id: "3",
                icon_src: "assets/img/about/Vector03.svg",
                icon_title: "We’re Cost-effective",
                icon_content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

            },
            {
                id: "4",
                icon_src: "assets/img/about/Vector04.svg",
                icon_title: "We’re Innovative",
                icon_content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

            },
        ];
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
                                    <h1 className="vl-heading">News</h1>
                                    <div className="vl-content about_content">
                                        {/* <p className="our_vission">Our vission and mission statement will go here</p> */}
                                        <br />
                                        <p className="our_vission01">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                        <p className="our_vission01">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                                        <p className="our_vission01">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
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
            <section className="why-us section-bgba aos-init aos-animate">
                <div className="container">

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="vl about_v1 about_vl about_v1">
                                <h1 className="vl-heading">Why RemitAssure ?</h1>
                                <div className="about_why_heading">
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12 col-lg-12 secure_content">
                            <ul className="about_why-ramit-assure page_about-sec">
                                < WhyIconsRenderingArrayOfObjects />
                            </ul>
                        </div>
                    </div>

                </div>
            </section>
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

export default News; 