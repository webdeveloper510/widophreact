import React, { useRef } from "react";
import { Link, useLocation } from "react-router-dom";




const RemitAssure = () => {
  const path = useLocation()?.pathname

  return (
    <section className="why-us_section homepage-why-us">
      <div className="container">
        <h1 className="vl-heading">Why RemitAssure ?</h1>

        <div className="vl-content">
          <p className="vl-paragraph padding-top-0">
            Our essence is to offer exceptional remittance services to our customers
          </p>
        </div>
        <div className="row mb-3">
          <div className="custom-col5">
            <div className="remit_keypoints light_box_bg">
              <img src="assets/img/home/icon1.svg" alt="background-icons" />
              <h4>We're Secure</h4>
              <p>We use industry-leading <br></br>technology to secure <br></br>your money.</p>
            </div>
          </div>
          <div className="custom-col2 no-padding">
            <div className="remit_keypoints">
              <img src="assets/img/home/icon2.svg" alt="background-icons" />
              <h4>We're Fast</h4>
              <p>95% of our transfers<br></br> are completed in<br></br> minutes…</p>
            </div>
          </div>
          {
            path !== "/about-us" ? (
              <div className="custom-col5 desktop-only">
                <div className="remit_keypoints">
                  <h1>Know more in detail about <p>RemitAssure</p></h1>
                  <Link to="/about-us" className="btn-ab" aria-label="About Us"><img src="assets/img/home/Union.png"  alt="background-images"/></Link>
                </div>
              </div>
            ) : (
              <div className="custom-col5 desktop-only">
                <div className="remit_keypoints remit-h">
                  <h1><p >RemitAssure</p></h1>
                </div>
              </div>
            )
          }

        </div>

        <div className="row">
          <div className="custom-col5 desktop-only">
            <div className="remit_keypoints dark_box_bg">

            </div>
          </div>
          <div className="custom-col2 no-padding">
            <div className="remit_keypoints">
              <img src="assets/img/home/icon3.svg" alt="background-icons" />
              <h4>We're Cost-effective</h4>
              <p>Our rates are competitive <br></br>compared to banks and <br></br>other remittance services.</p>
            </div>
          </div>
          <div className="custom-col5">
            <div className="remit_keypoints light_box_bg">
              <img src="assets/img/home/icon4.svg" alt="background-icons" />
              <h4>We're Innovative</h4>
              <p>We're committed to researching <br></br>new ideas and technology to <br></br>serve you better.</p>
            </div>
          </div>

        </div>
		   {
            path !== "/about-us" ? (
              <div className="custom-col5 mobile-only">
                <div className="remit_keypoints">
                  <h1>Know more in detail about <p>RemitAssure</p></h1>
                  <Link to="/about-us" className="btn-ab" aria-label="About Us"><img src="assets/img/home/Union.png"  alt="background-images"/></Link>
                </div>
              </div>
            ) : (
              <div className="custom-col5 mobile-only">
                <div className="remit_keypoints remit-h">
                  <h1><p >RemitAssure</p></h1>
                </div>
              </div>
            )
          }
<div className="custom-col5 mobile-only">
            <div className="remit_keypoints dark_box_bg">

            </div>
          </div>

      </div>
    </section >
  );
};

export default RemitAssure;
