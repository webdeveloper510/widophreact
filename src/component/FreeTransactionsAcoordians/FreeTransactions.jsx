import React, { useEffect, useState } from "react";
import { RxLinkedinLogo } from "react-icons/rx";
import { generateRandomKey } from "../../utils/hook";
import { object } from "yup";
import Accordion from 'react-bootstrap/Accordion';
import { Link, NavLink, useNavigate } from "react-router-dom";
const FreeTransctions = () => {
    function AccordionArrayOfObjects() {
        const [activeIndex, setActiveIndex] = useState(0); // Set initial state to 0
    
        const handleAccordionToggle = (index) => {
          setActiveIndex(activeIndex === index ? null : index);
        }
        const dataarray = [
          {
            id: 1,
            title: <>Free Transfers</>,
            content: "RemitAssure offers the convenience of free account transfers, allowing you to send money globally without incurring additional fees. Enjoy a cost-effective and efficient way to move funds securely across borders with our user-friendly platform. The use of our platform is completely free. There are no transaction charges or hidden fees.",
          },
          // {
          //   id: 3,
          //   title: "No Hidden Fee",
          //   content: "Yes, the use of our platform is completely free. There are no transaction charges or hidden fees.",
          // },
         {
          id:2,
          title:"Competitive FX",
          content:"Our lean business model and alliance with global industry leaders enable us to offer you competitive exchange rates."
         },
         {
          id:3,
          title:"Peace of Mind",
          content:"We’ve built a platform enabled by industry leading anti-money laundering and fraud protection technologies so that your funds safeguarded and securely transferred to your beneficiaries."
         }
    
   
          
        
        ];
        const accordionItems = dataarray.map((value, index) => {
          return (
            <Accordion.Item eventKey={index} className={`my-3 free-accordian`}>
    
            <Accordion.Header onClick={() => handleAccordionToggle(index)}>   <div className="title-acc"> <h2>{value.title}</h2></div></Accordion.Header>
    
              <Accordion.Body>
              <p className="mar-t">{value.content}</p>
              </Accordion.Body>
              <div className="border-div"></div>
            </Accordion.Item>
          )
        })
        return (
          <Accordion activeKey={activeIndex}>
            {accordionItems}
          </Accordion>
        )
      }
    
  return (
    <> <div className="accrodion_contents-f">
    <AccordionArrayOfObjects />
  </div></>
  )
  }
  
  export default FreeTransctions;