import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { Table, Card, NavLink } from 'react-bootstrap'
import { paymentSummary } from '../../utils/Api'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { commaSeperator } from '../../utils/hook'

const TransactionDetails = () => {

    const [detail, setDetails] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const { id } = useParams()
    const [reason, setReason] = useState("")


    useEffect(() => {
        setLoading(true)
        // console.log(id)
        paymentSummary(id).then(res => {
            if (res.code === "200") {
                setDetails(res.data)
                if (res.data.payment_status_reason && res.data?.payment_status?.toLowerCase() === "cancelled") {
                    fetchReason(res.data.payment_status_reason)
                }
            } else if (res.code === "400") {
                setError("Sorry, we are unable to find the details..")
            }
            setLoading(false)
        })
    }, [])

    const dateCreated = (date) => {
        let d = date.split("-")
        return d[2] + "-" + d[1] + "-" + d[0]
    }

    const fetchReason = (reason_list) => {
        let list = reason_list.split(",");
        let ar = list.filter(item => {
            return !item.includes("risk") && !item.includes("Risk") && item !== "" && item !== " "
        })
        if (ar[0] !== "" && ar[0] !== " ") {
            setReason(ar[0])
        } else {
            setReason("")
        }
    }

    return (
        <>
            {
                !loading ?
                    (
                        <section className="transfer-history-section">
                            <div className="form-head mb-4">
                                <h2 className="text-black font-w600 mb-0"><b>Transaction Detail</b></h2>
                            </div>
                            <div className="transaction-progress">
                                {error ? <p className='text-danger fs-5'>{error}</p> : <></>}
                                <div className="row mx-2">
                                    <Card>
                                        <Card.Body>
                                            <div className="row my-4">
                                                <div className='d-grid col-md-3 my-1 border-end'>
                                                    <span className='fs-6'>Amount Paid</span>
                                                    <span className='fw-semibold d-grid'>
                                                        <span className="fs-4"><span className='fs-6'>{detail?.send_currency}</span>&nbsp;{detail?.amount ? commaSeperator(detail?.amount) : "N/A"}</span>
                                                        {
                                                            detail?.discount_amount?.toString()?.split(".")[0] !== "0" && detail?.discount_amount !== "" ? (
                                                                <span className='small'>
                                                                    {detail?.send_currency}&nbsp;{detail?.discount_amount} Discount Applied
                                                                </span>
                                                            ) : (
                                                                <></>
                                                            )
                                                        }
                                                    </span>
                                                </div>
                                                <div className='d-grid col-md-3 my-1 border-end'>
                                                    <span className='fs-6'>Amount Sent</span>
                                                    <span className='fw-semibold fs-4'><span className=' fs-6'>{detail?.send_currency}&nbsp;</span>{detail?.total_amount ? commaSeperator(detail?.total_amount) : "N/A"}</span>
                                                </div>
                                                <div className='d-grid my-1 col-md-3 border-end'>
                                                    <span className='fs-6'>Amount Received</span>
                                                    <span className='fw-semibold fs-4'><span className=' fs-6'> {detail?.receive_currency}&nbsp;</span>{detail?.send_amount ? commaSeperator(detail?.receive_amount) : "N/A"}</span>
                                                </div>
                                                <div className='d-grid my-1 col-md-3'>
                                                    <span className='fs-6'> Exchange Rate</span>
                                                    <span className='fw-semibold d-grid'><span className='fs-4'>{detail?.exchange_rate ? commaSeperator(detail?.exchange_rate) : "N/A"}</span><span className='small'>{detail?.send_currency} {detail?.send_currency ? (<>&rarr;</>) : ""} {detail?.receive_currency}</span></span>
                                                </div>
                                            </div>
                                            <div className='row'>

                                                <div className='d-grid fs-6 my-1 col-md-2'>
                                                    <span>Date Created</span>
                                                    <span className='fw-semibold small'>{detail?.date ? dateCreated(detail?.date) : "N/A"}</span>
                                                </div>
                                                <div className='d-grid fs-6 my-1 col-md-2'>
                                                    <span>Transaction Id</span>
                                                    <span className='fw-semibold small'>{detail?.transaction_id ? detail?.transaction_id : "N/A"}</span>
                                                </div>
                                                <div className={`d-grid fs-6 my-1 ${detail?.payment_status?.toLowerCase() === "cancelled" ? "col-md-2" : "col-md-4"}`}>
                                                    <span>Status</span>
                                                    {
                                                        detail?.payment_status && (detail?.payment_status === "cancelled" || detail?.payment_status === "Cancelled") ? (
                                                            <span className='fw-semibold small text-danger text-capitalize'>{detail?.payment_status ? detail?.payment_status : "N/A"}</span>

                                                        ) : (
                                                            <span className='fw-semibold small text-capitalize'>{detail?.payment_status ? detail?.payment_status : "N/A"}</span>
                                                        )
                                                    }
                                                </div>
                                                {
                                                    reason !== "" ? (
                                                        <div className='d-grid fs-6 my-1 col-md-2'>
                                                            <span>Reason</span>
                                                            <span className='fw-semibold small text-capitalize'>{reason}</span>
                                                        </div>
                                                    ) : (
                                                        <></>
                                                    )
                                                }
                                                <div className={`d-grid fs-6 my-1 col-md-4`}>
                                                    {
                                                        detail?.payment_status?.toLowerCase() == "incomplete" ? (
                                                            <Link to={"/user-send-money"} state={{ id: detail?.id }}>
                                                                <span className="btn btn-outline-success btn-rounded" >Continue Transaction</span>
                                                           </Link>
                                                        ) : (
                                                            <a href={`${process.env.REACT_APP_API_URL}/payment/receipt/${detail?.id}`} target="_blank">
                                                                <span className="btn btn-outline-success btn-rounded" >Download Receipt</span>
                                                            </a>
                                                        )
                                                    }

                                                </div>
                                            </div>
                                            <hr />
                                            <div className='row my-4'>
                                                <div className="col-md-6 col-lg-6 col-sm-12">
                                                    <h5>Recipient Details</h5>
                                                    <Table>
                                                        <tbody style={{ maxWidth: "fit-content" }}>
                                                            <tr>
                                                                <td>Recipient name:</td>
                                                                <td className='text-capitalize' style={{ wordBreak: "break-word" }}>{detail?.recipient_name ? detail?.recipient_name : "N/A"}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Bank name:</td>
                                                                <td className='text-capitalize' style={{ wordBreak: "break-word" }}>{detail?.bank_name ? detail?.bank_name : "N/A"}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Account name:</td>
                                                                <td className='text-capitalize' style={{ wordBreak: "break-word" }}>{detail?.account_name ? detail?.account_name : "N/A"}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Account number:</td>
                                                                <td style={{ wordBreak: "break-word" }}>{detail?.account_number ? detail?.account_number : "N/A"}</td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                </div>
                                                <div className="col-md-6 col-lg-6 col-sm-12">
                                                    <h5>More Details</h5>
                                                    <Table>
                                                        <tbody>
                                                            <tr>
                                                                <td>Transfer method:</td>
                                                                <td style={{ wordBreak: "break-word" }}>{detail?.send_method ? detail?.send_method === "zai_payto_agreement" ? "Payto agreement" : detail?.send_method === "zai_payid_per_user" ? "PayID" : detail?.send_method : "N/A"}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Customer ID:</td>
                                                                <td style={{ wordBreak: "break-word" }}>{detail?.customer_id ? detail?.customer_id : "N/A"}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Transfer Reason:</td>
                                                                <td style={{ wordBreak: "break-word" }}>{detail?.reason ? detail?.reason : "N/A"}</td>
                                                            </tr>
                                                            {
                                                                detail?.send_method_details !== null ? (
                                                                    <>
                                                                        {
                                                                            detail?.send_method_details?.payid ?
                                                                                (
                                                                                    <tr>
                                                                                        <td>PayID:</td>
                                                                                        <td style={{ wordBreak: "break-word" }}>{detail?.send_method_details?.payid ? detail?.send_method_details?.payid : "N/A"}</td>
                                                                                    </tr>
                                                                                ) : <></>
                                                                        }
                                                                        {
                                                                            detail?.send_method !== "zai_payid_per_user" ? (
                                                                                <>
                                                                                    {
                                                                                        detail?.send_method_details?.bsb_code ?
                                                                                            (
                                                                                                <tr>
                                                                                                    <td>BSB code:</td>
                                                                                                    <td style={{ wordBreak: "break-word" }}>{detail?.send_method_details?.bsb_code ? detail?.send_method_details?.bsb_code : "N/A"}</td>
                                                                                                </tr>
                                                                                            ) : <></>
                                                                                    }
                                                                                    {
                                                                                        detail?.send_method_details?.account_number ?
                                                                                            (
                                                                                                <tr>
                                                                                                    <td>Account number:</td>
                                                                                                    <td style={{ wordBreak: "break-word" }}>{detail?.send_method_details?.account_number ? detail?.send_method_details?.account_number : "N/A"}</td>
                                                                                                </tr>
                                                                                            ) : <></>
                                                                                    }
                                                                                    {
                                                                                        detail?.send_method_details?.max_amount ?
                                                                                            (
                                                                                                <tr>
                                                                                                    <td>Max amount per transaction:</td>
                                                                                                    <td style={{ wordBreak: "break-word" }}>{detail?.send_method_details?.max_amount ? detail?.send_method_details?.max_amount : "N/A"}</td>
                                                                                                </tr>
                                                                                            ) : <></>
                                                                                    }
                                                                                </>
                                                                            ) : <></>
                                                                        }
                                                                    </>
                                                                ) : <></>
                                                            }
                                                        </tbody>
                                                    </Table>
                                                </div>

                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>
                            </div>
                        </section>
                    ) : (
                        <div className="loader-overly">
                            <div className="loader" >
                            </div>

                        </div>
                    )
            }
        </>

    )
}

export default TransactionDetails