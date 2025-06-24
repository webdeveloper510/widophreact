
import React, { useState, useContext, useEffect, useMemo } from "react";
import { Links, NavLink, useNavigate, useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import axios from "axios";
import UserRecipient from "../Userdashboard/UserRecipient";
import norecipients from '../../assets/img/userdashboard/hidden.avif';
import { BsFillPersonPlusFill } from "react-icons/bs";
import { BsFillPencilFill } from "react-icons/bs";
import Sidebar from './Sidebar';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import Select from "react-select";
import countryList from 'react-select-country-list'
import Page404 from "../pageNotfound/Page404";
import { useFormik } from "formik";
import * as Yup from "yup"
import clsx from "clsx";
import { getCardData, updateCardUser } from "../../utils/Api";
// start css
const myStyle = {
  color: "red",
  fontSize: "13px",
  textTransform: "capitalize"
}


const EditCardUser = () => {

  /**************************token ************************ */
  const token = sessionStorage.getItem("token");
  // console.log("TOKEN", token);

  const LoginDigitalidVerified = sessionStorage.getItem("LoginDigitalidVerified");
  // console.log("LoginDigitalidVerified", LoginDigitalidVerified)

  const signup_token = sessionStorage.getItem("signup_token")
  // console.log("signup_token", signup_token);

  const verification_otp = sessionStorage.getItem("verification_otp");
  // console.log("Verification Message", verification_otp)

  const RecipientUserName = sessionStorage.getItem("RecipientUserName");
  // console.log("RecipientUserName", RecipientUserName);

  const DigitalCode = sessionStorage.getItem("DigitalCode");
  // console.log("DigitalCode", DigitalCode);



  /*************data get ************/
  let { id } = useParams();
  //    alert(id)
  // console.log("========================>", id);


  /************ Start -Recipient Bank Details state***************/
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  /************ Start -messageText state***************/
  const [BankNameText, setBankNameText] = React.useState('');
  // const [userRecipientData, setUserRecipientData] = useState('');
  const [RecepientsData, setRecepientsData] = React.useState('');

  /************ Start -Card Bank Details state***************/
  // const [name, setName] = React.useState('');
  // const [card_number, setNumber] = React.useState('');
  // const [expiry_month, setExp_month] = useState('');
  // const [expiry_year, setExp_year] = useState('');



  // const handleName = (event) => {
  //   const regex = /^[a-zA-Z]+$/; // regex pattern to allow only alphabets
  //   if (event.target.value === '' || regex.test(event.target.value)) {
  //     setName(event.target.value);
  //   }
  // }

  // const handleNumber = (event) => {
  //   const newValue = event.target.value.replace(/[^0-9]/g, ''); // remove non-numeric characters
  //   setNumber(newValue);
  // }

  // const handleExpiryMonth = (event) => {
  //   const newValue = event.target.value.replace(/[^0-9]/g, ''); // remove non-numeric characters
  //   setExp_month(newValue);
  // }

  // const handleExpiryYear = (event) => {
  //   const newValue = event.target.value.replace(/[^0-9]/g, ''); // remove non-numeric characters
  //   setExp_year(newValue);
  // }

  /************ Start -Recipient Bank Details function***************/
  // const handleStep2InputChange =(e,key) =>{
  //   console.log(e.target.value)
  //   console.log(key)
  //   let valueForm = formValue
  //   valueForm[key] = e.target.value
  //   setFormValue(valueForm)
  //   console.log(formValue)
  // }
  /************ Start - Cancel Recipient Bank Details function***************/
  const handlRecipientBankDetails = (e) => {
    e.preventDefault();
    window.location.reload(false);
  }

  //Get data of update value 

  /****************** select country *******************/

  const [countryValue, setcountryValue] = React.useState('')
  const countryoptions = useMemo(() => countryList().getData(), [])

  const changeHandler = countryValue => {
    setcountryValue(countryValue)
  }

  /* start-- useRef is used for focusing on inputbox */
  // const input_name = useRef(null);
  // const input_card_number = useRef(null);
  // const input_expiry_month = useRef(null);
  // const input_expiry_year = useRef(null);


  // Start page show hide condtion page

  const navigate = useNavigate('');

  const [data, setData] = useState({ id: "", name: "", card_number: "", expiry_month: "", expiry_year: "" })

  const updateSchema = Yup.object().shape({
    name: Yup.string().min(1, "Minimum 1 Letter").max(100, "Maximum 100 letter").required("Name is required"),
    card_number: Yup.string().min(12, "Minimum 1 Letter").max(16, "Maximum 100 letter").required("Card card_number is required"),
    expiry_month: Yup.string().min(1, "Minimum 1 digit").max(2, "Maximum 100 digit").required("Expire Month is required"),
    expiry_year: Yup.string().min(1, "Minimum 1 digit").max(2, "Maximum 50 digit").required("Expire Year is required"),
  })

  const initialValues = {
    name: '',
    card_number: '',
    expiry_month: "",
    expiry_year: ""
  }


  /**************************************************************************
    * ************** Start  Recipient Bank Details ****************************
    * ***********************************************************************/

  /* start-- useRef is used for focusing on inputbox */

  // axios.post(API.BASE_URL + `payment/card/${id}`, {}, {
  //   headers: {
  //     "Authorization": `Bearer ${signup_token ? signup_token : token}`,
  //   },
  // })
  //   .then(function (response) {
  //     console.log(response);
  //     let value = response.data.data
  //     console.log({
  //       ...data, name: value.name, card_number: value.card_number,
  //       expiry_month: value.expiry_month, expiry_year: value.expiry_year
  //     })

  //     setData({
  //       ...data,
  //       name: value.name,
  //       card_number: value.card_number,
  //       expiry_month: value.expiry_month,
  //       expiry_year: value.expiry_year
  //     })

  //     setLoading(false); // Stop loading   
  //   })
  //   .catch(function (error, message) {
  //     console.log(error.response);
  //     setLoading(false); // Stop loading in case of error
  //     // setBankNameText(error.response.data); 

  //   })




  /**************************************************************************
    * ************** Start  Recipient Bank Details ****************************
    * ***********************************************************************/

  /* start-- useRef is used for focusing on inputbox */
  // const handleCardUpdateDetails = (value) => {
  //   if (name.length == 0) {
  //     input_name.current.focus();
  //     setError(true);
  //   } else if (card_number.length == 0) {
  //     input_card_number.current.focus();
  //     setError(true);
  //   } else if (expiry_month.length == 0) {
  //     input_expiry_month.current.focus();
  //     setError(true);
  //   } else if (expiry_year.length == 0) {
  //     input_expiry_year.current.focus();
  //     setError(true);
  //   }
  //   else {
  //     console.log("============>token", token)

  //     // event.preventDefault();
  //     setLoading(true); // Set loading before sending API requestssss
  //     axios.patch(API.BASE_URL + `payment/card/${value}`, {
  //       name: name,
  //       card_number: card_number,
  //       expiry_month: expiry_month,
  //       expiry_year: expiry_year,
  //     }, {
  //       headers: {
  //         "Authorization": `Bearer ${signup_token ? signup_token : token}`,
  //       },
  //     })
  //       .then(function (response) {
  //         console.log(response);
  //         setLoading(false); // Stop loading 
  //         navigate('/userCardLists');

  //       })
  //       .catch(function (error, message) {
  //         console.log(error.response);
  //         setLoading(false); // Stop loading in case of error
  //         // setBankNameText(error.response.data);

  //       })
  //   }
  // }
  useEffect(() => {
    // console.log("Data=========>", id)

    setLoading(true); // Set loading before sending API requestssss
    getCardData(id).then((response) => {
      if (response.code == "200") {
        let value = response.data

        setData({
          ...data,
          id: value.id,
          name: value.name,
          card_number: value.card_number,
          expiry_month: value.expiry_month,
          expiry_year: value.expiry_year
        })
        formik.setFieldValue("name", value.name)
        formik.setFieldValue("card_number", value.card_number)
        formik.setFieldValue("expiry_month", value.expiry_month)
        formik.setFieldValue("expiry_year", value.expiry_year)
      }
      setLoading(false)
    }).catch((error) => {
      setLoading(false)
    })
  }, [])

  const inputvalidation = (event) => {
    const pattern = /^[0-9]+$/;
    let value = event.target.value
    if (event.key === 'Backspace' || event.key === 'Enter' || event.key === 'Tab' || event.key === 'Shift' || event.key === 'ArrowLeft' || event.key === "ArrowRight" || event.key === "Escape" || event.key === "Delete") {
    } else {
      if (value.length < 16) {
        if (!pattern.test(event.key)) {
          event.preventDefault();
          event.stopPropagation()
        } else {
          setData({ ...data, card_number: event.target.value })
          formik.setFieldValue('card_number', event.target.value)
          formik.setFieldTouched('card_number', true)
        }
      } else {
        event.preventDefault()
        event.stopPropagation()
      }
    }

  }
  const monthvalidation = (event) => {
    // return false
    // const l = event.target.value.toString()
    if (event.target.value > 12) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      formik.setFieldValue("expiry_month", event.target.value)
      formik.setFieldTouched("expiry_month", true)
      setData({ ...data, expiry_month: event.target.value })
    }

  }

  const yearvalidation = (event) => {
    // const l = event.target.value.toString()
    if (event.target.value > 99) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      formik.setFieldValue("expiry_year", event.target.value)
      formik.setFieldTouched("expiry_year", true)
      setData({ ...data, expiry_year: event.target.value })
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema: updateSchema,
    onSubmit: async (values) => {
      setLoading(true)
      updateCardUser(id, {
        name: values.name,
        card_number: values.card_number,
        expiry_month: values.expiry_month,
        expiry_year: values.expiry_year
      })
        .then((response) => {
          if (response.code == "200") {
            navigate('/user-card-list')
            toast.success(response.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
          } else if (response.code == "400") {
            toast.error(response.message, { position: "bottom-right", autoClose: 2000, hideProgressBar: true })
          }
          setLoading(false)
        })
        .catch((error) => {
          setLoading(false)
        })
    }
  })

  return (
    <>
      <section>
        <div className="margin-set">
          <div className="tabs-page">
            <Sidebar />

            {/* <div className="form-head mb-4">
                <h2 ><b>Profile</b>
                </h2>
                <NavLink to="/userrecipients">
                    <button className="form-button addsingle_recepient" ><BsFillPersonPlusFill /> Recipients Lists</button>
                </NavLink>
              </div> */}


            <div className="content-body">
              <section className="edit_recipient_section">
                <div className="form-head mb-4">
                  <h2 className="text-black font-w600 mb-0"><b>Update Card </b>
                    <NavLink to="/user-card-list">
                      <button className="start-form-button back-btn" >
                        <MdOutlineKeyboardBackspace />
                        Back
                      </button>
                    </NavLink>
                    {/* <button className="form-button addsingle_recepient" ><NavLink to="/userrecipients"><BsFillPersonPlusFill /> Recipients Lists</NavLink></button>  */}

                  </h2></div>
                {/* <span style={myStyle}>{BankNameText.Accountnumberexist? BankNameText.Accountnumberexist: ''}</span>
                  <span style={myStyle}>{BankNameText.userrecipient? BankNameText.userrecipient: ''}</span> */}
                <form onSubmit={formik.handleSubmit} noValidate className="single-recipient">
                  <div className="card">
                    <div className="card-body">

                      <div className="row">
                        {/* <h5>Bank Information</h5> */}
                        <div className="col-md-4">
                          <div className="input_field">
                            <p className="get-text">Card Name<span style={{ color: 'red' }} >*</span></p>
                            <input
                              type="text"
                              autoComplete='off'
                              value={data.name}
                              placeholder="Enter name"
                              name="name"
                              onChange={(e) => setData({ ...data, name: e.target.value })}
                              {...formik.getFieldProps('name')}
                              className={clsx(
                                'form-control bg-transparent',
                                { 'is-invalid': formik.touched.name && formik.errors.name },
                                {
                                  'is-valid': formik.touched.name && !formik.errors.name,
                                }
                              )}
                            //  placeholder={RecepientsData.bank_name}
                            />
                            {/* {error && name.length <= 0 ?
                                  <span style={myStyle}>Please Enter the Card Name </span> : ""} */}
                            <span style={myStyle}>{BankNameText.name ? BankNameText.name : ''}</span>

                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="input_field">
                            <p className="get-text">Card Number<span style={{ color: 'red' }} >*</span></p>
                            <input
                              // type="text"
                              // name="card_number"
                              // ref={input_card_number}
                              // value={card_number}
                              // onChange={handleNumber}
                              // className='rate_input form-control'
                              value={data.card_number}
                              type="text"
                              autoComplete='off'
                              // {...formik.getFieldProps('card_number')}
                              onChange={(e) => setData({ ...data, card_number: e.target.value })}
                              onKeyDown={(e) => inputvalidation(e)}
                              name="card_number"
                              className={clsx(
                                'mb-3 bg-transparent form-control',
                                { 'is-invalid': formik.touched.card_number && formik.errors.card_number },
                                {
                                  'is-valid': formik.touched.card_number && !formik.errors.card_number,
                                }
                              )}
                            />
                            {/* {error && card_number.length <= 0 ?
                                  <span style={myStyle}>Please Enter the Card card_number </span> : ""} */}

                            <span style={myStyle}>{BankNameText.card_number ? BankNameText.card_number : ''}</span>

                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="input_field">
                            <p className="get-text">Card Expiry Month<span style={{ color: 'red' }} >*</span></p>
                            <input
                              // type="text"
                              // name="expiry_month"
                              // ref={input_expiry_month}
                              // value={expiry_month}
                              // onChange={handleExpiryMonth}
                              // className='rate_input form-control'
                              value={data.expiry_month}
                              // name="expiry_month"
                              type="card_number"
                              size="2"
                              maxLength="2"
                              autoComplete='off'
                              max="12"
                              onChange={(e) => monthvalidation(e)}
                              // {...formik.getFieldProps('expiry_month')}
                              name="expiry_month"
                              className={clsx(
                                'mb-3 bg-transparent form-control',
                                { 'is-invalid': formik.touched.expiry_month && formik.errors.expiry_month },
                                {
                                  'is-valid': formik.touched.expiry_month && !formik.errors.expiry_month,
                                }
                              )}
                            />
                            {/* {error && expiry_month.length <= 0 ?
                                  <span style={myStyle}>Please Enter the Card Expiry Month </span> : ""} */}

                            <span style={myStyle}>{BankNameText.expiry_month ? BankNameText.expiry_month : ''}</span>
                            <span style={myStyle}>{BankNameText.Accountnumberexist ? BankNameText.Accountnumberexist : ''}</span>
                          </div>
                        </div>
                      </div>
                      <div className="row each-row">
                        <div className="col-md-4">
                          <div className="input_field">
                            <p className="get-text">Card Expiry Year<span style={{ color: 'red' }} >*</span></p>
                            <input
                              // type="text"
                              // name="expiry_year"
                              // ref={input_expiry_year}
                              // value={expiry_year}
                              // onChange={handleExpiryYear}
                              // className='rate_input form-control'
                              // name="expiry_year"
                              value={data.expiry_year}
                              type="card_number"
                              size="2"
                              maxLength="2"
                              autoComplete='off'
                              // {...formik.getFieldProps('expiry_year')}
                              onChange={(e) => yearvalidation(e)}
                              className={clsx(
                                'mb-3 bg-transparent form-control',
                                { 'is-invalid': formik.touched.expiry_year && formik.errors.expiry_year },
                                {
                                  'is-valid': formik.touched.expiry_year && !formik.errors.expiry_year,
                                }
                              )}
                            />
                            {/* {error && expiry_year.length <= 0 ?
                                  <span style={myStyle}>Please Enter the Card Expiry Year </span> : ""} */}

                            <span style={myStyle}>{BankNameText.expiry_year ? BankNameText.expiry_year : ''}</span>
                            <span style={myStyle}>{BankNameText.Accountnumberexist ? BankNameText.Accountnumberexist : ''}</span>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-4">
                          <button
                            type="submit"
                            className="start-form-button"
                            onClick={handlRecipientBankDetails}
                          >
                            Clear
                          </button>
                        </div>
                        <div className="col-md-8">
                          <button
                            type="submit"
                            className="form-button"
                          // onClick={() => handleCardUpdateDetails(id)}
                          >
                            Update Card

                            {loading ? <>
                              <div className="loader-overly">
                                <div className="loader" >

                                </div>

                              </div>
                            </> : <></>}

                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </section>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}



export default EditCardUser;