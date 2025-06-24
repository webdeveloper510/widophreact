import React from 'react';

const Maintenance = () => {
    return (
        <>
            <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,700" rel="stylesheet" />
            <style>
                {`
                html, body { padding: 0; margin: 0; width: 100%; height: 100%; }
                * { box-sizing: border-box; }
                body {
                    text-align: center;
                    padding: 0;
                    background: #f5f5f5;
                    color: #000;
                    font-family: 'Open Sans', sans-serif;
                    font-weight: 100;
                    font-size: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                h1 { font-size: 50px; font-weight: 100; }
                article { width: 700px; padding: 50px; margin: 0 auto; }
                a { color: #000; font-weight: bold; text-decoration: none; }
                a:hover { text-decoration: underline; }
                svg { width: 75px; margin-top: 1em; }
                `}
            </style>

            <article>
                <div className="logo">
                    <img src="https://qa.remitassure.com/static/media/logo.7a0f6f59bcae1ffac3df.webp" alt="help" />
                </div>
                <h1>We'll be back soon!</h1>
                <div>
                    <p>Sorry for the inconvenience. We're performing some maintenance at the moment. If you need any help, kindly contact us on our <a href="mailto:crm@remitassure.com">support email</a> for updates; otherwise, we'll be back up shortly!</p>
                    <p>&mdash; The <a href="https://remitassure.com/">Remitassure</a> Team</p>
                </div>
            </article>
        </>
    );
};

export default Maintenance;
