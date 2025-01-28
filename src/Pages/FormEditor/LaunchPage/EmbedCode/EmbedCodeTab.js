// src/Pages/FormEditor/LaunchPage/EmbedCodeTab.jsx

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './css/embedCode.css';

const EmbedCodeTab = ({ embedCode }) => {
  return (
    <div className="embed-section">
      <p>
        Kopieer en plak de onderstaande code om de reserveringspagina op
        uw website in te sluiten:
      </p>
      <div className="code-container">
        <SyntaxHighlighter language="html" style={atomDark}>
          {embedCode}
        </SyntaxHighlighter>
        <button
          className="copy-button"
          onClick={() => {
            navigator.clipboard.writeText(embedCode);
            alert('Code gekopieerd naar klembord!');
          }}
        >
          Kopiëren
        </button>
      </div>
    </div>
  );
};

export default EmbedCodeTab;
