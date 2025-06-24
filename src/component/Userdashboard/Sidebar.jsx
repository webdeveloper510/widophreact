import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from 'react-router-dom';
import { BsCurrencyExchange, BsChevronCompactDown, BsChevronCompactUp, BsFillWalletFill, BsFillPersonPlusFill, BsFilePersonFill } from "react-icons/bs";
import { BiTransfer } from "react-icons/bi";
import { RiLockPasswordLine } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";

const Sidebar = () => {


  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const handleSidebarToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleCloseSidebar = () => {
    setIsOpen(false);
  };

  const toggleVisibility = () => {
    setState((prevState) => ({
      isVisible: !prevState.isVisible,
    }));
  };

  const location = useLocation()

  const handleClick = () => {
    if (location.pathname === "/user-send-money") {
      window.location.reload()
    }
  }



  return (

    <>
      <div className={`Sidebar ${isOpen ? 'open' : ''}`} ref={sidebarRef}>
        <button className="btn view_mobile_sidebar toggle-button" onClick={handleSidebarToggle}><RxDashboard /> View Dashboard</button>

        <div className="sidebar">
          {isOpen && (
            <label className="close-sidebar btn-close" onClick={handleCloseSidebar}>

            </label>
          )}
          <nav>
            <ul>
              <li><NavLink to="/dashboard"><RxDashboard />Dashboard</NavLink></li>
              <li><NavLink onClick={() => { handleClick() }} to={`/user-send-money`}><BsCurrencyExchange />New Transfer</NavLink></li>
              <li><NavLink to="/user-profile"><BsFilePersonFill />Profile Information</NavLink></li>
              <li className="payment_a"><div className='payment' onClick={toggleVisibility}><div> <BsFillWalletFill />Payment Details </div>  {state.isVisible ? <BsChevronCompactUp /> : <BsChevronCompactDown />}</div>
                {state.isVisible &&
                  <ul className="ms-4">
                    <li><NavLink to="/payment-detail/pay-id-detail" className="py-1 fw-semibold"><img src="/assets/img/zai/payid.svg" height={55} width={55} /></NavLink></li>
                    <li><NavLink to="/payment-detail/agreement-detail" className="py-1 fw-semibold"><img src="/assets/img/zai/payto.svg" height={55} width={55} /></NavLink></li>
                  </ul>
                }
              </li>

              <li><NavLink to="/transactions"><BiTransfer />Transactions</NavLink></li>
              <li><NavLink to="/user-recipients"><BsFillPersonPlusFill />Recipients</NavLink></li>
              <li><NavLink to="/change-password"><RiLockPasswordLine />Password</NavLink></li>
            </ul>
          </nav>
        </div>
      </div>
      {isOpen && <div className="overlay" onClick={handleCloseSidebar} />}
    </>
  )
}



export default Sidebar;