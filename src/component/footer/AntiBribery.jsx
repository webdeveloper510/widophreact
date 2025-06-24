import React from "react";
import { Link } from "react-router-dom";




const AntiBribery = () => {

    return (
        <div className="site-content">
            <section className="section-img">
                <div className="container">
                    <div className="row">
                        <div className="col-md-7 extra-large">
                            <div className=" headabout">
                                <h1 className="about-heading">Anti-Bribery and Corruption Policy</h1>
                            </div>
                            <p className="our_vission01">RemitAssure is dedicated to conducting business in a fair, honest, and ethical manner. This Anti-Bribery and Corruption (ABC) Policy has been designed to ensure compliance with all relevant anti-bribery and corruption laws and regulations.
                            </p>

                            <h3 className="sub-heading">
                                1. Scope
                            </h3>
                            <p className="our_vission01">
                                This policy applies to all employees, contractors, agents, and third parties acting on behalf of RemitAssure, regardless of their location or role within the company.</p>
                            <h3 className="sub-heading">
                                2. Prohibited Conduct
                            </h3>
                            <p className="our_vission01">
                                RemitAssure strictly prohibits any form of bribery, corruption, or facilitation payments, whether directly or indirectly related to its business activities. This includes, but is not limited to:
                                <ul>
                                    <li>Offering, promising, giving, or accepting bribes, kickbacks, or other improper payments to or from any individual or entity.
                                    </li>
                                    <li>Providing or accepting gifts, hospitality, or entertainment that could influence business decisions.
                                    </li>
                                    <li>Engaging in activities that violate anti-bribery and corruption laws or regulations.</li>
                                    <li>Making facilitation payments to expedite routine government actions.
                                    </li>
                                </ul>
                            </p>
                            <h3 className="sub-heading">
                                3. Gifts, Entertainment, and Hospitality
                            </h3>
                            <p className="our_vission01">
                                Employees must avoid situations where the acceptance of gifts, entertainment or hospitality could appear to influence their decisions. Our <Link to={"/gifts-entertainment-and-hospitality-policy"}>gift, entertainment and hospitality (GEH) policy </Link>sets limits on the value of acceptable gifts and hospitality and requires reporting and approval for anything exceeding those limits.
                            </p>
                            <h3 className="sub-heading">
                                4. Third Parties Due Diligence
                            </h3>
                            <p className="our_vission01">
                                RemitAssure conducts thorough due diligence on third parties, including agents, suppliers, and business partners, to ensure they adhere to anti-bribery and corruption laws. Contracts with third parties must include ABC compliance clauses.
                            </p>
                            <h3 className="sub-heading">
                                5. Reporting Procedures
                            </h3>
                            <p className="our_vission01">
                                RemitAssure encourages employees to report any suspicions of bribery or corruption through a secure and confidential whistleblowing channel. The company ensures that whistleblowers are protected from retaliation.
                            </p>

                            <h3 className="sub-heading">
                                6. Continuous Training and Awareness
                            </h3>
                            <p className="our_vission01">
                                RemitAssure provides regular training to employees to ensure they understand the ABC policy, recognize red flags, and know how to report concerns. Training sessions are mandatory and refreshed periodically.
                            </p>
                            <h3 className="sub-heading">
                                7. Compliance Monitoring and Enforcement
                            </h3>
                            <p className="our_vission01">
                                RemitAssure continuously monitors compliance with the ABC policy through audits, risk assessments, and internal controls. Any breaches of the policy result in disciplinary action, which could include termination of employment or legal action.
                            </p>
                            <h3 className="sub-heading">
                                8. Record Keeping
                            </h3>
                            <p className="our_vission01">
                                Accurate records of all financial transactions, gifts, and hospitality are maintained.
                            </p>
                            <p className="our_vission01">
                                These records provide a transparent audit trail and evidence of compliance with the policy.
                            </p>
                            <h3 className="sub-heading">
                                9. Review and Continuous Improvement
                            </h3>
                            <p className="our_vission01">
                                This policy is subject to regular reviews and updates to adapt to new risks, legal requirements, and best practices. Feedback from employees and external audits influence this policy’s continuous improvement.
                            </p>

                            <h3 className="sub-heading">
                                10. Contact Information
                            </h3>
                            <p className="our_vission01">
                                For questions or further guidance on this policy, please contact us through the following channels.
                            </p><p className="our_vission01">
                                <small>RemitAssure</small><br />
                                Level 3, South Tower, 339 Coronation Drive<br />
                                Milton, QLD 4064<br />
                                Tel: 1300 284 228<br />
                                Email: <a href="mailto:compliance@remitassure.com">compliance@remitassure.com</a> </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>

    )
}

export default AntiBribery; 