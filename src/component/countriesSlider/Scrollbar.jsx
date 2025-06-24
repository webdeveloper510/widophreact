import React, { useRef } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";


const Scrollbar = ({ handler }) => {
  const carouselRef = useRef(null);

  const responsive = {
    largescreen: {
      breakpoint: { max: 3000, min: 1367 },
      items: 4
    },
    desktop: {
      breakpoint: { max: 3000, min: 992 },
      items: 4,
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
      heading: "Philippines ",
      abbreviation: "PHP",
      image: "assets/img/home/philippines.webp",
    }, {
      heading: "Ghana  ",
      abbreviation: "GHS",
      image: "assets/img/home/ghana.webp",
    }, {
      heading: "Nigeria ",
      abbreviation: "USD",
      image: "assets/img/home/nigeria.webp",
      value: "USD"
    }, {
      heading: "Kenya ",
      abbreviation: "KES",
      image: "assets/img/home/kenya.webp",
    }, {
      heading: "Thailand ",
      abbreviation: "THB",
      image: "assets/img/home/country5.webp"
    }, {
      heading: "Vietnam ",
      abbreviation: "VND",
      image: "assets/img/home/country6.webp"
    }, {
      heading: "Nigeria ",
      abbreviation: "NGN",
      image: "assets/img/home/nigeria.webp"
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
    <div className="custome-country">
      <div className="custom-button-group country-slider-arrow for-desk">
        <button onClick={handlePrev} className="pre-sli " aria-label="Previous Slide"><img src="assets/img/home/skyiconarrow.png" alt="logo"/></button>
        <button onClick={handleNext} className="next-sli" aria-label="next Slide" ><img src="assets/img/home/bluearrow.png" alt="logo"/></button>
      </div>
      <Carousel
        ssr={false}
        ref={carouselRef}
        partialVisible={false}
        responsive={responsive}
        containerClass="carousel-container-with-scrollbar"
        additionalTransfrom={-0}
        itemClass="image-item"
        autoPlay={true} // Enable autoplay
        autoPlaySpeed={2000}
        infinite={true}
        // customButtonGroup={<CustomSlider />}
        beforeChange={(nextSlide) => {
          // ... your beforeChange logic
        }}
      >
        {items?.map((item, index) => {
          return (

            <div className="flags-container" key={index} onClick={() => handler(item.abbreviation)} style={{ cursor: "pointer" }}>

              <div className="image-container-text" draggable={false} >

                <div className="row items-start">
                  <img src={item.image} alt="quote-up" />
                  <label>{item.heading} <b> ({item.abbreviation})</b></label>
                </div>



              </div>

            </div>
          );
        })}
      </Carousel>
      <div className="custom-button-group country-slider-arrow for-mobilee">
        <button onClick={handlePrev} className="pre-sli"><img src="assets/img/home/skyiconarrow.png" alt="logo"/></button>
        <button onClick={handleNext} className="next-sli"><img src="assets/img/home/bluearrow.png" alt="logo"/></button>
      </div>

    </div>
  );
};

export default Scrollbar;
