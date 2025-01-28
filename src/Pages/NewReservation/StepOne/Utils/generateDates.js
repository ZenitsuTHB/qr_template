// Utils/generateDates.js

import { DateTime } from 'luxon';
import { collectExceptions } from './exceptions';
import { getSchemeSettingsDates } from './dates/schemeDates';
import { getBlockSettingsDates } from './dates/blockDates';
import { generateAvailableTimesForDate } from './generateTimes'; // Ensure correct import path

const initializeDictionaries = () => {
    window.dateDictionary = window.dateDictionary || {};
    window.shiftsPerDate = window.shiftsPerDate || {};
};

export const generateAvailableDates = (guests, timeblocks = [], reservations = []) => {
    initializeDictionaries();
    collectExceptions(timeblocks);

    const dagenInToekomstRaw = window.generalSettings?.dagenInToekomst;
    let dagenInToekomst = 365;

    if (dagenInToekomstRaw) {
        if (typeof dagenInToekomstRaw === 'number') {
            dagenInToekomst = dagenInToekomstRaw;
        } else if (typeof dagenInToekomstRaw === 'string') {
            dagenInToekomst = parseInt(dagenInToekomstRaw, 10);
            if (isNaN(dagenInToekomst)) {
                dagenInToekomst = 365;
            }
        }
    }

    const today = DateTime.now().setZone("Europe/Brussels").startOf('day');
    const maxDate = today.plus({ days: dagenInToekomst - 1 }).endOf('day'); // Subtract 1 because we count today as day 1

    const blockDates = getBlockSettingsDates(timeblocks);
    const schemeDates = getSchemeSettingsDates(timeblocks, maxDate);
    const combinedDates = [...blockDates, ...schemeDates];

    const filteredDates = combinedDates.filter(dateStr => {
        const date = DateTime.fromISO(dateStr, { zone: "Europe/Brussels" }).startOf('day');
        return date >= today && date <= maxDate;
    });

    let uniqueDates = Array.from(new Set(filteredDates)).sort();

    // Initialize countingDictionary
    const countingDictionary = {};

    // Retrieve intervalReservatie and validate it
    const intervalReservatie = window.generalSettings?.intervalReservatie;
    let intervalMinutes = 30; // Default value

    if (
        typeof intervalReservatie === 'number' &&
        Number.isInteger(intervalReservatie) &&
        intervalReservatie > 0
    ) {
        intervalMinutes = intervalReservatie;
    } else {
        console.warn(
            `[generateAvailableDates] Invalid intervalReservatie value "${intervalReservatie}". Using default intervalMinutes = 30`
        );
    }

    // Retrieve duurReservatie and validate it
    const duurReservatieRaw = window.generalSettings?.duurReservatie;
    let duurReservatieMinutes = 120; // Default duration in minutes (2 hours)

    if (
        typeof duurReservatieRaw === 'number' &&
        Number.isInteger(duurReservatieRaw) &&
        duurReservatieRaw > 0
    ) {
        duurReservatieMinutes = duurReservatieRaw;
    } else {
        console.warn(
            `[generateAvailableDates] Invalid duurReservatie value "${duurReservatieRaw}". Using default duurReservatieMinutes = 120`
        );
    }

    // Retrieve uurOpVoorhand and validate it
    let uurOpVoorhand = 0; // Default value

    // Function to generate times for a given dateKey
    const generateAvailableTimesForDateKey = (guests, dateKey) => {
        const dateDictionary = window.dateDictionary;
        const shiftsPerDate = window.shiftsPerDate;
        const selectedDate = DateTime.fromISO(dateKey, { zone: "Europe/Brussels" });

        if (!dateDictionary[dateKey] || dateDictionary[dateKey].length === 0) {
            return [];
        }

        const shiftData =
            shiftsPerDate && Array.isArray(shiftsPerDate[dateKey]) ? shiftsPerDate[dateKey] : [];

        if (shiftData.length > 0) {
            const shiftButtons = shiftData.map((shift) => ({
                label: shift.name,
                value: shift.startTime,
            }));
            return shiftButtons.map(button => button.value);
        }

        const times = [];

        dateDictionary[dateKey].forEach(({ startTime, endTime }) => {

            let startDateTime = DateTime.fromFormat(startTime, 'HH:mm', { zone: "Europe/Brussels" }).set({
                year: selectedDate.year,
                month: selectedDate.month,
                day: selectedDate.day
            });

            const endDateTime = DateTime.fromFormat(endTime, 'HH:mm', { zone: "Europe/Brussels" }).set({
                year: selectedDate.year,
                month: selectedDate.month,
                day: selectedDate.day
            });

            while (startDateTime < endDateTime) {
                const timeString = startDateTime.toFormat('HH:mm');
                times.push(timeString);
                startDateTime = startDateTime.plus({ minutes: intervalMinutes });
            }
        });

        const uniqueTimes = [...new Set(times)].sort(
            (a, b) => DateTime.fromFormat(a, 'HH:mm') - DateTime.fromFormat(b, 'HH:mm')
        );

        return uniqueTimes;
    };

    // Generate countingDictionary with initial counts
    uniqueDates.forEach(dateKey => {
        const times = generateAvailableTimesForDateKey(guests, dateKey);
        countingDictionary[dateKey] = {};

        times.forEach(time => {
            countingDictionary[dateKey][time] = 0;
        });
    });

    // Process reservations to update counts
    reservations.forEach(reservation => {
        const reservationDate = reservation.date; // string in "YYYY-MM-DD" format
        const reservationTime = reservation.time; // string in "HH:mm"
        const numberOfGuests = reservation.guests;

        if (countingDictionary[reservationDate]) {
            const resStartDateTime = DateTime.fromISO(`${reservationDate}T${reservationTime}`, { zone: "Europe/Brussels" });

            // Use duurReservatieMinutes instead of fixed 2 hours
            const resEndDateTime = resStartDateTime.plus({ minutes: duurReservatieMinutes });

            // For each time period in countingDictionary[reservationDate]
            Object.keys(countingDictionary[reservationDate]).forEach(timePeriodStart => {
                const timePeriodStartDateTime = DateTime.fromISO(`${reservationDate}T${timePeriodStart}`, { zone: "Europe/Brussels" });
                const timePeriodEndDateTime = timePeriodStartDateTime.plus({ minutes: intervalMinutes });

                // Check if reservation interval collides with time period
                if (resStartDateTime < timePeriodEndDateTime && resEndDateTime > timePeriodStartDateTime) {
                    // There is a collision
                    countingDictionary[reservationDate][timePeriodStart] += numberOfGuests;
                }
            });
        }
    });

    // Print the countingDictionary
    console.log('[generateAvailableDates] Counting Dictionary:', countingDictionary);

    // Store countingDictionary in window for access in generateAvailableTimesForDate
    window.countingDictionary = countingDictionary;

    // Remove dates with no available time buttons
    const datesToRemove = [];
    uniqueDates.forEach(dateKey => {
        const selectedDate = DateTime.fromISO(dateKey, { zone: "Europe/Brussels" }).toJSDate();
        const availableTimeButtons = generateAvailableTimesForDate(guests, selectedDate);

        if (availableTimeButtons.length === 0) {
            datesToRemove.push(dateKey);
        }
    });

    // Filter out the dates to remove
    uniqueDates = uniqueDates.filter(dateKey => !datesToRemove.includes(dateKey));

    // Print the final uniqueDates
    console.log('[generateAvailableDates] Final Unique Dates:', uniqueDates);

    return uniqueDates;
};
