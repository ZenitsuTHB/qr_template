import React from 'react';
import MainApp from './Components/MainApp';
import Login from './Pages/Login';
import OTPLogin from './Pages/Login/OTPLogin';
import WelcomeAnimation from './Components/Animations/index.js';
import './Styles/all-styles.js';

const App = () => {
  const loginDone = localStorage.getItem('loginSuccessful') === 'true';
  const animationShown = localStorage.getItem('welcomeScreenShown') === 'true';
  const shouldShowAnimation = !animationShown && !window.isIframe;

  const urlParams = new URLSearchParams(window.location.search);
  const otp = urlParams.get('otp');

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
