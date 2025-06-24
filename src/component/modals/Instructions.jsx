import { NavLink } from "react-bootstrap"
import { Link } from "react-router-dom"

export const PayToInstructions = ({ amount, currency }) => {
    return (
        <div className="instructions">
            <p className="thank">Thank you for choosing us,</p>
            <p>Please note that your PayTo agreement is now pending authorisation with your financial institution. </p>
            <p>To expedite transfer of your funds to your beneficiary, please:
                <ol>
                    <li>Log on to your banking portal or app.</li>
                    <li>Review and approve the PayTo agreement.</li>
                    <li>Once we have your authorisation, we'll debit <b>{currency} {amount}</b> from your account for this transfer.</li>
                    <li>If you need help approving your PayTo agreement, just get in touch with our <Link className="fw-bold" to={"/help"}>Support Centre</Link>.</li>
                </ol>
            </p>
            <p>Our essence is to serve you!</p>
            <p>RemitAssure Customer Management.</p>
        </div>
    )
}

export const PayIdInstructions = ({ amount, currency, pay_id, transaction_id }) => {
    return (
        <div className="instructions">
            <p className="thank">Thank you for choosing us,</p>
            <p>To expedite transfer of your funds to your beneficiary, please:</p>
            <ol className="my-2">
                <li>Log on to your banking portal or app.</li>
                <li>Initiate payment of <b>{currency} {amount}</b> for your transfer to PayID <span className="fw-bold" style={{ cursor: "pointer", color: "#4fa6d5" }} onClick={() => { navigator.clipboard.writeText(pay_id) }}>({pay_id})</span>.</li>
                <li>Enter your transaction ID <span className="fw-bold" style={{ cursor: "pointer", color: "#4fa6d5" }} onClick={() => { navigator.clipboard.writeText(transaction_id) }}>({transaction_id})</span> in the reference field of your bank transfer.</li>
                <li>If you need assistance initiating a PayID bank transfer, please contact our <Link className="fw-bold" to={"/help"}>Support Centre</Link>.</li>
            </ol>
            <p>Our essence is to serve you!</p>
            <p>RemitAssure Customer Management.</p>
        </div>
    )
}