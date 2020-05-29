import React, {PureComponent} from 'react';
import {
    Animated,
    Image,
    //LayoutAnimation,
    Platform,
    SectionList,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from '../src/react-native';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {bgEmpty, bgScreen, border, borderSeparate, drawerItem, primaryDark} from '../src/constants/colors';
import {
    AlertMessage,
    AndroidBackButton,
    CostCard,
    Fab,
    IOSSwipeCard,
    LoadingPopUp,
    Overlay,
    Toolbar
} from '../src/components';
import images from "public/static/assets/images";
import {globalState, userStore} from '../src/stores';
import {permissionId} from '../src/constants/values';
import {addCostQuery, getCostEditQuery, getCostQuery, removeCostQuery} from '../src/network/Queries';
//import Collapsible from 'react-native-collapsible';
import {onScrollFab} from '../src/utils';
//import {NavigationEvents} from 'react-navigation';

class HeaderList extends PureComponent {
    constructor() {
        super();
        this.animatedExpandValue = new Animated.Value(0);
    }

    componentDidMount() {
        this.animateExpand(false);
    }

    animateExpand(isExpand) {
        Animated.spring(
            this.animatedExpandValue, {
                toValue: isExpand ? 1 : 0,
                duration: 500,
                // friction: 3,
                // tension: 40,
                useNativeDriver: true,
            }).start();
    }

    render() {
        const {item, onHeaderPress, isExpand,style} = this.props;
        this.animateExpand(isExpand);
        let animateExpandRotate = this.animatedExpandValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg'],
        });
        return (
            <TouchableWithoutFeedback  onPress={() => onHeaderPress(item.title)}>
                <View style={[{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 8,
                    paddingStart: 16,
                    paddingEnd: 8,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: borderSeparate,
                    marginHorizontal: 16,
                    marginTop: 16,
                    marginBottom: 8,
                },style]}>

                    <Text style={{
                        flex: 1,
                        fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
                        fontSize: 16,
                        color: border,
                    }}>{item.title}</Text>

                    <Animated.Image
                        source={images.ic_expand}
                        style={{
                            tintColor: border,
                            height: 24,
                            width: 24,
                            transform: [{rotate: animateExpandRotate}],
                        }}
                    />

                </View>

            </TouchableWithoutFeedback>
        );
    }

}

@observer
export default class Costs extends PureComponent {
    @observable confirmList = [];

    constructor() {
        super();
        // this.costs = [];
        this.announceIds = [];
        this.fixedLength = 0;
        this.variableLength = 0;
        this.incomeLength = 0;
        this.state = {
            showOverlay: false,
            showInfoAnnouncePopup: false,
            showLastDatePopup: false,
            permission: userStore.findPermission(permissionId.costCalculation),
            loading: false,
            loadingMessage: '',
            isFabVisible: true,
            costList: [],

            hasNotAnnounced: false,

            announceTitle: '',
            announceRecordNumber: null,
            announceLastPayDate: '2019-05-08',
            lastItemPadding:100,
        };
    }

    componentDidMount() {
        this.init();
    }

    groupBy(array, key) {
        return array.reduce((objectsByKeyValue, obj) => {
            const value = obj[key];
            objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
            return objectsByKeyValue;
        }, {});
    }

    init() {
        this.setState({loading: true, loadingMessage: 'در حال دریافت ...'});
        getCostQuery()
            .then(result => {
                console.log(result);
                const hasNotAnnounced = !!result.find(o => !o.HasAnnounced);
                result.map(o => {
                    if (!o.HasAnnounced) {
                        const costClassId = parseInt(o.CostClassID);
                        costClassId === 1 ?
                            ++this.fixedLength : costClassId === 2 ?
                            ++this.variableLength : ++this.incomeLength;
                    }
                });

                const section = Object.values(this.groupBy(result, 'PeriodDetailID')).map(o => {
                    return {title: o[0].PeriodName, data: o};
                });
                this.setState({costList: section, hasNotAnnounced: hasNotAnnounced});
            })
            .catch(e => this.setState({costList: []}))
            .finally(() => this.setState({loading: false}));
    }



    onHeaderPress = title => {
        this.setState({
            activeSection: this.state.activeSection === title
                ? ''
                : title,
        });
    };
    scrollToLast(section){
        if(this.state.costList[this.state.costList.length-1]==section)
            setTimeout(()=>this.setState({lastItemPadding:0}),300)
        else
            this.setState({lastItemPadding:100});
    }
    removeCost=item=>{
        this.setState({selectedItem:item, removeCostDialogShow:true})
    }

