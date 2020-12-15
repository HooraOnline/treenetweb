import {action, observable} from 'mobx';

class UserStore {

    @observable cUser='';
    @observable userID= '' ;
    @observable username= '' ;
    @observable beforloginDate='';
    @observable dateYear= '' ;
    @observable birthDate= '' ;
    @observable avatar= '' ;
    @observable displayName= '' ;
    @observable fullName= '' ;
    @observable gender= '' ;
    @observable invitationCode='' ;
    @observable invitationLink='' ;
    @observable location='' ;
    @observable loginDate='' ;
    @observable mobile='' ;
    @observable mobileVerified='' ;
    @observable email='' ;
    @observable emailVerified='' ;
    @observable permissionList='' ;
    @observable regentId='' ;
    @observable roleList='' ;
    @observable token='' ;
    @observable cdate='' ;
    @observable udate='' ;
    @observable countryCode='' ;
    @observable birthYear='' ;
    @observable fullName='' ;
    @observable shortMobile='' ;
    @observable branchesCount=0 ;
    @observable leavesCount=0 ;
    @observable subsetList=[];
    @observable story='';
    @action
 
    setUser(user) {
        this.user=user;
        this.userID= user.id ;
        this.username= user.username ;
        this.userKey= user.userKey ;
        this.profileImage= user.profileImage ;
        this.inviteProfileImage=user.inviteProfileImage;
        this.avatar=user.avatar;
        this.beforloginDate=user.beforloginDate;
        this.birthDate= user.birthDate ;
        this.birthYear=user.birthYear ;
        this.age=user.birthDate?(new Date()).getFullYear()-birthYear:'';
        this.displayName= user.displayNme|| '' ;
        this.fullName= user.fullName|| '' ;
        this.fullName=user.fullName;
        this.gender= user.gender|| '' ;
        this.invitationCode=user.invitationCode|| '' ;
        this.invitationLink=user.invitationLink
        this.location=user.location ;
        this.loginDate=user.loginDate ;
        this.countryCode=contryCodeX;
        this.mobile=user.mobile|| '' ;
        this.shortMobile=shortMobile|| '',
        this.mobileVerified=user.mobileVerified ;
        this.email=user.email|| '' ;
        this.emailVerified=user.emailVerified ;
        this.permissionList=user.permissionList ;
        this.regentId=user.regentId ;
        this.roleList=user.roleList ;
        this.token=user.token ;
        this.cdate=user.cdate ;
        this.udate=user.udate ;
        this.story=user.story ;
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
        this.cUser='',
        this.userID= '' ;
        this.username= '' ;
        this.userKey='';
        this.birthDate= '' ;
        this.birthDate= '' ;
        this.displayName= '' ;
        this.fullName= '' ;
        this.gender= '' ;
        this.invitationCode='' ;
        this.invitationLink='' ;
        this.location='' ;
        this.loginDate='' ;
        this.mobile='' ;
        this.mobileVerified='' ;
        this.email='' ;
        this.emailVerified='' ;
        this.permissionList='' ;
        this.regentId='' ;
        this.roleList='' ;
        this.udate='' ;
        this.subsetList='';
    }
}

const userStore = new UserStore();

export default userStore;
export {UserStore};
