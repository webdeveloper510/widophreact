// Step3.js
import { createVeriffFrame, MESSAGES } from '@veriff/incontext-sdk';
import { Veriff } from '@veriff/js-sdk';
import React, { useEffect, useState } from 'react';
import { getVeriffStatus } from '../../utils/Api';
import { toast } from 'react-toastify';
import { Alert } from 'react-bootstrap';

const Step3 = ({ nextStep, setVeriffStatus }) => {

  const [loading, setLoading] = useState(false)
  const [re_verify, setReverify] = useState(false)

  useEffect(() => {
    let local = JSON.parse(sessionStorage.getItem("remi-user-dt"))
    const veriff = Veriff({
      apiKey: `${process.env.REACT_APP_VERIFF_KEY}`,
      parentId: 'veriff-root',
      onSession: function (err, response) {
        createVeriffFrame({
          url: response.verification.url,
          onEvent: function (msg) {
            console.log("event");
            setReverify(false)
            switch (msg) {
              case MESSAGES.CANCELED:
                console.log("cancelling of event");
                setLoading(false)
                break;
              case MESSAGES.STARTED:
                console.log("starting of event");
                setReverify(false)
                break;
              case MESSAGES.FINISHED:
                setLoading(true)
                console.log("finishing of event");
                setReverify(false)
                let intervalCleared = false;
                const interval = setInterval(() => {
                  getVeriffStatus({ session_id: response.verification.id })
                  // .then(res => {
                  //   if (res.code === "200") {
                  //     if (res?.data?.verification?.status?.toLowerCase() === "approved") {
                  //       clearIntervalAndExecute("approved");
                  //     } else if (res?.data?.verification?.status?.toLowerCase() === "declined") {
                  //       clearIntervalAndExecute("declined", "Verification failed. Please try verifying your ID once more.");
                  //     } else if (res?.data?.verification?.status?.toLowerCase() === "resubmission_requested") {
                  //       clearIntervalAndExecute("resubmission_requested", "Something went wrong. Please re-submit the verification.");
                  //     }
                  //   }
                  // })
                }, 5000)
                setTimeout(() => {
                  if (!intervalCleared) {
                    setLoading(false);
                    clearInterval(interval);
                    setVeriffStatus("submitted")
                    nextStep()
                  }
                }, 10 * 1000)
                function clearIntervalAndExecute(status, message = "") {
                  intervalCleared = true;
                  setLoading(false);
                  clearInterval(interval);
                  if (message) {
                    setReverify(message);
                  } else if (status === "approved") {
                    nextStep()
                  }
                }
                break;
            }
          }
        });
        if (err) {
          toast.error(err?.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
        }
      }
    });
    veriff.setParams({
      vendorData: `${local?.customer_id}`,
      person: {
        givenName: `${local?.First_name}`,
        lastName: `${local?.Last_name}`
      }
    });
    veriff.mount({
      formLabel: {
        givenName: 'First name',
        lastName: 'Last name',
        vendorData: 'Unique id/Document id'
      },
      submitBtnText: 'Verify Your ID',
      loadingText: 'Processing...'
    })
  }, [])

  return (
    <>
      {
        loading && (
          <>
            <div className="loader-overly" style={{ background: "rgb(0 0 0 / 85%)" }}>
              <div className="loader">
              </div>
              <div className="loader-text">
                <p className='get-text' >Please wait while we are verifying your identity..</p>
              </div>
            </div>
          </>
        )
      }
      <div>
        <section className="kyc">
          <div className="">
            <div className="">
              <div className="row each-row">
                <div className='col-md-12'>
                  <div id='veriff-root' style={{ margin: "auto", padding: "25px 0px" }}>
                  </div>
                </div>
              </div>
              <div className="next-step dashbord">
                {
                  re_verify && (
                    <Alert className='kyc_alert' >
                      <span>{re_verify}</span>
                    </Alert>
                  )
                }
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
};

export default Step3;