    async confirmDeleteCost() {
        console.log(this.state.selectedItem);
        let costId=this.state.selectedItem.CalculationHeaderID;
        globalState.showBgLoading();
        await removeCostQuery(costId)
            .then(() => {
                //this.setState({loading: false});
                //this.props.navigation.goBack();
                this.init();
                globalState.showToastCard();
            })
            .catch(e => {
                globalState.showToastCard();
            })
            .finally(() => globalState.hideBgLoading());
        this.setState({removeCostDialogShow:false})
    }
    render() {
        const toolbarStyle = {
            start: {
                onPress: this.onBackPress.bind(this),
                content: images.ic_back,
            },
            title: 'هزینه‌های ساختمان',
            end: (this.state.costList.length > 0 && this.state.hasNotAnnounced) ? {
                onPress: this.goToAnnouncement.bind(this),
                icon: images.ic_broadcast,
            } : null,
        };

        return (
            <View style={{flex: 1, backgroundColor: this.state.costList.length > 0 ? bgScreen : bgEmpty}}>
                <Toolbar customStyle={toolbarStyle}/>
               {/* <NavigationEvents onWillFocus={payload => {
                    if (payload.action.type === 'Navigation/BACK') {
                        this.init();
                    }
                }}/>*/}
                <AndroidBackButton
                    onPress={() => {
                        if (this.state.loading) {
                            return true;
                        } else if (this.state.showOverlay) {
                            this.setState({
                                showOverlay: false,
                                nominatedToDeleteItem: null,
                            });
                        } else if (this.state.selectingCosts) {
                            this.setState({selectingCosts: false});
                        } else {
                            this.onBackPress();
                        }
                        return true;
                    }}
                />

                <SectionList
                    stickySectionHeadersEnabled={false}
                    initialNumToRender={10}
                    style={{flex: 1,marginTop:0}}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={(
                        <View
                            style={{
                                height: global.height - 90,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Image
                                // resizeMode='center'
                                source={images.es_Inbox}
                                style={{width: global.width, height: global.width / 100 * 62}}
                            />
                            <Text style={{
                                marginTop: 32,
                                fontFamily: Platform.OS === 'ios' ? 'IRANYekan-ExtraBold' : 'IRANYekanExtraBold',
                                fontSize: 18,
                                textAlign: 'center',
                            }}>هیچ هزینه‌ای ثبت نشده!</Text>
                            <Text style={{
                                fontSize: 14,
                                color: drawerItem,
                                marginHorizontal: 24,
                                textAlign: 'center',
                            }}>شما هنوز هزینه یا درآمدی برای ساختمان ثبت نکرده‌‎اید.
                            </Text>

                            <View style={{marginTop: 24}}>
                                <Fab
                                    onPress={this.addNewCost.bind(this)}
                                    icon={images.ic_add}
                                    title={'ساخت هزینه'}
                                />
                            </View>
                        </View>
                    )}
                    sections={this.state.costList}
                    extraData={this.state.loading}
                    onScroll={this.onScrollFab}
                    ref={(sectionList) => { this.sectionList = sectionList }}
                    renderSectionHeader={(section) => (
                        <HeaderList
                            style={{marginBottom:this.state.costList[this.state.costList.length-1]==section?section.title !== this.state.activeSection?100:this.state.lastItemPadding:0}}
                            item={section}
                            onHeaderPress={title => {
                                this.onHeaderPress(title);
                                this.scrollToLast(section);
                            }}
                            isExpand={section.title === this.state.activeSection}
                        />
                    )}
                    renderItem={(item, section,index) => (
                        <IOSSwipeCard
                            noPadding
                            style={{  marginHorizontal: 24,marginTop:section.title === this.state.activeSection?10:0}}
                            //disabled={ this.state.payState!=FILTER__TRANSACTION}
                            index={index}
                            permission={this.state.permission}
                            onMore={(!item.HasAnnounced && !item.ParentID)?()=>{this.removeCost(item)}:null}
                            moreIcon={images.ic_delete}
                            moreLabel={'حذف'}
                            moreColor={'red'}
                            moreDisabled={true}
                            moreBtnCorner={true}
                            onClose={() => {
                                this.setState({isOpen: true});
                            }}
                            onOpen={id => {
                                this.setState({isOpen: false, idSwipeOpened: id});
                            }}
                            idSwipeOpened={this.state.idSwipeOpened}
                        >
                          {/*  <Collapsible
                                key={item}
                                style={{  marginHorizontal: -24,}}
                                collapsed={section.title !== this.state.activeSection}>*/}

                                    <CostCard
                                        cost={item}
                                        permission={this.state.permission}
                                        navigateToEdit={cost => this.goToEditCost(cost)}
                                    />

                           {/* </Collapsible>*/}
                        </IOSSwipeCard>

                    )}
                />


                {this.state.costList.length > 0 && this.state.isFabVisible && this.state.permission.writeAccess && (
                    <View
                        pointerEvents="box-none"
                        style={{
                            ...StyleSheet.absoluteFillObject,
                            alignItems: this.state.costList.length > 0 ? 'flex-end' : 'center',
                            justifyContent: 'flex-end',
                            flex: 1,
                            marginEnd: 16,
                            marginBottom: 24,
                        }}
                    >
                        <Fab
                            onPress={this.addNewCost.bind(this)}
                            icon={images.ic_add}
                        />
                    </View>
                )}
                {this.state.showOverlay && (
                    <Overlay
                        catchTouch={true}
                        onPress={this.dismiss.bind(this)}
                    >
                        {/*{this.state.showInfoAnnouncePopup && (
                            <InfoAnnouncePopUp
                                onSubmitAnnounce={info => this.onSubmitAnnounce(info)}
                            />
                        )}*/}
                        {/* {this.state.showLastDatePopup && (

                        )}*/}
                    </Overlay>
                )}
                {this.state.removeCostDialogShow && (
                    <AlertMessage
                        visible={this.state.removeCostDialogShow}
                        title="حذف هزینه"
                        message={
                            'آیا از حذف هزینه ' + this.state.selectedItem.CostTypeName + ' مطمئن هستید؟'
                        }
                        onConfirm={() => {
                            this.confirmDeleteCost();
                        }}
                        onDismiss={() => this.setState({removeCostDialogShow:false})}
                        confirmTitle="بله"
                        dismissTitle="خیر"
                    />
                )

                }

                <LoadingPopUp visible={this.state.loading} message={this.state.loadingMessage}/>

            </View>
        );
    }

    onBackPress() {
        this.props.navigation.goBack();
    }

    dismiss() {
        this.setState({
            showOverlay: false,
            showInfoAnnouncePopup: false,
        });
    }

    goToAnnouncement() {
        console.warn("$$$$$$$$$ goToAnnouncement this.fixedLength: ", this.fixedLength);
        console.warn("$$$$$$$$$ goToAnnouncement this.variableLength: ", this.variableLength);
        console.warn("$$$$$$$$$ goToAnnouncement this.incomeLength: ", this.incomeLength);
        if (
            (this.fixedLength > 0 && this.variableLength > 0) ||
            (this.fixedLength > 0 && this.incomeLength > 0) ||
            (this.variableLength > 0 && this.incomeLength > 0)
        ) {
            this.props.navigation.navigate('Announcement', {fromCost: true});
        } else {
            this.props.navigation.navigate('AddAnnouncement', this.fixedLength > 0 ?
                {type: {id: 1, Name: 'ثابت', title: 'اعلان هزینه ثابت'}, fromCost: true} : this.variableLength > 0 ?
                    {type: {id: 2, Name: 'متغیر', title: 'اعلان هزینه متغیر'}} : {type: {id: 3, Name: 'درآمد', title: 'اعلان درآمد'}}
            );
        }
    }

    async goToEditCost(cost) {
        this.setState({loading: true, loadingMessage: 'در حال دریافت جزئیات ...'});
        await getCostEditQuery(cost.CalculationHeaderID)
            .then(result => {
                Object.assign(cost, {CostTypeDetailName: result[0].CostTypeDetailName});
                Object.assign(cost, {detail: JSON.parse(result[0].Datas)});
                if(result[0].InstallmentData)
                 Object.assign(cost, {InstallmentData: JSON.parse(result[0].InstallmentData)});
                this.props.navigation.navigate('AddCost', {cost});
            })
            .catch(e => globalState.showToastCard())
            .finally(() => this.setState({loading: false}));
    }


    addNewCost() {
        this.props.navigation.navigate('AddCost'); //, {onConfirm: item => this.setSwitchValue(item),}
    }

    onScrollFab = (event) => {
       /* const fabStatus = onScrollFab(event, this._listViewOffset);
        this._listViewOffset = fabStatus.currentOffset;
        if (fabStatus.isFabVisible !== this.state.isFabVisible) {
            LayoutAnimation.configureNext(fabStatus.customLayoutLinear);
            this.setState({isFabVisible: fabStatus.isFabVisible});
        }*/
    };

    async onConfirmDelete() {
        this.setState({loading: true, loadingMessage: 'در حال حذف هزینه ...'});
        const {
            CostType_ID,
            Description,
            TotalPrice,
            OwnerOfCost,
            ForUnit,
            CalculateType_ID,
            Apartment_ID,
            HasConfirmed,
            CostHeader_ID,
        } = this.state.nominatedToDeleteItem;
        const newItem = {
            id: CostHeader_ID,
            costType_ID: CostType_ID,
            description: Description,
            totalPrice: TotalPrice,
            ownerOfCost: OwnerOfCost,
            forUnit: ForUnit,
            calculateType_ID: CalculateType_ID,
            apartment_ID: Apartment_ID,
            hasConfirmed: HasConfirmed,
            isDisabled: true,
        };
        await addCostQuery(newItem)
            .then(() => {
                this.setState({
                    showOverlay: false,
                    nominatedToDeleteItem: null,
                    selectingCosts: false,
                });
                this.init();
            })
            .catch(e => {
            }).finally(() => this.setState({loading: false}));
    }
}

const styles = StyleSheet.create({
    buttonIn: {
        flex: 1,
        borderWidth: 0.5,
        alignItems: 'center',
        borderRadius: 4,
        height: 33,
        justifyContent: 'center',
        marginLeft: 7,
        marginRight: 7,
    },
});
