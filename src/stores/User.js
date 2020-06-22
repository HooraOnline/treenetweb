import {action, observable} from 'mobx';

class UserStore {
    @observable cUser=null;
    @observable userID= null ;
    @observable username= null ;
    @observable beforloginDate=null;
    @observable dateYear= null ;
    @observable birthDate= null ;
    @observable displayName= null ;
    @observable firstName= null ;
    @observable gender= null ;
    @observable invitationCode=null ;
    @observable invitationLink=null ;
    @observable lastName=null ;
    @observable location=null ;
    @observable loginDate=null ;
    @observable mobile=null ;
    @observable mobileVerified=null ;
    @observable email=null ;
    @observable emailVerified=null ;
    @observable permissionList=null ;
    @observable isVerify=null ;
    @observable regentId=null ;
    @observable roleList=null ;
    @observable token=null ;
    @observable udate=null ;
    @observable countryCode=null ;
    @observable birthYear=null ;
    @observable profileImage=null ;

    @action
    setUser(user) {
        const birthYear=user.birthDate?new Date(user.birthDate).getFullYear():'';
        this.user=user;
        this.userID= user.id ;
        this.username= user.username ;
        this.profileImage= user.profileImage ;
        this.beforloginDate=user.beforloginDate;
        this.birthDate= user.birthDate ;
        this.birthYear=birthYear ;
        this.age=user.birthDate?(new Date()).getFullYear()-birthYear:'';
        this.displayName= user.displayNme ;
        this.firstName= user.firstName ;
        this.gender= user.gender ;
        this.invitationCode=user.invitationCode ;
        this.invitationLink=`https://treenetgram.com/?invitationCode=${user.invitationCode}`
        this.lastName=user.lastName ;
        this.location=user.location ;
        this.loginDate=user.loginDate ;
        this.mobile=user.mobile ;
        this.mobileVerified=user.mobileVerified ;
        this.email=user.email ;
        this.emailVerified=user.emailVerified ;
        this.isVerify=user.isVerify ;
        this.permissionList=user.permissionList ;
        this.regentId=user.regentId ;
        this.roleList=user.roleList ;
        this.token=user.user ;
        this.udate=user.udate ;
        this.countryCode=user.geoInfo?user.geoInfo.calling_code:'98';

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
        this.birthDate= null ;
        this.birthDate= null ;
        this.displayName= null ;
        this.firstName= null ;
        this.gender= null ;
        this.invitationCode=null ;
        this.invitationLink=null ;
        this.lastName=null ;
        this.location=null ;
        this.loginDate=null ;
        this.mobile=null ;
        this.mobileVerified=null ;
        this.email=null ;
        this.emailVerified=null ;
        this.isVerify=null ;
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
