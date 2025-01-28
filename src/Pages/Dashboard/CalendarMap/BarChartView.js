// BarChartView.js

import React from 'react';
import './css/barChartView.css';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import useChartData from './Hooks/useChartData';

const BarChartView = ({
  currentDate,
  reservationsByDate,
  selectedShift,
  selectedViewMode,
  maxCapacity,
  gemiddeldeDuurCouvert,
  predictionsByDate,
  weekOrMonthView,
  weatherDataByDate,
}) => {
  const chartData = useChartData({
    currentDate,
    reservationsByDate,
    selectedShift,
    selectedViewMode,
    maxCapacity,
    gemiddeldeDuurCouvert,
    predictionsByDate,
    weekOrMonthView,
    weatherDataByDate,
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: selectedShift === 'Dag' && selectedViewMode === 'Algemeen',
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            if (selectedViewMode === 'Bezettingspercentage') {
              return `${context.parsed.y}%`;
            } else if (selectedViewMode === 'Weer') {
              return `${context.parsed.y}°C`;
            } else {
              return `${context.parsed.y} gasten`;
            }
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: selectedViewMode === 'Bezettingspercentage' ? 100 : undefined,
        title: {
          display: true,
          text:
            selectedViewMode === 'Bezettingspercentage'
              ? 'Bezettingsgraad (%)'
              : selectedViewMode === 'Weer'
              ? 'Temperatuur (°C)'
              : 'Aantal Gasten',
        },
        stacked: selectedShift === 'Dag' && selectedViewMode === 'Algemeen',
      },
      x: {
        title: {
          display: true,
          text:
            weekOrMonthView === 'week' ? 'Dag van de Week' : 'Dag van de Maand',
        },
        stacked: selectedShift === 'Dag' && selectedViewMode === 'Algemeen',
      },
    },
  };

  return (
    <div className="bar-chart-view">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChartView;
