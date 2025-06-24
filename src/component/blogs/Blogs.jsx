import React, { useEffect, useRef, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { fetchBlogs } from "../../utils/Api";
import { Link } from "react-router-dom";
import { generateSlug } from "../../utils/hook";


const Blogs = () => {

  const [blogs, setBlogs] = useState([])
  const carouselRef = useRef(null);

  const responsive = {
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

  useEffect(() => {
    fetchBlogs().then(res => {
      if (res?.data && res?.data?.length > 0) {
        console.log(res)
        setBlogs(res?.data)
      }
    })
  }, [])

  function formatDate(datetimeString) {
    const date = new Date(datetimeString);

    const day = date.getUTCDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getUTCFullYear();

    const daySuffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `${day}${daySuffix(day)} ${month} ${year}`;
  }

  const sliceText = (rawText, charLimit) => {
    return rawText.slice(0, charLimit) + '...';
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
        beforeChange={(nextSlide) => {
          // ... your beforeChange logic
        }}
      >
        {blogs?.map((item) => {
          return (
            <Link to={`blogs/${generateSlug(item?.name)}`} state={{ id: item?.id }} >
              <div className="blogs h-100 cursor-pointer">
                <div className="image-container-text" draggable={false}>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="blogimag"><img height={"200px"} src={process.env.REACT_APP_API_URL + "/media/" + item?.image} alt="quote-up" className="bloggim" /></div>
                    </div>
                    <div className="date mt-2">
                      <div className="date-icon">
                        <img src={'assets/img/home/dateicon.svg'} alt="quote-up" className="" />
                      </div>
                      <div className="dattenum">
                        {formatDate(item?.created_at)}
                      </div>           </div>
                    <div className="blogheading">
                      <h3>{sliceText(item?.name, 50)}</h3>
                    </div>
                    <div className="bloginfo">
                      {
                        item.short_description ? (
                          <p>{sliceText(item?.short_description, 175)}</p>
                        ) : (
                          <p dangerouslySetInnerHTML={{ __html: sliceText(item?.description, 175) }}></p>
                        )
                      }
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </Carousel>
      <div className="custom-button-group">
        <button onClick={handlePrev} className="pre-sli" aria-label="Previous Slide"><img src="assets/img/home/arrow1 (1).png" alt="logo" /></button>
        <button onClick={handleNext} className="next-sli" aria-label="next Slide"><img src="assets/img/home/nextsli.png" alt="logo" /></button>
      </div>
    </div>
  );
};

export default Blogs;