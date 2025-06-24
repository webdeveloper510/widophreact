// Step4.js
import React, { useEffect, useState } from 'react';
const Step4 = ({ end_handler, veriff_status }) => {

    const [redirect_time, setRedirectTime] = useState(10)

    useEffect(() => {
        if (redirect_time === 0) {
            end_handler()
        } else {
            setTimeout(() => {
                setRedirectTime(redirect_time - 1)
            }, 1 * 1000)
        }
    }, [redirect_time])

    return (
        <div>
            <section className="kyc">
                <div className="">
                    <div className="">
                        <div className="row each-row">
                            <div className='col-md-12'>
                                <div className='width_80_per'>
                                    <img src="assets/img/home/kyc-suc.webp">
                                    </img>
                                </div>
                                <p className='kyc-sucful'><span className='kyc-text'>KYC</span> <br></br>{veriff_status ? "Request has been submitted. It may take some time.":"Successful"}</p>
                            </div>
                        </div>
                        <div className="next-step dashbord">
                            <button className="login_button dashbord-go" onClick={() => { end_handler() }}>Go To Dashboard  <img src="assets/img/home/Union.png" className="vission_image" alt="alt_image" /></button>
                            <p>You will be redirected in <span><b>{redirect_time}</b> Seconds </span></p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
};

export default Step4;
