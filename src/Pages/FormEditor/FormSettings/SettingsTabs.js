// src/components/FormSettings/SettingsTabs.jsx

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Settings from './Settings/index.js';
import Colors from './Colors/index.js';
import Fonts from './Fonts/index.js'; 
import './css/settingsTabs.css';
import './css/formSettings.css';
import './css/mobile.css';

const SettingsTabs = () => {
  const [activeTab, setActiveTab] = useState('formSettings');
  const [activeTitle, setActiveTitle] = useState("Algemene Instellingen");
  const [pendingTab, setPendingTab] = useState(null);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);

  const settingsRef = useRef();
  const colorsRef = useRef();
  const fontsRef = useRef();

  const isIframe = typeof window !== 'undefined' && window.isIframe;

  const tabs = [
    { id: 'formSettings', label: 'Algemeen', title: "Algemene Instellingen" },
    { id: 'appearanceSettings', label: 'Kleuren', title: "Kleuren Instellingen" },
    { id: 'fontsSettings', label: 'Lettertypen', title: "Lettertype Instellingen" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleTabClick = async (tabId, tabTitle) => {
    let currentRef;
    if (activeTab === 'formSettings') {
      currentRef = settingsRef;
    } else if (activeTab === 'appearanceSettings') {
      currentRef = colorsRef;
    } else if (activeTab === 'fontsSettings') {
      currentRef = fontsRef;
    }

    if (currentRef && currentRef.current && currentRef.current.isDirty) {
      if (isIframe) {
        try {
          await currentRef.current.handleSave();
          setActiveTab(tabId);
          setActiveTitle(tabTitle);
        } catch (error) {
          console.error('Error saving before tab switch:', error);
        }
      } else {
        setPendingTab({ id: tabId, title: tabTitle });
        setShowUnsavedChangesModal(true);
      }
    } else {
      setActiveTab(tabId);
      setActiveTitle(tabTitle);
    }
  };

  const handleDiscardChanges = () => {
    setShowUnsavedChangesModal(false);
    if (pendingTab) {
      setActiveTab(pendingTab.id);
      setActiveTitle(pendingTab.title);
      setPendingTab(null);
    }
  };

  const handleCancelTabChange = () => {
    setShowUnsavedChangesModal(false);
    setPendingTab(null);
  };

  return (
    <div className="form-settings-page">
      <form className="form-settings-form central-container-style " onSubmit={handleSubmit}>
        <h2 className="secondary-title">{activeTitle}</h2>

        <div className="settings-tabs">
          <div className="tab-menu">
            <div className="buttons-container">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  type="button"
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => handleTabClick(tab.id, tab.title)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="tab-label">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="underline-settings-tabs"
                      className="tab-underline"
                      initial={false}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="tab-content">
            {activeTab === 'formSettings' && <Settings ref={settingsRef} />}
            {activeTab === 'appearanceSettings' && <Colors ref={colorsRef} />}
            {activeTab === 'fontsSettings' && <Fonts ref={fontsRef} />}
          </div>
        </div>
      </form>

      {!isIframe && showUnsavedChangesModal && (
        <div className="modal unsaved-changes-modal">
          <div className="modal-content">
            <h2 className='secondary-title'>Wijzigingen Niet Opgeslagen</h2>
            <p>Wilt doorgaan zonder op te slaan?</p>
            <div className="modal-buttons">
              <button type="button" className="button cancel-button cancel" onClick={handleCancelTabChange}>Annuleren</button>
              <button type="button" className="button discard-button red" onClick={handleDiscardChanges}>Doorgaan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsTabs;
