// src/components/AvatarSelection/AvatarSelection.jsx

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAvatar } from '../../Redux/actions/avatarActions';
import { avatars, avatarNames } from './avatars';
import { useTranslation } from 'react-i18next';
import './css/avatarSelection.css';

const AvatarSelection = ({ onSelectAvatar }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatarPosition, setAvatarPosition] = useState({ initialTop: 0, initialLeft: 0 });
  const [avatarTransform, setAvatarTransform] = useState({ deltaX: 0, deltaY: 0 });
  const [isReverting, setIsReverting] = useState(false);
  const [accountName, setAccountName] = useState('');
  const avatarRefs = useRef([]);
  const { t } = useTranslation("accountOnboarding");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [titleText, setTitleText] = useState(t('chooseAnAvatar'));
  const [subtitleText, setSubtitleText] = useState(t('Step 2/3'));

  useEffect(() => {
    if (selectedAvatar !== null && !isReverting) {
      setSubtitleText(t('Step 3/3'));
      setTitleText(t('chooseAccountName'));
    } else if (isReverting) {
      setSubtitleText(t('Step 2/3'));
      setTitleText(t('chooseAnAvatar'));
    }
  }, [selectedAvatar, isReverting, t]);

  useEffect(() => {
    const handleResize = () => {
      if (selectedAvatar !== null) {
        const avatarElement = avatarRefs.current[selectedAvatar];
        if (!avatarElement) return;

        const rect = avatarElement.getBoundingClientRect();
        const initialTop = rect.top;
        const initialLeft = rect.left;
        const avatarWidth = avatarElement.offsetWidth;
        const avatarHeight = avatarElement.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const centerLeft = viewportWidth / 2 - avatarWidth / 2;
        const centerTop = viewportHeight / 2 - avatarHeight / 2;
        const deltaX = centerLeft - initialLeft;
        const deltaY = centerTop - initialTop;

        setAvatarPosition({ initialTop, initialLeft });
        setAvatarTransform({ deltaX, deltaY });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedAvatar]);

  const handleSelectAvatar = (index) => {
    if (selectedAvatar === index || isReverting) return;

    const avatarElement = avatarRefs.current[index];
    if (!avatarElement) return;

    const rect = avatarElement.getBoundingClientRect();
    const initialTop = rect.top;
    const initialLeft = rect.left;
    const avatarWidth = avatarElement.offsetWidth;
    const avatarHeight = avatarElement.offsetHeight;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const centerLeft = viewportWidth / 2 - avatarWidth / 2;
    const centerTop = viewportHeight / 2 - avatarHeight / 2;
    const deltaX = centerLeft - initialLeft;
    const deltaY = centerTop - initialTop;
    
    setAvatarPosition({ initialTop, initialLeft });
    setAvatarTransform({ deltaX, deltaY });
    setSelectedAvatar(index);
  };

  const handleRevertAvatar = () => {
    if (selectedAvatar === null || isReverting) return;

    setIsReverting(true);

    setTimeout(() => {
      setSelectedAvatar(null);
      setAvatarPosition({ initialTop: 0, initialLeft: 0 });
      setAvatarTransform({ deltaX: 0, deltaY: 0 });
      setIsReverting(false);
    }, 1000);
  };

  const goToNextPage = () => {
    onSelectAvatar(selectedAvatar);

    if (accountName.trim() === '') {
      alert(t('pleaseEnterAccountName'));
      return;
    }

    localStorage.setItem('loginSuccessful', 'true');
    dispatch(setAvatar(avatarNames[selectedAvatar]));
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="avatar-page avatar-page-container">
      <div className="avatar-title-and-selection">
        <h4 className="avatar-subtitle">{subtitleText}</h4>
        <h1 className="avatar-title">{titleText}</h1>
        <div className="avatar-selection-container">
          {avatars.map((avatar, index) => (
            <button
              key={index}
              className={`avatar-button ${
                selectedAvatar === index
                  ? isReverting
                    ? 'reverting'
                    : 'selected'
                  : selectedAvatar !== null
                  ? 'hidden'
                  : ''
              }`}
              onClick={() => handleSelectAvatar(index)}
              ref={(el) => (avatarRefs.current[index] = el)}
              style={
                selectedAvatar === index && !isReverting
                  ? {
                      position: 'fixed',
                      top: avatarPosition.initialTop,
                      left: avatarPosition.initialLeft,
                      transform: `translate(${avatarTransform.deltaX}px, ${avatarTransform.deltaY}px) scale(2)`,
                      zIndex: 10,
                      transition: 'transform 1s, top 1s, left 1s',
                    }
                  : {}
              }
            >
              <img
                src={avatar}
                alt={`${t('avatar')} ${index + 1}`}
                className={`avatar-image ${
                  selectedAvatar === index && !isReverting ? 'miraculous' : ''
                }`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'path_to_placeholder_image';
                }}
              />
            </button>
          ))}
          {selectedAvatar !== null && (
            <input
              type="text"
              className={`account-input ${selectedAvatar !== null ? 'visible' : ''}`}
              placeholder={t('enterAccountName')}
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          )}
        </div>
        {selectedAvatar !== null && (
          <div className="button-group">
            <button className="previous-button visible" onClick={handleRevertAvatar} disabled={isReverting}>
              {t('previous')}
            </button>
            <button className="next-button visible" onClick={goToNextPage} disabled={isReverting}>
              {t('next')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarSelection;
