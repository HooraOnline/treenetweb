
import Api from '../apiCaller'
// import simpleContacts from 'react-native-simple-contacts';
//utility
export function getContact() {
  return (dispatch, getState) => {
    return simpleContacts.getContacts()
      .then(contactList => {
        let contacts = JSON.parse(contactList);
        dispatch(setStateToStore("contactList", contacts));
        return contactList;
      })
      .catch((ex) => {
        throw ex;
      });

  }
}

//data
export function callApi(apiPath,urlParams, storeKey, model, filterParams) {
  return (dispatch, getState) => {
    return Api.get(apiPath, model, filterParams, urlParams)
      .then(data => {
        if (storeKey)
          doDispatch(storeKey, data);
        return data;
      })
      .catch((ex) => {
        throw ex;
      });
  }
}
export function fetchById(apiPath, storeKey, id, fetchParams, fromCache) {
  return (dispatch, getState) => {
    // let state = getState();
    // if (fromCache && state.isCache[storeKey])
    //   return new Promise(function (resolve, reject) {
    //     resolve(state[storeKey]);
    //   })
    // if (storeKey) state.isCache[storeKey] = true;
    return Api.getById(apiPath, id, fetchParams)
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
export function fetchList(apiPath, storeKey, condition, sort,limit,skip, fromCache) {
  return (dispatch, getState) => {
    let state = getState();
    if (fromCache && state.isCache[storeKey])
      return new Promise(function (resolve, reject) {
        resolve(state[storeKey]);
      })
    if (storeKey) state.isCache[storeKey] = true;
    return Api.fetchCollection(apiPath, condition, sort,limit,skip)
      .then(list => {
        if (storeKey)
        doDispatch(storeKey, list)
        return list;
      })
      .catch((ex) => {
        throw ex;
      });
  }
}
export function fetchPagedList(apiPath, storeKey, condition, sort,pageIndex,pageSize) {
  return (dispatch, getState) => {
    //let state = getState();
    let limit=pageSize || 10;
    let skip=(pageIndex || 0) * (pageSize || 10);
    return Api.fetchCollection(apiPath, condition, sort,limit,skip)
      .then(list => {
        if (storeKey){
          doDispatch(storeKey, list);
        }
        return list;
      })
      .catch((ex)=>{
        throw ex;
      });
  }
}
export function getCount(apiPath, storeKey, condition, fromCache) {
  return (dispatch, getState) => {
    let state = getState();
    if (fromCache && state.isCache[storeKey])
      return new Promise(function (resolve, reject) {
        resolve(state[storeKey]);
      })
    if (storeKey) state.isCache[storeKey] = true;
    return Api.getCount(apiPath, condition)
      .then(count => {
        if (storeKey)
          dispatch(setStateToStore(storeKey, count));
        return count;
      })
      .catch((ex) => {
        throw ex;
      });

  }
}
export function addEntity(apiPath, model, storeKey, freshCountStoreKey) {
  return (dispatch, getState) => {
    return Api.post(apiPath, model)
      .then(function (addedModel) {
        if (!storeKey)
          return addedModel[0];
        dispatch(setStateToStore(storeKey, addedModel[0]));
        if (freshCountStoreKey) {
          var state = getState();
          let oldCount = state[freshCountStoreKey];
          dispatch(setStateToStore(freshCountStoreKey, oldCount + 1));
        }
        return addedModel[0];
      })
      .catch((ex) => {
        throw ex;
      });
  }
}
export function addList(apiPath, listForAdd, storeKey, storeList, freshCountStoreKey) {
  return (dispatch, getState) => {
    return Api.post(apiPath, listForAdd)
      .then(function (addedList) {
        if (!storeKey)
          return addedList;
        if (!storeList) {
          var state = getState();
          storeList = state[storeKey];
        }
        storeList = listForAdd.concat(storeList);
        dispatch(setStateToStore(storeKey, storeList));
        if (freshCountStoreKey) {
          var state = getState();
          let oldCount = state[freshCountStoreKey];
          dispatch(setStateToStore(freshCountStoreKey, oldCount + listForAdd.length));
        }
        return addedList;
      })
      .catch((ex) => {
        throw ex;
      });

  }
}
export function updateEntity(apiPath, model, modelStoreKey,list, listStoreKey) {
  return (dispatch, getState) => {
    return Api.put(apiPath, model).then(editedModel => {
      if (modelStoreKey)
        dispatch(setStateToStore(modelStoreKey, editedModel));
      if (listStoreKey) {
        if (model.id) {
          let index = list.findIndex(item => item.id === model.id);
          list[index] = editedModel;
          dispatch(setStateToStore(listStoreKey, []));
          
          dispatch(setStateToStore(listStoreKey, list));
        } else {
          dispatch(setStateToStore(listStoreKey, list.concat([editedModel])));
        }

      }
      return editedModel;
    }).catch((ex) => {
      throw ex;
    });
  }
}
export function updateList(apiPath, list, storeKey) {
  for (let i = 0; i < list.length; i++)
    return updateEntity(apiPath, list[i], storeKey);
}
export function updateByCondition(apiPath, condition, newValues, storeKey) {
  return (dispatch, getState) => {
    return Api.updateByCondition(apiPath, condition, newValues)
      .then(count => {
        if (storeKey)
          dispatch(setStateToStore(storeKey, count));
        return count;
      })
      .catch((ex) => {
        throw ex;
      });

  }
}
//filrer={id:id}
export function deleteById(apiPath, id, listStoreKey) {
  return (dispatch, getState) => {
    return Api.delete(apiPath, id).then(res => {
      if (res.count) {
        if (listStoreKey) {
          let list = getState()[listStoreKey];
          let index = list.findIndex(item => item.id === id);
          list.splice(index, 1);
          dispatch(setStateToStore(listStoreKey, list));
        }
        return true;
      }

      else
        return false;
    }).catch((ex) => {
      throw ex;
    });
  }
}
//بدلیل رعایت امنیت بخش سرور غیر فعال شده
export function deleteByCondition(apiPath, condition) {
  return (dispatch, getState) => {
    return Api.deleteByCondition(apiPath, condition).then(res => {
      if (res.count)
        return true;
      else
        return false;
    }).catch((ex) => {
      throw ex;
    });
  }
}


export function doDispatch(storeKey, value) {
  return (dispatch, getState) => {
    dispatch(setStateToStore(storeKey, value));
  }
}
export function setStateToStore(storeKey, value) {
  return {
    type: storeKey,
    [storeKey]: value,
  }
}
export function clearStore() {
  return (dispatch, getState) => {
    let state = getState();
    let stateList = Object.keys(state);
    stateList.forEach(function (s) {
      if (typeof (state[s]) == 'boolean')
        state[s] = false;
      else if (typeof (state[s]) == 'string')
        state[s] = "";
      else if (state[s].push)
        state[s] = [];
      else if (typeof (state[s]) == 'number')
        state[s] = 0;
      else if (typeof (state[s]) == 'object')
        state[s] = {};
    });
  }
}


