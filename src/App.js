import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainApp from './Components/MainApp';
import Login from './Pages/Login';
import OTPLogin from './Pages/Login/OTPLogin';
import WelcomeAnimation from './Components/Animations/index.js';
import QRManager from './Pages/qr_manager';
import Sidebar from './Components/Structural/Sidebar';
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
    return (
      // Wrap the entire app in a single Router
      <Router>
        <div className="app-container flex">
          <Sidebar />
          <div className="content-container flex-grow">
            <Routes>
              <Route path="/" element={<MainApp />} />
              <Route path="/qr_manager" element={<QRManager />} />
              {/* Add other routes here */}
            </Routes>
          </div>
        </div>
      </Router>
    );
  }
};

export default App;
