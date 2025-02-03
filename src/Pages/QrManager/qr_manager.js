import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import { qrManagerSecondaryTopBar } from '../../Config/secondaryTabConfig.js';
import { withHeader } from '../../Components/Structural/Header/index.js';
import { useNavigate, useLocation } from 'react-router-dom';

const QRManager = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSectionClick = (path) => {
    navigate(`/qr_manager/${path}`);
  };

  return (
    <div className="qr-manager-page">
      {/* Navigation Bar */}
      <NavigationBar
        sections={qrManagerSecondaryTopBar}
        selectedSection={location.pathname.replace('/qr_manager/', '')}
        onSectionClick={handleSectionClick}
      />

      {/* Outlet renders child routes dynamically */}
      <div className="qr-content">
        <Outlet />
      </div>
    </div>
  );
};

export default withHeader(QRManager);
