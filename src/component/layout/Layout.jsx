import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router';
import Sidebar from '../Userdashboard/Sidebar';
import Header from '../header/Header';
import Footer from '../footer/Footer';

const Layout = ({ children }) => {

    const navigate = useNavigate()
    const path = useLocation().pathname

    useEffect(() => {
        let token = sessionStorage.getItem("token")
        let user = JSON.parse(sessionStorage.getItem("remi-user-dt"))
        if ((!token && !user) || (token && !user)) {
            navigate("/login")
        }
    }, [path])

    return (
        <div>
            <Header />
            <div className="margin-set">
                <div className="tabs-page">
                    <Sidebar />
                    <div className="content-body">
                        {children}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Layout