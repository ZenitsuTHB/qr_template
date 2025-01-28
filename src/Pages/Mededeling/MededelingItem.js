// src/Pages/Mededeling/MededelingItem.js

import React, { useState } from 'react';
import './css/mededeling.css';
import { FaEllipsisV, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import ConfirmationModal from '../../Components/Structural/Modal/Delete';
import EditMededelingModal from './EditMededelingModal';

const MededelingItem = ({ mededeling, api, triggerNotification, refreshMededelingen }) => {
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
      await api.delete(`${window.baseDomain}api/mededeling/${mededeling._id}`);
      triggerNotification('Mededeling succesvol verwijderd', 'success');
      refreshMededelingen();
    } catch (error) {
      console.error('Error deleting mededeling:', error);
      triggerNotification('Fout bij het verwijderen van de mededeling', 'error');
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  return (
    <div className="mededeling-component__mededeling-item">
      <div className="mededeling-component__mededeling-content">
        <h4>{mededeling.mededeling}</h4>
        <p>
          Geldig van {mededeling.startDate} tot {mededeling.endDate}
        </p>
        <p>
          Van {mededeling.startTime} tot {mededeling.endTime}
        </p>
        <p>Dagen: {mededeling.daysOfWeek.join(', ')}</p>
      </div>
      <div className="mededeling-component__mededeling-actions">
        <FaEllipsisV onClick={handleEllipsisClick} className="mededeling-component__ellipsis-icon" />
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
          title="Mededeling Verwijderen"
          message="Weet u zeker dat u deze mededeling wilt verwijderen?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          confirmText="Verwijderen"
          cancelText="Annuleren"
          confirmButtonClass="discard-button red"
          cancelButtonClass="cancel-button"
        />
      )}
      {isEditModalVisible && (
        <EditMededelingModal
          isVisible={isEditModalVisible}
          mededeling={mededeling}
          api={api}
          triggerNotification={triggerNotification}
          refreshMededelingen={refreshMededelingen}
          onClose={() => setIsEditModalVisible(false)}
        />
      )}
    </div>
  );
};

export default MededelingItem;
