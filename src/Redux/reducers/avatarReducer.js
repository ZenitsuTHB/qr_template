const initialState = {
	avatar: localStorage.getItem('selectedAvatar') || 'blue1', // Default or stored avatar
  };
  
  const avatarReducer = (state = initialState, action) => {
	switch (action.type) {
	  case 'SET_AVATAR':
		localStorage.setItem('selectedAvatar', action.payload); // Save to localStorage
		return {
		  ...state,
		  avatar: action.payload,
		};
	  default:
		return state;
	}
  };
  
  export default avatarReducer;
  