import {action, observable} from 'mobx';
import {PersistStore} from "./PersistStore";

class PublicStore {

    @observable cUser={};
    @observable sebsetList=[];
    @observable leavesCount=0;
    @observable branchesCount=0;

    @action
    setUser(user) {
        this.cUser=user;
    }

    @action
    findPermission(itemId) {
        let permission=this.Form.find(o => o.formID === itemId);
        return permission;
    }

    @action
    setUnitBalance(unitBalance) {
        this.UnitBalance = unitBalance ? parseFloat(unitBalance) : 0;
    }

    clear() {
        this.token='' ;
        this.cUser=null;

    }
}


const pStore = new PublicStore();

export default pStore;
export {PublicStore};

