// Step1.js
import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';
import "react-phone-input-2/lib/bootstrap.css";
import countryList from '../../utils/AuNz.json';
import clsx from "clsx";
import Autocomplete from "react-google-autocomplete";
import { useFormik } from "formik";
import * as Yup from "yup";
import { userProfile } from "../../utils/Api";
import { toast } from "react-toastify";

const Step2 = ({ prevStep, skipHandler, selected_area_code, setSelectedAreaCode, nextStep, updateData }) => {
  const [city_list, setCityList] = useState([])
  const [state_list, setStateList] = useState([])
  const [postal_list, setPostalList] = useState([])



  const secondSchema = Yup.object().shape({
    payment_per_annum: Yup.string().required(),
    value_per_annum: Yup.string().required(),
    country: Yup.string().min(2).max(30).required().notOneOf(["none"]),
    state: Yup.string().min(2).max(35).required().notOneOf(["none"]),
    city: Yup.string().min(1).max(35).required().trim().notOneOf(["none"]),
    postcode: Yup.string().length(4).required(),
    street: Yup.string().max(500).required().trim(),
    flat: Yup.string().max(30).notRequired(),
    building: Yup.string().min(1).max(30).required().trim(),
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
      country: "none"
    },
    validationSchema: secondSchema,
    onSubmit: async (values) => {
      let payload = values
      if (/^\s*$/.test(payload.flat)) {
        delete payload['flat']
      }
      nextStep()
      updateData(payload)
    },
    validateOnChange: true,
    validateOnBlur: false,
  })

  useEffect(() => {
    userProfile().then((res) => {
      if (res.code == "200") {
        let p = res.data.mobile
        let countryValue = res?.data?.country || res?.data?.location;
        let p_a, v_a;
        if (res.data.payment_per_annum === "" || res.data.payment_per_annum === null) {
          p_a = "Tier-1 Less than 5 times";
        } else {
          p_a = res.data.payment_per_annum
        }
        if (res.data.value_per_annum === "" || res.data.value_per_annum === null) {
          v_a = "Tier-1 Less than $30,000"
        } else {
          v_a = res.data.value_per_annum
        }
        formik.setValues({
          location: res.data.location || "",
          payment_per_annum: p_a,
          value_per_annum: v_a,
          city: res.data.city || "",
          state: res.data.state || "",
          postcode: res.data.postcode || "",
          street: res.data.street || "",
          flat: res.data.flat || "",
          building: res.data.building || "",
          country_code: res.data.country_code || "",
          country: res?.data?.country?.toLowerCase() !== "none" && res?.data?.country?.toLowerCase() !== "" && res?.data?.country?.toLowerCase() !== undefined || null ? res?.data?.country : res?.data?.location,
          country_code: res?.data?.country_code || "AU"
        })
      }
    }).catch((error) => {
      if (error.response.data.code == "400") {
        toast.error(error.response.data.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
      }
    })
  }, [])

  useEffect(() => {
    if (formik.values.country !== "none" && formik.values.country !== "") {
      let array_1 = countryList?.filter((item) => {
        return item?.name === formik.values.country
      })
      let array = array_1[0]?.states;

      formik.setValues({ ...formik.values, city: "none", postcode: "", state: "none" })
      if (array) {
        array.sort((a, b) => (a.state > b.state) ? 1 : -1);
      }
      setStateList(array);
    } else {
      formik.setValues({ ...formik.values, city: "none", postcode: "", state: "none", country: countryList[0].name, country_code: countryList[0].iso2 })
      setCityList([])
      setStateList([])
      setPostalList([])
    }
  }, [formik.values.country])

  useEffect(() => {
    if (formik.values.state !== "none" && state_list && state_list.length > 0) {
      let array = state_list.filter((item) => {
        return item?.state === formik.values?.state
      })
      array.sort((a, b) => (a.city > b.city) ? 1 : -1);

      setCityList(array);
    } else if (formik.values.state === "none") {
      formik.setValues({ ...formik.values, city: "none", postcode: "" })
      setCityList([])
    }

  }, [formik.values.state, state_list])

  useEffect(() => {
    if (formik.values.city !== "none") {
      let postals = city_list.filter((item) => {
        return item?.city === formik.values?.city && item?.state === formik.values?.state
      })
      setPostalList(postals)
      formik.setValues({ ...formik.values, postcode: postals[0]?.post_code })
    } else if (formik.values.city === "none") {
      formik.setValues({ ...formik.values, postcode: "" })
      setPostalList([])
    }

  }, [formik.values.city, city_list])



  const handleNumericOnly = (event) => {
    const result = event.target.value.replace(/[^0-9]/, "");
    formik.setFieldValue(event.target.name, result)
  }

  const handleChange = (e) => {
    if (e.target.name === 'country') {
      if (e.target.value !== "none") {
        countryList.map((item) => {
          if (item.name === e.target.value) {
            setSelectedAreaCode(item.phone_code)
          }
        })
      }
      formik.setValues({ ...formik.values, country: e.target.value, state: "none", city: "none", postcode: "" })
    } else if (e.target.name === "state") {
      formik.setValues({ ...formik.values, state: e.target.value, city: "none", postcode: "" })
    }
    formik.setFieldValue(`${[e.target.name]}`, e.target.value)
    formik.setFieldTouched(`${[e.target.name]}`, true)
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

  useEffect(() => {
    countryList.map((item) => {
      if (item.phone_code === selected_area_code) {
        formik.setValues({ ...formik.values, country: item?.name, country_code: item?.iso2 })
      }
    })
  }, [selected_area_code])

  const getSelectedStreet = async (place) => {
    let street = await place?.address_components?.filter(
      (component) => {
        return component.types.includes('route') || component.types.includes('street_name')
      }
    );
    if (street && street.length > 0) {
      formik.setFieldValue("street", street[0].long_name)
    } else {
      formik.setFieldValue("street", place?.address_components[0]?.long_name)
    }
  }

  const getStreetName = (e, max) => {
    if (e.key === 'Backspace' || e.key === 'Enter' || e.key === 'Tab' || e.key === 'Shift' || e.key === 'ArrowLeft' || e.key === "ArrowRight" || e.key === "Escape" || e.key === "Delete") {
      formik.setFieldValue("street", e.target.value)
      formik.setFieldTouched("street", true)
    } else {
      const value = e.target.value.toString()
      if (value.length >= max) {
        e.stopPropagation()
        e.preventDefault()
      } else {
        formik.setFieldValue("street", e.target.value)
        formik.setFieldTouched("street", true)
        formik.handleChange(e)
      }
    }
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
                      value={formik.values.payment_per_annum}
                      name="payment_per_annum"
                      onChange={(e) => handleChange(e)}
                      className={clsx(
                        'form-control form-select bg-transparent',
                        { 'is-invalid': formik.touched.payment_per_annum && formik.errors.payment_per_annum },
                        {
                          'is-valid': formik.touched.payment_per_annum && !formik.errors.payment_per_annum,
                        }
                      )}
                      onBlur={formik.handleBlur}
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
                      value={formik.values.value_per_annum}
                      name="value_per_annum"
                      onChange={(e) => handleChange(e)}
                      className={clsx(
                        'form-control form-select bg-transparent',
                        { 'is-invalid': formik.touched.value_per_annum && formik.errors.value_per_annum },
                        {
                          'is-valid': formik.touched.value_per_annum && !formik.errors.value_per_annum,
                        }
                      )}
                      onBlur={formik.handleBlur}
                    >
                      <option value="Tier-1 Less than $30,000" key="Less than $30,000">Tier-1 Less than $30,000</option>
                      <option value="Tier-2 $30,000 - $100,000" key="$30,000-$100,000">Tier-2 $30,000 - $100,000</option>
                      <option value="Tier-3 Greater than $100,000" key="Greater than $100,000">Tier-3 Greater than $100,000</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="row each-row">
                <h5>Address</h5>
                <div className="col-md-4 mb-3">
                  <Form.Group className="form_label" controlId="country">
                    <p className="get-text">Country<span style={{ color: 'red' }} >*</span></p>
                    <select
                      value={formik.values.country}
                      name="country"
                      onChange={(e) => handleChange(e)}
                      className={clsx(
                        'form-control form-select bg-transparent',
                        { 'is-invalid': formik.touched.country && formik.errors.country },
                        {
                          'is-valid': formik.touched.country && !formik.errors.country,
                        }
                      )}
                      onBlur={formik.handleBlur}
                    >
                      <option value={"none"} >Select a country</option>
                      <option value={"Australia"} >Australia</option>
                      <option value={"New Zealand"} >New Zealand</option>
                    </select>
                  </Form.Group>
                </div>
                <div className="col-md-4 mb-3">
                  <Form.Group className="form_label statess" controlId="state">
                    <p className="get-text">State<span style={{ color: 'red' }} >*</span></p>
                    {
                      state_list && state_list.length > 0 ?
                        (<select
                          value={formik.values.state}
                          name="state"
                          onChange={(e) => handleChange(e)}
                          className={clsx(
                            'form-control form-select bg-transparent',
                            { 'is-invalid': formik.touched.state && formik.errors.state },
                            {
                              'is-valid': formik.touched.state && !formik.errors.state,
                            }
                          )}
                          onBlur={formik.handleBlur}
                        >
                          <option value={"none"} key={"none"}>Select a state</option>
                          {state_list?.map((opt, index) => {
                            if (opt?.state !== state_list[index - 1]?.state) {
                              return (
                                <option value={opt?.state} key={index}>{opt?.state}</option>
                              )
                            }
                          })
                          }
                        </select>) :
                        (<input
                          type="text"
                          placeholder='No country selected'
                          className={clsx(
                            'form-control form-select bg-transparent',
                            { 'is-invalid': formik.touched.state && formik.errors.state },
                            {
                              'is-valid': formik.touched.state && !formik.errors.state,
                            }
                          )}
                          readOnly
                        />)
                    }
                  </Form.Group>
                </div>
                <div className="col-md-4 mb-3">
                  <Form.Group className="form_label" controlId="city">
                    <p className="get-text">City/Suburb<span style={{ color: 'red' }} >*</span></p>
                    {
                      city_list && city_list.length > 0 ? (
                        <select
                          value={formik.values.city}
                          name="city"
                          onChange={(e) => handleChange(e)}
                          className={clsx(
                            'form-control form-select bg-transparent',
                            { 'is-invalid': formik.touched.city && formik.errors.city },
                            {
                              'is-valid': formik.touched.city && !formik.errors.city,
                            }
                          )}
                          onBlur={formik.handleBlur}
                        >
                          <option value="none" key="none">Select a city</option>
                          {city_list?.map((opt, index) => {
                            if (city_list[index]?.city !== city_list[index - 1]?.city && opt?.city !== "") {
                              return (
                                <option value={opt?.city} key={index}>{opt?.city}</option>
                              )
                            }
                          })
                          }
                        </select>
                      ) : (
                        <input
                          type="text"
                          name="city"
                          placeholder='No state selected'
                          className={clsx(
                            'form-control form-select bg-transparent',
                            { 'is-invalid': formik.touched.city && formik.errors.city },
                            {
                              'is-valid': formik.touched.city && !formik.errors.city,
                            }
                          )}
                          readOnly
                        />
                      )
                    }
                  </Form.Group>
                </div>
              </div>
              <div className="row each-row">
                <div className="col-md-4 mb-3">
                  <Form.Group className="form_label" controlId="postal">
                    <p className="get-text">Zip/Postal Code<span style={{ color: 'red' }} >*</span></p>
                    <input
                      type="text"
                      name="postcode"
                      value={formik.values.postcode}
                      maxLength="4"
                      list='postal_list'
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
                    <datalist id="postal_list">
                      {
                        postal_list.length > 0 && postal_list?.map((opt, index) => {
                          return <option value={opt.post_code} key={index} />
                        })
                      }
                    </datalist>
                  </Form.Group>
                </div>
                <div className="col-md-4 mb-3">
                  <Form.Group className="form_label" controlId="street">
                    <p className="get-text">Street Name<span style={{ color: 'red' }} >*</span></p>
                    {/* <input
                      type="text"
                      name="street"
                      value={formik.values.street}
                      onKeyDown={(e) => { handleEmail(e, 30) }}
                      {...formik.getFieldProps("street")}
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': formik.touched.street && formik.errors.street },
                        {
                          'is-valid': formik.touched.street && !formik.errors.street,
                        }
                      )}
                    /> */}
                    <Autocomplete
                      apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                      onPlaceSelected={getSelectedStreet}
                      placeholder=""
                      id="street"
                      options={{
                        types: [],
                        componentRestrictions: { country: formik.values.country === "New Zealand" ? "nz" : "au" },
                      }}
                      className={clsx(
                        'form-control bg-transparent',
                        { 'is-invalid': formik.touched.street && formik.errors.street },
                        {
                          'is-valid': formik.touched.street && !formik.errors.street,
                        }
                      )}
                      onInput={(e) => getStreetName(e, 500)}
                      inputAutocompleteValue={formik.values.street}
                      defaultValue={formik.values.street}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-4 mb-3">
                  <Form.Group className="form_label" controlId="flat">
                    <p className="get-text">Flat/Unit No.</p>
                    <input
                      type="text"
                      name="flat"
                      value={formik.values.flat}
                      onKeyDown={(e) => { handleEmail(e, 15) }}
                      {...formik.getFieldProps("flat")}
                      className='form-control bg-transparent'
                      onBlur={formik.handleBlur}
                    />
                  </Form.Group>
                </div>
              </div>
              <div className="row each-row">
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
              </div>
            </div>
          </div>
          <div className="next-step">
            <button type="button" className="SKip back-btn" onClick={() => prevStep()}>Back</button>
            <button type="submit" className="login_button">Continue<img src="assets/img/home/Union.png" className="vission_image" alt="alt_image" /></button>
            <button type="button" className="SKip" onClick={() => skipHandler(formik.values)}>Skip</button>
          </div>
        </form>
      </section>

    </>

  )
}

export default Step2;
