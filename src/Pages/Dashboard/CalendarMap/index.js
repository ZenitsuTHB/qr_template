// src/Components/Calendar/CalendarComponent.js

import React, { useState, useMemo } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import BarChartView from './BarChartView';
import ReservationDetailsModal from './ReservationDetailsModal';
import './css/calendarComponent.css';
import { withHeader } from '../../../Components/Structural/Header';
import useReservations from './Hooks/useReservations';
import usePredictions from './Hooks/usePredictions';
import WeekReport from './Reports/WeekReport';
import MonthReport from './Reports/MonthReport';
import ModalWithoutTabs from '../../../Components/Structural/Modal/Standard';
import BezettingspercentageForm from './BezettingspercentageForm';
import useDates from './Hooks/useDates';
import useWeatherData from './Hooks/useWeatherData';
import { getMonday } from './Utils/dateUtils';
import { formatDateForFilter } from '../../../Utils/dateUtils';
import useNotification from '../../../Components/Notification/index.js';

const CalendarComponent = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateReservations, setSelectedDateReservations] = useState(null);
  const [selectedShift, setSelectedShift] = useState('Dag');
  const [selectedViewMode, setSelectedViewMode] = useState('Algemeen');
  const [isChartView, setIsChartView] = useState(false);
  const [weekOrMonthView, setWeekOrMonthView] = useState('month');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const [maxCapacityInput, setMaxCapacityInput] = useState(50); // Default max capacity
  const [gemiddeldeDuurCouvertInput, setGemiddeldeDuurCouvertInput] = useState(60); // Default value

  const reservationsByDate = useReservations(); // Fetch reservations using the new hook
  const predictionsByDate = usePredictions(
    currentDate,
    reservationsByDate,
    selectedShift,
    selectedViewMode
  );

  const dates = useDates(currentDate, weekOrMonthView);

  // Memoize startDate and endDate to prevent re-creation on every render
  const { startDate, endDate } = useMemo(() => {
    let startDate, endDate;
    if (weekOrMonthView === 'month') {
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    } else if (weekOrMonthView === 'week') {
      startDate = getMonday(currentDate);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
    }
    return { startDate, endDate };
  }, [currentDate, weekOrMonthView]);

  const weatherDataByDate = useWeatherData(startDate, endDate, selectedViewMode === 'Weer');

  const { triggerNotification, NotificationComponent } = useNotification();

  const handlePrev = () => {
    if (weekOrMonthView === 'week') {
      setCurrentDate((prev) => {
        const newDate = new Date(prev);
        newDate.setDate(prev.getDate() - 7);
        return newDate;
      });
    } else {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      );
    }
  };

  const handleNext = () => {
    if (weekOrMonthView === 'week') {
      setCurrentDate((prev) => {
        const newDate = new Date(prev);
        newDate.setDate(prev.getDate() + 7);
        return newDate;
      });
    } else {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
      );
    }
  };

  const handleDateClick = (date) => {
    const dateString = formatDateForFilter(date);
    setSelectedDateReservations({
      date: dateString,
      reservations: reservationsByDate[dateString] || [],
    });
  };

  const handleCloseModal = () => {
    setSelectedDateReservations(null);
  };

  const toggleChartView = () => {
    setIsChartView(!isChartView);
  };

  const openReportModal = () => {
    setIsReportModalOpen(true);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
  };

  const handleMaxCapacityChange = (e) => {
    setMaxCapacityInput(e.target.value);
  };

  const handleGemiddeldeDuurCouvertChange = (e) => {
    setGemiddeldeDuurCouvertInput(e.target.value);
  };

  return (
    <div className="calendar-page">
      <NotificationComponent />
      <CalendarHeader
        currentDate={currentDate}
        onPrev={handlePrev}
        onNext={handleNext}
        selectedShift={selectedShift}
        setSelectedShift={setSelectedShift}
        selectedViewMode={selectedViewMode}
        setSelectedViewMode={setSelectedViewMode}
        isChartView={isChartView}
        toggleChartView={toggleChartView}
        weekOrMonthView={weekOrMonthView}
        setWeekOrMonthView={setWeekOrMonthView}
        onGenerateReport={openReportModal}
      />

      {selectedViewMode === 'Bezettingspercentage' && (
        <BezettingspercentageForm
          maxCapacity={maxCapacityInput}
          gemiddeldeDuurCouvert={gemiddeldeDuurCouvertInput}
          onMaxCapacityChange={handleMaxCapacityChange}
          onGemiddeldeDuurCouvertChange={handleGemiddeldeDuurCouvertChange}
        />
      )}

      {isChartView ? (
        <BarChartView
          currentDate={currentDate}
          reservationsByDate={reservationsByDate}
          selectedShift={selectedShift}
          selectedViewMode={selectedViewMode}
          predictionsByDate={predictionsByDate}
          weekOrMonthView={weekOrMonthView}
          maxCapacity={maxCapacityInput}
          gemiddeldeDuurCouvert={gemiddeldeDuurCouvertInput}
          weatherDataByDate={weatherDataByDate}
        />
      ) : (
        <CalendarGrid
          dates={dates}
          currentDate={currentDate}
          reservationsByDate={reservationsByDate}
          onDateClick={handleDateClick}
          selectedShift={selectedShift}
          selectedViewMode={selectedViewMode}
          predictionsByDate={predictionsByDate}
          weekOrMonthView={weekOrMonthView}
          maxCapacity={maxCapacityInput}
          gemiddeldeDuurCouvert={gemiddeldeDuurCouvertInput}
          weatherDataByDate={weatherDataByDate}
        />
      )}
      {selectedDateReservations && (
        <ReservationDetailsModal
          reservationsData={selectedDateReservations}
          onClose={handleCloseModal}
          triggerNotification={triggerNotification}
        />
      )}

      {isReportModalOpen && (
        <ModalWithoutTabs
          content={
            weekOrMonthView === 'week' ? (
              <WeekReport
                dates={dates}
                reservationsByDate={reservationsByDate}
                selectedShift={selectedShift}
                autoGenerate={true}
              />
            ) : (
              <MonthReport
                dates={dates}
                reservationsByDate={reservationsByDate}
                selectedShift={selectedShift}
                autoGenerate={true}
              />
            )
          }
          onClose={closeReportModal}
        />
      )}
    </div>
  );
};

export default withHeader(CalendarComponent);
