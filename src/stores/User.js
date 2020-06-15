import {action, observable} from 'mobx';

class UserStore {
    @observable cUser=null;
    @observable userID= null ;
    @observable username= null ;
    @observable beforloginDate=null;
    @observable biarthDate= null ;
    @observable birthDate= null ;
    @observable displayName= null ;
    @observable firstName= null ;
    @observable gender= null ;
    @observable invitationCode=null ;
    @observable lastName=null ;
    @observable location=null ;
    @observable loginDate=null ;
    @observable mobile=null ;
    @observable mobileVerified=null ;
    @observable permissionList=null ;
    @observable regentId=null ;
    @observable roleList=null ;
    @observable token=null ;
    @observable udate=null ;

    @action
    setUser(user) {
        this.user=user;
        this.userID= user.id ;
        this.username= user.username ;
        this.beforloginDate=user.beforloginDate;
        this.biarthDate= user.biarthDate ;
        this.birthDate= user.birthDate ;
        this.displayName= user.displayNme ;
        this.firstName= user.firstName ;
        this.gender= user.gender ;
        this.invitationCode=user.invitationCode ;
        this.lastName=user.lastName ;
        this.location=user.location ;
        this.loginDate=user.loginDate ;
        this.mobile=user.mobile ;
        this.mobileVerified=user.mobileVerified ;
        this.permissionList=user.permissionList ;
        this.regentId=user.regentId ;
        this.roleList=user.roleList ;
        this.token=user.user ;
        this.udate=user.udate ;
    }

    @action
    findPermission(itemId) {
        let permission=this.Form.find(o => o.formID === itemId);
        return permission;
    }

    @action
    setUnitBalance(unitBalance) {
        this.UnitBalance = unitBalance ? parseFloat(unitBalance) : null;
    }

    clear() {
        this.cUser=null,
        this.userID= null ;
        this.username= null ;
        this.beforloginDate=null;
        this.biarthDate= null ;
        this.birthDate= null ;
        this.displayName= null ;
        this.firstName= null ;
        this.gender= null ;
        this.invitationCode=null ;
        this.lastName=null ;
        this.location=null ;
        this.loginDate=null ;
        this.mobile=null ;
        this.mobileVerified=null ;
        this.permissionList=null ;
        this.regentId=null ;
        this.roleList=null ;
        this.token=null ;
        this.udate=null ;
    }
}

const userStore = new UserStore();

export default userStore;
export {UserStore};
