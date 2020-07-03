import {action, observable} from 'mobx';
import {persist} from 'mobx-persist';

class PersistStore {
    @persist @observable locale = null;

    @persist @observable token = null;

    @persist @observable userRegisterbefor = false;
    @persist @observable notChangePassword = false;
    @persist @observable apiToken = null;
    @persist @observable userLanguageKey = 'fa';
    @persist @observable userLanguageId = 3;
    @persist @observable isRtl = true;
    @persist @observable direction = 'dir';
    @persist @observable showMenu=true

    @persist @observable selected = 0;

    @persist('list') @observable roles = [];

    @persist @observable username = null; // TODO : MUST BE DELETED


    @observable pushID = null;

    @persist paymentId = null;

    @action clearStore() {
        this.token = null;
        this.apiToken = null;
        this.selected = 0;
        this.username = null;
        this.paymentId = null;
        this.locale = null;

    }
    @action
    setAuthToken(token) {
        this.token = token;
    }
}

const persistStore = new PersistStore();

export default persistStore;
export {PersistStore};
