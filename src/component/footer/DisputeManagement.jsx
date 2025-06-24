import React from "react";
import { Link } from "react-router-dom";




const DisputeManagementPolicy = () => {

    return (
        <div className="site-content">
            <section className="section-img">
                <div className="container">
                    <div className="row">
                        <div className="col-md-7 extra-large">
                            <div className=" headabout">
                                <h1 className="about-heading">Dispute Management Policy</h1>
                            </div>
                            <p className="our_vission01">At RemitAssure, we prioritize customer satisfaction and the swift resolution of disputes. Our goal is to maintain trust and transparency in all transactions. If you encounter a dispute, please let us know promptly.
                            </p>

                            <h3 className="sub-heading">
                                1. Initiating a Dispute
                            </h3>
                            <p className="our_vission01">
                            To address your concerns effectively, you can provide details and supporting documentation of your dispute through the channels listed in our Support Centre on the website <Link to={'/'} className="text-underline">https://remitassure.com</Link> or via our mobile app.
                            </p>
                            <h3 className="sub-heading">
                                2. Evaluation and Investigation
                            </h3>
                            <p className="our_vission01">
                            Upon receiving your dispute, RemitAssure will conduct a thorough investigation to identify the root cause of the issue. We aim to provide initial feedback within 24 hours. If more time is required, we will inform you. 
                            </p>
                            <h3 className="sub-heading">
                                3. Communication and Collaboration
                            </h3>
                            <p className="our_vission01">
                            Throughout the dispute management process, RemitAssure will keep you informed about progress and may request additional information if needed to resolve the issue.
                            </p>
                            <h3 className="sub-heading">
                                4. Resolution and Follow-Up
                            </h3>
                            <p className="our_vission01">
                            After completing the investigation, RemitAssure will promptly work towards resolving the dispute. This may involve issuing a refund, clarifying misunderstanding, or taking corrective actions. Follow-up checks will be conducted to ensure the resolution is successfully implemented.
                            </p>
                            <h3 className="sub-heading">
                                5. Arbitration
                            </h3>
                            <p className="our_vission01">
                            Any disputes or differences arising from these procedures will be submitted to arbitration per the Resolution Institute of Australia's Arbitration Rules. Unless otherwise agreed, either party can request a nomination from the Chair of the Resolution Institute. The arbitration will take place in Sydney.
                            </p>

                            <h3 className="sub-heading">
                                6. Governing Law
                            </h3>
                            <p className="our_vission01">
                            This User Agreement and any related disputes or claims will be governed by the laws of Australia, excluding its conflict of law principles. You agree to submit to the exclusive jurisdiction of the courts in Sydney, Australia.
                            </p>
                            <h3 className="sub-heading">
                                7. Contact Information
                            </h3>
                            <p className="our_vission01">
                                For questions or further guidance on this policy, please contact us through the following channels.
                            </p><p className="our_vission01">
                                <small>RemitAssure</small><br />
                                Level 3, South Tower, 339 Coronation Drive<br />
                                Milton, QLD 4064<br />
                                Tel: 1300 284 228<br />
                                Email: <a href="mailto:crm@remitassure.com">crm@remitassure.com</a> </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>

    )
}

export default DisputeManagementPolicy; 