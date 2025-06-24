import React, { useRef } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";


const Scrollbar = () => {
  const carouselRef = useRef(null);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 992 },
      items: 2,
    },
    tablet: {
      breakpoint: { max: 992, min: 450 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 450, min: 0 },
      items: 1,
    },
  };

  const CustomSlider = ({ carouselState }) => {
    // ... your CustomSlider component content
  };

  const items = [
    {
      name: "Peter Willson",
      author: "assets/img/home/test2.webp",
      heading: "Best on the market",
      image: "assets/img/referral/Group_star1.png",
      paragraph: 'I absolutely love this platform. Its so easy and user- friendly. Though my first time, it felt like second nature using it to transfer funds.I highly recommend it to anyone seeking a reliable and efficient money transfer service.'
    }, {
      name: "Luca",
      author: "assets/img/home/test22.webp",
      heading: "Best on the market ",
      image: "assets/img/referral/Group_star1.png",
      paragraph: 'I have tried various international money transfer services, but RemitAssure truly stands out. Its user-friendly and the service is seamless. I certainly will use RemitAssure again.'
    }, {
      name: "Dario",
      author: "assets/img/home/test2.webp",
      heading: "Best on the market",
      image: "assets/img/referral/Group_star.png",
      paragraph: 'RemitAssure is an execellent platform to use. I was taken aback by the speed at which my transfer was completed. It certainly beat my expectation'
    }, {
      name: "Arianna",
      author: "assets/img/home/test22.webp",
      heading: "Best on the market",
      image: "assets/img/referral/Group_star2.png",
      paragraph: 'RemitAssures exchange rates are amazing, certainly the best I have seen. For such an efficient and user-friendly service, they are are certainly value for money'
    }, {
      name: "Dante",
      author: "assets/img/home/test2.webp",
      heading: "Best on the market",
      image: "assets/img/referral/Group_star.png",
      paragraph: 'I have tried several money transfer services, but RemitAssure has won me over.Their platform is easy to navigate, making the entire process smooth and hassle- free.RemitAssure has become my go - to choice for sending money internationally.'
    }, {
      name: "Bianca",
      author: "assets/img/home/test22.webp",
      heading: "Best on the market",
      image: "assets/img/referral/Group_star1.png",
      paragraph: 'I especially love the rigour of this platform and its focus on security and fraud prevention. Once onbaorded, one feels like this is a platform to be trusted for secure money transfer'
    }
  ];

  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  const handlePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.previous();
    }
  };

  return (
    <div>
      <Carousel
        ssr={false}
        ref={carouselRef}
        partialVisible={false}
        responsive={responsive}
        containerClass="carousel-container-with-scrollbar"
        additionalTransfrom={-0}
        autoPlay={true}
        autoPlaySpeed={2000}
        infinite={true}
        // customButtonGroup={<CustomSlider />}
        beforeChange={(nextSlide) => {
          // ... your beforeChange logic
        }}
      >
        {items?.map((item, index) => {
          return (

            <div
              key={index}
              className={`testimonail ${index % 2 === 0 ? 'even' : 'odd'}`}
              testimonail  >


              <div className="image-container-text" draggable={false}>
                <div className="row">
                  <div className="arrow-sy desktop-only">
                    <img src="assets/img/home/qote.webp" alt="qt">

                    </img>
                  </div>

                  <div className="col-md-4 img-con">
                  <img src={item.author} alt="quote-up" className="authrimg" />
          </div>
          <div className="arrow-sy mobile-only center-arr">
                    <img src="assets/img/home/qote.webp" alt="qt">

                    </img>
                  </div>
                  <div className="col-md-8 center-text-test">
                  <h2 className="author-name">{item.name}</h2> 
                    <p className="material-heading fw-light">{item.paragraph}</p>
                    <img src={item.image} alt="quote-up" className="testimonial-rating" />
                  </div>
                </div>
                {/* <img src="assets/img/home/quote-up.svg" alt="quote-up" className="quotup_icons" /> */}

                {/* <img src="assets/img/home/quote-down.svg" alt="quote-up" className="quotdown_icons" /> */}

              </div>

            </div>
          );
        })}
      </Carousel>

      <div className="custom-button-group">
        <button onClick={handlePrev} className="pre-sli " aria-label="Previous Slide"><img src="assets/img/home/arrow1 (1).png" alt="logo"  /></button>
        <button onClick={handleNext} className="next-sli" aria-label="Next Slide"><img src="assets/img/home/nextsli.png"  alt="logo" /></button>
      </div>
    </div>
  );
};

export default Scrollbar;
