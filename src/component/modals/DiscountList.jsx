
import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap'
import { getCouponList } from '../../utils/Api';

export const DiscountList = ({ show, handler, handleSelected, selected, currency }) => {

  const [couponList, setCouponList] = useState([]);

  useEffect(() => {
    getCouponList(currency).then(res => {
      if (res?.code === "200" && res?.data && res?.data?.length > 0) {
        setCouponList(res.data)
      }
    })
  }, [currency])

  const applyCoupon = (coupon) => {
    handleSelected(coupon)
    handler()
  }

  return (
    <Modal show={show} centered onHide={() => handler()}>
      <Modal.Header closeButton>
        <div className='discount-header w-100'>
          <h4 >All Coupons</h4>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="discount-cupons">
          {
            couponList && couponList.length > 0 ? couponList.map((item) => {
              return (
                <div className='cupons-info'>
                  <div className='cuposn-name'>
                    <h2>{item?.name}</h2>
                    <p>{item?.description}</p>
                  </div>
                  <div>
                    <Button className='apply-button' onClick={() => { applyCoupon(item) }} disabled={selected?.id === item?.referral_meta_id}>{selected?.id === item?.referral_meta_id ? "Applied" : "Apply"}</Button>
                  </div>
                </div>
              )
            }) : "No Coupon Available !!"
          }
        </div>
      </Modal.Body>
    </Modal>
  )
}


export default DiscountList

