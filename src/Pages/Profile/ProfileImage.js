// src/components/Profile/ProfileImage.jsx

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAvatar } from '../../Redux/actions/avatarActions';
import useNotification from '../../Components/Notification/index';
import './css/style.css';

const ProfileImage = ({
  profileImage,
  avatarMapping,
  imageId,
  api,
  updateAccountData,
}) => {
  const dispatch = useDispatch();
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const { triggerNotification, NotificationComponent } = useNotification();

  const handleAvatarClick = () => {
    setShowAvatarModal(true);
  };

  const handleAvatarSelectInternal = async (avatarKey) => {
    setShowAvatarModal(false);
    try {
      const updatedData = await api.put(window.baseDomain + 'api/account', { imageId: avatarKey });
      updateAccountData(updatedData);
      dispatch(setAvatar(avatarKey));
      triggerNotification('Profiel aangepast', 'success');
    } catch (error) {
      triggerNotification('Fout bij het bijwerken van profiel', 'error');
    }
  };

  // Determine the current profile image based on imageId
  const currentProfileImage = imageId && avatarMapping[imageId] ? avatarMapping[imageId] : profileImage;

  return (
    <div>
      <NotificationComponent />
      <div
        className="profile-page__image-container"
        onClick={handleAvatarClick}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter') handleAvatarClick();
        }}
        aria-label="Change profile image"
      >
        <img src={currentProfileImage} alt="Profile" className="profile-page__image" />
      </div>

      {showAvatarModal && (
        <div className="profile-page__modal" role="dialog" aria-modal="true">
          <div className="profile-page__modal-content">
            <h2>Kies een Avatar</h2>
            <div className="profile-page__avatar-grid">
              {Object.keys(avatarMapping).map((key, index) => (
                <img
                  key={key}
                  src={avatarMapping[key]}
                  alt={key}
                  className="profile-page__avatar-option"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleAvatarSelectInternal(key)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleAvatarSelectInternal(key);
                  }}
                  aria-label={`Selecteer avatar ${key}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileImage;
