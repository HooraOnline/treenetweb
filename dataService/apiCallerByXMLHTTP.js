// import Vue from 'vue'
// import VueAxios from 'vue-axios'
// import axios from 'axios';
// Vue.use(VueAxios, axios);
// Vue.config.productionTip = false;
// //for notification
// import Toasted from 'vue-toasted'
// import { getApiData} from './liReq';

// // window.aaaa=axios
// // axios.defaults.headers.common['Authorization']="dauJBEpEUsrQNEn5t4ziyiIICJET9qvThhVutSF7EV5vf0QDCrNvrDCsCfyjrSD9";
// //axios.defaults.headers.common['Content-Type']= "application/x-www-form-urlencoded";
// //axios.defaults.headers.common['Accept']= "application/json";

// Vue.use(Toasted, {
//     duration: 3000,
//     position: 'top-center',
//     type: 'success',
//     // action: {
//     //     text: '  مشاهده شد',
//     //     onClick: (e, toastObject) => {
//     //         toastObject.goAway(0);
//     //     }
//     // }
// });
// //export const apihost = 'http://localhost:3000/api/';
// //  export const apihost = 'https://mcs.mci.ir/api/';
// export const apihost = 'http://mcs.partiatech.com/api/';


// class Api {
//     constructor() {

//     }
//     static init() {
//         Api.setHeaders();
//     }
//     static apiAddress = apihost;
//     static fileContainer = apihost + "containers/";
//     static token = "";
//     static setToken(token) {
//         Api.token = token;
//         //axios.defaults.headers.common['Authorization'] = token;
//     }
//     static setHeaders() {
//         axios.defaults.baseURL = apihost;
//         //axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';
//         // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//         // axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://localhost:8080';
//         // axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
//         // axios.defaults.headers.common['Accept'] = 'application/json';
//         // axios.defaults.headers.common['dataType'] = 'json';
//         // axios.defaults.headers.common['Access-Control-Allow-Credentials'] = true;
        

//     }

//     static getFilePath(model) {
//         return apihost + "containers/" + model + "/download/"
//     }
//     static getUri(apiPath) {
//         let uri = apihost + apiPath;
//         if (!Api.token)
//             return uri;

//         let sp = '?';
//         if (uri.indexOf('?') > -1)
//             sp = '&';
//         return uri + sp + 'access_token=' + Api.token;
//     }
//     static encrypt(params){
//       let str=JSON.stringify(params);
//       let b64 = window.btoa(unescape(encodeURIComponent(str)));
//       return b64;
//     }
//     static fetchById(apiPath, params) {
//         let uri = apihost+apiPath + "/fetchById?params="+Api.encrypt(params)+ '&access_token=' + Api.token;
//         return getApiData(uri);
      
//     }

//   static fetch(apiPath, filter) {
//     let params={}
//     params.filter=filter;
//     let uri=apihost+apiPath+"/fetch?params="+Api.encrypt(params)+ '&access_token=' + Api.token;
//     return getApiData(uri);
    
//   }
//     static getCount(apiPath, filter) {
//         let params={}
//         params.filter=filter;
//         let uri=apihost+apiPath+"/getCount?params="+Api.encrypt(params)+ '&access_token=' + Api.token;
//         return getApiData(uri);
//     }
//     static saveEntity(apiPath, model) {
//         let uri=apihost+apiPath+"/save?params="+Api.encrypt(model)+ '&access_token=' + Api.token;
//         return getApiData(uri);
//     }
//     static remove(apiPath, list) {
//         let uri=apihost+apiPath+"/removeList?params="+Api.encrypt(list)+ '&access_token=' + Api.token;
//         return getApiData(uri);
//     }
//     static removeWhere(apiPath, condition) {
//         let uri=apihost+apiPath+"/removeWhere?params="+Api.encrypt(condition)+ '&access_token=' + Api.token;
//         return getApiData(uri);
//     }
   
//     static get(apiPath, params) {
//         let uri=apihost+apiPath+"?params="+Api.encrypt(params)
//         if(Api.token)
//           uri=uri+ '&access_token=' + Api.token;
//         return getApiData(uri);
//     }
//     //for upload files by html file input send me files array from=>event.target.files in
//     static upload(files, uploadFolder, uploadingFunc) {
//         let fd = new FormData();
//         let uploadedfiles = [];
//         for (let i = 0; i < files.length; i++) {
//             let file = files[i];
//             let temp = file.name.split('.');
//             let ext = '.' + temp[temp.length - 1];
//             let fileName = Math.floor((Math.random() * 100000000000000000000) + 1).toString() + ext;
//             uploadedfiles.push(fileName);
//             fd.append('name', fileName);
//             fd.append('photos', {
//                 uri: fileName,
//                 type: file.type,
//                 name: fileName,
//             });
//             let fileType = file.type.split('/')[0];
//             fd.append(fileType, file, fileName);

//         }
//         let uri = apihost + 'containers/' + uploadFolder + '/upload';
//         return axios.post(uri, fd, {
//             onUploadProgress: (e) => {
//                 if (uploadingFunc) {
//                     let persent = Math.floor((e.loaded / e.total) * 100);
//                     uploadingFunc(persent, uploadedfiles);
//                 }
//             }
//         }).then(response => {
//             if (response.status === 200) {
//                 response.msg = "آپلود فایل با موفقیت انجام شد";
//                 response.uploadedfiles = uploadedfiles;
//                 return response;
//             }
//             throw response;
//         })
//             .catch(error => {
//                 console.log(error);
//                 error.msg = "خطا در آپلود فایل";
//                 throw error
//             });
//     }

// }
// Api.init();
// export default Api
