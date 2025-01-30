import React from 'react';

const NavigationBar = ({ sections, selectedSection, onSectionClick }) => {
  return (
    <nav className="navigation-bar flex space-x-4 p-4 bg-gray-200">
      {sections.map((section) => (
        <button
          key={section.id}
          className={`p-2 ${selectedSection === section.id ? 'bg-blue-500 text-white' : 'bg-white'}`}
          onClick={() => onSectionClick(section.id)}
        >
          {section.label}
        </button>
      ))}
    </nav>
  );
};

export default NavigationBar;
