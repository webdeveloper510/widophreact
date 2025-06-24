import React, { useEffect, useState } from 'react'
import { Button, Modal, Table } from 'react-bootstrap'
import { commaSeperator } from '../../utils/hook'
import { Link } from 'react-router-dom'
import DiscountList from './DiscountList'
import { applyReferralCode } from '../../utils/Api'
import { toast } from 'react-toastify'

const ReviewYourTransfer = ({ data, isConfirmation, handleCancel, handleContinue }) => {

    const [coupon_selector, setCouponSelector] = useState(false)
    const [user_data, setUserData] = useState(JSON.parse(sessionStorage.getItem("remi-user-dt")))
    const [applied, setApplied] = useState(null);
    const [discount_values, setDiscountValues] = useState({
        final_amount: data?.data?.amount?.send_amt || 0,
        discount_amount: data?.data?.amount?.discount_amount || 0,
        total_amount: data?.data?.amount?.send_amt || 0
    })

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        })
    }, [])

    const handleCouponSelector = () => {
        setCouponSelector(!coupon_selector)

    }

    const handleCouponSelection = (value) => {
        applyReferralCode({ referral_meta_id: value?.referral_meta_id, transaction_id: sessionStorage.getItem("transaction_id") }).then(res => {
            if (res.code === "200") {
                setDiscountValues(res.data)
                setApplied(value)
            } else {
                toast.error(res.message, { hideProgressBar: true, autoClose: 3000, position: "bottom-right" })
            }
        })
    }

    const removeDiscount = () => {
        setApplied(null)
        setDiscountValues({
            final_amount: data?.data?.amount?.send_amt || 0,
            discount_amount: data?.data?.amount?.discount_amount || 0,
            total_amount: data?.data?.amount?.send_amt || 0
        })
        sessionStorage.removeItem("discApp")
    }

    useEffect(() => {
        if (applied) {
            sessionStorage.setItem("discApp", JSON.stringify({ value: applied, tId: sessionStorage.getItem("transaction_id") }))
        }
    }, [applied])

    return (
        <>
            <div className='col-md-12 d-grid m-0 p-0' style={{ placeItems: "center" }}>
                <div className="form-head mb-4">
                    <h2 className="text-black font-w600 mb-0"><b>{!data?.data?.reason ? "Review Your Transfer" : "Confirm Your Transfer"}</b>
                    </h2>
                </div>
                <div className='card w-100'>
                    <div className='card-body'>
                        <div className='w-100 review_transfer_head'>
                            <b className="text-start fs-5">Transfer Details</b>
                        </div>
                        <div className="row my-4">
                            <div className="col-md-6">
                                <div className="review_transfer_field my-3">
                                    <span>Amount Sending</span>
                                    <th className='float-end'>{data?.data?.amount?.from_type}&nbsp;{discount_values.total_amount !== "" && discount_values.total_amount !== undefined && discount_values.total_amount !== null ? commaSeperator(discount_values.total_amount) : discount_values.total_amount}</th>
                                </div>
                                <div className="review_transfer_field my-3">
                                    <span>Amount Exchanged</span>
                                    <th className='float-end'>{data?.data?.amount?.to_type}&nbsp;{data?.data?.amount?.exchange_amt !== "" && data?.data?.amount?.exchange_amt !== undefined && data?.data?.amount?.exchange_amt !== null ? commaSeperator(data?.data?.amount?.exchange_amt) : data?.data?.amount?.exchange_amt}</th>
                                </div>
                               {
                                isConfirmation && (
                                    <div className="review_transfer_field my-3 text-success">
                                    <span>Discount Applied</span>
                                    <th className='float-end'> <span className='text-success'>{data?.data?.amount?.from_type}&nbsp;{discount_values?.discount_amount}&nbsp;</span>
                                        {
                                            applied?.name && (
                                                <small>{applied?.name?.toLowerCase() === "invite" ? "(Refferal discount)" : `(${applied?.name} discount)`}</small>
                                            )
                                        }

                                    </th>
                                </div>
                                )
                               }
                                {
                                    isConfirmation && (
                                        <div className='row'>
                                            <div className='col-md-6'>
                                                {
                                                    applied === null && (
                                                        <span style={{ color: "rgba(114, 62, 235, 0.7)" }} onClick={() => handleCouponSelector()}> <b className='mt-2' style={{ textDecoration: "underline", cursor: "pointer" }} >See All Coupons</b> &rarr;</span>
                                                    )
                                                }
                                            </div>
                                            <div className='col-md-6'>
                                                {
                                                    applied && (
                                                        <Button variant='danger' className='float-end' onClick={() => removeDiscount()}>Remove</Button>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    )
                                }

                            </div>
                            <div className="col-md-6">
                                <div className="review_transfer_field my-3">
                                    <span>Total Cost</span>
                                    <th className='float-end'>{data?.data?.amount?.from_type}&nbsp;{discount_values?.final_amount}</th>
                                </div>
                                <div className="review_transfer_field my-3">
                                    <span>Total To Recipient</span>
                                    <th className='float-end'>{data?.data?.amount?.to_type}&nbsp;{data?.data?.amount?.exchange_amt !== "" && data?.data?.amount?.exchange_amt !== undefined && data?.data?.amount?.exchange_amt !== null ? commaSeperator(data?.data?.amount?.exchange_amt) : data?.data?.amount?.exchange_amt}</th>
                                </div>
                                <div className="review_transfer_field my-3">
                                    <span>Exchange Rate</span>
                                    <th className='float-end'>1 {data?.data?.amount?.from_type} = {data?.data?.amount?.exchange_rate !== "" && data?.data?.amount?.exchange_rate !== undefined && data?.data?.amount?.exchange_rate !== null ? commaSeperator(data?.data?.amount?.exchange_rate) : data?.data?.amount?.exchange_rate}&nbsp;{data?.data?.amount?.to_type}</th>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-6'>
                                <div className='w-100 review_transfer_head'>
                                    <b className="text-start fs-5">Transfer From </b><small>(Sender Details)</small>
                                </div>
                                <div className="review_transfer_field mt-4">
                                    <span>Sender Name</span>
                                    <th className='float-end'>{user_data?.First_name}&nbsp;{user_data?.Last_name}</th>
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className='w-100 review_transfer_head mb-4'>
                                    <b className="text-start fs-5">Transfer To </b><small>(Recipient Details)</small>
                                </div>
                                <div className="review_transfer_field mt-4">
                                    <span>Beneficiary Name</span>
                                    <th className='float-end'>{data?.data?.recipient?.first_name} {data?.data?.recipient?.last_name}</th>
                                </div>
                                <div className="review_transfer_field my-3">
                                    <span>Bank Name</span>
                                    <th className='float-end'>{data?.data?.amount?.part_type === "other" ? data?.data?.amount?.payout_part : data?.data?.amount?.part_type}</th>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-md-4">
                                <button className="start-form-button" variant="secondary" onClick={() => handleCancel()}>
                                    Back
                                </button>
                            </div>
                            <div className="col-md-8 full-col">
                                <button className="form-button detail_buttoon" type="button" variant="primary" onClick={() => handleContinue()}>Continue</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DiscountList show={coupon_selector} handler={() => handleCouponSelector()} handleSelected={(value) => handleCouponSelection(value)} selected={applied} currency={data?.data?.amount?.from_type} />
        </>
    )
}

export default ReviewYourTransfer