import React, {PureComponent} from 'react';
import {
    Animated,
    FlatList, IconApp,
    Image,
    Keyboard,
    Modal,
    Platform, ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from '../../react-native';
import PropTypes from 'prop-types';
import {
    bgScreen,
    bgWhite,
    black, border,
    borderSeparate,
    checkIcon,
    drawerItem,
    gray,
    overlayColor, placeholderTextColor,
    primaryDark, subTextItem,
    textItem,
} from '../../constants/colors';

import images from "public/static/assets/images";
import SearchBox from '../SearchBox';
import {FloatingLabelTextInput} from "../index";
import {isMobile} from "../../utils";

export default class MultiSelectorDropDown extends PureComponent {
    constructor(props) {
        super(props);
        this.init = false;
        this.animatedFromBottom = new Animated.Value(0);
        this.animatedExpandValue = new Animated.Value(0);
        this.state = {
            value: props.value || [],
            selectedIndexes:[],
            selectedItems:[],
            dialogVisible: props.openInStart || false,
            dialogTop:55,
            dialogWidth:global.width,
        };
        this.myRef = React.createRef();
        this.initSelected();
    }

    componentDidMount() {
        this.props.onRef && this.props.onRef(this);
       
        setTimeout(() =>{
            //if(this.myRef.current && !this.props.snake)
              //this.setState({dialogTop:this.myRef.current.offsetTop+this.myRef.current.offsetHeight+5, dialogWidth: this.myRef.current.offsetWidth,pageHeight:this.myRef.current.offsetHeight  })
        } ,
         100);

    }

    open(){
        this.setState({dialogVisible:true});
    }

    initSelected=()=>{
        this.state.selectedIndexes=[];
        this.state.selectedItems=[];
        this.props.value.map((id) => {
            this.props.items.map((item, index) => {
                if (id===item[this.props.idItem]) {
                    this.state.selectedIndexes.push(index);
                    this.state.selectedItems.push(item);
                }
            });
        });
    };

    onValueChanged(entity, id, index) {
        if (this.state.value.includes(id)) {
            let value = this.state.value.filter(item => item !== id,);
            let selectedIndexes = this.state.selectedIndexes.filter(i => i !== index,);
            let selectedItems = this.state.selectedItems.filter(item => item[this.props.idItem] !== id,);
            this.state.value=value;
            this.state.selectedItems=selectedItems;
            this.state.selectedIndexes=selectedIndexes;
            this.setState({
                value: value,
                selectedIndexes: selectedIndexes,
                selectedItems: selectedItems
            });
        } else {
            this.state.value=[...this.state.value, id];
            this.state.selectedItems=[...this.state.selectedItems, entity];
            this.state.selectedIndexes=[...this.state.selectedIndexes, entity];
            this.setState({
                value: this.state.value,
                selectedItems: this.state.selectedItems,
                selectedIndexes: this.state.selectedIndexes,
            });
        }
        this.props.onValueChanged(this.state.value,this.state.selectedItems,this.state.selectedIndexes);
    }

    selectAll(items) {
        if (this.state.value.length > 0) {
            this.setState({value: []});

        } else {
            const selectedArr = [];
            items.map((item, index) => {
                selectedArr.push(item[this.props.idItem]);
            });
            this.setState({value: selectedArr});

        }
    }

    animateSnake(open, fn) {
        Animated.parallel([
            Animated.timing(
                this.animatedExpandValue, {
                    toValue: open ? 1 : 0,
                    duration: 500,
                    // friction: 3,
                    // tension: 40,
                    useNativeDriver: true,
                }),
            Animated.timing(
                this.animatedFromBottom,
                {
                    toValue: open ? 1 : 0,
                    duration: open ? 500 : 250,
                    useNativeDriver: true,
                },
            ),
        ]).start(fn);
    }

    onAccept = () => {
        this.setState({dialogVisible: false});
    };

    removeItem = (item) => {
        let id = item[this.props.idItem];
        let idItem = this.props.idItem;
        let value = this.state.value.filter(item => item !== id,);
        let index = this.props.items.findIndex(i => i[idItem] === id,);
        let selectedIndexes = this.state.selectedIndexes.filter(i => i !== index,);
        let selectedItems = this.state.selectedItems.filter(i => i[this.props.idItem] !== id);
        this.setState({value: value, selectedIndexes: selectedIndexes, selectedItems: selectedItems});
        this.props.onRemoveItem && this.props.onRemoveItem(value, selectedItems, selectedIndexes, item, index,)
    };

    removeAllSelecteds = () => {
        this.setState({value: [], selectedIndexes: [], selectedItems: []});
    };

   
    renderSelected=()=>{
        this.initSelected();
        const {
            fieldItem = 'Name',
        } = this.props;
        let animateExpandRotate = this.animatedExpandValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg'],
        });


        return (
            <div style={{width:'100%',}} ref={this.myRef}>
               <View
                    style={{
                        flex: 1,
                        width:'100%',
                        flexDirection: 'row',
                        borderRadius: 10,
                        borderWidth: this.state.dialogVisible?0:1,
                        borderColor: gray,
                        alignItems:'center',
                        justifyContent:'space-between',


                    }}>

                    {this.state.selectedItems.length ?

                        <FlatList
                            style={{}}
                            data={this.state.selectedItems}
                            //numColumns={2}
                            //listFormat='wrap'
                            scrollEnabled={true}
                            //flexWrap={true}
                            horizontal={true}
                            renderItem={({item, index}) =>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent:'center',
                                    marginHorizontal: 5,
                                    backgroundColor: bgScreen,
                                    borderRadius: 40,
                                    paddingVertical: 4,
                                    paddingHorizontal:3,
                                    marginTop:(Platform.OS==='web')?15:0,
                                    marginVertical:5

                                }}>
                                    {item.Icon &&(
                                        <IconApp
                                            source={'ap'+[item.Icon]}
                                            style={{
                                                height: 20,
                                                width: 20,
                                                tintColor: checkIcon,

                                            }}
                                        />
                                    )
                                    }
                                    <Text style={{whiteSpace: 'pre',paddingHorizontal: 5,fontSize: 11}}>{this.props.customSelectedItem?this.props.customSelectedItem(item):item[fieldItem]}</Text>
                                    <TouchableOpacity
                                        style={{padding: 0,}}
                                        onPress={() => this.removeItem(item, index)}
                                    >
                                        <IconApp
                                            source={'apic_deleteX'}
                                            style={{
                                                tintColor: black,
                                                width: 24,
                                                height: 24,

                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            }/>

                        :
                        <View style={{flex:1}}>
                            <Text style={{
                                color: border,
                                alignSelf: 'flex-start',
                                padding:10
                            }}>{this.props.noSelected || this.props.title}</Text>

                        </View>

                    }
                    <TouchableOpacity
                        onPress={()=>{
                            this.setState({
                                dialogVisible:!this.state.dialogVisible,
                                //dialogWidth:this.myRef.current.offsetWidth,
                                //dialogTop:this.myRef.current.offsetTop,
                            });
                        }}
                        style={{
                            alignItems:'flex-end',
                            justifyContent:'flex-start',

                            // transform: [{rotate: animateExpandRotate}],
                        }}
                    >
                        <IconApp
                            class={this.state.dialogVisible?this.state.selectedItems.length>0?'apic_done':'apic_close':'apic_edit'}
                            style={{

                                height: 24,
                                width: 24,
                                tintColor: subTextItem,
                                marginHorizontal:10,
                                //transform: [{rotate: animateExpandRotate}],
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </div>
        )
    }

    onSearch(text) {
        if(!text) return;
        text=text.replaceAll('ي','ی');
        text=text.replaceAll('ك','ک');
        this.setState({keyWord: text})
        let items = this.props.items.filter((item) => item[this.props.searchField].search(text) > -1);
        this.setState({searchItems: items})
    }

    render() {
        const {
            idItem,
            title,
            items,
            search = false,
            validation,
            disabled,
            selectedItemCustom,
            itemComponent,
            value,
            primaryColor = primaryDark,
            fieldItem = 'Name',
            numColumns,
            selectAll
        } = this.props;
        const animateTranslateY = this.animatedFromBottom.interpolate({
            inputRange: [0, 1],
            outputRange: [550, 0],
        });

        let animateExpandRotate = this.animatedExpandValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg'],
        });
        if (this.state.value.length > this.state.selectedItems.length) {
            this.state.value = this.state.selectedItems.map(item => item[this.props.idItem])
        }

        let listItems = this.state.searchItems || items;

        return (
            <div ref={this.myRef} style={this.props.style}>
                <TouchableOpacity
                    style={[styles.button, this.props.buttonStyle, {
                        flex: 1,
                        position:'relative',
                        opacity: disabled ? .3 : 1,
                        borderColor: disabled ? '#777' : validation ? gray : primaryColor,
                    }]}
                    onPress={() => {
                        Keyboard.dismiss();
                        this.setState({value: value});
                        this.animateSnake(true, () => {
                        });
                    }}
                    disabled={disabled}
                >
                    {selectedItemCustom ? (
                        selectedItemCustom
                    ) : (
                        this.renderSelected()
                    )}



                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={this.state.dialogVisible}
                        presentationStyle="overFullScreen"
                        onRequestClose={() => {
                            this.animateSnake(false, () => this.setState({dialogVisible: false}));
                        }}
                    >
                        <View style={{
                            flex: 1,
                            width:'100%',
                            alignItems: 'center',
                            backgroundColor: 'transparent',

                        }}>
                            <TouchableWithoutFeedback
                                onPress={() => this.animateSnake(false, () => this.setState({dialogVisible: false}))}>
                                <View
                                    style={{
                                        flex: 1,
                                        backgroundColor: overlayColor,
                                        opacity: 0,
                                        ...StyleSheet.absoluteFillObject,
                                    }}
                                    pointerEvents={'auto'}
                                />
                            </TouchableWithoutFeedback>
                            <View
                                style={{

                                    //borderTopStartRadius: 20,
                                    //borderTopEndRadius: 20,
                                    borderBottomEndRadius:10,
                                    borderBottomStartRadius:10,
                                    borderRadius: 0,//this.props.snake?0:10,
                                    backgroundColor: 'white',
                                    maxHeight:this.props.maxHeight || global.height /1.5,
                                    position: 'absolute',
                                    width: this.state.dialogWidth,
                                    top: this.state.dialogTop,
                                    borderWidth:1,
                                    borderColor:gray,

                                    shadowColor: '#aaa',
                                    shadowOffset: {width: 0, height: 1},
                                    shadowOpacity: 0.8,

                                }}
                            >
                                <View style={{
                                    flex:1,
                                    shadowColor: '#000',
                                    shadowOffset: {width: 0, height: 1},
                                    shadowOpacity: 0.8,

                                    minHeight:45,
                                }}>
                                    { this.renderSelected(true)}
                                </View>

                               {/* <View style={{backgroundColor:subTextItem,height:1,marginBottom:5}}/>*/}

                                {selectAll!==false &&(
                                    <TouchableOpacity
                                        onPress={() => this.selectAll(items)}
                                        style={{}}
                                    >
                                        <View style={styles.row}>
                                            <Image
                                                source={this.state.value.length === items.length ? images.checked_icon : images.unchecked_icon}
                                                style={{
                                                    height: 24,
                                                    width: 24,
                                                    tintColor: this.state.value.length === items.length ? primaryDark : checkIcon,
                                                }}
                                            />
                                            <Text style={{
                                                flex: 1,
                                                alignSelf: 'flex-start',
                                                fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
                                                fontSize: 11,
                                                color: drawerItem,
                                                marginStart: 16,
                                                marginVertical: 10,
                                            }}>انتخاب همه</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                                {this.props.searchField && (<View style={{minHeight:60,justifyContent:'center',}}>
                                    <View
                                        style={{
                                            minHeight: 38,
                                            marginTop: 10,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            borderColor: borderSeparate,
                                            borderWidth: 1,
                                            border: '1px solid #ececec',
                                            borderRadius: 10,
                                            justifyCenter: 'center',
                                            backgroundColor: '#fff',
                                            paddingHorizontal: 10,
                                            marginHorizontal: '3%',
                                            //marginBottom: 20,

                                            shadowColor: '#000',
                                            shadowOffset: {width: 0, height: 1},
                                            shadowOpacity: 0.8,

                                        }}>
                                        <IconApp
                                            source={'apic_search'}
                                            style={{
                                                tintColor: textItem,
                                                width: 24,
                                                height: 24,

                                            }}
                                        />
                                        <FloatingLabelTextInput
                                            ref="textInput"
                                            editable={true}

                                            multiline={false}
                                            maxLength={200}
                                            numberOfLines={1}
                                            floatingLabelEnable={false}
                                            underlineColor={placeholderTextColor}
                                            textInputStyle={{
                                                fontSize: 12,
                                                color: 'black',
                                                textAlign: 'right',

                                            }}
                                            underlineSize={0}
                                            labeStyle={{paddingLeft: 40, color: border}}
                                            style={{flex: 1, marginHorizontal: 10,}}
                                            placeholder={"جستجو "}
                                            onChangeText={text => this.onSearch(text)}
                                            value={this.state.keyWord}
                                        />

                                    </View>
                                </View>)
                                }
                                <ScrollView style={{width:'100%',marginBottom:24}}>
                                    <FlatList
                                        keyExtractor={(item, index) => index.toString()}
                                        data={listItems}
                                        numColumns={numColumns}
                                        extraData={this.state.value.length}
                                        renderItem={({item, index}) => (
                                            <TouchableOpacity
                                                onPress={() => this.onValueChanged(item, item[idItem], index)}
                                                style={[{flex: 1}, this.props.listStyle]}
                                            >
                                                {itemComponent ? (
                                                    itemComponent(item, index, this.state.value.includes(item[idItem]))
                                                ) : (
                                                    <View style={styles.row}>
                                                        <Image
                                                            source={this.state.value.includes(item[idItem]) ? images.checked_icon : images.unchecked_icon}
                                                            style={{
                                                                height: 24,
                                                                width: 24,
                                                                marginEnd: 10,
                                                                tintColor: this.state.value.includes(item[idItem]) ? primaryDark : checkIcon,
                                                            }}
                                                        />
                                                        {item.Icon &&(
                                                            <Image
                                                                source={images[item.Icon]}
                                                                style={{
                                                                    height: 24,
                                                                    width: 24,
                                                                    tintColor: checkIcon,

                                                                }}
                                                            />
                                                        )
                                                        }

                                                        <Text style={{
                                                            //flex: 1,
                                                            fontSize: 12,
                                                            color: drawerItem,
                                                            marginStart: 6,
                                                            marginVertical: 16,
                                                        }}>{this.props.customListItem?this.props.customListItem(item):item[fieldItem]}</Text>
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        )}
                                    />
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>
                </TouchableOpacity>
            </div>

        );
    }



}



const styles = StyleSheet.create({
    row: {
        flex: 1,
        width:'100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 24,
        borderBottomWidth: 1,
        borderColor: borderSeparate,
        paddingStart: 8,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
    },
});

