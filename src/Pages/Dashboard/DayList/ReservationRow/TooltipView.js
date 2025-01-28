// src/Components/ReservationsList/Tooltip.jsx

import React, { useEffect, useRef, useState } from 'react';
import {
  FaEllipsisV,
  FaPencilAlt,
  FaTrashAlt,
  FaStickyNote,
  FaBirthdayCake,
} from 'react-icons/fa';
import './css/tooltip.css';
import ConfirmationModal from '../../../../Components/Structural/Modal/Delete';
import useApi from '../../../../Hooks/useApi';

const Tooltip = ({
  reservationId,
  extraInfo,
  isTooltipOpen,
  onTooltipToggle,
  onTooltipClose,
  onDeleteSuccess,
  triggerNotification,
}) => {
  const tooltipTimerRef = useRef(null);
  const tooltipRef = useRef(null);
  const [isIconHovered, setIsIconHovered] = useState(false);
  const [isParentHovered, setIsParentHovered] = useState(false);
  const [isEllipsisHovered, setIsEllipsisHovered] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const api = useApi();

  const handleEllipsisClick = () => {
    onTooltipToggle(reservationId);
  };

  const handleExtraIconMouseEnter = () => {
    setIsIconHovered(true);
  };

  const handleExtraIconMouseLeave = () => {
    setIsIconHovered(false);
  };

  useEffect(() => {
    if (isTooltipOpen) {
      if (tooltipTimerRef.current) {
        clearTimeout(tooltipTimerRef.current);
      }
      tooltipTimerRef.current = setTimeout(() => {
        onTooltipClose();
      }, 2500);
    } else {
      if (tooltipTimerRef.current) {
        clearTimeout(tooltipTimerRef.current);
        tooltipTimerRef.current = null;
      }
    }

    return () => {
      if (tooltipTimerRef.current) {
        clearTimeout(tooltipTimerRef.current);
      }
    };
  }, [isTooltipOpen, onTooltipClose]);

  useEffect(() => {
    const currentTooltip = tooltipRef.current;
    if (!currentTooltip) return;

    const parentElement = currentTooltip.parentElement;
    if (!parentElement) return;

    const handleParentMouseEnter = () => {
      setIsParentHovered(true);
    };

    const handleParentMouseLeave = () => {
      setIsParentHovered(false);
    };

    parentElement.addEventListener('mouseenter', handleParentMouseEnter);
    parentElement.addEventListener('mouseleave', handleParentMouseLeave);

    return () => {
      parentElement.removeEventListener('mouseenter', handleParentMouseEnter);
      parentElement.removeEventListener('mouseleave', handleParentMouseLeave);
    };
  }, []);

  const shouldShowExtraIcon = extraInfo && extraInfo.trim() !== '';

  const isExtraTooltipOpen =
    (isIconHovered || isParentHovered) &&
    !isTooltipOpen &&
    !isEllipsisHovered;

  const birthdayWords = [
    'birthday',
    'anniversary',
    'anniversaire',
    'geburtstag',
    'jahrestag',
    'jarig',
    'jarige',
    'verjaardag',
    'verjaardagsfeest',
    'jubileum',
    'cumpleaños',
    'aniversario',
  ];

  let iconToUse = FaStickyNote;

  if (shouldShowExtraIcon) {
    const extraInfoLower = extraInfo.toLowerCase();
    const containsBirthdayWord = birthdayWords.some((word) =>
      extraInfoLower.includes(word)
    );

    if (containsBirthdayWord) {
      iconToUse = FaBirthdayCake;
    }
  }

  const editUrl = `https://view.reservaties.net/?action=edit&reservationId=${encodeURIComponent(
    reservationId
  )}&admin=true` + "&restaurantId=" + localStorage.getItem('username');

  const handleDeleteClick = (e) => {
    e.preventDefault();
    setDeleteError(null);
    setIsDeleteModalVisible(true);
  };

  // Handler for confirming deletion
  const handleConfirmDelete = async () => {
    setIsDeleteModalVisible(false);
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await api.delete(`${window.baseDomain}api/auth-reservations/${reservationId}`);
      if (onDeleteSuccess) {
        onDeleteSuccess(reservationId); // Invoke the handler passed from ReservationRow
      }
      console.log(`Reservation ${reservationId} has been deleted.`);
    } catch (error) {
      console.error('Error deleting reservation:', error);
      setDeleteError(
        error.response?.data?.error || error.message || 'Failed to delete the reservation.'
      );
      if (triggerNotification) {
        triggerNotification('Fout bij het verwijderen van de reservatie.', 'error');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Handler for canceling deletion
  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  return (
    <div className="extra-column" ref={tooltipRef}>
      <div className="icons-container">
        {shouldShowExtraIcon && (
          <div
            className="extra-icon-container"
            onMouseEnter={handleExtraIconMouseEnter}
            onMouseLeave={handleExtraIconMouseLeave}
          >
            {React.createElement(iconToUse, { className: 'extra-icon' })}
            {isExtraTooltipOpen && (
              <div className="extra-tooltip">{extraInfo}</div>
            )}
          </div>
        )}
        <div
          className="ellipsis-container"
          onMouseEnter={() => setIsEllipsisHovered(true)}
          onMouseLeave={() => setIsEllipsisHovered(false)}
        >
          <FaEllipsisV className="ellipsis-icon" onClick={handleEllipsisClick} />
          {isTooltipOpen && (
            <div className="tooltip-container">
              <a
                href={editUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="tooltip-item no-style"
              >
                <FaPencilAlt className="tooltip-icon" />
                Bewerken
              </a>
              <div className="tooltip-separator"></div>
              <a
                href="#"
                onClick={handleDeleteClick}
                className="tooltip-item delete-item no-style"
              >
                <FaTrashAlt className="tooltip-icon" />
                Verwijderen
              </a>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isVisible={isDeleteModalVisible}
        title="Reservatie Verwijderen"
        message="Wilt u deze reservatie verwijderen?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Verwijderen"
        cancelText="Annuleren"
        confirmButtonClass="discard-button red"
        cancelButtonClass="cancel-button"
        isLoading={isDeleting}
        errorMessage={deleteError}
      />
    </div>
  );
};

export default Tooltip;
