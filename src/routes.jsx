import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AuthProtect from './auth/AuthProtect';
import AuthDashProtect from './auth/AuthProtect';
import Home from './component/home/Home';
import Aboutus from './component/aboutus/Aboutus';
import Help from './component/help/Help';
import Signup from './component/signup/Signup';
import Login from './component/login/Login';
import ForgotPassword from './component/forgotpassword/ForgotPassword';
import RecentPassword from './component/resetPassword/ResetPassword';
import LocalStorage from './component/resetPassword/Localstorage';
import Verification from './component/verification/Verification';
import SendMoney from './component/send/SendMoney';
import Transfer from './component/Userdashboard/Transfer';
import AddNewRecipient from './component/Userdashboard/AddNewRecipient';
import UserProfile from './component/Userdashboard/UserProfile';
import ChangePassword from './component/Userdashboard/ChangePassword';
import UserRecipient from './component/Userdashboard/UserRecipient';
import Dashboard from './component/Userdashboard/Dashboard';
import Editrecipientuser from './component/Userdashboard/EditUserRecipient';
import Page404 from './component/pageNotfound/Page404';
import UserMoney from "./component/Userdashboard/UserMoney/UserMoney"
import EmailVerify from './component/verification/EmailVerify';
import Working from './component/footer/Working';
import News from './component/footer/News';
import Privacy from './component/footer/Privacy';
import T_c from './component/footer/T_c';
import Mobile from './component/footer/Mobile';
import AML from './component/footer/Aml';
import Referral from "./component/referral/Referral"
import TransactionDetails from './component/Userdashboard/TransactionDetails';
import PayIdDetail from './component/Userdashboard/paymentDetails/PayIdDetail';
import PayToDetail from './component/Userdashboard/paymentDetails/PayToDetail';
import Layout from './component/layout/Layout';
import NonDashLayout from './component/layout/NonDashLayout';
import Commingsoon from './component/commingsoon/Commingsoon';
import MultiStepForm from './component/kyc/Mainsteps';
import DiscountList from './component/modals/DiscountList'
import Contactus from './component/contactus/Contactus';
import Maintenance from './Maintenance';
import AntiBribery from './component/footer/AntiBribery';
import GehPolicy from './component/footer/GehPolicy';
import DisputeManagementPolicy from './component/footer/DisputeManagement';
import WhistleblowingPolicy from './component/footer/WhistleblowingPolicy';
import ViewBlog from './component/blogs/ViewBlog';
const RouteWithBodyClass = ({ element, bodyClass }) => {
  useEffect(() => {
    document.body.className = bodyClass;

    // Cleanup when the component is unmounted
    return () => {
      document.body.className = '';
    };
  }, [bodyClass]);

  return element;
};
const routes = [

  {
    path: '/',
    children: [
      // { path: '/', element: <Maintenance /> },
      //  { path: '/home', element: <NonDashLayout><Home /></NonDashLayout> },
      { path: '/', element: <NonDashLayout><Home /></NonDashLayout> },
      { path: 'contact-us', element: <NonDashLayout><RouteWithBodyClass element={<Contactus />} bodyClass="signup-page" /> </NonDashLayout> },
      { path: 'blogs/:slug', element: <NonDashLayout><RouteWithBodyClass element={<ViewBlog/>} bodyClass="signup-page" /> </NonDashLayout>},
      { path: 'test', element: <NonDashLayout><DiscountList /></NonDashLayout> },
      { path: 'complete-kyc', element: <NonDashLayout><RouteWithBodyClass element={<MultiStepForm />} bodyClass="kyc-page" /></NonDashLayout> },
      { path: 'about-us', element: <NonDashLayout><RouteWithBodyClass element={<Aboutus />} bodyClass="aboutus-page" /></NonDashLayout> },
      { path: 'working', element: <NonDashLayout><RouteWithBodyClass element={<Working />} bodyClass=" Working bg-image" /> </NonDashLayout> },
      { path: 'news', element: <NonDashLayout><News /> </NonDashLayout> },
      { path: 'privacy-policy', element: <NonDashLayout><RouteWithBodyClass element={<Privacy />} bodyClass="bg-image" /></NonDashLayout> },
      { path: 'terms-and-condition', element: <NonDashLayout> <RouteWithBodyClass element={<T_c />} bodyClass="bg-image" /> </NonDashLayout> },
      { path: 'apps', element: <NonDashLayout><Mobile /> </NonDashLayout> },
      { path: 'aml-policy', element: <NonDashLayout> <RouteWithBodyClass element={<AML />} bodyClass="bg-image" />  </NonDashLayout> },
      { path: 'anti-bribery-and-corruption-policy', element: <NonDashLayout> <RouteWithBodyClass element={<AntiBribery />} bodyClass="bg-image" />  </NonDashLayout> },
      { path: 'gifts-entertainment-and-hospitality-policy', element: <NonDashLayout> <RouteWithBodyClass element={<GehPolicy />} bodyClass="bg-image" />  </NonDashLayout> },
      { path: 'dispute-management-policy', element: <NonDashLayout> <RouteWithBodyClass element={<DisputeManagementPolicy />} bodyClass="bg-image" />  </NonDashLayout> },
      { path: 'whistle-blowing-policy', element: <NonDashLayout> <RouteWithBodyClass element={<WhistleblowingPolicy />} bodyClass="bg-image" />  </NonDashLayout> },
      { path: 'help', element: <NonDashLayout><RouteWithBodyClass element={<Help />} bodyClass="bg-image" /></NonDashLayout> },
      { path: 'sign-up', element: <NonDashLayout><RouteWithBodyClass element={<Signup />} bodyClass="signup-page" /> </NonDashLayout> },
      { path: 'login', element: <NonDashLayout><RouteWithBodyClass element={<Login />} bodyClass="signup-page" /> </NonDashLayout> },
      { path: 'forgot-password', element: <NonDashLayout><RouteWithBodyClass element={<ForgotPassword />} bodyClass="signup-page" /></NonDashLayout> },
      { path: 'reset-password', element: <NonDashLayout> <RouteWithBodyClass element={<RecentPassword />} bodyClass="" /></NonDashLayout> },
      { path: 'reset-password/:id', element: <NonDashLayout><LocalStorage /> </NonDashLayout> },
      { path: '/verification', element: <NonDashLayout> <RouteWithBodyClass element={<Verification />} bodyClass="footer-space bg-colored" /> </NonDashLayout> },
      { path: '404', element: <Page404 /> },
      { path: 'CommingSoon', element: <Commingsoon /> },
      { path: '*', element: <Navigate to="/404" /> },
    ]
  },
  {
    path: '/',
    guard: AuthProtect,
    children: [
      { path: '/referral', element: <NonDashLayout> <RouteWithBodyClass element={<Referral />} bodyClass="bg-image" /></NonDashLayout> },
      // { path: '/send-money', element: <NonDashLayout><RouteWithBodyClass element={<SendMoney />} bodyClass="footer-space" /></NonDashLayout> },
      { path: "/send-money", element: <Navigate to={"/user-send-money"} replace={true} /> }
    ]
  },
  {
    path: '/',
    guard: AuthDashProtect,
    children: [
      { path: '/transactions', element: <Layout>  <RouteWithBodyClass element={<Transfer />} bodyClass="footer-space bg-colored" /></Layout> },
      { path: '/transaction-detail/:id', element: <Layout><TransactionDetails /></Layout> },
      { path: '/user-send-money', element: <Layout><RouteWithBodyClass element={<UserMoney />} bodyClass="footer-space bg-colored" /> </Layout> },
      { path: '/add-new-recipient', element: <Layout> <RouteWithBodyClass element={<AddNewRecipient />} bodyClass="footer-space bg-colored" />  </Layout> },
      { path: '/user-profile', element: <Layout> <RouteWithBodyClass element={<UserProfile />} bodyClass="footer-space bg-colored" /> </Layout> },
      { path: '/user-recipients', element: <Layout>  <RouteWithBodyClass element={<UserRecipient />} bodyClass="footer-space bg-colored" />  </Layout> },
      { path: '/change-password', element: <Layout> <RouteWithBodyClass element={<ChangePassword />} bodyClass="footer-space bg-colored" /> </Layout> },
      { path: '/dashboard', element: <Layout><RouteWithBodyClass element={<Dashboard />} bodyClass="footer-space bg-colored" /></Layout> },
      { path: '/edit-recipient-user', element: <Layout><AddNewRecipient /></Layout> },
      { path: "/payment-detail/agreement-detail", element: <Layout>  <RouteWithBodyClass element={<PayToDetail />} bodyClass="footer-space bg-colored" /> </Layout> },
      { path: "/payment-detail/pay-id-detail", element: <Layout><PayIdDetail /></Layout> },
      { path: '404', element: <Page404 /> },
      { path: '*', element: <Navigate to="/404" /> },
    ]
  },
  {
    path: "/",
    children: [
      { path: "/remi-user-email-verification/:id", element: <EmailVerify /> }
    ]
  }
]

export default routes;