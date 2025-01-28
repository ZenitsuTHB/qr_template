// src/Pages/Uitzonderingen/ExceptionItem.js

import React, { useState } from 'react';
import './css/exceptions.css';
import { FaTrashAlt } from 'react-icons/fa';
import ConfirmationModal from '../../Components/Structural/Modal/Delete';

const ExceptionItem = ({ exception, api, triggerNotification, refreshExceptions }) => {
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleteModalVisible(false);
    try {
      await api.delete(`${window.baseDomain}api/exceptions/${exception._id}`);
      triggerNotification('Uitzondering succesvol verwijderd', 'success');
      refreshExceptions();
    } catch (error) {
      console.error('Error deleting exception:', error);
      triggerNotification('Fout bij het verwijderen van de uitzondering', 'error');
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  // Determine the color class based on the type
  const typeColorClass = () => {
    switch (exception.type) {
      case 'Opening':
        return 'tag-green';
      case 'Uitzondering':
        return 'tag-blue';
      case 'Sluiting':
      case 'Sluitingsdag':
        return 'tag-orange';
      default:
        return '';
    }
  };

  return (
    <div className="exceptions-page__exception-item">
      <div className="exceptions-page__exception-content">
        <h4>
          {exception.title}{' '}
          <span className={`exceptions-page__tag ${typeColorClass()}`}>{exception.type}</span>
        </h4>
        {exception.timeframe && <p>Toepassing: {exception.timeframe}</p>}
        <p>
          Geldig van {exception.startDate} tot {exception.endDate}
        </p>
        {exception.startHour && exception.endHour && (
          <p>
            Van {exception.startHour} tot {exception.endHour}
          </p>
        )}
        {exception.maxSeats && <p>Max. Zitplaatsen: {exception.maxSeats}</p>}
        {exception.daysOfWeek && exception.daysOfWeek.length > 0 && (
          <p>Dagen: {exception.daysOfWeek.join(', ')}</p>
        )}
      </div>
      <div className="exceptions-page__exception-actions">
        <FaTrashAlt onClick={handleDeleteClick} className="exceptions-page__delete-icon" />
      </div>
      {isDeleteModalVisible && (
        <ConfirmationModal
          isVisible={isDeleteModalVisible}
          title="Uitzondering Verwijderen"
          message="Weet u zeker dat u deze uitzondering wilt verwijderen?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          confirmText="Verwijderen"
          cancelText="Annuleren"
          confirmButtonClass="discard-button red"
          cancelButtonClass="cancel-button"
        />
      )}
    </div>
  );
};

export default ExceptionItem;
