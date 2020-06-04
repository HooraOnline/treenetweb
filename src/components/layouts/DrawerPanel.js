import React, {useEffect, useState,PureComponent} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {CircularProgress,Divider,CssBaseline,Drawer,ButtonBase} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuButton from "../MenuButton";
import EditIcon from '@material-ui/icons/Edit';
import {deviceWide, fetchStore, getFileDownloadURL, getWidth} from '../../utils';
import {persistStore, userStore} from '../../stores';
import Router from "next/router";
import {drawerHeaderSubTitle, drawerHeaderTitle, primary, primaryDark, gray, bgWhite} from "../../constants/colors";
import { createBrowserHistory } from "history";
import images from "../../../public/static/assets/images";
import {getImageBase64Query} from "../../network/Queries";
import ImageCacheProgress from "../ImageCacheProgress";
import accounting from "accounting";
import {Image, View} from "../../react-native";
import {observer} from "mobx-react";
import Progress from "../../react-native/Progress";
import SectionList from "../../react-native/SectionList";
const drawerWidth = 280;
const navigatorLinks = {
    SpLogin: 'SpLogin',
    FacilityManaging:'FacilityManaging',
    ContactUs: 'ContactUs',
    Main: 'Main',
    FacilityDetails: 'FacilityDetails',
    Costs: 'Costs',
    Suggestion: 'Suggestion',
    NoticBoard: 'NoticBoard',
    Units: 'Units',
    UnitsCreate: 'UnitsCreate',
    AddCost: 'AddCost',
    AddUnit: 'AddUnit',
    Lobby:'Lobby',
    AboutMonta: 'AboutMonta',
    AddSans: 'AddSans',
    Rules: 'Rules',
    Profile: 'Profile',
    Survey: 'Survey',
    Setting:'Setting',
    Payment: 'Payment',
    Period: 'Period',
    Announcement: 'Announcement',
    AnnouncementEdit: 'AnnouncementEdit',
    Years:'Years',
    IppCharge: 'IppCharge',
    PayAnnounce: 'PayAnnounce',
    Transaction: 'Transaction',
    FirstUserBalance:'FirstUserBalance',
    PayAdmin:'PayAdmin',
    User2UnitAssignment:'User2UnitAssignment',
    Account:'Account',
    AddAccount: 'AddAccount',
    AccountDisabled: 'AccountDisabled',
    PayResult:'PayResult',
    Facility: 'facility/Facility',
    AddFacility: 'facility/AddFacility',
    FacilityDisabled: 'facility/FacilityDisabled',
    AddSetting: 'AddSetting',
    AddAnnouncement: 'AddAnnouncement',
    ManualPay: 'ManualPay',
    MyUnit: 'MyUnit',
    AddMessage: 'AddMessage',
    AddSuggestion: 'AddSuggestion',
    AddRule: 'AddRule',
    AddSurvey: 'AddSurvey',
    NearMe:'NearMe',
    AboutApplication: 'AboutApplication',
    AboutUs: 'AboutUs',
    Cars: 'car/Cars',
    AddCar: 'car/AddCar',

    CarsUnit: 'car/CarsUnit',
    AllCar: 'car/AllCar',
    AllTransaction: 'AllTransaction',
    AllTransactionOfDate: 'AllTransactionOfDate',

    Magazzino: 'Magazzino',
    Parking: 'Parking',
    RentCreate:'RentCreate',
    Renting:'Renting',
    AddFacilityAdditional: 'facility/AddFacilityAdditional',
    FacilityFilter: 'facility/FacilityFilter',
    AddSchedule:'facility/AddSchedule',
    ScheduleList: 'facility/ScheduleList',
    FacilityFilterList: 'facility/FacilityFilterList',
    FacilityReservation:'facility/FacilityReservation',
    FacilityForReserve: 'facility/FacilityForReserve',
    Wallet: 'Wallet',
    ScheduleReserved: 'ScheduleReserved',
    UserScheduleReserved: 'UserScheduleReserved',
    MyReserves:'MyReserves',

};
class Header extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            userImageProgress: 0,
            userImageIndeterminate: true,
            imgFailed: false,
            width:500,
            profileImage:null,
        }
    }

    async componentDidMount() {
        this.setState({width:getWidth(),loadingImage:true}) ;
        setTimeout(()=>{
         this.setState({profileImage:userStore.UserImage});

        },200)
    }

    render() {
        const {
            name,
            apartmentName,
            roleId,
            role,
            nationalCode,
            numberOfFloors,
            numberOfUnits,
            unit,
            userUnitNumber,
            image,
            imageExists=false,
        } = this.props.headerInfo;

        const {onPress, onTransactionPress} = this.props;
        return (
            <div
                style={{
                    position: 'relative',
                    backgroundColor: primary,
                    paddingRight: 16,
                    paddingTop: 19,
                    paddingBottom: 16,
                    /*overflowY:'hidden',
                    overflowX:'hidden'*/
                }}>
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 10,
                        right: 0
                    }}
                >
                    {/*<img
                        src={images.nd_bg}
                        style={{ opacity:0.1}}
                    />*/}
                </div>
                <div
                    style={{
                        display:'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                    <ButtonBase
                        onPress={onPress}
                        disabled={persistStore.selected === 0}
                        style={{borderRadius: 46, marginLeft: 8}}>
                       {/* <ImageCacheProgress
                            style={{
                                height: 56,
                                width: 56,
                                borderRadius: 28,
                                overflow: 'hidden',

                            }}
                            resizeMode="contain"
                            src={this.state.profileImage }

                        />*/}
                        <ImageCacheProgress
                            style={{
                                height: 56,
                                width: 56,
                                borderRadius: 28,
                                overflow: 'hidden',
                            }}
                            imageStyle={{
                                height:  56,
                                width: 56 ,
                                borderRadius: 20,
                            }}
                            default_ProPic={images.default_ProPic}
                            source={{ uri: this.state.profileImage,}
                            }
                            indicator={Progress.Pie}
                            indicatorProps={{
                                size: 30,
                                borderWidth: 2,
                                color: '#ddd',
                                unfilledColor: primaryDark,
                            }}
                            resizeMode="contain"
                            onLoad={() => {
                                this.setState({imageExists: true});
                            }}

                        />
                    </ButtonBase>

                    <div style={{flex: 1}}>
                        <div style={{alignSelf: 'flex-start',flexDirection:'column'}}>
                            <span style={{
                                color: drawerHeaderTitle,
                                fontSize: 17,
                                alignSelf: 'flex-start',
                            }}>{name}</span>
                            {roleId == 1 ? (
                                <div>
                                    <span style={{fontSize: 10, color: drawerHeaderSubTitle,whiteSpace: 'nowrap'}}>
                                        {role} {apartmentName}
                                    </span>
                                    <br/>
                                    <span style={{fontSize: 12, color: drawerHeaderSubTitle}}>
                                        {numberOfFloors} طبقه،‌ {numberOfUnits} واحد
                                    </span>

                                </div>
                            ) : (
                                <div>
                                    <span style={{fontSize: 12, color: drawerHeaderSubTitle}}>
                                        {role} {roleId == 0 ? '' : 'واحد'} {userUnitNumber}
                                    </span>
                                    <span style={{fontSize: 10, color: drawerHeaderSubTitle}}>{apartmentName}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <ButtonBase
                        onPress={onPress}
                        disabled={persistStore.selected === 0}
                        style={{height: 60, paddingRight: 16, paddingLeft: 16,justifyContent: 'center',color:'#FFFFFF'}}>

                        {/*<img
                        src={images.ic_edit}
                        style={{height: 24, width: 24, tintColor: drawerHeaderTitle}}
                    />*/}
                        <EditIcon/>

                    </ButtonBase>
                </div>
                {userStore.UnitBalance != null && (
                    <ButtonBase
                        onPress={onTransactionPress}
                        style={{
                            margin: 7,
                            borderWidth: 1,
                            borderColor: userStore.UnitBalance < 0 ? fab : 'white',
                            borderRadius: 15,
                            backgroundColor: userStore.UnitBalance < 0 ? 'rgba(255, 193, 7, 0.5)' : 'rgba(255, 255, 255, 0.24)',
                            marginTop: 16,
                            marginLeft: 16,
                        }}
                    >
                        <div style={{
                            display:'flex',
                            flexDirection: 'row',
                            paddingRight: 16,
                            paddingLeft: 8,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <div style={{flex: 1}}>
                                <span style={{
                                    paddingVertical: 10,
                                    color: drawerHeaderTitle,
                                    fontSize: 12,
                                    alignSelf: 'flex-start',
                                }}>حسابداری</span>
                            </div>


                            <span style={{
                                color: drawerHeaderTitle,
                                fontFamily:'IRANYekanBold(FaNum)',
                                fontSize: 15,
                                writingDirection: 'ltr',
                            }}>
                                {userStore.UnitBalance === 0 ? 'حسابی ندارید' : accounting.formatMoney(userStore.UnitBalance, '', 0, ',')}
                            </span>
                            {userStore.UnitBalance !== 0 && (
                                <span style={{
                                    color: drawerHeaderTitle,
                                    fontSize: 12,
                                }}> {userStore.CurrencyID}</span>
                            )}
                            <div style={{marginTop: 5}}>
                                <Image
                                    source={images.ic_left}
                                    style={{
                                        height: 24,
                                        width: 24,
                                        tintColor: bgWhite
                                    }}
                                />
                            </div>

                        </div>
                    </ButtonBase>
                )}
            </div>
        );
    }


}
const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: drawerWidth,
    },
    title: {
        //flexGrow: 1,
    },
    hide: {
        display: 'none',
    },
    menuItems: {
        display: 'flex',
        'flex-direction': 'row',
        'justify-content': 'flex-end'
    },
    drawer: {
        //width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        //display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        //marginRight: -drawerWidth,
    },
    contentShift: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: drawerWidth,
    },
}));


