import { createStore } from 'redux';
import avatarReducer from './reducers/avatarReducer';

const store = createStore(
  avatarReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // Redux dev tools
);

export default store;
