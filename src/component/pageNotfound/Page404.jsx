import React from "react";
import {links, NavLink, useNavigate} from 'react-router-dom';
import notfound from '../../assets/img/userdashboard/error.webp';

const Page404 = () =>{
    return(
        <>
         <div className='container'>
            <div className='notfound-section'>
            <img src={notfound} alt="404error" />

            <h1>OOPS !</h1>
            <p>We can't seem to find the page you are looking for !</p>

            <NavLink to="/">Go to Homepage</NavLink>
            </div>
            </div>
        
        </>
    )
}


export default Page404;