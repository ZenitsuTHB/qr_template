// src/components/ReservationSidebar.js

import React, { useEffect, useState } from 'react';
import ReservationStepOne from './StepOne';
import ReservationStepTwoFiltering from './ReservationStepTwo';
import ReservationSummary from './ReservationSummary';
import { FaTimes } from 'react-icons/fa';
import './css/reservationSidebar.css';
import useApi from '../../Hooks/useApi';
import moment from 'moment-timezone'; // Import moment-timezone for timezone handling
import FormField from './FormField';

const ReservationSidebar = ({
  isOpen,
  onClose,
  formData,
  errors,
  handleChange,
  handleFinalSubmit,
  setFormData,
  isSubmitting,
  reservationSubmitted,
  onNewReservation,
}) => {
  const api = useApi();
  const [timeblocks, setTimeblocks] = useState([]);
  const [loadingTimeblocks, setLoadingTimeblocks] = useState(false);
  const [timeblocksError, setTimeblocksError] = useState(null);
  const [menuData, setMenuData] = useState([]);
  const [restaurantData, setRestaurantData] = useState([]);
  
  // New states for personeel
  const [availablePersoneel, setAvailablePersoneel] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setLoadingTimeblocks(true);
      const fetchData = async () => {
        try {
          console.log("New Reservation GET");
          const data = await api.get(`${window.baseDomain}api/auth-restaurant/`, { noCache: true });
          setTimeblocks(data.timeblocks || []);
          window.timeblocks = data.timeblocks || [];
          const generalSettings = data['general-settings'] || {};
          window.generalSettings = generalSettings;
          setMenuData(data.menu || []);
          setRestaurantData(data);

          
          // Fetch personeel data
          const personeelData = await api.get(`${window.baseDomain}api/personeel`, { noCache: true });
          const currentDateCEST = moment().tz('Europe/Amsterdam').startOf('day'); // CEST timezone

          const filteredPersoneel = personeelData.filter((personeel) => {
            const startDate = moment(personeel.startDate, 'YYYY-MM-DD').tz('Europe/Amsterdam').startOf('day');
            const endDate = moment(personeel.endDate, 'YYYY-MM-DD').tz('Europe/Amsterdam').endOf('day');
            return currentDateCEST.isBetween(startDate, endDate, null, '[]'); // Inclusive
          });

          setAvailablePersoneel(filteredPersoneel);
        } catch (err) {
          setTimeblocksError(err);
          console.error('Error fetching data:', err);
        } finally {
          setLoadingTimeblocks(false);
        }
      };
      fetchData();
    }
  }, [isOpen, api]);

  return (
    <div className={`reservation-sidebar-component ${isOpen ? 'open' : ''}`}>
      <div className="reservation-sidebar-content">
        <h2 className='admin-title'>Admin Reservatie</h2>

        <button className="close-sidebar-button" onClick={onClose}>
          <FaTimes size={20} color="#000" />
        </button>
        {reservationSubmitted ? (
          <ReservationSummary
            formData={formData}
            onNewReservation={() => {
              setFormData({
                guests: '',
                date: '',
                time: '',
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                extraInfo: '',
                menu: '',
                personeel: '', // Reset personeel selection
              });
              onNewReservation();
            }}
          />
        ) : (
          <>
            {/* Personeel Selection Box */}
            {availablePersoneel.length > 0 && (
              <div className="sidebar-section-personeel">
                <FormField
                  label=""
                  name="personeel"
                  type="select"
                  options={availablePersoneel.map((personeel) => ({
                    value: `${personeel.voornaam} ${personeel.achternaam}`,
                    label: `${personeel.voornaam} ${personeel.achternaam}`,
                  }))}
                  value={formData.personeel}
                  onChange={handleChange}
                  error={errors.personeel}
				  selectPlaceholder="Toewijzen aan persoon"
                />
              </div>
            )}

            <div className="sidebar-section-one">
              <ReservationStepOne
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                setFormData={setFormData}
                timeblocks={timeblocks}
                loadingTimeblocks={loadingTimeblocks}
                timeblocksError={timeblocksError}
                restaurantData={restaurantData}
              />
            </div>
            <div className="sidebar-section-two">
              <ReservationStepTwoFiltering
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                isSubmitting={isSubmitting}
                menuData={menuData}
              />
            </div>
            <div className="reservation-footer">
              <button
                type="button"
                className="store-reservation-button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Opslaan...' : 'Opslaan'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReservationSidebar;
