import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import hands, { NAME as handsName } from 'js/features/hands';

export default combineReducers({
  routing,
  [handsName]: hands,
});
