import React from 'react'
import { Modal } from 'react-bootstrap'

export const PayToInst = ({ show, handler }) => {
    return (
        <Modal show={show} onHide={handler} centered>
            <Modal.Header closeButton>
                <Modal.Title className='fs-5'><img src="/assets/img/zai/payto.svg" height={30} /></Modal.Title>
            </Modal.Header>
            <Modal.Body className="my-3 guideline">
                <b>Instructions to use PayTo as a payment method:</b>
                <ul className='py-2'>
                    <li>Create a PayTo agreement authorising us to debit your account for transaction. </li>
                    <li>We initiate a request to your financial institution for the payment.</li>
                    <li>You log on to your banking portal or app to review and approve the payment for your transaction.</li>
                </ul>
            </Modal.Body>
        </Modal>
    )
}


export const PayIDInst = ({ show, handler }) => {
    return (
        <Modal show={show} onHide={handler} centered>
            <Modal.Header closeButton>
                <Modal.Title className='fs-5'><img src="/assets/img/zai/payid.svg" height={30} /></Modal.Title>
            </Modal.Header>
            <Modal.Body className="my-3 guideline">
                <b>Instructions to use PayID as a payment method:</b>
                <ul className='py-2'>
                    <li>Copy the generated PayID and Transaction ID. </li>
                    <li>Log on to your banking portal or app to initiate the payment for transaction to copied PayID.</li>
                    <li>Use transaction ID as reference number for the payment.</li>
                </ul>
            </Modal.Body>
        </Modal>
    )
}

