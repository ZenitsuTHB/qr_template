import React from 'react';

const QRContent = ({ selectedSection }) => {
  return (
    <div className="qr-content p-6">
      {selectedSection === '/qr_manager' && <p>Welcome to the QR Manager Overview</p>}
      {selectedSection === '/qr_manager/generate' && <p>Generate your QR Codes here</p>}
      {selectedSection === '/qr_manager/scan' && <p>Scan QR Codes using your camera</p>}
      {selectedSection === '/qr_manager/history' && <p>View past QR Codes</p>}
    </div>
  );
};

export default QRContent;