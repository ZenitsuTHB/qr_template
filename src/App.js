import React from 'react';
import MainApp from './Components/MainApp';
import Login from './Pages/Login';
import WelcomeAnimation from './Components/Animations/index.js';
import './Styles/all-styles.js';
import OTPLogin from './Pages/Login/OTPLogin/index.js';

window.baseDomain = "https://squid-app-aychi.ondigitalocean.app/";

window.viewMode = 'full-screen';
window.isProduction = false;

const App = () => {
  const loginDone = localStorage.getItem('loginSuccessful') === 'true';
  const animationShown = localStorage.getItem('welcomeScreenShown') === 'true';
  const shouldShowAnimation = !animationShown && !window.isIframe;

  console.log('Current document cookies:', document.cookie);

  // Check if there's an OTP in the URL search params
  const urlParams = new URLSearchParams(window.location.search);
  const otp = urlParams.get('otp');

  // If there's an OTP, render the OTPLogin component
  if (otp) {
    return <OTPLogin otp={otp} />;
  }

  if (!loginDone) {
    return <Login />;
  } else if (shouldShowAnimation) {
    return <WelcomeAnimation />;
  } else {
    return <MainApp />;
  }
};

export default App;
