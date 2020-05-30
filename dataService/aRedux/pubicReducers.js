import * as storeKeys from './storeKeys'


function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}

let reduser = {}

let keys = Object.keys(storeKeys);
for (let i = 0; i < keys.length; i++) {
  reduser[keys[i]] = createReducer(storeKeys[keys[i]], {
    [keys[i]](state, action) {
      let newState = action[keys[i]];
      return newState;
    }
  });
}

//public******************************************************************
export const puplicVariable = reduser.puplicVariable;

export const isCache = reduser.isCache;
export const currentList = reduser.currentList;
export const currentEntity = reduser.currentEntity;
export const currentEntity2 = reduser.currentEntity2;
export const appConfig = reduser.appConfig;

//Hamrah Yar
 export const cUser = reduser.cUser;
 export const disignInfo = reduser.disignInfo;

 //masterPage reduser
 export const showFooter = reduser.showFooter;
 export const userHealthInfo = reduser.userHealthInfo;
