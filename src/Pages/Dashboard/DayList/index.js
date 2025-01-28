// src/Components/ReservationsList/ReservationsList.js

import React, { useState, useContext, useMemo, useEffect } from 'react';
import { withHeader } from '../../../Components/Structural/Header/index.js';
import ReservationRow from './ReservationRow/index.js';
import Pagination from './Pagination.js';
import SearchFilters from './SearchFilters/index.js';
import { SearchContext } from '../../../Context/SearchContext.js';
import useIsMobile from './Hooks/useIsMobile.js';
import useFilteredReservations from './Hooks/useFilteredReservations.js';
import usePagination from './Hooks/usePagination.js';
import ShiftSelector from './Filters/ShiftSelector.js';
import DatePickerComponent from './Filters/DatePicker.js';
import useSortedReservations from './Hooks/useSortedReservation.js';
import { getNewSortConfig } from './Utils/sortUtils.js';
import { shifts } from './Utils/constants.js';
import { FaSortUp, FaSortDown, FaFilter, FaPrint } from 'react-icons/fa';
import './css/reservationList.css';
import './css/settingsTabs.css';

// Import the new useReservationsList hook
import useReservationsList from './Hooks/useReservationsList.js';
import useNotification from '../../../Components/Notification/index.js';
import ModalWithoutTabs from '../../../Components/Structural/Modal/Standard/index.js';

// Import localStorage utility functions
import { loadFromLocalStorage, saveToLocalStorage } from './Utils/localStorageUtils.js';

// Define a constant key for localStorage
const LOCAL_STORAGE_KEY = 'reservationsListVisibleFields';

// Define the FIELD_CONFIG outside the component to ensure consistency
const FIELD_CONFIG = [
  { key: 'aantalGasten', label: '#', alwaysVisible: true },
  { key: 'tijdstip', label: 'Uur', alwaysVisible: true },
  { key: 'zitplaats', label: 'Zitplaats', alwaysVisible: false },
  { key: 'fullName', label: 'Naam', defaultVisible: true },
  { key: 'email', label: 'Email', defaultVisible: true },
  { key: 'phone', label: 'Telefoon', defaultVisible: false },
  { key: 'personeel', label: 'Toewijzing', alwaysVisible: false },
  { key: 'menu', label: 'Menu', defaultVisible: false },
];

const ReservationsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openTooltipId, setOpenTooltipId] = useState(null);
  const isMobile = useIsMobile();
  const [nameSearch, setNameSearch] = useState('');
  const [guestsSearch, setGuestsSearch] = useState('');
  const [timeSearch, setTimeSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isShiftOptionsOpen, setIsShiftOptionsOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState('');
  const { searchQuery } = useContext(SearchContext);
  const [itemsPerPage, setItemsPerPage] = useState(11);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [isReadyToPrint, setIsReadyToPrint] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false); // New state for tracking print status

  // Use the new hook to fetch reservations data
  const { reservationsData, loading, error } = useReservationsList();

  // Initialize the useNotification hook
  const { triggerNotification, NotificationComponent } = useNotification();

  // Filter, sort, and paginate the reservations data
  const filteredReservationsData = useFilteredReservations(reservationsData, {
    searchQuery,
    nameSearch,
    guestsSearch,
    timeSearch,
    selectedDate,
    selectedShift,
  });

  const sortedReservationsData = useSortedReservations(filteredReservationsData, sortConfig);

  // Calculate the total number of guests for the selected date
  const totalGuests = useMemo(() => {
    return sortedReservationsData.reduce((total, reservation) => {
      const guests = Number(reservation.aantalGasten);
      return total + (isNaN(guests) ? 0 : guests);
    }, 0);
  }, [sortedReservationsData]);

  const { currentData: currentReservations, totalPages } = usePagination(
    sortedReservationsData,
    currentPage,
    itemsPerPage
  );

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleTooltipToggle = (id) => {
    if (openTooltipId === id) {
      setOpenTooltipId(null);
    } else {
      setOpenTooltipId(id);
    }
  };

  const handleTooltipClose = () => {
    setOpenTooltipId(null);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsDatePickerOpen(false);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    const newSortConfig = getNewSortConfig(sortConfig, key);
    setSortConfig(newSortConfig);
  };

  // Initialize visibleFields from localStorage or use default
  const defaultVisibleFields = FIELD_CONFIG.filter(
    (field) => field.defaultVisible || field.alwaysVisible
  ).map((field) => field.key);

  const [visibleFields, setVisibleFields] = useState(() =>
    loadFromLocalStorage(LOCAL_STORAGE_KEY, defaultVisibleFields)
  );

  // Persist visibleFields to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage(LOCAL_STORAGE_KEY, visibleFields);
  }, [visibleFields]);

  const [isFieldSelectorModalOpen, setIsFieldSelectorModalOpen] = useState(false);

  const handleFilterClick = () => {
    setIsFieldSelectorModalOpen(true);
  };

  const handlePrintClick = () => {
    setItemsPerPage(100000); // Increase items per page for printing
    setIsReadyToPrint(true); // Mark ready to wait for data to load
    setIsPrinting(true);
  };

  useEffect(() => {
    if (isReadyToPrint) {
      // Check if data is loaded and then trigger print
      if (!loading && reservationsData.length > 0) {
        window.print();
        setItemsPerPage(11); // Reset items per page
        setIsReadyToPrint(false); // Reset the print state
        setIsPrinting(false); // Reset the printing state
      }
    }
  }, [isReadyToPrint, loading, reservationsData]);

  const FieldSelectorModal = ({ visibleFields, setVisibleFields, onClose }) => {
    const [selectedFields, setSelectedFields] = useState(visibleFields);

    const handleCheckboxChange = (fieldKey) => {
      if (selectedFields.includes(fieldKey)) {
        setSelectedFields(selectedFields.filter((key) => key !== fieldKey));
      } else {
        setSelectedFields([...selectedFields, fieldKey]);
      }
    };

    const handleApply = () => {
      setVisibleFields(selectedFields);
      onClose();
      triggerNotification('Velden bijgewerkt', 'success'); // Optional: Notify the user
    };

    return (
      <ModalWithoutTabs
        content={
          <div className="field-selector-modal">
            <h2 className="secondary-title">Selecteer velden om weer te geven</h2>
            <div className="field-options">
              {FIELD_CONFIG.map((field) => (
                <div key={field.key} className="field-option">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedFields.includes(field.key)}
                      onChange={() => handleCheckboxChange(field.key)}
                      disabled={field.alwaysVisible}
                    />
                    {field.label}
                  </label>
                </div>
              ))}
            </div>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={handleApply}>
                Toepassen
              </button>
            </div>
          </div>
        }
        onClose={onClose}
      />
    );
  };

  // Adjust the number of columns to include the Tooltip column
  const columnsCount = visibleFields.length + 1; // +1 for the Tooltip column

  return (
    <div className="reservations-page">
      {/* Render the NotificationComponent */}
      <NotificationComponent />

      {/* Include the FieldSelectorModal */}
      {isFieldSelectorModalOpen && (
        <FieldSelectorModal
          visibleFields={visibleFields}
          setVisibleFields={setVisibleFields}
          onClose={() => setIsFieldSelectorModalOpen(false)}
        />
      )}

      <DatePickerComponent
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        isDatePickerOpen={isDatePickerOpen}
        setIsDatePickerOpen={setIsDatePickerOpen}
        handleDateChange={handleDateChange}
        totalGuests={totalGuests} // Pass the totalGuests prop
        selectedShift={selectedShift} // Pass the selectedShift prop
        isPrinting={isPrinting}
      />
      <ShiftSelector
        shifts={shifts}
        selectedShift={selectedShift}
        setSelectedShift={setSelectedShift}
        isShiftOptionsOpen={isShiftOptionsOpen}
        setIsShiftOptionsOpen={setIsShiftOptionsOpen}
        setCurrentPage={setCurrentPage}
      />
      <SearchFilters
        nameSearch={nameSearch}
        setNameSearch={setNameSearch}
        guestsSearch={guestsSearch}
        setGuestsSearch={setGuestsSearch}
        timeSearch={timeSearch}
        setTimeSearch={setTimeSearch}
      />

      <div className="reservations-container">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Fout bij het laden</div>
        ) : (
          <>
            <div
              className={`reservations-grid ${isMobile ? 'mobile-grid' : ''}`}
              style={{ gridTemplateColumns: `60px 70px repeat(${columnsCount - 2}, 1fr)` }}
            >
              {!isMobile && (
                <div className="reservations-header reservation-row">
                  {visibleFields.map((fieldKey) => {
                    const fieldConfig = FIELD_CONFIG.find((field) => field.key === fieldKey);
                    return (
                      <div
                        key={fieldKey}
                        className={`header-cell ${fieldKey}-header`}
                        onClick={() => handleSort(fieldKey)}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        {fieldConfig.label}
                        {fieldConfig.label && (
                          <span className="sort-icon">
                            {sortConfig.key === fieldKey && sortConfig.direction === 'asc' && <FaSortUp />}
                            {sortConfig.key === fieldKey && sortConfig.direction === 'desc' && <FaSortDown />}
                          </span>
                        )}
                      </div>
                    );
                  })}
                  {/* Always render the last column header for Tooltip */}
                  <div className="header-cell extra-header"></div>
                </div>
              )}

              {currentReservations.length > 0 ? (
                currentReservations.map((reservation) => (
                  <React.Fragment key={reservation.id}>
                    <ReservationRow
                      reservation={reservation}
                      visibleFields={visibleFields}
                      isMobile={isMobile}
                      isTooltipOpen={openTooltipId === reservation.id}
                      onTooltipToggle={handleTooltipToggle}
                      onTooltipClose={handleTooltipClose}
                      triggerNotification={triggerNotification}
                    />

                    {/* Extra Info Row - Visible Only When Printing */}
                    {/* Extra Info Row - Visible Only When Printing */}
                    {reservation.extra && reservation.extra !== '' && (
                      <div className="extra-info-row">
                        <div className="extra-info-content">
                          <strong>Extra info:</strong> {reservation.extra}
                        </div>
                      </div>
                    )}

                    
                  </React.Fragment>
                  
                ))
              ) : (
                <div
                  className={`no-reservations-row ${
                    isMobile ? 'no-reservations-mobile' : 'no-reservations-desktop'
                  }`}
                >
                  <span>
                    {selectedShift === 'Dag'
                      ? 'Geen reservaties voor deze dag.'
                      : 'Geen reservaties voor deze shift.'}
                  </span>
                </div>
              )}
            </div>
            {currentReservations.length > 0 && (
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                handlePageClick={handlePageClick}
              />
            )}

            {/* Buttons below the pagination */}
            <div className="buttons-container">
              <button className="filter-button" onClick={handleFilterClick}>
                <FaFilter className="button-icon" />
                Filter
              </button>
              <button className="print-button" onClick={handlePrintClick}>
                <FaPrint className="button-icon" />
                Print
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default withHeader(ReservationsList);
