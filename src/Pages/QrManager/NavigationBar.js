import React from 'react';

const NavigationBar = ({ sections, selectedSection, onSectionClick }) => {
  return (
    <nav className="navigation-bar flex space-x-4 p-4 bg-gray-200">
      {sections.map((section) => (
        <button
          key={section.path} // Use path as key
          className={`p-2 ${selectedSection === section.path ? 'bg-blue-500 text-white' : 'bg-white'}`}
          onClick={() => onSectionClick(section.path)} // Use path
        >
          {section.label}
        </button>
      ))}
    </nav>
  );
};

export default NavigationBar;
