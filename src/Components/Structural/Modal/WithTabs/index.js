// src/components/ModalWithTabs/index.js

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoCloseOutline } from 'react-icons/io5';
import './css/tabs.css'

const ModalWithTabs = ({ tabs, onClose }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
	<div className="modal-tab-component">
		<motion.div
		className="modal-overlay"
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
		layout
		onClick={onClose}
		>
		<motion.div
			className="modal-content"
			initial={{ scale: 0.8, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			exit={{ scale: 0.8, opacity: 0 }}
			transition={{ duration: 0.3 }}
			onClick={(e) => e.stopPropagation()}
		>
			<button className="close-button" onClick={onClose}>
			<IoCloseOutline />
			</button>

			<div className="tabs-container">
			<div className="tab-menu">
				<div className="buttons-container">
				{tabs.map((tab) => (
					<motion.button
					key={tab.id}
					type="button"
					className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
					onClick={() => handleTabClick(tab.id)}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					layout
					>
					<span className="tab-label">{tab.label}</span>
					{activeTab === tab.id && (
						<motion.div
						className="tab-underline"
						layout
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						/>
					)}
					</motion.button>
				))}
				</div>
			</div>

			<motion.div className="tab-content">
				{tabs.map(
				(tab) =>
					activeTab === tab.id && (
					<div key={tab.id} className="tab-pane">
						{tab.content}
					</div>
					)
				)}
			</motion.div>
			</div>
		</motion.div>
		</motion.div>
	</div>
  );
};

export default ModalWithTabs;
