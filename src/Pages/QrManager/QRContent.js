import React from 'react';

const QRContent = ({ selectedSection }) => {
  return (
    <div className="qr-content p-6">
      {selectedSection === 'Overview' && <p>Welcome to the QR Manager Overview</p>}
      {selectedSection === 'Generate' && <p>Generate your QR Codes here</p>}
      {selectedSection === 'Scan' && <p>Scan QR Codes using your camera</p>}
      {selectedSection === 'History' && <p>View past QR Codes</p>}
    </div>
  );
};

export default QRContent;
