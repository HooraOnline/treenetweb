import {action, observable} from 'mobx';
import {persist} from 'mobx-persist';

class PersistStore {
    @persist @observable locale = null;

    @persist @observable token = null;
    @persist @observable showMenu=true

    @persist @observable selected = 0;

    @persist('list') @observable roles = [];

    @persist @observable username = null; // TODO : MUST BE DELETED


    @observable pushID = null;

    @persist paymentId = null;

    @action clearStore() {
        this.token = null;
        this.selected = 0;
        this.username = null;
        this.paymentId = null;
        this.locale = null;
    }
}

const persistStore = new PersistStore();

export default persistStore;
export {PersistStore};
