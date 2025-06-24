import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { NavLink, useNavigate } from 'react-router-dom';
import axios from "axios";
import norecipients from '../../assets/img/userdashboard/hidden.avif';
import { BsFillPersonPlusFill } from "react-icons/bs";
import Sidebar from './Sidebar';
import authDashHelper from "../../utils/AuthDashHelper";
import { recipientList } from "../../utils/Api";


const UserRecipients = () => {

    const token = sessionStorage.getItem("token")
    const navigate = useNavigate();

    const [show, setShow] = useState(false);
    const [delete_id, setDelete_Id] = useState('');
    const handleClose = () => setShow(false);
    const [isActive, setActive] = useState("false");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const serverUrl = process.env.REACT_APP_API_URL

    const handleShow = (key) => {
        setShow(true);
        setDelete_Id(key)
    }

    const LoadEdit = (id) => {
        navigate(`/edit-recipient-user`, { state: { id: id } });
    }

    const getList = () => {
        setLoading(true);
        recipientList().then((res) => {
            setData(res.data)
            setLoading(false)
        }).catch((error) => {
            setLoading(false)
        })
    }

    useEffect(() => {
        getList();
    }, [])

    const handleRemoveRecipientBankDetails = () => {
        axios.delete(`${serverUrl}/payment/recipient-update/${delete_id}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
            .then(function (response) {
                handleClose()
                getList();
            })
            .catch(function (error) {
            })
    }


    return (
        <>
            {loading ? <>
                <div className="loader-overly">
                    <div className="loader" >
                    </div>

                </div>
            </> : <></>}
            {
                !loading ? (
                    <span>
                        {data && data?.length > 0 ? (
                            <section className="user_recipients_section">
                                <div className="form-head mb-4">
                                    <h2 className="text-black font-w600 mb-0"><b>Recipients Lists</b>
                                        <NavLink to="/add-new-recipient">
                                            <button className="form-button addsingle_recepient" >
                                                <BsFillPersonPlusFill />
                                                Add New Recipient
                                            </button>
                                        </NavLink>
                                    </h2>
                                </div>
                                <div className="col-lg-12">
                                    <div className="card fullwidth">
                                        <div className="card-body">
                                            <div className="table-responsive">
                                                <Table className="table table-responsive-md card-table previous-transaction">
                                                    <thead>
                                                        <tr>
                                                            <th>Sr.No </th>
                                                            <th>Name</th>
                                                            <th>Destination</th>
                                                            {/* <th>Transfer Now Link</th> */}
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            data?.map((item, index) => {
                                                                return (
                                                                    <tr key={item.id}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{item.first_name} {item.last_name}</td>
                                                                        <td>{item.country}</td>
                                                                        {/* <td>{item.transfer_now ? item.transfer_now : "Coming soon"}</td> */}
                                                                        <td>
                                                                            <button className="btn btn-danger" onClick={() => handleShow(item.id)}><i className="fa fa-trash"></i></button>
                                                                            <button className="btn btn-primary" onClick={() => { LoadEdit(item.id) }}><i className="fa fa-pencil color-muted"></i></button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })}
                                                    </tbody>
                                                </Table>
                                            </div>
                                            <Modal show={show} onHide={handleClose} backdrop="static" >
                                                <Modal.Header>
                                                </Modal.Header>
                                                <Modal.Body>Are you sure you want to delete ?</Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={() => handleClose()}>
                                                        Close
                                                    </Button>
                                                    <Button className="delete_recipient" variant="danger" onClick={() => { handleRemoveRecipientBankDetails() }} >
                                                        Delete
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>

                                        </div>
                                    </div>
                                </div>
                            </section>
                        ) : (
                            <>
                                <section>
                                    <div className="form-head mb-4">
                                        <h2 className="text-black font-w600 mb-0"><b>Add Recipient</b></h2>
                                    </div>
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="add-rec-new">
                                                <h6 className="my-2">No Recipient Found</h6>
                                                <img src={norecipients} alt="empty" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={isActive ? "add-recipent-section" : "remove-add-recipent-section"}>
                                        <div className="col-md-12 align-center">
                                            <NavLink to="/add-new-recipient">
                                                <button className="form-button addsingle_recepient" >
                                                    <BsFillPersonPlusFill />
                                                    Add New Recepients
                                                </button>
                                            </NavLink>
                                        </div>
                                    </div>
                                </section>
                            </>
                        )
                        }
                    </span>
                ) : (
                    <>
                        <div className="loader-overly">
                            <div className="loader" >
                            </div>
                        </div>
                    </>
                )
            }
        </>
    )
}

export default UserRecipients;