// Utils/generateTimes.js

import { DateTime } from 'luxon';

const TARGET_DATE = '2024-12-03'; // The date we're focusing on

const formatDateKey = (date) => {
    const formattedDate = DateTime.fromJSDate(date).toISODate();
    return formattedDate;
};

export const generateAvailableTimesForDate = (guests, selectedDate) => {
    const dateDictionary = window.dateDictionary;
    const shiftsPerDate = window.shiftsPerDate;
    const dateKey = formatDateKey(selectedDate);
    const now = DateTime.now().setZone("Europe/Brussels");
    const selectedDateTime = DateTime.fromJSDate(selectedDate).setZone("Europe/Brussels");
    const isToday = selectedDateTime.hasSame(now, 'day');

    if (dateKey === TARGET_DATE) {
        console.log(`[generateAvailableTimesForDate] Generating available times for dateKey: ${dateKey}`);
    }

    // Retrieve and validate 'uurOpVoorhand' from generalSettings
    const uurOpVoorhandRaw = window.generalSettings?.uurOpVoorhand;
    let uurOpVoorhand = 4; // Default value

    if (typeof uurOpVoorhandRaw === 'number' && uurOpVoorhandRaw >= 0) {
        uurOpVoorhand = uurOpVoorhandRaw;
        if (dateKey === TARGET_DATE) {
            console.log(`[generateAvailableTimesForDate] 'uurOpVoorhand' set to: ${uurOpVoorhand} hours`);
        }
    } else {
        console.warn(
            `[generateAvailableTimesForDate] Invalid or missing 'uurOpVoorhand' value ("${uurOpVoorhandRaw}"). Using default: ${uurOpVoorhand} hours`
        );
    }

    let minAllowedTime;
    if (isToday) {
        minAllowedTime = now.plus({ hours: uurOpVoorhand });
        if (dateKey === TARGET_DATE) {
            console.log(`[generateAvailableTimesForDate] Today (${dateKey}) - minAllowedTime set to: ${minAllowedTime.toFormat('HH:mm')}`);
        }
    } else {
        minAllowedTime = selectedDateTime.startOf('day');
        if (dateKey === TARGET_DATE) {
            console.log(`[generateAvailableTimesForDate] Future date (${dateKey}) - minAllowedTime set to start of the day (${minAllowedTime.toFormat('HH:mm')})`);
        }
    }

    // Retrieve and validate 'intervalReservatie' from generalSettings
    const intervalReservatie = window.generalSettings?.intervalReservatie;
    let intervalMinutes = 30; // Default value

    if (
        typeof intervalReservatie === 'number' &&
        Number.isInteger(intervalReservatie) &&
        intervalReservatie > 0
    ) {
        intervalMinutes = intervalReservatie;
        if (dateKey === TARGET_DATE) {
            console.log(`[generateAvailableTimesForDate] 'intervalReservatie' set to: ${intervalMinutes} minutes`);
        }
    } else {
        console.warn(
            `[generateAvailableTimesForDate] Invalid or missing 'intervalReservatie' value ("${intervalReservatie}"). Using default: ${intervalMinutes} minutes`
        );
    }

    // Retrieve and validate 'duurReservatie' from generalSettings
    const duurReservatieRaw = window.generalSettings?.duurReservatie;
    let duurReservatieMinutes = 120; // Default duration in minutes (2 hours)

    if (
        typeof duurReservatieRaw === 'number' &&
        Number.isInteger(duurReservatieRaw) &&
        duurReservatieRaw > 0
    ) {
        duurReservatieMinutes = duurReservatieRaw;
        if (dateKey === TARGET_DATE) {
            console.log(`[generateAvailableTimesForDate] 'duurReservatie' set to: ${duurReservatieMinutes} minutes`);
        }
    } else {
        console.warn(
            `[generateAvailableTimesForDate] Invalid or missing 'duurReservatie' value ("${duurReservatieRaw}"). Using default: ${duurReservatieMinutes} minutes`
        );
    }

    if (!dateDictionary[dateKey] || dateDictionary[dateKey].length === 0) {
        if (dateKey === TARGET_DATE) {
            console.warn(`[generateAvailableTimesForDate] No dateDictionary entries found for dateKey: ${dateKey}`);
        }
        return [];
    }

    const shiftData =
        shiftsPerDate && Array.isArray(shiftsPerDate[dateKey]) ? shiftsPerDate[dateKey] : [];

    let timeButtons = [];

    if (shiftData.length > 0) {
        if (dateKey === TARGET_DATE) {
            console.log(`[generateAvailableTimesForDate] Found ${shiftData.length} shiftData entries for dateKey: ${dateKey}`);
        }
        timeButtons = shiftData.map((shift) => ({
            label: shift.name,
            value: shift.startTime,
        }));
        const availableTimes = timeButtons.map(button => button.value);
        if (dateKey === TARGET_DATE) {
            console.log(`[generateAvailableTimesForDate] Shift-based available times for ${dateKey}:`, availableTimes);
        }
    } else {
        const times = [];

        dateDictionary[dateKey].forEach(({ startTime, endTime }) => {
            let startDateTime = DateTime.fromFormat(startTime, 'HH:mm', { zone: "Europe/Brussels" }).set({
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate()
            });

            const endDateTime = DateTime.fromFormat(endTime, 'HH:mm', { zone: "Europe/Brussels" }).set({
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate()
            });

            if (dateKey === TARGET_DATE) {
                console.log(`[generateAvailableTimesForDate] Processing time block for ${dateKey}: ${startTime} - ${endTime}`);
            }

            while (startDateTime < endDateTime) {
                if (startDateTime >= minAllowedTime) {
                    const timeString = startDateTime.toFormat('HH:mm');
                    times.push(timeString);
                }
                startDateTime = startDateTime.plus({ minutes: intervalMinutes });
            }
        });

        const uniqueTimes = [...new Set(times)].sort(
            (a, b) => DateTime.fromFormat(a, 'HH:mm') - DateTime.fromFormat(b, 'HH:mm')
        );
        if (dateKey === TARGET_DATE) {
            console.log(`[generateAvailableTimesForDate] Generated unique available times for ${dateKey}:`, uniqueTimes);
        }

        timeButtons = uniqueTimes.map((time) => ({
            label: time,
            value: time,
        }));
    }

    // Determine capacityLimit: use uitzonderlijkeCapaciteit if defined, else use general zitplaatsen
    const uitzonderlijkeCapaciteit = window.uitzonderlijkeCapaciteit || {};
    const exceptionalCapacity = uitzonderlijkeCapaciteit[dateKey];
    const capacityLimit = (typeof exceptionalCapacity === 'number')
        ? exceptionalCapacity
        : (window.generalSettings?.zitplaatsen || 0);

    if (typeof capacityLimit !== 'number' || capacityLimit < 0) {
        console.warn(
            `[generateAvailableTimesForDate] Invalid capacityLimit value ("${capacityLimit}"). Defaulting to 0.`
        );
    }

    const finalCapacityLimit = (typeof capacityLimit === 'number' && capacityLimit >= 0)
        ? capacityLimit
        : 0;

    if (dateKey === TARGET_DATE) {
        console.log(`[generateAvailableTimesForDate] Capacity limit for ${dateKey}: ${finalCapacityLimit} guests`);
    }

    // Filter timeButtons based on countingDictionary and capacityLimit
    const countingDictionary = window.countingDictionary || {};

    if (countingDictionary[dateKey]) {
        if (dateKey === TARGET_DATE) {
            console.log(`[generateAvailableTimesForDate] Applying capacity constraints for ${dateKey}`);
        }

        // Define the checkConsecutiveTimes function
        const checkConsecutiveTimes = (startTime) => {
            const intervalsToCheck = [];
            let currentTime = DateTime.fromFormat(startTime, 'HH:mm', { zone: "Europe/Brussels" });
            const endTime = currentTime.plus({ minutes: duurReservatieMinutes });

            while (currentTime < endTime) {
                const timeString = currentTime.toFormat('HH:mm');
                intervalsToCheck.push(timeString);
                currentTime = currentTime.plus({ minutes: intervalMinutes });
            }

            for (const time of intervalsToCheck) {
                const guestsCount = countingDictionary[dateKey][time] || 0;
                const availableCapacity = finalCapacityLimit - guestsCount;

                if (dateKey === TARGET_DATE) {
                    console.log(`[checkConsecutiveTimes] Time: ${time}, GuestsCount: ${guestsCount}, AvailableCapacity: ${availableCapacity}`);
                }

                if (guests > availableCapacity) {
                    // Not enough capacity at this time interval
                    return false;
                }
            }

            // All intervals have sufficient capacity
            return true;
        };

        timeButtons = timeButtons.filter(button => {
            const time = button.value;

            // Use the checkConsecutiveTimes function
            const canAccommodate = checkConsecutiveTimes(time);

            if (dateKey === TARGET_DATE) {
                console.log(`[generateAvailableTimesForDate] Time: ${time}, Can Accommodate: ${canAccommodate}`);
            }

            return canAccommodate;
        });
    } else {
        if (dateKey === TARGET_DATE) {
            console.warn(`[generateAvailableTimesForDate] No countingDictionary entries found for dateKey: ${dateKey}. All times are available.`);
        }
    }

    if (dateKey === TARGET_DATE) {
        console.log(`[generateAvailableTimesForDate] Final available time buttons for ${dateKey}:`, timeButtons);
    }

    return timeButtons;
};
