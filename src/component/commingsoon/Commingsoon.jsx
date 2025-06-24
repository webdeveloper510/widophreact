import React from "react";
import {links, NavLink, useNavigate} from 'react-router-dom';


const Commingsoon = () =>{
    return(
        <>
         <div className='container'>
            <div className='notfound-section'>
            <img src="assets/img/home/coming.webp" alt="404error" />

            
            <NavLink to="/">Go to Homepage</NavLink>
            </div>
            </div>
        
        </>
    )
}


export default Commingsoon;