import React, { useState, useEffect, useMemo } from 'react';
import './css/generalSettings.css';
import { withHeader } from '../../../Components/Structural/Header';
import useApi from '../../../Hooks/useApi';
import useNotification from '../../../Components/Notification';
import { FaInfoCircle } from 'react-icons/fa'; // Import the info icon

const Settings = () => {
  const api = useApi();
  const { triggerNotification, NotificationComponent } = useNotification();

  const defaultSettings = {
    zitplaatsen: 0,
    uurOpVoorhand: 0,
    dagenInToekomst: 0,
    maxGasten: 0,
    intervalReservatie: 0,
    duurReservatie: 60,
    showNoticeForMaxGuests: 'Nee',
    noticePhoneNumber: '',
  };  

  const [settings, setSettings] = useState(defaultSettings);
  const [initialSettings, setInitialSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        console.log("General Settings GET");
        const response = await api.get(window.baseDomain + 'api/general-settings', { noCache: true });
        const data = response || {};

        const mergedData = { 
          ...defaultSettings, 
          ...data,
          dagenInToekomst: data.dagenInToekomst !== undefined ? Number(data.dagenInToekomst) : defaultSettings.dagenInToekomst,
          intervalReservatie: data.intervalReservatie !== undefined ? Number(data.intervalReservatie) : defaultSettings.intervalReservatie,
          duurReservatie: data.duurReservatie !== undefined ? Number(data.duurReservatie) : defaultSettings.duurReservatie,
        };

        setSettings(mergedData);
        setInitialSettings(mergedData);
      } catch (err) {
        console.error('Error fetching general settings:', err);
        triggerNotification('Fout bij het ophalen van instellingen.', 'error');
        setSettings(defaultSettings);
        setInitialSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [api]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let parsedValue = value;
    // Parse numerical fields properly
    if (['intervalReservatie', 'dagenInToekomst', 'duurReservatie'].includes(name)) {
      parsedValue = value === '' ? '' : Number(value);
      if (isNaN(parsedValue)) {
        parsedValue = 0; 
      }
    }

    setSettings((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put(window.baseDomain + 'api/general-settings', settings);
      triggerNotification('Instellingen opgeslagen', 'success');
      setInitialSettings(settings);
    } catch (err) {
      console.error('Error saving general settings:', err);
      triggerNotification('Fout bij het opslaan', 'error');
    }
  };

  const isDirty = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(initialSettings),
    [settings, initialSettings]
  );

  // Generate increments
  const generateIncrements = () => {
    const increments = [];

    // 5 min increments up to 60
    for (let i = 5; i <= 60; i += 5) {
      increments.push(i);
    }

    // 10 min increments from 70 to 90
    for (let i = 70; i <= 90; i += 10) {
      increments.push(i);
    }

    // 15 min increments from 105 to 180
    for (let i = 105; i <= 180; i += 15) {
      increments.push(i);
    }

    // 30 min increments from 210 to 300
    for (let i = 210; i <= 300; i += 30) {
      increments.push(i);
    }

    // 60 min increments from 360 to 600
    for (let i = 360; i <= 600; i += 60) {
      increments.push(i);
    }

    return increments;
  };

  const timeOptions = generateIncrements();

  return (
    <div className="general-settings-page">
      <NotificationComponent />
      <h2 className="settings-title">Beheer Reservaties</h2>
      <div className="settings-container">
        <form className="settings-form" onSubmit={handleSave} noValidate>
          {/* Aantal Zitplaatsen */}
          <div className="form-group">
            <div className="label-with-tooltip">
              <label>Aantal Zitplaatsen</label>
              <div className="button-with-tooltip">
                <FaInfoCircle />
                <div className="tooltip">
                  Het maximum aantal gasten die kunnen boeken in uw restaurant indien geen uitzondering van toepassing is.
                </div>
              </div>
            </div>
            <div className="input-container">
              <input
                type="number"
                name="zitplaatsen"
                placeholder="Zitplaatsen"
                value={settings.zitplaatsen}
                onChange={handleChange}
                min="0"
                max="10000"
              />
            </div>
          </div>

          {/* Min. Uren op Voorhand te Reserveren */}
          <div className="form-group">
            <div className="label-with-tooltip">
              <label>Min. Uren op Voorhand te Reserveren</label>
              <div className="button-with-tooltip">
                <FaInfoCircle />
                <div className="tooltip">
                  Het minimum aantal uren dat klanten vooraf moeten reserveren.
                </div>
              </div>
            </div>
            <div className="input-container">
              <select
                name="uurOpVoorhand"
                value={settings.uurOpVoorhand}
                onChange={handleChange}
              >
                {Array.from({ length: 17 }, (_, i) => (
                  <option key={i} value={i}>
                    {i} uur
                  </option>
                ))}
              </select>
            </div>
          </div>


          {/* Max. Aantal Dagen in de Toekomst te Reserveren */}
          <div className="form-group">
            <div className="label-with-tooltip">
              <label>Max. Aantal Dagen in de Toekomst te Reserveren</label>
              <div className="button-with-tooltip">
                <FaInfoCircle />
                <div className="tooltip">
                  Het maximale aantal dagen in de toekomst tot wanneer klanten kunnen reserveren.
                </div>
              </div>
            </div>
            <div className="input-container">
              <input
                type="number"
                name="dagenInToekomst"
                placeholder="Hoeveel dagen in de toekomst"
                value={settings.dagenInToekomst}
                onChange={handleChange}
                min="0"
                max="400"
              />
            </div>
          </div>

          {/* Interval Reservatie */}
          <div className="form-group">
            <div className="label-with-tooltip">
              <label>Interval Tussen Reservaties (min)</label>
              <div className="button-with-tooltip">
                <FaInfoCircle />
                <div className="tooltip">
                  Het interval tussen reservaties.
                </div>
              </div>
            </div>
            <div className="input-container">
              <select
                name="intervalReservatie"
                value={settings.intervalReservatie}
                onChange={handleChange}
              >
                <option value={0}>Selecteer interval</option>
                {timeOptions.map((val) => (
                  <option key={val} value={val}>
                    {val} min
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Duur Reservatie */}
          <div className="form-group">
            <div className="label-with-tooltip">
              <label>Duur Reservatie (min)</label>
              <div className="button-with-tooltip">
                <FaInfoCircle />
                <div className="tooltip">
                  De standaardduur van een reservatie in minuten.
                </div>
              </div>
            </div>
            <div className="input-container">
              <select
                name="duurReservatie"
                value={settings.duurReservatie}
                onChange={handleChange}
              >
                <option value={0}>Selecteer duur</option>
                {timeOptions.map((val) => (
                  <option key={val} value={val}>
                    {val} min
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Max. Aantal Gasten per Online Boeking */}
          <div className="form-group">
            <div className="label-with-tooltip">
              <label>Max. Aantal Gasten per Online Boeking</label>
              <div className="button-with-tooltip">
                <FaInfoCircle />
                <div className="tooltip">
                  Het maximale aantal gasten per online reservering.
                </div>
              </div>
            </div>
            <div className="input-container">
              <input
                type="number"
                name="maxGasten"
                placeholder="Max gasten online boeking"
                value={settings.maxGasten}
                onChange={handleChange}
                min="0"
                max="1000"
                step="1"
              />
            </div>
          </div>

          {/* Show Notice for Exceeding Max Guests */}
          <div className="form-group">
            <div className="label-with-tooltip">
              <label>Vraag om te Bellen bij Meer Gasten</label>
              <div className="button-with-tooltip">
                <FaInfoCircle />
                <div className="tooltip">
                  Wanneer iemand een groter aantal gasten kiest dan bepaald in het bovenstaande veld kan u vragen om te bellen.
                </div>
              </div>
            </div>
            <div className="input-container">
              <select
                name="showNoticeForMaxGuests"
                value={settings.showNoticeForMaxGuests}
                onChange={handleChange}
              >
                <option value="Ja">Ja</option>
                <option value="Nee">Nee</option>
              </select>
            </div>
          </div>

          {settings.showNoticeForMaxGuests === 'Ja' && (
            <div className="form-group">
              <div className="label-with-tooltip">
                <label>Telefoonnummer</label>
                <div className="button-with-tooltip">
                  <FaInfoCircle />
                  <div className="tooltip">
                    Het telefoonnummer dat wordt getoond in de melding die vraagt om te bellen voor uitgebreidere reservaties.
                  </div>
                </div>
              </div>
              <div className="input-container">
                <input
                  type="text"
                  name="noticePhoneNumber"
                  placeholder="Telefoonnummer"
                  value={settings.noticePhoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <button type="submit" className="button-style-3" disabled={!isDirty}>
            Opslaan
          </button>
        </form>
      </div>
    </div>
  );
};

export default withHeader(Settings);
