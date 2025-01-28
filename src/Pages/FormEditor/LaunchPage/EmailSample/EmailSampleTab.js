// src/Pages/FormEditor/LaunchPage/EmailSampleTab.jsx

import React from 'react';
import { FaEnvelopeOpenText } from 'react-icons/fa';
import './css/emailSample.css';

const EmailSampleTab = ({ emailSubject, emailBody, shareMessage, reservationLink }) => {
  return (
    <div className="email-section">
      <div className="email-header">
        <FaEnvelopeOpenText className="email-icon" />
        <h3 className="email-title">Uitnodiging per E-mail</h3>
      </div>

      <p className="email-intro">
        Hieronder vindt u een voorbeeld van een uitnodiging die u per e-mail kunt versturen naar uw klanten. U kunt de tekst aanpassen naar wens.
      </p>

      <div className="email-sample">
        <p>Beste klant,</p>
        <p>
          Wij zijn verheugd om u uit te nodigen voor een reservering bij ons. Via onderstaande link kunt u eenvoudig een afspraak maken op een tijdstip dat voor u het beste uitkomt.
        </p>
        <p>
          <strong>Reserveer nu:</strong>{' '}
          <a href={reservationLink}>{reservationLink}</a>
        </p>
        <p>
          Mocht u vragen hebben, aarzel dan niet om contact met ons op te nemen. We kijken ernaar uit u te verwelkomen!
        </p>
        <p>Met vriendelijke groet,<br />Uw bedrijfsteam</p>
      </div>

      {/* Send Email Button */}
      <a
        href={`mailto:?subject=${encodeURIComponent(
          emailSubject
        )}&body=${encodeURIComponent(emailBody)}`}
        className="email-button"
      >
        E-mail Versturen
      </a>
    </div>
  );
};

export default EmailSampleTab;
