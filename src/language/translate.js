 import {fa} from "./fa";
 import {en} from "./en";
 import {ar} from "./ar"
 import {ch} from "./ch"
 import {tu} from "./tu"
 import {saveCookie} from "../utils";
 let dictionary =Object.assign(fa,en,ar,ch,tu);

 //temp**************************
 global.slanguage = 'en';
 global.isRtl = false;
 saveCookie('lng', {index:0,title: 'English',key:'en',rtl:false});
 //temp************************

const translate=(keyword)=> {
     let key=`${global.slanguage}_${keyword}`;
     return  dictionary[`${key}`] || keyword;
}

export default translate;


