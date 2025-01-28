import React from 'react';

const ProfileHeader = ({
  profileImage,
  name,
  dateOfBirth,
  bio,
  editing,
  setEditing,
  handleSaveProfile,
  handleAvatarClick,
  setName,
  setDateOfBirth,
  setBio
}) => {
  return (
    <div className="profile-page__header">
      <div className="profile-page__header-content">
        <div className="profile-page__profile-pic-container" onClick={handleAvatarClick}>
          <img src={profileImage} alt="Profile" className="profile-page__profile-pic" />
        </div>
        {editing ? (
          <div className="profile-page__edit-form">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Name"
              className="profile-page__input"
            />
            <input
              type="date"
              value={dateOfBirth}
              onChange={e => setDateOfBirth(e.target.value)}
              placeholder="Date of Birth"
              className="profile-page__input"
            />
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Bio"
              className="profile-page__textarea"
            />
            <button onClick={handleSaveProfile} className="profile-page__button">Save</button>
          </div>
        ) : (
          <div className="profile-page__bio">
            <h2>{name}</h2>
            <p>{bio}</p>
            <button onClick={() => setEditing(true)} className="profile-page__button">Edit Profile</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
