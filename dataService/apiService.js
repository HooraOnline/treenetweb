
//created by by saeed yousefi
import Api from './apiCaller'
import { cipher } from './pdk/utils';
import { persistStore, userStore} from "../src/stores";
import {deleteCookie, fetchStore, navigation, showMassage,} from "../src/utils";
import fetch from "isomorphic-unfetch";
import axios from 'axios';
import pStore, {Store} from "../src/stores/PublicStore";

export let currentUser = {};
//urlparams={username:1232}
export const callPostApi = function (apiPath, params) {

  return Api.post(apiPath, params)
};
export const callGetApi = function (apiPath, urlparams) {
  return Api.get(apiPath, urlparams)
};
//for One
export const getById = function (apiPath, id, filds, include) {
  let params = {};
  params.filter = {};
  params.id = id;
  params.filter.fields = filds;
  params.filter.include = include;
  return Api.get(apiPath, params)

};



export const postQuery = function (apiPath, entity,storKey) {
    entity.udate = new Date();
  if (!entity.id)
    entity.cdate = new Date();

  return Api.post(apiPath, entity)
      .then(res=>{
          if(storKey) pStore[storKey]=res;
         return res
      });
};


//for list
/*example
apiPath='members'
   simple filter=> filter={sellerId:"5abc818c36a12033f4dd2eaf"}
   and & or filter=> filter={and:[{sellerId:"5abc818c36a12033f4dd2eaf"},{or:[{amount:500},{amount:300}]}]}

   simple order=> order="amount asc";
    2 or more field order=> order=["step DESC","amount desc"];


    includes
    {include: 'relatedModel'}
    {include: ['relatedModel1', 'relatedModel2', ...]}
    {include: {relatedModel1: [{relatedModel2: 'relationName'} , 'relatedModel']}}
    simple include=get user by his posts=>'posts'
    include 2 =get user by his orders and posts=>['posts', 'orders']
    include 3=get order by its owner=>{owner: 'orders'}
    http://mcs.partiatech.com/api/comments/5c31bead58146848bd7f1b5c?filter[include]=module
    http://mcs.partiatech.com/api/customers?filter[include][reviews]=author&filter[where][age]=21

    advance include examples=>
   1-
    {
    relation: 'customer', // include the customer
      scope: { // further filter the customer object
        fields: ['username', 'email'], // only show two fields
        include: { // include orders for the customer
          relation: 'orders',
          scope: {
            where: {orderId: 5} // only select order with id 5
          }
        }
    }

    2-Post.findById('123', {
        include: {
          relation: 'orders',
          scope: { // fetch 1st "page" with 5 entries in it
            skip:0,
            limit:5
          }
        }
      }, function() { });
 3-Post.find({include: {owner: [{posts: 'images'} , 'orders']}}, function(err, posts) {
      posts.forEach(function(post) {
        // post.owner points to the relation method instead of the owner instance
        var p = post.toJSON();

      });

});

    fields
    fields=> {id: true, title: true, image: true}

  */
export const getList = function (apiPath, condition, fields, include, sort, page, pageSize) {
  let param = {};
  let pageIndex = page ? page - 1 : 0;
  param.where = condition || {};
  param.fields = fields;
  param.include = include;
  param.order = sort || "id desc";
  param.limit = pageSize || 1000;
  param.skip = param.limit * pageIndex || 0;
  let params = '?filter=' + encodeURIComponent(JSON.stringify(param));
  apiPath = apiPath + params;
  return Api.get(apiPath, param);
};
export const saveEntity = function (apiPath, entity) {
  entity.udate = new Date();
  if (!entity.id)
    entity.cdate = new Date();
  return Api.post(apiPath, entity);
};
export const addList = function (apiPath, entityList) {

  entityList.map((entity) => { entity.udate = new Date();; entity.cdate = new Date(); })
  return Api.post(apiPath, entityList);
};
export const updateList = function (apiPath, entityList) {
  return Api.post(apiPath, entityList);
};
//condition={isSeen:false} newValue={isSeen:true}
export const updateByCondition = function (apiPath, newValue) {
  return Api.put(apiPath + "/update", newValue).then((res) => res.count);

};
export const removeEntity = function (apiPath, id) {
  return Api.remove(apiPath, { "ids": [id] });
};
//ids=["3213","12321"]
export const removeList = function (apiPath, ids) {
  return Api.remove(apiPath, { "ids": ids });
};
//condition={isSeen:false}
export const removeByCondition = function (apiPath, condition) {
  return Api.removeWhere(apiPath, condition);
};
export const softDelete = function (apiPath, id) {
  let entity = { id: id, isDeleted: true };
  return Api.saveEntity(apiPath, entity);
};

