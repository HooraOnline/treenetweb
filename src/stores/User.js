import {action, observable} from 'mobx';

class UserStore {
    @observable cUser=null;
    @observable userID= null ;
    @observable username= null ;
    @observable beforloginDate=null;
    @observable dateYear= null ;
    @observable birthDate= null ;
    @observable avatar= null ;
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
    @observable regentId=null ;
    @observable roleList=null ;
    @observable token=null ;
    @observable cdate=null ;
    @observable udate=null ;
    @observable countryCode=null ;
    @observable birthYear=null ;
    @observable fullName=null ;
    @observable shortMobile=null ;
    @observable branchesCount=0 ;
    @observable leavesCount=0 ;
    @action
    setUser(user) {
        let contryCodeX=user.geoInfo?user.geoInfo.calling_code:'98';
        let birthYear=user.birthDate?new Date(user.birthDate).getFullYear():'';
        let shortMobile=user.mobile?user.mobile.replace(contryCodeX+'-',''):'';
        let seperator=user.firstName && user.lastName?' ':''
        let fullName=(user.firstName ||'') +seperator+ (user.lastName || '');
        this.user=user;
        this.userID= user.id ;
        this.username= user.username ;
        this.profileImage= user.profileImage ;
        this.inviteProfileImage=user.inviteProfileImage;
        this.avatar=user.avatar;
        this.beforloginDate=user.beforloginDate;
        this.birthDate= user.birthDate || '' ;
        this.birthYear=birthYear|| '' ;
        this.age=user.birthDate?(new Date()).getFullYear()-birthYear:'';
        this.displayName= user.displayNme|| '' ;
        this.firstName= user.firstName|| '' ;
        this.lastName=user.lastName|| '' ;
        this.fullName=fullName;
        this.gender= user.gender|| '' ;
        this.invitationCode=user.invitationCode|| '' ;
        this.invitationLink=`https://treenetgram.com/?invitationCode=${user.invitationCode}`
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
        this.token=null ;
        this.cUser=null,
        this.userID= null ;
        this.username= null ;
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
        this.permissionList=null ;
        this.regentId=null ;
        this.roleList=null ;
        this.udate=null ;
    }
}

const userStore = new UserStore();

export default userStore;
export {UserStore};
