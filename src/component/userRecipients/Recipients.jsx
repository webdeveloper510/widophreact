import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Accordion from 'react-bootstrap/Accordion';
import { toast } from "react-toastify";
import axios from "axios";
import MultiStepProgressBar from "./MultiStepProgressBar";
import global from "../../utils/global";

const Recipients = () => {

    const token = sessionStorage.getItem("token");
    const verification_otp = sessionStorage.getItem("verification_otp");

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.post(global.serverUrl + '/recipient-list/', {}, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
            .then(function (response) {
                setData(response.data);
                setLoading(false);
            })
            .catch(function (error) {
                setLoading(false);
                if (error.response.status) {
                    toast.error(error.response.data.detail);
                }
            })
    }, [])

    return (
        <>
            {
                verification_otp || token != undefined || '' ? (

                    <section>
                        <div className="container">
                            <div className="row">
                                <section className="user_recipients_section">
                                    <h1 className="recipients_lists">Recipients Lists</h1>


                                    <div className="col-lg-12">
                                        {/* loader start */}

                                        {loading ? <>
                                            <div className="loader-overly">
                                                <div className="loader" >

                                                </div>

                                            </div>
                                        </> : <></>}
                                        {/* loader End */}
                                        {/* <h1 className="recipients_lists">Recipients Lists</h1> */}

                                        <Table striped bordered hover className="table_user_recipients">
                                            <thead>
                                                <tr>
                                                    <th>Sr.No </th>
                                                    {/* <th>User</th> */}
                                                    <th>Name</th>
                                                    <th>Destination</th>
                                                    <th>Detail Link</th>
                                                    <th>Transfer Now Link</th>
                                                    <th>Transfer Progress</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    data.data?.map((res, index) => {
                                                        return (

                                                            <tr key={res.id}>

                                                                <td>{index + 1}</td>
                                                                {/* <td>{res.user}</td> */}
                                                                <td>{res.name}</td>
                                                                <td>{res.destination}</td>
                                                                <td>{res.detail_link}</td>
                                                                <td>{res.transfer_now_link}</td>
                                                                <td>
                                                                    <Accordion>
                                                                        <Accordion.Item eventKey="0">
                                                                            <Accordion.Header>Completed</Accordion.Header>
                                                                            <Accordion.Body>

                                                                                <MultiStepProgressBar />


                                                                            </Accordion.Body>
                                                                        </Accordion.Item>
                                                                    </Accordion>

                                                                </td>
                                                            </tr>


                                                        )
                                                    })}

                                            </tbody>
                                        </Table>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </section>

                ) : (
                    <>

                    </>
                )
            }



            {/* <!-- ======= Recept RemitAssure-Section End ======= --> */}

        </>
    )
}



export default Recipients;