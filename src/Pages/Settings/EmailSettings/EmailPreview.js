import React, { useState, useEffect, useRef } from 'react';
import BannerUploadComponent from './BannerUploadComponent';
import logo from '../../../Assets/logos/logo.webp'

const EmailPreview = ({ settings, handleChange }) => {
  // Sample data for placeholders
  const sampleData = {
    firstName: 'Jan',
    lastName: 'Jansen',
    date: new Date(),
    time: '18:30',
    guests: 4,
    phone: '0123456789',
    email: 'jan.jansen@example.com',
    reservationId: '123456789',
  };

  // Function to format the date
  const formatDate = (date) => {
    return date.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // EditableText component
  const EditableText = ({
    value,
    name,
    handleChange,
    element: Element = 'span',
    className = '',
    style = {},
    inputType = 'input', // 'input' or 'textarea'
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localValue, setLocalValue] = useState(value);
    const inputRef = useRef(null);

    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
        if (inputType !== 'textarea') {
          inputRef.current.setSelectionRange(
            inputRef.current.value.length,
            inputRef.current.value.length
          );
        }
      }
    }, [isEditing]);

    const handleBlur = () => {
      setIsEditing(false);
      handleChange({
        target: { name, value: localValue },
      });
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && inputType !== 'textarea') {
        handleBlur();
      }
    };

    const handleClick = () => {
      setIsEditing(true);
    };

    const grayBoxStyle = {
      border: '1px dashed gray',
      borderRadius: '8px',
      padding: '2px',
      display: 'inline-block',
      cursor: 'text',
    };

    const inputStyle = {
      ...style,
      border: 'none',
      outline: 'none',
      background: 'none',
      padding: '0',
      margin: '0',
      width: 'auto',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      color: 'inherit',
    };

    return (
      <span style={grayBoxStyle}>
        {isEditing ? (
          inputType === 'textarea' ? (
            <textarea
              ref={inputRef}
              name={name}
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onBlur={handleBlur}
              className={className}
              style={inputStyle}
              rows={1}
            />
          ) : (
            <input
              ref={inputRef}
              type="text"
              name={name}
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className={className}
              style={inputStyle}
              size={Math.max(localValue.length + 1, 1)}
            />
          )
        ) : (
          <Element
            className={className}
            style={{ ...style, display: 'inline' }}
            onClick={handleClick}
          >
            {localValue}
          </Element>
        )}
      </span>
    );
  };

  return (
    <div className="email-preview-container">
      <style>
        {`
          .email-preview-container-small {
            max-width: 800px;
            width: 100%;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 8px;
            padding: 20px;
            font-family: 'Poppins', sans-serif;
            overflow: hidden;
          }

          .email-preview-container .sender-info {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 20px;
            width: 100%;
          }

          .email-preview-container .sender-info .info-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 1px solid #cccccc;
            border-radius: 5px;
            padding: 10px 15px;
            color: #666666;
            margin-bottom: 10px;
            width: 100%;
            background-color: #f5f5f5;
          }

          .email-preview-container .sender-info .info-box .label {
            font-weight: bold;
            color: #333333;
          }

          .email-preview-container .sender-info .info-box .value {
            font-weight: normal;
            text-align: right;
          }

          .email-preview-container .email-body {
            color: #333333;
          }

          .email-preview-container .email-body h2 {
            color: #000;
            font-size: 24px;
            margin-bottom: 16px;
          }

          .email-preview-container .email-body p {
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 16px;
          }

          .email-preview-container .reservation-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 14px;
          }

          .email-preview-container .reservation-table td {
            padding: 8px 12px;
            border: 1px solid #dddddd;
          }

          .email-preview-container .reservation-table td.label {
            font-weight: 600;
            width: 150px;
            vertical-align: top;
            background-color: #f9f9f9;
          }

          .email-preview-container .email-footer {
            text-align: center;
            font-size: 12px;
            color: gray;
            border-top: 1px solid #dddddd;
            padding-top: 10px;
            margin-top: 20px;
          }

          .email-preview-container .email-footer a {
            color: gray;
            text-decoration: none;
          }

          .email-preview-container .email-footer img {
            display: block;
            margin: 0 auto;
            vertical-align: middle;
          }

          .email-preview-container input,
          .email-preview-container textarea {
            border: none;
            outline: none;
            background: none;
            font-family: inherit;
            font-size: inherit;
            color: inherit;
            width: auto;
            resize: none;
          }
        `}
      </style>

      <div className="sender-info">
        <div className="info-box">
          <span className="label">Verzender:</span>
          <span className="value">
            {settings.groetNaam || 'Het Team'}
          </span>
        </div>
        <div className="info-box">
          <span className="label">Email:</span>
          <span className="value">bevestiging@reservaties.net</span>
        </div>
        <div className="info-box">
          <span className="label">Antwoord naar:</span>
          <span className="value">
            {settings.antwoordEmail || 'noreply@example.com'}
          </span>
        </div>
      </div>

      <div className="email-preview-container-small">
        <div className="email-body">

		{settings.showBanner && <BannerUploadComponent />}
          <h2 style={{ color: '#FB5B86'}}>
            <EditableText
              value={settings.startGreeting || 'Beste'}
              name="startGreeting"
              handleChange={handleChange}
              element="span"
              className=""
              style={{ color: '#FB5B86', fontSize: '24px' }}
            />{' '}
            {sampleData.firstName},
          </h2>

          <p>
            Uw reservatie is bevestigd voor{' '}
            <strong>{formatDate(sampleData.date)}</strong> om{' '}
            <strong>{sampleData.time}</strong>.
          </p>

          <p>
            <EditableText
              value={
                settings.emailInhoud ||
                'Wij kijken ernaar uit om u te verwelkomen en hopen dat u een fijne tijd zult hebben.'
              }
              name="emailInhoud"
              handleChange={handleChange}
              element="span"
              inputType="textarea"
              className=""
              style={{ fontSize: '16px', lineHeight: '1.5' }}
            />
          </p>

          {settings.reservatieBewerken === 'Reservatie Bewerken Toestaan' && (
            <p>
              U kunt uw reservatie bewerken via de volgende link:{' '}
              <a
                href={`https://edit.reservaties.net?reservationId=${sampleData.reservationId}`}
              >
                Reservatie Bewerken
              </a>
            </p>
          )}

          <p>
            <EditableText
              value={settings.endGreeting || 'Met vriendelijke groeten,'}
              name="endGreeting"
              handleChange={handleChange}
              element="span"
              className=""
              style={{}}
            />
          </p>
          <p>
            <strong>
              <EditableText
                value={settings.groetNaam || 'Het Team'}
                name="groetNaam"
                handleChange={handleChange}
                element="span"
                className=""
                style={{}}
              />
            </strong>
          </p>
        </div>

        {settings.toonTabel === 'Toon tabel' && (
          <>
            <p>
              <strong>Uw Informatie:</strong>
            </p>
            <table className="reservation-table">
              <tbody>
                <tr>
                  <td className="label">Naam:</td>
                  <td>
                    {sampleData.firstName} {sampleData.lastName}
                  </td>
                </tr>
                <tr>
                  <td className="label">Datum:</td>
                  <td>{formatDate(sampleData.date)}</td>
                </tr>
                <tr>
                  <td className="label">Tijd:</td>
                  <td>{sampleData.time}</td>
                </tr>
                <tr>
                  <td className="label">Aantal Personen:</td>
                  <td>{sampleData.guests}</td>
                </tr>
                <tr>
                  <td className="label">Telefoonnummer:</td>
                  <td>{sampleData.phone}</td>
                </tr>
                <tr>
                  <td className="label">E-mailadres:</td>
                  <td>{sampleData.email}</td>
                </tr>
              </tbody>
            </table>
          </>
        )}

        <div className="email-footer">
          <p>
            <a href="https://mateza.be">
              <img
                src={logo}
                alt="Mateza Logo"
                style={{ width: '35px', height: '35px' }}
              />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailPreview;