//utility service
export const upload = function (files, folderName, uploadingFunc) {
  return Api.upload(files, folderName, uploadingFunc);
};
export const uploadSelectorFiles = function (selector) {
  return Api.upload(selector.files, selector.uploadFolder, function (persent, uploadedfiles) {
    selector.uplodedPersent = persent;
    selector.onUploading && selector.onUploading(persent, uploadedfiles, selector);
    if (persent === 100)
      selector.onUploaded && selector.onUploaded(uploadedfiles, selector)
  });
};
//for upload files in filesArray
export const multyUpload = function (selectors, successUploadAllFunc, fialUploadAll, index, uploadedfiles) {
  let ufiles = uploadedfiles || [];
  let index2 = index || 0;
  if (!selectors[index2]) {
    successUploadAllFunc && successUploadAllFunc(1);
    return;
  }

  let selector = selectors[index2];
  if (selector.files.length === 0)
    multyUpload(selectors, successUploadAllFunc, fialUploadAll, ++index2, ufiles);
  else {
    uploadSelectorFiles(selector)
      .then((uploadedfiles, selector) => {
        ufiles.push(uploadedfiles);
        multyUpload(selectors, successUploadAllFunc, fialUploadAll, ++index2, ufiles);
      })
      .catch((e) => {
        fialUploadAll && fialUploadAll(e, selector)
      })
  }

};
export const getServerFilePath = function (folder) {
  return Api.getServerFilePath(folder);
};
export const getFileUri = function (folder, imageName) {

  let path = Api.fileContainer + folder + '/download/' + imageName;
  return path;
};
function arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = [].slice.call(new Uint8Array(buffer));

    bytes.forEach((b) => binary += String.fromCharCode(b));

    return window.btoa(binary);
};
 export const getImageBase64Api=async (folder, imageName)=> {

     const headersSetting={
         'Access-Control-Allow-Origin': '*',
         'Accept'        : 'application/json',
         'Content-Type'  : 'application/json',
         'Authorization' : 'Bearer ' +  persistStore.apiToken,
     }

     let requestURL=getFileUri(folder, imageName);
     try{
         const response = await fetch(requestURL, {
             headers: headersSetting,
             method: 'GET'
         });
         if (response.status === 200) {

             let imageStr
             imageStr = arrayBufferToBase64(response.body);
             return await 'data:image/jpeg;base64,'+imageStr;
         }
     }
     catch (e) {

     }

 }
        export const saveInCoolkie = function (key, object, secend) {
  let obj = JSON.stringify(object);
  //VueCookies.set(key, obj, secend);
};

//user service

export const loginApi_OLD = function (username, password) {
  username = cipher(password)(username);
  password = cipher(username)(password);

  return callPostApi("Members/loginMember", { username: username, password: password })
    .then(response => {
      let member = response;
      if (!member.isActive) {
        //response.msg = "اکانت شما غیر فعال شده است";
        throw response;
      }
      const userRoles = member.roles;
      const adminRoles = member.roles.filter(role => role.name == 'admin');
      if (adminRoles.length == 0) {
        //response.msg = "شما ادمین نیستید، در صورت تلاش بیشتر اکانت شما مسدود می شود.";
        throw response;
      }

      currentUser = member;
      saveInCoolkie("userPT209873366", { username: username, password: password }, 60 * 60 * 1 * 1);// s m h d

      Api.setToken(member.token, member.username);
      //مقابله با هک با تغییر رسپانس
      return isSafeUser(member)
        .then(() => {
          return member;
        })
        .catch((e) => {
          throw e;
        })


    })
    .catch(e => {
      e.msg = "عدم موفقیت، لطفا دوباره تلاش کنید";
      throw e;
    })
};
export const isSafeUser = function (user) {

  return getById("members", user.id, null, 'roles')
    .then(member => {
      const adminRoles = member.roles.filter(role => role.name == 'admin');
      if (adminRoles.length != 0 && user.username == member.username && user.email == member.email && user.mobile == member.mobile) {
        return member;
      }
      //response.msg = "تغییر رسپانس توسط هکر";
      throw response;
    })
    .catch(e => {
      throw 1114;
    });
};

