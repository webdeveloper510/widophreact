import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { commaSeperator } from '../../utils/hook'

const TransactionConfirm = ({ data, discount, handleCancel, handleContinue }) => {


    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        })

    }, [])

    return (
        <div className='col-md-12 d-grid m-0 p-0' style={{ placeItems: "center" }}>
            <div className="form-head mb-4">
                <h2 className="text-black font-w600 mb-0"><b>{!data?.data?.reason ? "Review Your Transfer" : "Confirm Your Transfer"}</b>
                </h2>
            </div>
            <div className='card w-75'>
                <div className='card-body'>
                    <Table className='recipint-details-popup'>
                        <thead>
                            <tr>
                                <th colSpan={2} className="popup-heading">Transfer Summary</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>Amount Sending</th>
                                <td>{data?.data?.amount?.from_type}&nbsp;{data?.data?.amount?.send_amt !== "" && data?.data?.amount?.send_amt !== undefined && data?.data?.amount?.send_amt !== null ? commaSeperator(data?.data?.amount?.send_amt) : data?.data?.amount?.send_amt}</td>
                            </tr>
                            <tr>
                                <th>Amount Exchanged</th>
                                <td>{data?.data?.amount?.to_type}&nbsp;{data?.data?.amount?.exchange_amt !== "" && data?.data?.amount?.exchange_amt !== undefined && data?.data?.amount?.exchange_amt !== null ? commaSeperator(data?.data?.amount?.exchange_amt) : data?.data?.amount?.exchange_amt}</td>
                            </tr>
                            {
                                discount?.discount_amount?.toString()?.split(".")[0] !== "0" && discount?.discount_amount !== "" ? (
                                    <tr>
                                        <td>Discount Applied</td>
                                        <td className='text-success'>
                                            <span>{data?.data?.amount?.from_type}</span>&nbsp;{discount?.discount_amount}&nbsp;{discount?.type?.toLowerCase() === "invite" ? "(Refferal discount)" : `(${discount?.type} discount)`}
                                        </td>
                                    </tr>
                                ) : (
                                    <></>
                                )
                            }
                            <tr>
                                <th>Total Cost</th>
                                <td>{data?.data?.amount?.from_type}&nbsp;{discount?.final_amount}</td>
                            </tr>
                            <tr>
                                <th>Total To Recipient</th>
                                <td>{data?.data?.amount?.to_type}&nbsp;{data?.data?.amount?.exchange_amt !== "" && data?.data?.amount?.exchange_amt !== undefined && data?.data?.amount?.exchange_amt !== null ? commaSeperator(data?.data?.amount?.exchange_amt) : data?.data?.amount?.exchange_amt}</td>
                            </tr>
                            <tr>
                                <th>Exchange Rate</th>
                                <td>1 {data?.data?.amount?.from_type} = {data?.data?.amount?.exchange_rate !== "" && data?.data?.amount?.exchange_rate !== undefined && data?.data?.amount?.exchange_rate !== null ? commaSeperator(data?.data?.amount?.exchange_rate) : data?.data?.amount?.exchange_rate}&nbsp;{data?.data?.amount?.to_type}</td>
                            </tr>
                        </tbody>
                        <thead>
                            <tr>
                                <th colSpan={2} className="popup-heading">Transfer To</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>Beneficiary Name</th>
                                <td>{data?.data?.recipient?.first_name} {data?.data?.recipient?.middle_name !== "" ? data?.data?.recipient?.middle_name : ""} {data?.data?.recipient?.last_name}</td>
                            </tr>
                            <tr>
                                <th>Bank Name</th>
                                <td>{data?.data?.amount?.part_type === "other" ? data?.data?.amount?.payout_part : data?.data?.amount?.part_type}</td>
                            </tr>
                            {
                                data?.data?.receive_method ? (
                                    <tr>
                                        <th>Receive Method</th>
                                        <td>{data?.data?.receive_method === "PayByID" ? "Pay ID" : data?.data?.receive_method}</td>
                                    </tr>
                                ) : <></>
                            }
                            {
                                data?.data?.reason ? (
                                    <tr>
                                        <th>Reason</th>
                                        <td>{data?.data?.reason}</td>
                                    </tr>
                                ) : <></>
                            }
                        </tbody>
                    </Table>
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
    )
}

export default TransactionConfirm