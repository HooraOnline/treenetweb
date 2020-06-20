//import Vue from 'vue'
import axios from 'axios';
//Vue.use(axios);
//Vue.config.productionTip = false;
//for notification
//import Toasted from 'vue-toasted'
import { decipher,cipher } from './pdk/utils';
import {getCookie, showMassage} from "../src/utils";
import translate from "../src/language/translate";
import {persistStore} from "../src/stores";
import version from "../src/version";

// axios.defaults.headers.common['Authorization']="dauJBEpEUsrQNEn5t4ziyiIICJET9qvThhVutSF7EV5vf0QDCrNvrDCsCfyjrSD9";
//axios.defaults.headers.common['Content-Type']= "application/x-www-form-urlencoded";
//axios.defaults.headers.common['Accept']= "application/json";

/*Vue.use(Toasted, {
    duration: 4000,
    position: 'top-center',
    type: 'success',
    // action: {
    //     text: '  مشاهده شد',
    //     onClick: (e, toastObject) => {
    //         toastObject.goAway(0);
    //     }
    // }
});*/



export const apihost = version.release ? "https://treenetserver.herokuapp.com/api/" : 'http://192.168.1.161:3000/api/';
let isSetToken=false;
class Api {
    constructor() {

    }
    static init() {
        Api.setHeaders();
    }
    static apiAddress = apihost;
    static fileContainer = apihost + "containers/";
    static token = "";

    static  setHeaders = (token)=> {
        axios.defaults.baseURL = apihost;
        // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        // axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        // axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
        // axios.defaults.headers.common['Accept'] = 'application/json';
        // axios.defaults.headers.common['dataType'] = 'json';
        // axios.defaults.headers.common['Access-Control-Allow-Credentials'] = true;
    }
    static setToken=async (token)=>{
       if(!axios.defaults.headers.common['Authorization'] || axios.defaults.headers.common['Authorization'].length<20){
            persistStore.token=token || await getCookie('token');
            axios.defaults.headers.common['Authorization'] =  'Bearer ' + persistStore.token;
       }
    }
    static getFilePath(model) {
        return apihost + "containers/" + model + "/download/"
    }
    static getUri= (apiPath)=> {
        let uri = apihost + apiPath;
        return uri;
    }
    static encrypt(param){
      let str=JSON.stringify(param);
      //let b64 = window.btoa(unescape(encodeURIComponent(str)));
      //return b64;
      return cipher("privatekey4673")(encodeURIComponent(str));
    }

    static get=async (apiPath, urlparams)=> {
        await this.setToken();
        let uri = Api.getUri(apiPath, '?');
        let urlparameters = urlparams ? { params: urlparams } : undefined;

        return axios.get(uri, urlparameters)
            .then(function (response) {
                if (response.status === 200)
                    return response.data;
                throw response;
            })
            .catch(function (error) {
                console.log(error);
                throw error
            });
    }
    static getCount=async (apiPath, params)=> {
        await this.setToken();
        let uri =  apiPath + "/count?params="+params;
        return axios.get(uri)
            .then(function (response) {
                if (response.status === 200)
                    return response.data;
                throw response;
            })
            .catch(function (error) {
                console.log(error);
                throw error
            });
    }
    static post=async (apiPath, model)=> {
        await this.setToken();
        let uri =  apiPath;
        //model={value:Api.encrypt(model)};
        return axios.post(uri, model)
            .then(function (response) {
                if (response.status === 200)
                    return response.data;
                throw response;
            })
            .catch(function (error) {
                console.log(error);
                if(error.response && error.response.status==401){
                    showMassage(translate('عدم دسترسی'),'info');
                    throw error;
                    return;
                }

                if(error.response && error.response.data && error.response.data.error && error.response.data.error.key){
                    showMassage(translate( error.response.data.error.key),'info');
                    throw error;
                    return;
                }
                if(error.response.data){
                    console.log(error.response.data)
                }
                throw error;

            });
    }
    static put(apiPath, item) {
        let uri = Api.getUri(apiPath + '/' + item.id);
        item.udate = new Date();
        item.updatebypost = true;
        return axios.put(uri, item)
            .then((response) => {
                if (response.status === 200) {
                    response.msg = "عملیات با موفقیت انجام شد";
                    return response;
                }
                return response;
            })
            .catch(error => {
                console.log(error);
                error.msg = "خطا در انجام عملیات";
                throw error

            });
    }

