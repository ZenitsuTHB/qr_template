// src/Pages/Personeel/PersoneelItem.js
import React, { useState } from 'react';
import './css/personeel.css';
import { FaEllipsisV, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import ConfirmationModal from '../../Components/Structural/Modal/Delete';
import EditPersoneelModal from './EditPersoneelModal';

const PersoneelItem = ({ personeel, api, triggerNotification, refreshPersoneel }) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const handleEllipsisClick = () => {
    setIsTooltipOpen(!isTooltipOpen);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalVisible(true);
    setIsTooltipOpen(false);
  };

  const handleEditClick = () => {
    setIsEditModalVisible(true);
    setIsTooltipOpen(false);
  };

  const handleConfirmDelete = async () => {
    setIsDeleteModalVisible(false);
    try {
      await api.delete(`${window.baseDomain}api/personeel/${personeel._id}`);
      triggerNotification('Personeel succesvol verwijderd', 'success');
      refreshPersoneel();
    } catch (error) {
      console.error('Error deleting personeel:', error);
      triggerNotification('Fout bij het verwijderen van het personeel', 'error');
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  return (
    <div className="personeel-component__personeel-item">
      <div className="personeel-component__personeel-content">
        <h4>{personeel.voornaam} {personeel.achternaam}</h4>
        <p>
          Werkend van {personeel.startDate} tot {personeel.endDate}
        </p>
      </div>
      <div className="personeel-component__personeel-actions">
        <FaEllipsisV onClick={handleEllipsisClick} className="personeel-component__ellipsis-icon" />
        {isTooltipOpen && (
          <div className="tooltip-container">
            <div className="tooltip-item" onClick={handleEditClick}>
              <FaPencilAlt className="tooltip-icon" />
              Bewerken
            </div>
            <div className="tooltip-separator"></div>
            <div className="tooltip-item delete-item" onClick={handleDeleteClick}>
              <FaTrashAlt className="tooltip-icon" />
              Verwijderen
            </div>
          </div>
        )}
      </div>
      {isDeleteModalVisible && (
        <ConfirmationModal
          isVisible={isDeleteModalVisible}
          title="Personeel Verwijderen"
          message="Weet u zeker dat u dit personeel wilt verwijderen?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          confirmText="Verwijderen"
          cancelText="Annuleren"
          confirmButtonClass="discard-button red"
          cancelButtonClass="cancel-button"
        />
      )}
      {isEditModalVisible && (
        <EditPersoneelModal
          isVisible={isEditModalVisible}
          personeel={personeel}
          api={api}
          triggerNotification={triggerNotification}
          refreshPersoneel={refreshPersoneel}
          onClose={() => setIsEditModalVisible(false)}
        />
      )}
    </div>
  );
};

export default PersoneelItem;
