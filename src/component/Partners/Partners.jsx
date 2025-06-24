import React, { useRef } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";


const Partners = () => {
  const carouselRef = useRef(null);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 992 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 992, min: 450 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 450, min: 0 },
      items: 3,
    },
  };

  const CustomSlider = ({ carouselState }) => {
    // ... your CustomSlider component content
  };

  const items = [
    {

      image: "assets/img/home/am.webp",

    }, {
      image: "assets/img/home/ver.webp",
    },
    {
      image: "assets/img/home/image92.webp",
    },
    {
      image: "assets/img/home/image93.webp",
    },
    {
      image: "assets/img/home/image94.webp",
    },
    {
      image: "assets/img/home/image95.webp",
    },



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
        autoPlay={true} // Enable autoplay
        autoPlaySpeed={3000}
        infinite={true}
        // customButtonGroup={<CustomSlider />}
        beforeChange={(nextSlide) => {
          // ... your beforeChange logic
        }}
      >
        {items?.map((item) => {
          return (
            <div className="partners">

              <div className="image-container-text" draggable={false}>

                <div className="">
                  <div className="">
                    <img src={item.image} alt="quote-up" className="vs" /></div>
                </div>
                {/* <img src="assets/img/home/quote-up.svg" alt="quote-up" className="quotup_icons" /> */}

                {/* <img src="assets/img/home/quote-down.svg" alt="quote-up" className="quotdown_icons" /> */}

              </div>

            </div>
          );
        })}
      </Carousel>


      <div className="custom-button-group for-mobileee">
        <button onClick={handlePrev} className="pre-sli" aria-label="Previous Slide"><img src="assets/img/home/arrow1 (1).png" alt="logo" /></button>
        <button onClick={handleNext} className="next-sli" aria-label="Nex Slide"><img src="assets/img/home/nextsli.png" alt="logo" /></button>
      </div>

    </div>
  );
};

export default Partners;
