// src/utils/validationUtils.js

export const validateAccountData = (formData) => {
	const errors = {};
  
	if (!formData.first_name.trim()) {
	  errors.first_name = 'Voornaam is verplicht.';
	}
  
	if (!formData.last_name.trim()) {
	  errors.last_name = 'Achternaam is verplicht.';
	}
  
	if (!formData.phone_number.trim()) {
	  errors.phone_number = 'Telefoonnummer is verplicht.';
	} else if (!/^\+?\d{10,15}$/.test(formData.phone_number)) {
	  errors.phone_number = 'Voer een geldig telefoonnummer in.';
	}
  
	if (!formData.street.trim()) {
	  errors.street = 'Straat is verplicht.';
	}
  
	if (!formData.house_number.trim()) {
	  errors.house_number = 'Huisnummer is verplicht.';
	}
  
	if (!formData.city.trim()) {
	  errors.city = 'Stad is verplicht.';
	}
  
	if (!formData.postal_code.trim()) {
	  errors.postal_code = 'Postcode is verplicht.';
	} 
	if (!/^[1-9]\d{3}$/.test(formData.postal_code)) {
	  errors.postal_code = 'Voer een geldige Belgische postcode in.';
	}
  
	if (!formData.restaurant_name.trim()) {
	  errors.restaurant_name = 'Naam restaurant is verplicht.';
	}
  
	return errors;
  };
  