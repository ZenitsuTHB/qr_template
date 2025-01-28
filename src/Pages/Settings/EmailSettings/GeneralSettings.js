// GeneralSettings.jsx

import React from 'react';

const GeneralSettings = ({ settings, handleChange, handleSave, isDirty }) => {
  // Default options for Start Greeting
  const startGreetingOptions = ['Dag', 'Hallo', 'Hey', 'Beste', 'Geachte'];

  // Default options for End Greeting
  const endGreetingOptions = [
    'Met vriendelijke groeten,',
    'Hartelijk bedankt,',
    'Tot snel!',
    'Warme groeten,',
  ];

  // Check if the current startGreeting is among the default options
  const isStartGreetingInOptions = startGreetingOptions.includes(
    settings.startGreeting
  );

  const isEndGreetingInOptions = endGreetingOptions.includes(
    settings.endGreeting
  );

  return (
    <form className="settings-form" onSubmit={handleSave} noValidate>
      <div className="form-group">
        <label>Naam</label>
        <div className="input-container">
          <input
            type="text"
            name="groetNaam"
            value={settings.groetNaam}
            onChange={handleChange}
            placeholder="Voer de groetnaam in"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Reply Antwoorden Naar</label>
        <div className="input-container">
          <input
            type="email"
            name="antwoordEmail"
            value={settings.antwoordEmail}
            onChange={handleChange}
            placeholder="Voer het antwoord emailadres in"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Startgroet</label>
        <div className="input-container">
          <select
            name="startGreeting"
            value={settings.startGreeting}
            onChange={handleChange}
            required
          >
            {startGreetingOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            {!isStartGreetingInOptions && (
              <option value={settings.startGreeting}>
                {settings.startGreeting}
              </option>
            )}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Email Inhoud</label>
        <div className="input-container">
          <textarea
            name="emailInhoud"
            value={settings.emailInhoud}
            onChange={handleChange}
            placeholder="Voer de email inhoud in"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Eindgroet</label>
        <div className="input-container">
          <select
            name="endGreeting"
            value={settings.endGreeting}
            onChange={handleChange}
            required
          >
            {endGreetingOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            {!isEndGreetingInOptions && (
              <option value={settings.endGreeting}>
                {settings.endGreeting}
              </option>
            )}
          </select>
        </div>
      </div>


			<div className="form-group">
        <label>Banner Weergave</label>
        <div className="input-container">
          <select
            name="showBanner"
            value={settings.showBanner ? 'Toon Banner' : 'Verberg Banner'}
            onChange={(e) =>
              handleChange({
                target: {
                  name: 'showBanner',
                  value: e.target.value === 'Toon Banner',
                },
              })
            }
          >
            <option value="Toon Banner">Toon Banner</option>
            <option value="Verberg Banner">Verberg Banner</option>
          </select>
        </div>
      </div>


      <button type="submit" className="settings-button" disabled={!isDirty}>
        Opslaan
      </button>
    </form>
  );
};

export default GeneralSettings;
