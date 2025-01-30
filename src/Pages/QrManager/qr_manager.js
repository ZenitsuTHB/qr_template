import React, { useState } from 'react';
import useWindowWidth from './Hooks/useWindowWidth'; // Adjust path as needed
import NavigationBar from './NavigationBar'; // If you have a navigation component
import QRContent from './QRContent'; // Component to display dynamic content
import { withHeader } from '../../Components/Structural/Header'; // If using a layout wrapper

const QRManager = () => {
  const windowWidth = useWindowWidth();
  const [selectedSection, setSelectedSection] = useState('Overview');

  const isMobile = windowWidth < 900;

  const sections = [
    { id: 'Overview', title: 'Overview', label: isMobile ? 'O' : 'Overview' },
    { id: 'Generate', title: 'Generate QR', label: isMobile ? 'G' : 'Generate' },
    { id: 'Scan', title: 'Scan QR', label: isMobile ? 'S' : 'Scan' },
    { id: 'History', title: 'History', label: isMobile ? 'H' : 'History' },
  ];

  return (
    <div className="qr-manager-page">
      {/* Navigation Bar */}
      <NavigationBar
        sections={sections}
        selectedSection={selectedSection}
        onSectionClick={setSelectedSection}
      />

      {/* Dynamic Content Based on Selection */}
      <QRContent selectedSection={selectedSection} />
    </div>
  );
};

export default withHeader(QRManager);
