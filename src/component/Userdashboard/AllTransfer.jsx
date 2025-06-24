import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import nodata from '../../assets/img/userdashboard/nodata.avif';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { commaSeperator } from "../../utils/hook";


const serverUrl = process.env.REACT_APP_API_URL
const AllTranfer = ({ status, data }) => {

  const [transactionData, setTransactionData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {

    if (data?.length != 0) {
      if (status === "pending") {
        let pending = data.filter((item) => {
          return item?.payment_status?.toLowerCase()?.includes("pending")
        })
        setTransactionData(pending)

      } else if (status === "completed") {
        let completed = data.filter((item) => {
          return item.payment_status?.toLowerCase() === "completed" || item.payment_status?.toLowerCase() === "processed"
        })
        setTransactionData(completed)
      } else if (status === "cancelled") {
        let completed = data.filter((item) => {
          return item?.payment_status?.toLowerCase() === "cancelled"
        })
        setTransactionData(completed)
      } else if (status === "Incomplete") {
        let incomplete = data.filter((item) => {
          return item.payment_status?.toLowerCase() === "incomplete"
        })
        setTransactionData(incomplete)
      } else {
        setTransactionData(data)
      }
    }
  }, [data])

  const modified_date = (date) => {
    let d = date.split("-")
    return d[2] + "-" + d[1] + "-" + d[0]
  }

  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="tabs-recipent-new">
            <span>
              {transactionData?.length > 0 ? (
                <div className="table-responsive">
                  <Table className="table table-responsive-md card-table previous-transaction">
                    <thead>
                      <tr>
                        <th>Transaction ID</th>
                        <th>Recipient</th>
                        <th>Amount Paid</th>
                        <th>Date</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>{status && status === "Incomplete" ? "Action" : "Receipt"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        transactionData?.map((res, index) => {
                          return (
                            <tr key={index}  >
                              <td style={{ cursor: "pointer" , textDecoration:"underline" }} onClick={() => navigate(`/transaction-detail/${res?.transaction_id}`)}>{res?.transaction_id}</td>
                              <td>
                                <h6 className="fs-16 font-w600 mb-0">{res?.recipient_name ? res?.recipient_name : "N/A"}</h6>
                              </td>
                              <td className="transaction-icon"><span className="text-uppercase">{res?.send_currency} </span> {commaSeperator(res?.amount)} </td>
                              <td>{modified_date(res?.date)}</td>
                              <td>{res?.reason}</td>

                              <td>{
                                res?.payment_status === "cancelled" || res?.payment_status === "Cancelled" ? (
                                  <span className="btn btn-outline-danger btn-rounded custom_status" onClick={() => navigate(`/transaction-detail/${res?.transaction_id}`)} >{res?.payment_status}</span>

                                ) : (
                                  <span className="btn btn-outline-success btn-rounded custom_status" onClick={() => navigate(`/transaction-detail/${res?.transaction_id}`)} >{res?.payment_status}</span>

                                )
                              }
                              </td>
                              <td>
                                {status === "Incomplete" ? (
                                  <Link to={"/user-send-money"} state={{ id: res?.id }}>
                                    <span className="btn btn-outline-success btn-rounded" >Continue</span>
                                  </Link>
                                ) : (
                                  <a href={`${serverUrl}/payment/receipt/${res?.id}`} target="_blank">
                                    <span className="btn btn-outline-success btn-rounded" >Download</span>
                                  </a>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <>
                  <div className="no-data">
                    <img src={nodata} alt="no transaction" height="400px" />
                    <div className="col-md-12">
                    </div>
                    <div className="col-md-12">
                      {
                        status === "completed" || "all" ? (
                          <NavLink to={`/user-send-money`} className="send_money">Send Money</NavLink>
                        ) : (
                          <></>
                        )
                      }
                    </div>
                  </div>
                </>
              )
              }
            </span>
          </div>
        </div >
      </div >
    </>
  )
}
export default AllTranfer;


