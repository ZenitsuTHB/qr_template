import React, { useState } from 'react';
import './css/menu.css';
import { FaEllipsisV, FaPencilAlt, FaTrashAlt } from 'react-icons/fa'; // Import additional icons
import ConfirmationModal from '../../Components/Structural/Modal/Delete'; // Adjust the path if necessary
import EditMenuModal from './EditMenuModal';

const MenuItem = ({ menu, api, triggerNotification, refreshMenus }) => {
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
      await api.delete(`${window.baseDomain}api/menu/${menu._id}`);
      triggerNotification('Menu succesvol verwijderd', 'success');
      refreshMenus();
    } catch (error) {
      console.error('Error deleting menu:', error);
      triggerNotification('Fout bij het verwijderen van het menu', 'error');
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  return (
    <div className="menu-component__menu-item">
      <div className="menu-component__menu-content">
        <h4>{menu.name}</h4>
        <p>
          Geldig van {menu.startDate} tot {menu.endDate}
        </p>
        <p>
          Van {menu.startHour} tot {menu.endHour}
        </p>
        <p>Dagen: {menu.daysOfWeek.join(', ')}</p>
      </div>
      <div className="menu-component__menu-actions">
        <FaEllipsisV onClick={handleEllipsisClick} className="menu-component__ellipsis-icon" />
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
          title="Menu Verwijderen"
          message="Weet u zeker dat u dit menu wilt verwijderen?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          confirmText="Verwijderen"
          cancelText="Annuleren"
          confirmButtonClass="discard-button red"
          cancelButtonClass="cancel-button"
        />
      )}
      {isEditModalVisible && (
        <EditMenuModal
          isVisible={isEditModalVisible}
          menu={menu}
          api={api}
          triggerNotification={triggerNotification}
          refreshMenus={refreshMenus}
          onClose={() => setIsEditModalVisible(false)}
        />
      )}
    </div>
  );
};

export default MenuItem;
