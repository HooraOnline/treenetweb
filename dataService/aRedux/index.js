import { combineReducers } from 'redux';
import * as publicActions from './publicActions';
import * as memberActions from './memberActions';
import * as pubicReducers from './pubicReducers';


export const ActionCreators = Object.assign({},
  publicActions,
  memberActions
);

export default combineReducers(Object.assign(
  pubicReducers
));