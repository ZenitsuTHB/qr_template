// ReservationRow.js

import React, { useEffect, useState } from 'react';
import ReservationNumber from './ReservationNumber.js';
import NameColumn from './NameColumn.js';
import Tooltip from './TooltipView.js'; // Import Tooltip component
import ConfirmationModal from '../../../../Components/Structural/Modal/Delete';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import './css/reservationRow.css';
import './css/mobile.css';
import useApi from '../../../../Hooks/useApi';

const FIELD_CONFIG = [
  { key: 'aantalGasten', label: '#', alwaysVisible: true },
  { key: 'tijdstip', label: 'Uur', alwaysVisible: true },
  { key: 'fullName', label: 'Naam', defaultVisible: true },
  { key: 'email', label: 'Email', defaultVisible: true },
  { key: 'phone', label: 'Telefoon', defaultVisible: true },
  { key: 'menu', label: 'Menu', defaultVisible: false },
  // Removed 'extra' and 'actions' fields
];

const ReservationRow = ({
  reservation,
  visibleFields,
  isMobile,
  isTooltipOpen,
  onTooltipToggle,
  onTooltipClose,
  triggerNotification,
}) => {
  const seenKey = `seen-data-${reservation.id}`;
  const expiryTimeString = localStorage.getItem(seenKey);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [isVisible, setIsVisible] = useState(true); // New state for visibility

  const api = useApi();

  function getCurrentTimeInCEST() {
    const now = new Date();
    const nowInCESTString = now.toLocaleString('en-US', {
      timeZone: 'Europe/Berlin',
    });
    return new Date(nowInCESTString);
  }

  let isNewReservationHere = false;

  if (expiryTimeString) {
    const expiryTime = new Date(expiryTimeString);
    const nowInCEST = getCurrentTimeInCEST();
    isNewReservationHere = nowInCEST < expiryTime;
  } else {
    isNewReservationHere = true;
  }

  useEffect(() => {
    if (!expiryTimeString) {
      const nowInCEST = getCurrentTimeInCEST();
      const expiryTime = new Date(nowInCEST.getTime() + 60 * 60 * 1000); // 60 minutes from now
      localStorage.setItem(seenKey, expiryTime.toISOString());
    }
  }, [expiryTimeString, seenKey]);

  // Internal handler for deletion success
  const handleDeleteSuccess = (deletedReservationId) => {
    if (deletedReservationId === reservation.id) {
      setIsVisible(false); // Hide the row
      // Trigger a success notification
      triggerNotification('Reservatie verwijderd', 'success');
    }
    // If you need to notify a parent component, you can add that logic here
  };

  if (!isVisible) {
    return null; // Do not render the row if it's not visible
  }

  const renderField = (reservation, fieldKey) => {
    switch (fieldKey) {
      case 'aantalGasten':
        return <ReservationNumber aantalGasten={reservation.aantalGasten} />;
      case 'tijdstip':
        return reservation.tijdstip;
      case 'fullName':
        return (
          <NameColumn
            isNewReservationHere={isNewReservationHere}
            firstName={reservation.firstName}
            lastName={reservation.lastName}
          />
        );
      case 'email':
        return reservation.email;
      case 'phone':
        return reservation.phone;
      case 'language':
        return reservation.language;
      case 'menu':
        return reservation.menu;
      case 'createdAt':
        return new Date(reservation.createdAt).toLocaleString();
      default:
        return reservation[fieldKey];
    }
  };

  return (
    <>
      {isMobile ? (
        <div className="reservation-row-mobile">
          {visibleFields.map((fieldKey) => (
            <div key={fieldKey} className="reservation-item">
              <div className="label">{FIELD_CONFIG.find((field) => field.key === fieldKey).label}</div>
              <div>{renderField(reservation, fieldKey)}</div>
            </div>
          ))}
          {/* Always render the Tooltip in mobile view */}
          <div className="reservation-item">
            <div className="label">Extra Informatie</div>
            <div>{reservation.extra || 'Geen extra info'}</div>
          </div>
          <div className="reservation-item buttons-container">
            <button className="edit-button" onClick={() => window.open(`https://view.reservaties.net/?action=edit&reservationId=${encodeURIComponent(reservation.id)}&admin=true` + "&restaurantId=" + localStorage.getItem('username'), '_blank')}>
              <FaPencilAlt className="button-icon" />
              Bewerk
            </button>
            <button className="delete-button" onClick={() => setIsDeleteModalVisible(true)}>
              <FaTrashAlt className="button-icon" />
              Verwijderen
            </button>
          </div>

          <ConfirmationModal
            isVisible={isDeleteModalVisible}
            title="Reservatie Verwijderen"
            message="Wilt u deze reservatie verwijderen?"
            onConfirm={async () => {
              setIsDeleteModalVisible(false);
              setIsDeleting(true);
              setDeleteError(null);

              try {
                await api.delete(`${window.baseDomain}api/auth-reservations/${reservation.id}`);
                handleDeleteSuccess(reservation.id);
              } catch (error) {
                console.error('Error deleting reservation:', error);
                setDeleteError(
                  error.response?.data?.error || error.message || 'Failed to delete the reservation.'
                );
                triggerNotification('Fout bij het verwijderen van de reservatie.', 'error');
              } finally {
                setIsDeleting(false);
              }
            }}
            onCancel={() => setIsDeleteModalVisible(false)}
            confirmText="Verwijderen"
            cancelText="Annuleren"
            confirmButtonClass="discard-button red"
            cancelButtonClass="cancel-button"
            isLoading={isDeleting}
            errorMessage={deleteError}
          />
        </div>
      ) : (
        <div className="reservation-row reservation-row-desktop">
          {visibleFields.map((fieldKey) => (
            <div key={fieldKey}>{renderField(reservation, fieldKey)}</div>
          ))}

          <Tooltip
            reservationId={reservation.id}
            extraInfo={reservation.extra}
            isTooltipOpen={isTooltipOpen}
            onTooltipToggle={onTooltipToggle}
            onTooltipClose={onTooltipClose}
            onDeleteSuccess={handleDeleteSuccess}
            triggerNotification={triggerNotification}
          />
        </div>
      )}
    </>
  );
};

export default ReservationRow;
