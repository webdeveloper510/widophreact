import Sidebar from '../Sidebar';
import React, { useEffect, useState } from 'react'
import AmountDetail from './AmountDetail'
import BankDetails from './BankDetails'
import PaymentDetails from './PaymentDetails'
import { useLocation, useNavigate } from 'react-router-dom'
import authDashHelper from '../../../utils/AuthDashHelper';
import { pendingTransactions } from '../../../utils/Api';

const SendMoney = () => {

    const [step, setStep] = useState(0)
    const [previous, setPrevious] = useState(null)
    const navigate = useNavigate()

    const location = useLocation();

    const handleStep = (data) => {
        setStep(Number(data))
    }

    useEffect(() => {
        if (location?.state && location?.state?.id) {
            setPrevious(location.state.id)
        }
    }, [])

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
        })
        sessionStorage.setItem("send-step", step)
    }, [step])

    useEffect(() => {
        if (authDashHelper('dashCheck') === false) {
            navigate("/dashboard")
        }
    }, [])

    return (
        <div className="col-md-12">
            {
                step === 0 ? <AmountDetail handleStep={handleStep} step={step} previous={previous} />
                    :
                    step === 1 ? <BankDetails handleStep={handleStep} step={step} />
                        :
                        step === 2 ? <PaymentDetails handleStep={handleStep} step={step} />
                            :
                            <></>
            }
        </div>
    )
}

export default SendMoney