const MenuBar=observer(props=> {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [menuItems, setMenuItems] = React.useState([]);
    const [width, setWidth] = useState(900);
    const [isWide, setIsWide] = useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
        props.onClose && props.onClose()
    };

    const initDrawerData = async () => {
        await fetchStore();
        let nonGroupedItem = [];
        let items=[];
        userStore.Form.map(item => {
            if (item.hasShow) {
                if (item.formID < 0) {
                    items.push({
                        title: item.persianName,
                        items: userStore.Form.filter(filterItem => filterItem.parentID === item.formID && filterItem.hasShow),
                    });
                } else if (!item.parentID) {
                    nonGroupedItem.push(item);
                }
            }
        });
        if (nonGroupedItem.length > 0) {
            groupedItem.push({ title: 'سایر', data: nonGroupedItem });
        }

        setMenuItems(items);
    }

    const onRoleSelected=(role)=>{

        initDrawerData();
        props.onRoleSelected && props.onRoleSelected(role)
    }
    const logout=()=>{

        persistStore.token=null;
        let browserHistory = createBrowserHistory();
        browserHistory.replace({ firstPage: true });
        Router.prefetch('/login');
    }
    useEffect(() => {

        if (menuItems.length==0){
            initDrawerData();
        }
        setWidth(getWidth());
        setIsWide(deviceWide());
        props.onRef && props.onRef(initDrawerData);
    }, [userStore.Form.length]);

    let  userFormLength=1;

    const {
        RoleID,
        RoleName,
        BuildingName,
        NameOfUser,
        NumberOfFloors,
        NumberOfUnits,
        UnitNumber,
        NationalCode,
        Form,
    } = userStore;
    return (
        <div className={classes.root}>
            <CssBaseline />

            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="right"
                open={props.open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                {/*<div style={{display:'flex', width:'100%',height:150, alignItems:'center',justifyContent:'flex-start',backgroundColor:primaryDark}}>


                    <img
                        style={{ height: "100px", width: "100px", borderRadius:25, display: "block" }}
                        src="../static/assets/images/theme/Default_ProPic.png"
                    />
                    <span style={{
                        color: drawerHeaderTitle,
                        fontFamily:  'IRANYekanBlack',
                        fontSize: 17,}} >{userStore.NameOfUser}</span>
                </div>*/}
                <Header
                    headerInfo={{
                        name: NameOfUser,
                        apartmentName: BuildingName,
                        roleId: RoleID,
                        role: RoleName,
                        nationalCode: NationalCode,
                        numberOfFloors: NumberOfFloors,
                        numberOfUnits: NumberOfUnits,
                        userUnitNumber: UnitNumber,
                    }}
                    onPress={() => this.goToProfile()}
                    onTransactionPress={() => this.goToTransaction()}

                />
                {!isWide &&(
                    <div style={{padding:10}}  onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </div>
                )}

                <div style={{flex:1, backgroundColor: 'fefefe' }}>
                    <SectionList
                        headerStyle={{backgroundColor:'#FFFFFF'}}
                        chidStyle={{backgroundColor:'#FFFFFF'}}
                        items={menuItems}
                        renderSectionHeader={(item, index) => (
                            <div style={{display:"flex"}}>
                                <span key={index} style={{fontSize:12,color:gray}} >{item.title}</span>
                                <img
                                    style={{ height: "25px", width: "25px", display: "block",position:'absolute',left:0,top:16 }}
                                    src="../static/assets/images/theme/ic_expand.png"
                                />
                            </div>
                        )
                        }
                        renderItem={(child, section, index) =>{
                            if(!child.destination)
                                return null;

                            return (
                                <MenuButton
                                    key={child.destination}
                                    path={navigatorLinks[child.destination]}
                                    label={child.persianName}
                                    icon={child.icon}
                                />
                            )
                        }
                        }
                    />

                </div>
                <Divider />
                <div onClick={logout}  style={{cursor: 'pointer', display:'flex',alignItems:'center',justifyContent:'center', width:'100%',height:50,padding:10,marginBottom:'5%' }}>
                    <img
                        style={{ height: "25px", width: "25px", display: "block",position:'absolute',right:'9%' }}
                        src="../static/assets/images/theme/ic_nd_logout.png"
                    />
                    <span style={{ fontSize:14,padding:10}} > خروج از حساب کاربری</span>
                </div>

            </Drawer>



        </div>
    );
})

export default  MenuBar;
