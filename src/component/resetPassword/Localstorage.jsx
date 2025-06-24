import React, { useState, useEffect } from "react";
import {Links, NavLink, useNavigate, useParams} from 'react-router-dom';


const LocalStorage = () => {

    const [token,setToken] = useState(0);
    const {id} = useParams();

    const navigate = useNavigate();


    useEffect(() => {
        sessionStorage.setItem('token_forgot',id)
       // history.push('/resetpasswordsss')
        navigate('/reset-passwords');     
    
      }, [token]);

    
    
    return(
        <>

        </>

    )
}



export default LocalStorage;