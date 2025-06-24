import React, { Children } from 'react'
import Header from '../header/Header'
import Footer from '../footer/Footer';

const NonDashLayout = ({ children }) => {
    return (
        <div>
            <Header />
            {children}
            <Footer />
        </div>
    )
}

export default NonDashLayout