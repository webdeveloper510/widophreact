// Step2.js
import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import "react-phone-input-2/lib/bootstrap.css";
import clsx from "clsx";
import Autocomplete from "react-google-autocomplete";
import { useFormik } from "formik";
import * as Yup from "yup";
import { userProfile } from "../../utils/Api";
import { toast } from "react-toastify";
import { Button, FormSelect, Modal } from "react-bootstrap";
import { BsCheckCircleFill } from "react-icons/bs";

const Step2 = ({ prevStep, nextStep, updateData, end_handler }) => {

  const [show_message, setShowMessage] = useState(false)
  const [skip_clicked, setSkipCLicked] = useState(false)

  const secondSchema = Yup.object().shape({
    payment_per_annum: Yup.string().required(),
    value_per_annum: Yup.string().required(),
    country: Yup.string().min(2).max(30).required().notOneOf(["none"]),
    state: Yup.string().min(2).max(35).required().trim().notOneOf(["", " "]),
    city: Yup.string().min(1).max(35).required().trim().notOneOf(["", " "]),
    postcode: Yup.string().length(4).required(),
    street: Yup.string().max(100).required().trim().notOneOf(["", " "]),
    flat: Yup.string().max(30).notRequired(),
    building: Yup.string().min(1).max(30).required().trim().notOneOf(["", " "]),
    address: Yup.string(),
  })

  const formik = useFormik({
    initialValues: {
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
      country: "Australia",
      address: "",
    },
    validationSchema: secondSchema,
    onSubmit: async (values) => {
      let payload = values
      // console.log(values)
      if (/^\s*$/.test(payload.flat)) {
        delete payload['flat']
      }
      if (payload.address === "" || payload.address === undefined || payload.address === " ") {
        delete payload['address'];
      }
      if (values.country === "Australia") {
        payload.country_code = "AU"
      } else {
        payload.country_code = "NZ"
      }
      updateData(payload)
      if (values.payment_per_annum === "Tier-1 Less than 5 times" && values.value_per_annum === "Tier-1 Less than $30,000") {
        nextStep()
      } else {
        setShowMessage(true)
      }
    },
  })

  useEffect(() => {
    userProfile().then((res) => {
      if (res.code == "200") {
        let countryValue = res?.data?.country && res?.data?.country !== "" ? res?.data?.country : res?.data?.location;
        formik.setValues({
          location: res?.data?.location,
          occupation: res?.data?.occupation,
          payment_per_annum: res?.data?.payment_per_annum || "Tier-1 Less than 5 times",
          value_per_annum: res?.data?.value_per_annum || "Tier-1 Less than $30,000",
          city: res?.data?.city || "",
          state: res?.data?.state || "",
          postcode: res?.data?.postcode || "",
          street: res?.data?.street || "",
          flat: res?.data?.flat || "",
          building: res?.data?.building || "",
          country_code: res?.data?.country_code || "AU",
          country: countryValue,
          address: res?.data?.address || "",
        })
      }
    }).catch((error) => {
      if (error.response.data.code == "400") {
        toast.error(error.response.data.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
      }
    })
  }, [])

  const onSkipCLicked = () => {
    let payload = formik.values
    // console.log(values)
    if (/^\s*$/.test(payload.flat)) {
      delete payload['flat']
    }
    if (payload.address === "" || payload.address === undefined || payload.address === " ") {
      delete payload['address'];
    }
    if (formik.values.country === "Australia") {
      payload.country_code = "AU"
    } else {
      payload.country_code = "NZ"
    }
    updateData(payload).then(res => {
      if (formik.values.payment_per_annum === "Tier-1 Less than 5 times" && formik.values.value_per_annum === "Tier-1 Less than $30,000") {
        end_handler()
      } else {
        setSkipCLicked(true)
        setShowMessage(true)
      }
    })
  }


  const handleOnHide = () => {
    if (skip_clicked == true) {
      setShowMessage(false)
      end_handler()
    } else {
      nextStep()
    }
  }

  const handleNumericOnly = (event) => {
    const result = event.target.value.replace(/[^0-9]/, "");
    formik.setFieldValue(event.target.name, result)
  }

  const handleChange = (e) => {
    if (e.target.name === "country") {
      formik.setValues({ ...formik.values, country: e.target.value, state: "", city: "", postcode: "", street: "" })
    } else {
      formik.setFieldValue(`${[e.target.name]}`, e.target.value)
      formik.setFieldTouched(`${[e.target.name]}`, true)
    }
  }


  const handleEmail = (e, max) => {
    if (e.key === 'Backspace' || e.key === 'Enter' || e.key === 'Tab' || e.key === 'Shift' || e.key === 'ArrowLeft' || e.key === "ArrowRight" || e.key === "Escape" || e.key === "Delete") {
      formik.setFieldValue(`${[e.target.name]}`, e.target.value)
      formik.setFieldTouched(`${[e.target.name]}`, true)
    } else {
      const value = e.target.value.toString()
      if (value.length >= max) {
        e.stopPropagation()
        e.preventDefault()
      } else {
        formik.setFieldValue(`${[e.target.name]}`, e.target.value)
        formik.setFieldTouched(`${[e.target.name]}`, true)
      }
    }
  }

  const getSelectedStreet = async (place) => {
    let country = "", state = "", city = "", postcode = "", street = "", building = "";
    await place?.address_components?.forEach((component) => {
      if (component?.types?.includes("street_number")) {
        // street = component?.long_name + " " + street;
      } else if (component?.types?.includes('postal_code')) {
        postcode = component?.long_name;
      } else if (component?.types?.includes('route') || component.types.includes('street_name')) {
        street = street + component?.long_name;
      } else if (component?.types?.includes('locality')) {
        city = component?.long_name;
      } else if (component?.types?.includes('administrative_area_level_1')) {
        state = component?.long_name;
      } else if (component?.types?.includes('country')) {
        country = component?.long_name;
      } else if (component?.types?.includes('subpremise') || component?.types?.includes('building') || component?.types?.includes('building_number')) {
        building = component?.long_name;
      }
    })

    formik.setFieldValue("country", country)
    formik.setFieldValue("state", state)
    formik.setFieldValue("postcode", postcode)
    formik.setFieldValue("city", city)
    formik.setFieldValue("street", street.trim())
    formik.setFieldValue("building", building)
    formik.setFieldValue("address", place?.formatted_address)
  }

  const handleOnlyAplha = (event) => {
    const result = event.target.value.replace(/[^A-Za-z!@#$%^&*()_+\-=[\]{};':"\\|,.<>/? ]/gi, "");
    formik.setFieldValue(event.target.name, result)
    formik.setFieldTouched(event.target.name, true)
  }

  return (
    <>
      <section className="kyc">
        <form onSubmit={formik.handleSubmit} noValidate className="single-recipient">
          <div className="">
            <div className="">
              <div className="row each-row">
                <p className="mb-3"><span className="h5">Account Usage</span><span className='small'>&nbsp;(Utilization above tier 1 requires additional verification documents.)</span></p>
                <div className="col-md-6">
                  <div className="input_field">
                    <p className="get-text">Projected frequency of payments per annum<span style={{ color: 'red' }} >*</span></p>
                    <select
                      name="payment_per_annum"
                      id="payment_per_annum"
                      {...formik.getFieldProps("payment_per_annum")}
                      className={clsx(
                        'form-control form-select bg-transparent',
                        { 'is-invalid': formik.touched.payment_per_annum && formik.errors.payment_per_annum },
                        {
                          'is-valid': formik.touched.payment_per_annum && !formik.errors.payment_per_annum,
                        }
                      )}
                    >
                      <option value="Tier-1 Less than 5 times" key="Less than 5 times">Tier-1 Less than 5 times</option>
                      <option value="Tier-2 5-10 Times" key="5-10 times">Tier-2 5-10 Times</option>
                      <option value="Tier-3 Greater than 10 Times" key="Greater than 10 times">Tier-3 Greater than 10 Times</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="input_field">
                    <p className="get-text">Projected value of payments per annum<span style={{ color: 'red' }} >*</span></p>
                    <select
                      name="value_per_annum"
                      id="value_per_annum"
                      {...formik.getFieldProps("value_per_annum")}
                      className={clsx(
                        'form-control form-select bg-transparent',
                        { 'is-invalid': formik.touched.value_per_annum && formik.errors.value_per_annum },
                        {
                          'is-valid': formik.touched.value_per_annum && !formik.errors.value_per_annum,
                        }
                      )}
                    >
                      <option value="Tier-1 Less than $30,000" key="Less than $30,000">Tier-1 Less than $30,000</option>
                      <option value="Tier-2 $30,000 - $100,000" key="$30,000-$100,000">Tier-2 $30,000 - $100,000</option>
                      <option value="Tier-3 Greater than $100,000" key="Greater than $100,000">Tier-3 Greater than $100,000</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="row each-row">
                <h5>Your Address</h5>
                <div className="col-md-6 mb-3">
                  <Form.Group className="form_label" controlId="country">
                    <p className="get-text">Country<span style={{ color: 'red' }} >*</span></p>
                    <FormSelect
                      value={formik.values.country}
                      name="country"
                      id="country"
                      onChange={handleChange}
                      className={clsx(
                        'bg-transparent',
                        { 'is-invalid': formik.touched.country && formik.errors.country },
                        {
                          'is-valid': formik.touched.country && !formik.errors.country,
                        }
                      )}
                    >
                      <option value="Australia">Australia</option>
                      <option valu="New Zealand">New Zealand</option>
                    </FormSelect>
                  </Form.Group>
                </div>
              </div>
              <div className="row each-row">
                <div className="col-md-12 mb-3">
                  <Form.Group className="form_label" controlId="address">
                    <p className="get-text">Address</p>
                    <Autocomplete
                      apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                      onPlaceSelected={getSelectedStreet}
                      placeholder="Street Address, Company or P.O. box.. "
                      id="address"
                      name="address"
                      className="form-control"
                      options={{
                        types: [],
                        componentRestrictions: { country: formik.values.country === "New Zealand" ? "nz" : "au" },
                      }}
                      onChange={formik.handleChange}
                      value={formik.values.address}
                    />
                  </Form.Group>
                </div>
              </div>
              <div className="row each-row">
                <div className="col-md-4 mb-3">
                  <Form.Group className="form_label" controlId="flat">
                    <p className="get-text">Unit/Apt No.</p>
                    <input
                      type="text"
                      name="flat"
                      value={formik.values.flat}
                      onKeyDown={(e) => { handleEmail(e, 15) }}
                      {...formik.getFieldProps("flat")}
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': formik.touched.flat && formik.errors.flat && formik.values.flat !== "" && null },
                        {
                          'is-valid': formik.touched.flat && !formik.errors.flat && formik.values.flat !== "" && null,
                        }
                      )}
                      onBlur={formik.handleBlur}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-4 mb-3">
                  <Form.Group className="form_label" controlId="building">
                    <p className="get-text">Building No.<span style={{ color: 'red' }} >*</span></p>
                    <input
                      type="text"
                      name="building"
                      value={formik.values.building}
                      onKeyDown={(e) => { handleEmail(e, 30) }}
                      {...formik.getFieldProps("building")}
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': formik.touched.building && formik.errors.building },
                        {
                          'is-valid': formik.touched.building && !formik.errors.building,
                        }
                      )}
                      onBlur={formik.handleBlur}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-4 mb-3">
                  <Form.Group className="form_label" controlId="street_name">
                    <p className="get-text">Street Name<span style={{ color: 'red' }} >*</span></p>
                    <input
                      type="text"
                      name="street"
                      value={formik.values.street}
                      onKeyDown={(e) => { handleEmail(e, 100) }}
                      {...formik.getFieldProps("street")}
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': formik.touched.street && formik.errors.street },
                        {
                          'is-valid': formik.touched.street && !formik.errors.street,
                        }
                      )}
                      onBlur={formik.handleBlur}
                    />
                  </Form.Group>
                </div>
              </div>
              <div className="row each-row">
                <div className="col-md-4 mb-3">
                  <Form.Group className="form_label" controlId="city">
                    <p className="get-text">City/Suburb<span style={{ color: 'red' }} >*</span></p>
                    <input
                      type="text"
                      name="city"
                      value={formik.values.city}
                      maxLength="35"
                      onChange={handleOnlyAplha}
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': formik.touched.city && formik.errors.city },
                        {
                          'is-valid': formik.touched.city && !formik.errors.city,
                        }
                      )}
                      placeholder="city or suburb .."
                      onBlur={formik.handleBlur}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-4 mb-3">
                  <Form.Group className="form_label" controlId="postal">
                    <p className="get-text">Zip/Postal Code<span style={{ color: 'red' }} >*</span></p>
                    <input
                      type="text"
                      name="postcode"
                      value={formik.values.postcode}
                      maxLength="4"
                      onChange={handleNumericOnly}
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': formik.touched.postcode && formik.errors.postcode },
                        {
                          'is-valid': formik.touched.postcode && !formik.errors.postcode,
                        }
                      )}
                      onBlur={formik.handleBlur}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-4 mb-3">
                  <Form.Group className="form_label statess" controlId="state">
                    <p className="get-text">State<span style={{ color: 'red' }} >*</span></p>
                    <input
                      type="text"
                      name="state"
                      value={formik.values.state}
                      maxLength="30"
                      onChange={handleOnlyAplha}
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': formik.touched.state && formik.errors.state },
                        {
                          'is-valid': formik.touched.state && !formik.errors.state,
                        }
                      )}
                      placeholder="state or province .."
                      onBlur={formik.handleBlur}
                    />
                  </Form.Group>
                </div>
              </div>
            </div>
          </div>
          <div className="next-step">
            <button type="button" className="SKip back-btn" onClick={() => prevStep()}>Back</button>
            <button type="submit" className="login_button">Continue<img src="assets/img/home/Union.png" className="vission_image" alt="alt_image" /></button>
            <button type="button" className="SKip" onClick={() => onSkipCLicked()}>Skip</button>
          </div>
        </form>
      </section>
      <MessageDialog show={show_message} onHide={() => handleOnHide()} />
    </>
  )
}

const MessageDialog = ({ show, onHide }) => {
  return (
    <Modal show={show} backdrop="static" centered>
      <Modal.Header>
        Account Usage Request
      </Modal.Header>
      <Modal.Body className='my-4 text-center'>
        <h1 className='text-success text-bold display-3'><BsCheckCircleFill /></h1>
        <h5>Your request has been submitted</h5>
        <p className="my-3"><span className="text-danger text-bold">*</span>Please mail your documents at <a href="mailto:ankur@codenomad.net" target="_blank">ankur@codenomad.net</a> to update your account usage successfully. </p>
      </Modal.Body>
      <Modal.Footer>
        <Button type="click" variant="primary" onClick={onHide}>
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default Step2;