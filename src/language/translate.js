 import {fa} from "./fa";
 import {en} from "./en";
 import {ar} from "./ar"
 import {ch} from "./ch"
 import {tu} from "./tu"
 import {persistStore} from "../stores";
 let dictionary =Object.assign(fa,en,ar,ch,tu);


const translate=(keyword)=> {
     let key=`${persistStore.userLanguageKey || 'en'}_${keyword}`;
     return  dictionary[`${key}`] || keyword;
}

export default translate;


