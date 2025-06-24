import React, { useEffect, useState } from 'react'
import Sidebar from '../Sidebar'
import { Button, Table } from 'react-bootstrap'
import { getAgreementList, getPayID } from '../../../utils/Api'
import { toast } from 'react-toastify'

const PayToDetail = () => {

    const [agreement_details, setAgreementDetails] = useState({})
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        setLoader(true)
        getAgreementList().then(res => {
            setLoader(false)
            if (res?.code === "200") {
                setAgreementDetails(res?.data)
            }
        })
    }, [])

    const dateFormat = (date) => {
        let split = date.split("-");
        return split[2] + "-" + split[1] + "-" + split[0]
    }


    return (
        <section>
            <div className="form-head mb-4">
                <span className="text-black font-w600 mb-0 fs-3 fw-semibold"><img src="/assets/img/zai/payto.svg" height={50} /> Agreement Details
                </span>
            </div>

            {!loader ? (
                <div className='row'>
                    <div className='col-md-7'>
                        <div className='form_body h-100'>
                            {
                                Object?.keys(agreement_details)?.length > 0 ? (
                                    <div>
                                        <Table>
                                            <tbody>
                                                <tr>
                                                    <td>Agreement ID:</td>
                                                    <td>{agreement_details?.agreement_uuid}</td>
                                                </tr>
                                                {
                                                    agreement_details?.account_id_type === "PAYID" ? (
                                                        <>
                                                            <tr>
                                                                <td>Pay ID:</td>
                                                                <td>{agreement_details?.payid}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Pay ID Type:</td>
                                                                <td>{agreement_details?.payid_type === "EMAL" ? "EMAIL" : agreement_details?.payid_type === "TELI" ? "TEL" : agreement_details?.payid_type}</td>
                                                            </tr>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <tr>
                                                                <td>Account Number:</td>
                                                                <td>{agreement_details?.account_number}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>BSB Code:</td>
                                                                <td>{agreement_details?.bsb_code}</td>
                                                            </tr>
                                                        </>
                                                    )
                                                }
                                                <tr>
                                                    <td>Amount Limit:</td>
                                                    <td>${agreement_details?.max_amount === "1000" ? "1k" : agreement_details?.max_amount === "5000" ? "5k" : agreement_details?.max_amount === "10000" ? "10k" : "30k"}</td>
                                                </tr>
                                                <tr>
                                                    <td>Start Date:</td>
                                                    <td>{dateFormat(agreement_details?.agreement_start_date)}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                ) : (
                                    <p className="no-entry"> No Agreement created</p>
                                )
                            }
                        </div>
                    </div>
                </div>
            ) : (
                <div className="loader-overly">
                    <div className="loader" >
                    </div>
                </div>
            )}
        </section>
    )
}

export default PayToDetail