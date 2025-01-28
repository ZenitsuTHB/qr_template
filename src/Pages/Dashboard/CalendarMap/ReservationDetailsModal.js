// ReservationDetailsModal.js

import React, { useState, useEffect } from 'react';
import ModalWithoutTabs from '../../../Components/Structural/Modal/Standard'; // Adjust the import path as needed
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import './css/reservationDetailsModal.css';
import { format, parseISO } from 'date-fns'; // Import parseISO
import { nl } from 'date-fns/locale';
import ConfirmationModal from '../../../Components/Structural/Modal/Delete'; // Import ConfirmationModal
import useApi from '../../../Hooks/useApi'; // Import useApi

const ReservationDetailsModal = ({ reservationsData, onClose, triggerNotification }) => {
  const { date, reservations } = reservationsData;
  const parsedDate = parseISO(date); // Use parseISO to parse the date string
  const formattedDate = format(parsedDate, 'd MMMM yyyy', { locale: nl });

  // Local state to manage the list of reservations within the modal
  const [reservationsList, setReservationsList] = useState(reservations);

  useEffect(() => {
    setReservationsList(reservations);
  }, [reservations]);

  return (
    <ModalWithoutTabs
      onClose={onClose}
      content={
        <div className="reservation-modal-content">
          <h2>Reservaties - {formattedDate}</h2>
          <div className="reservation-table">
            {reservationsList.map((reservation) => (
              <ReservationRow
                key={reservation.id}
                reservation={reservation}
                triggerNotification={triggerNotification}
                onDelete={(deletedReservationId) => {
                  setReservationsList((prevReservations) =>
                    prevReservations.filter((res) => res.id !== deletedReservationId)
                  );
                }}
              />
            ))}
          </div>
        </div>
      }
    />
  );
};

const ReservationRow = ({ reservation, triggerNotification, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const api = useApi();

  // Handler for opening the delete confirmation modal
  const handleDeleteClick = () => {
    setDeleteError(null);
    setIsDeleteModalVisible(true);
  };

  // Handler for confirming deletion
  const handleConfirmDelete = async () => {
    setIsDeleteModalVisible(false);
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await api.delete(`${window.baseDomain}api/auth-reservations/${reservation.id}`);
      if (onDelete) {
        onDelete(reservation.id); // Remove the reservation from the list
      }
      console.log(`Reservation ${reservation.id} has been deleted.`);


      triggerNotification('Reservatie verwijderd', 'success');

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error deleting reservation:', error);
      setDeleteError(
        error.response?.data?.error || error.message || 'Failed to delete the reservation.'
      );
      triggerNotification('Fout bij het verwijderen van de reservatie.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handler for canceling deletion
  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  // Handler for editing reservation
  const handleEditClick = () => {
    const editUrl = `https://view.reservaties.net/?action=edit&reservationId=${encodeURIComponent(
      reservation.id
    )}&admin=true` + "&restaurantId=" + localStorage.getItem('username');
    window.open(editUrl, '_blank');
  };

  return (
    <div className="reservation-row">
      <div className="reservation-main-info" onClick={() => setIsExpanded(!isExpanded)}>
        <FaChevronDown className={`arrow-icon ${isExpanded ? 'expanded' : ''}`} />
        <span>
          <strong>
            {reservation.aantalGasten} gasten - {reservation.time}
          </strong>{' '}
          - {reservation.fullName}
        </span>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="reservation-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>Email: {reservation.email}</div>
            <div>Telefoon: {reservation.phone}</div>
            {reservation.menu && <div>Menu: {reservation.menu}</div>}
            {reservation.extra && <div>Extra: {reservation.extra}</div>}
            <div className="reservation-buttons">
              <button className="standard-button red" onClick={handleDeleteClick}>
                Verwijderen
              </button>
              <button className="standard-button blue" onClick={handleEditClick}>
                Bewerken
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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

export default ReservationDetailsModal;