export const setCurrentUser = function (user) {
  return currentUser = user;
};

export const sendEmailApi = function (email, subject, text) {
  return saveEntity("Messages/sendMessage", {
    from: "Treenet.",
    to: email,
    subject: subject,
    text: text
  })
};
export const changePasswordApi = function (member) {
  let newPass = Math.floor(Math.random() * 1000000).toString();
  member.password = newPass;
  member.tempPassword = newPass;
  return saveEntity("members", member)
    .then((res) => {
      res.newPassword = newPass;
      return res;
    });
};
export const resetPasswordApi = function (email) {
  return callGetApi('Members/resetUserPassword', { email: email })
    .then((res) => {
      res.msg = "عملیات با موفقیت انجام شد.";
      // this.$toasted.show("عملیات با موفقیت انجام شد.", { type: "success" });
      // sendEmail(member.email, "پسورد جدید", "پسورد جدید شما برای سیستم همراه " + res.newPassword + " می باشد، ای پسورد موقتی بوده و اکیدا توصیه می جهت حفظ امنیت بلافاصله بعد از ورود پسورد خود را تغییر دهید. ")
    })
    .catch((err) => {
      err.msg = "خطا در انجام عملیات .";
    })
};


//**************************************user******************************************


let leavesCount=0
const calculateCount=(user)=>{
    leavesCount=leavesCount+user.subsets.length;
    for(let i=0;i<user.subsets.length;++i){
        calculateCount(user.subsets[i]);
    }
}
const calculateTotalSubsetsCount=(subsets)=>{
    for(let p=0;p<subsets.length;++p){
        calculateCount(subsets[p]);
    }
}

//for get current user



export const loginApi= function (username,password,mobile) {
  return  postQuery('Members/me/login',{username,password,mobile})
      .then(user=>{
          persistStore.apiToken=user.token;
          Api.setToken(user.token);
          return user;
      })

}
export const logoutApi=function (username,password) {
    if(persistStore.notChangePassword){
        showMassage('قبل از خروج، نام کاربری و رمز عبور خود را با لمس نوار زرد رنگ بالا عوض کنید.','info')
        return;
    }
    navigation.navigate('home');
    persistStore.clearStore();
    userStore.clear();

}

export const getUserProfileApi = function (fields, include) {
    let params = {};
    params.filter = {};
    //params.userId22 = userId;
    params.filter.fields = fields;
    params.filter.include = include;
    return  Api.get('members/me/getProfile', params)
        .then(user=>{
            pStore.cUser=user;
            persistStore.notChangePassword=user.notChangePassword;
            getUserSubsetApi()
                .then(subsetList=>{
                    leavesCount=0;
                    pStore.subsetList=subsetList;
                    calculateTotalSubsetsCount(subsetList);
                    pStore.branchesCount=subsetList.length;
                    pStore.leavesCount=leavesCount;

                })
                .catch(err=>{
                    //this.setState({loading:false});
                });
            return user
        }).catch((error)=>{
            debugger
            if(error.errorKey=='fa_server_member_user_notExist'){
                persistStore.notChangePassword=true;
                persistStore.userRegisterbefor=false;

            }
            persistStore.clearStore();
            navigation.navigate('login');

        })

};
export const getUserSubsetApi = (userId)=> {
    let params = {};
    if(userId) params.userId=userId;
    //params.filter = {};
    //params.filter.fields = fields;
    //params.filter.include = include;
    return  Api.post('members/me/getSubsetList', params)
        .then(subsetlist=>{
            return subsetlist;
        });
};