    static remove(apiPath, list) {
        let uri =  apiPath + "/removeList";
        return axios.post(uri, list)
            .then(function (response) {
                if (response.status === 200)
                    return response.data;
                throw response;
            })
            .catch(function (error) {
                console.log(error);
                throw error
            });
    }
    static removeWhere(apiPath, condition) {
        let uri =  apiPath + "/removeWhere";
        return axios.post(uri, condition)
            .then(function (response) {
                if (response.status === 200)
                    return response.data;
                throw response;
            })
            .catch(function (error) {
                console.log(error);
                throw error
            });
    }

    static delete(apiPath, id) {
        let uri = Api.getUri(apiPath + '/' + id);
        return axios.delete(uri)
            .then((response) => {
                if (response.status === 200) {
                    response.msg = "عملیات با موفقیت انجام شد";
                    return response;

                }
                throw response;
            })
            .catch(error => {
                console.log(error);
                error.msg = "خطا در انجام عملیات";
                throw error
            });
    }

    //for upload files by html file input send me files array from=>event.target.files in
    static upload(files, uploadFolder, uploadingFunc) {
        let fd = new FormData();
        let uploadedfiles = [];
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let temp = file.name.split('.');
            let ext = '.' + temp[temp.length - 1];
            let fileName =Math.floor(Date.now())+ ext;
            uploadedfiles.push(fileName);
            fd.append('name', fileName);
            fd.append('photos', {
                uri: fileName,
                type: file.type,
                name: fileName,
            });
            let fileType = file.type.split('/')[0];
            fd.append(fileType, file, fileName);

        }
        let uri = apihost + 'containers/' + uploadFolder + '/upload';
        return axios.post(uri, fd, {
            onUploadProgress: (e) => {
                if (uploadingFunc) {
                    let persent = Math.floor((e.loaded / e.total) * 100);
                    uploadingFunc(persent, uploadedfiles);
                }
            }
        }).then(response => {
            if (response.status === 200) {
                response.msg = "آپلود فایل با موفقیت انجام شد";
                response.uploadedfiles = uploadedfiles;
                return response;
            }
            throw response;
        })
            .catch(error => {
                console.log(error);
                error.msg = "خطا در آپلود فایل";
                throw error
            });
    }

    static uploadSmallFile(files, uploadFolder, uploadingFunc) {
        let fd = new FormData();
        let uploadedfiles = [];
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let temp = file.name.split('.');
            let ext = '.' + temp[temp.length - 1];
            let fileName = Math.floor((Math.random() * 100000000000000000000) + 1).toString() + ext;
            uploadedfiles.push(fileName);
            fd.append('name', fileName);
            fd.append('photos', {
                uri: fileName,
                type: file.type,
                name: fileName,
            });
            let fileType = file.type.split('/')[0];
            fd.append(fileType, file, fileName);

        }
        let uri = apihost + 'containers/uploadSmallFile';
        return axios.post(uri, fd, {
            onUploadProgress: (e) => {
                if (uploadingFunc) {
                    let persent = Math.floor((e.loaded / e.total) * 100);
                    uploadingFunc(persent, uploadedfiles);
                }
            }
        }).then(response => {
            if (response.status === 200) {
                response.msg = "آپلود فایل با موفقیت انجام شد";
                response.uploadedfiles = uploadedfiles;
                return response;
            }
            throw response;
        })
            .catch(error => {
                console.log(error);
                error.msg = "خطا در آپلود فایل";
                throw error
            });
    }

}
Api.init();
export default Api
