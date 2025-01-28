// src/components/GiftCard/index.js

import React from 'react';
import { withHeader } from '../../../Components/Structural/Header/index.js';
import './css/giftCard.css';
import ValidationSection from './ValidationSection/index.js';
import OverviewSection from './OverviewSection/index.js';
import AddGiftCardSection from './AddGiftcardSection/index.js';

const GiftCard = () => {
  return (
    <div className="gift-card-page">
      <div className="gift-card-page__top-row">
        <div className="gift-card-page__section">
          <ValidationSection />
        </div>
        <div className="gift-card-page__section">
			    <AddGiftCardSection/>
        </div>
      </div>
      <div className="gift-card-page__bottom-row">
        <div className="gift-card-page__section">
          <OverviewSection />
        </div>
      </div>
    </div>
  );
};

export default withHeader(GiftCard);
