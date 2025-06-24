import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { updateAccountUsage, updateProfile, userProfile } from '../../utils/Api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import * as Yup from "yup";

const MultiStepForm = ({ is_model, handleModel, currentStep }) => {

  /* ---------------------------------------------- State declaration's -------------------------------------------- */
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(currentStep || 1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected_area_code, setSelectedAreaCode] = useState("61")
  const [veriff_status, setVeriffStatus] = useState(null);
  const [user_data, setUserData] = useState();

  /* ---------------------------------------------- Formik declaration's --------------------------------------- */

  const firstSchema = Yup.object().shape({
    First_name: Yup.string().min(2).max(25).required().trim(),
    Middle_name: Yup.string().min(2).max(25).trim(),
    Last_name: Yup.string().min(2).max(25).required().trim(),
    email: Yup.string().matches(/^[\w-+\.]+@([\w-]+\.)+[\w-]{2,5}$/, "Invalid email format").max(50).required(),
    mobile: Yup.string().min(9).max(10).required(),
    Date_of_birth: Yup.date().min(new Date(Date.now() - 3721248000000)).max(new Date(Date.now() - 567648000000), "You must be at least 18 years").required(),
    occupation: Yup.string().min(1).max(50).required().trim(),
    Country_of_birth: Yup.string().required().notOneOf(["none"]),
  })

  const secondSchema = Yup.object().shape({
    payment_per_annum: Yup.string().required().notOneOf(["none"]),
    value_per_annum: Yup.string().required().notOneOf(["none"]),
    country: Yup.string().min(2).max(30).required().notOneOf(["none"]),
    state: Yup.string().min(2).max(35).required().notOneOf(["none"]),
    city: Yup.string().min(1).max(35).required().trim().notOneOf(["none"]),
    postcode: Yup.string().length(4).required(),
    street: Yup.string().min(1).max(150).required(),
    flat: Yup.string().min(1).max(30).notRequired(),
    building: Yup.string().min(1).max(30).required().trim(),
  })

  const formik = useFormik({
    initialValues: {
      customer_id: "",
      mobile_verified: "",
      email: "",
      First_name: "",
      Middle_name: "",
      Last_name: "",
      Date_of_birth: "",
      Country_of_birth: "none",
      mobile: "",
      location: "",
      occupation: "",
      payment_per_annum: "Tier-1 Less than 5 times",
      value_per_annum: "Tier-1 Less than $30,000",
      city: "",
      state: "",
      postcode: "",
      street: "",
      flat: "",
      building: "",
      country_code: "AU",
      country: "Australia"
    },
    validationSchema: activeStep === 1 ? firstSchema : secondSchema,
    onSubmit: async (values) => {
      if (activeStep === 1) {
        nextStep()
        updateData(values)
      } else {
        updateData(values)
        nextStep()
      }
    }
  })

  /* ------------------------------------------------- Handler's and Hook's ------------------------------------------- */
  const nextStep = () => {
    console.log("helloji")
    if (activeStep == 2 && (user_data.is_digital_Id_verified == "approved" || user_data.is_digital_Id_verified == "submitted")) {
      endHandler()
    } else {
      setCompletedSteps([...completedSteps, activeStep]);
      setActiveStep(activeStep + 1);
    }
   
  };

  const prevStep = () => {
    setCompletedSteps([...completedSteps, activeStep]);
    setActiveStep(activeStep - 1);
  };

  const endHandler = () => {
    if (is_model) {
      handleModel()
    } else {
      navigate("/dashboard")
    }
  }

  const updateData = async (values) => {
    let d = {}
    d = values
    d.location = values.country
    d.Gender = "NA"
    if (values.First_name === "" || values.First_name === undefined || values.First_name === " " || values.First_name === null) {
      delete d['First_name'];
    } if (values.Middle_name === "" || values.Middle_name === undefined || values.Middle_name === " " || values.Middle_name === null) {
      delete d['Middle_name'];
    } if (values.Last_name === "" || values.Last_name === undefined || values.Last_name === " " || values.Last_name === null) {
      delete d['Last_name'];
    } if (values.Date_of_birth === "" || values.Date_of_birth === undefined || values.Date_of_birth === " " || values.Date_of_birth === null) {
      delete d['Date_of_birth'];
    } if (values.occupation === "" || values.occupation === undefined || values.occupation === " " || values.occupation === null) {
      delete d['occupation'];
    } if (values.Country_of_birth === "" || values.Country_of_birth === undefined || values.Country_of_birth === "none" || values.Country_of_birth === null) {
      delete d['Country_of_birth'];
    } if (values.city === "" || values.city === undefined || values.city === " " || values.city === null) {
      delete d['city'];
    } if (values.flat === "" || values.flat === undefined || values.flat === " " || values.flat === null) {
      delete d['flat'];
    } if (values.building === "" || values.building === undefined || values.building === " " || values.building === null) {
      delete d['building'];
    } if (values.street === "" || values.street === undefined || values.street === " " || values.street === null) {
      delete d['street'];
    } if (values.postcode === "" || values.postcode === undefined || values.postcode === " " || values.postcode === null) {
      delete d['postcode'];
    } if (values.state === "" || values.state === undefined || values.state === " " || values.state === null) {
      delete d['state'];
    } if (values.country === "" || values.country === undefined || values.country === " " || values.country === null) {
      delete d['country'];
    } if (values.location === "" || values.location === undefined || values.location === " " || values.location === null) {
      delete d['location'];
    } if (values.country_code === "" || values.country_code === undefined || values.country_code === " " || values.country_code === null) {
      delete d['country_code'];
    }
    if (values.payment_per_annum === "" || values.payment_per_annum === undefined || values.payment_per_annum === null) {
      delete d['payment_per_annum'];
    } else {
      if (values.payment_per_annum !== "Tier-1 Less than 5 times") {
        updateAccountUsage({ type: "payment_per_annum", value: values.payment_per_annum });
      }
    }
    if (values.value_per_annum === "" || values.value_per_annum === undefined || values.value_per_annum === null) {
      delete d['value_per_annum'];
    } else {
      if (values.value_per_annum !== "Tier-1 Less than $30,000") {
        updateAccountUsage({ type: "value_per_annum", value: values.value_per_annum });
      }
    }
    delete d["customer_id"];
    delete d["stripe_customer_id"];
    delete d["referred_by"];
    delete d["referral_code"];
    delete d["mobile_verified"];
    delete d["is_verified"];
    delete d["is_digital_Id_verified"];
    delete d["id"];
    delete d["destination_currency"];
    delete d["created_at"];
    delete d["profile_completed"];

    if (Object?.keys(d)?.length > 0) {
      await updateProfile(d).then(res => {
        if (res.code === "200") {
          let user = JSON.parse(sessionStorage.getItem("remi-user-dt"))
          let local = { ...res.data, is_digital_Id_verified: user?.is_digital_Id_verified }
          sessionStorage.removeItem("remi-user-dt")
          sessionStorage.setItem("remi-user-dt", JSON.stringify(local))
          userProfile().then((res) => {
            setUserData(res.data);
          }).catch((error) => {
            if (error.response.data.code == "400") {
              toast.error(error.response.data.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
            }
          })
        } else if (res.code === "400") {
          toast.error(res.message, { position: "bottom-right", hideProgressBar: true, autoClose: 2000 })
        }
      }).catch((err) => {
        toast.error(err.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
      })
    }
  }

  useEffect(() => {
    if (!sessionStorage.getItem("token") && !sessionStorage.getItem("remi-user-dt")) {
      navigate("/login")
    } else {
      let dt = JSON.parse(sessionStorage.getItem("remi-user-dt"))
      if (dt.is_digital_Id_verified?.toString()?.toLowerCase() !== "declined" && dt.is_digital_Id_verified?.toString()?.toLowerCase() !== "pending" && dt.profile_completed == true) {
        navigate("/dashboard")
      }

      if (currentStep && currentStep == 3) {
        setCompletedSteps([1, 2])
      }
    }
    setLoading(true)
    userProfile().then((res) => {
      if (res.code == "200") {
        // console.log(res.data)
        setLoading(false)
        let p = res.data.mobile
        let phone = p.substring(3);
        let countryValue = res?.data?.location || res?.data?.country;
        formik.setValues({ ...formik.values, ...res.data, mobile: phone, country: countryValue, occupation: res?.data?.occupation?.toLowerCase() !== "none" ? res?.data?.occupation : "", country_code: countryValue == "Australia" ? "AU" : "NZ" })
      }
    }).catch((error) => {
      if (error.response.data.code == "400") {
        toast.error(error.response.data.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
      }
      setLoading(false)
    })
  }, [])

  const skip = (values) => {
    updateData(values)
    endHandler()
  }

  /* ------------------------------------------------------- Return ------------------------------------------------ */

  return (
    <>
      <section className="sigupsec" >
        <div className="container">
          <div className="row">
            <div className="col-md-4">
            </div>
            <div className="col-md-7">
              <div style={{ marginBottom: '20px' }}>
                <ul id="progressbar">
                  {[1, 2, 3, 4].map((step) => (
                    <li
                      key={step}
                      className={`step ${step === activeStep ? 'active' : ''} ${completedSteps.includes(step) ? 'done' : ''}`}
                    >
                      {step === 1 && (
                        <>Step 1</>
                      )}
                      {step === 2 && (
                        <>Step 2</>
                      )}
                      {step === 3 && (
                        <>Step 3</>
                      )} {
                        step === 4 && (
                          <>Step 4</>
                        )
                      }
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="row align-center1">
                <div className="col-lg-5">
                  <div className="kyc-img">
                    <img src="assets/img/home/kyc.webp" className="signup" alt="alt_image" />
                  </div>
                </div>
                <div className="col-lg-7 d-flex align-items-center">
                  <div>
                    <h2 className="Sign-heading my-3">KYC</h2>
                    <h3 className='sub-head'>Complete your KYC in 4 steps</h3>
                    <div>
                    </div>
                    <div>
                      <div className='steps-form'>
                        {activeStep === 1 && (
                          <Step1 prevStep={prevStep} nextStep={nextStep} updateData={(values) => updateData(values)} selected_area_code={selected_area_code} setSelectedAreaCode={setSelectedAreaCode} skipHandler={(values) => skip(values)} end_handler={endHandler} />
                        )}
                        {activeStep === 2 && (
                          <Step2 nextStep={nextStep} prevStep={prevStep} formik={formik} updateData={(values) => updateData(values)} selected_area_code={selected_area_code} setSelectedAreaCode={setSelectedAreaCode} skipHandler={(values) => skip(values)} end_handler={endHandler} />
                        )}
                        {activeStep === 3 && (
                          <Step3 values={formik.values} nextStep={nextStep} setVeriffStatus={setVeriffStatus} />
                        )}
                        {activeStep === 4 && (
                          <Step4 end_handler={endHandler} veriff_status={veriff_status} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MultiStepForm;