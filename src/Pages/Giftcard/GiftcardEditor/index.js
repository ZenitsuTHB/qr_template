import React, { useEffect } from 'react';
import { withHeader } from '../../../Components/Structural/Header';

const GiftcardEditor = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://editor.unlayer.com/embed.js';
    script.async = true;

    document.body.appendChild(script);

    script.onload = () => {
      if (window.unlayer) {
        window.unlayer.init({
          id: 'editor',
          projectId: 255501,
          templateId: 565564,
          locale: 'nl-NL', // Set the desired locale here
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      id="editor"
      style={{
        height: '90vh',
        width: '100%',
      }}
    ></div>
  );
};

export default withHeader(GiftcardEditor);
