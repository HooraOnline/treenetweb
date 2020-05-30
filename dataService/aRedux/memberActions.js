
import Api from '../apiCaller'


//data
export function registerMember(mobile) {
  return (dispatch, getState) => {
    return  Api.get('members/registerMember', null, null, member)
      .then(data => {
        if (storeKey)
          dispatch(setStateToStore(storeKey, data));
        return data;
      })
      .catch((ex) => {
        throw ex;
      });

  }
}



