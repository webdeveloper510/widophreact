import React, { useEffect, useState } from 'react'
import Sidebar from '../Sidebar'
import { Button, Table } from 'react-bootstrap'
import { getPayID } from '../../../utils/Api'

const PayIdDetail = () => {

    const [pay_id_details, setPayIdDetails] = useState({ pay_id: null, email: null });
    const [copied, setCopied] = useState(false)
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        setLoader(true)
        getPayID().then(res => {
            setLoader(false)
            if (res?.code === "200") {
                setPayIdDetails({ pay_id: res?.data?.payid, email: res?.data?.zai_email })
            }
        })
    }, [])


    const copyToClipboard = (value) => {
        navigator.clipboard.writeText(value)
        setCopied(true)
    }

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false)
            }, 3000)
        }
    }, [copied])

    return (
        <section>
            <div className="form-head mb-4">
                <span className="text-black font-w600 mb-0 fs-3 fw-semibold"><img src="/assets/img/zai/payid.svg" height={50} /> Details
                </span>
            </div>

            {!loader ? (
                <div className="row">
                    <div className="col-md-6">
                        <div className='form_body h-100'>

                            {
                                pay_id_details.pay_id !== null ? (
                                    <div>
                                        <Table>
                                            <tbody>
                                                <tr>
                                                    <td>Pay ID:</td>
                                                    <td>{pay_id_details?.pay_id}
                                                        <span>
                                                            <Button type='button' className='mx-2 px-2 py-0 clipboard-button' variant={copied ? 'outline-success' : 'outline-secondary'} onClick={() => copyToClipboard(pay_id_details.pay_id)}>
                                                                {
                                                                    copied ?
                                                                        <>
                                                                            <i className="bi bi-clipboard"></i>
                                                                            <span className="tooltip-clipboard">Copied!</span>
                                                                        </> : <>
                                                                            <i className="bi bi-clipboard"></i>
                                                                            <span className="tooltip-clipboard">Copy</span>
                                                                        </>
                                                                }
                                                            </Button>
                                                        </span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Email:</td>
                                                    <td>{pay_id_details?.email}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                ) : (<p className="no-entry">No Pay ID registered</p>)
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

export default PayIdDetail