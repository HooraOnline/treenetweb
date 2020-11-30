import React, {PureComponent} from 'react';
import {
    Animated,
    FlatList,
    Image,
    Keyboard,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from '../react-native';
import PropTypes from 'prop-types';
import {
    borderSeparate,
    checkIcon,
    drawerItem,
    overlayColor,
    primaryDark,
    subTextItem,
    textItem,
} from '../constants/colors';

import images from "../../public/static/assets/images";
import SearchBox from './SearchBox';


export default class ListMultiSelect extends PureComponent {
    constructor() {
        super();
        this.init = false;
        this.animatedFromBottom = new Animated.Value(0);
        this.animatedExpandValue = new Animated.Value(0);
        this.state = {
            selectedItems: [],
            dialogVisible: false,

        };

    }



    onCheck(id,index) {
        if (this.state.selectedItems.includes(id)) {
            this.setState({ selectedItems: this.state.selectedItems.filter( item => item !== id, ), });

        } else {
            this.setState({selectedItems: [...this.state.selectedItems, id]});

        }

    }

    selectAll(items) {
        if (this.state.selectedItems.length > 0) {
            this.setState({selectedItems: []});

        } else {
            const selectedArr = [];
            items.map((item,index) => {
                selectedArr.push(item[this.props.idItem]);
            });
            this.setState({selectedItems: selectedArr});

        }
    }

    animateSnake(open, fn) {
        Animated.parallel([
            Animated.timing(
                this.animatedExpandValue, {
                    toValue: open ? 1 : 0,
                    duration: 500,
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

    onAccept=()=> {
        let selectedIndex=[];
        let selectedEntity=[];
        this.state.selectedItems.map((id)=>{
            this.props.items.map((item,index)=>{
                if(id==item[this.props.idItem]){
                    selectedIndex.push(index);
                    selectedEntity.push(item)
                }
            })
        });
        this.animateSnake(false, () => {
            this.props.onAccept(this.state.selectedItems,selectedIndex,selectedEntity);
            this.setState({dialogVisible: false});
        })
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
            selectedItems,
            selectedIcon,
            selectedTitle,
            primaryColor = primaryDark,
            fieldItem,
            numColumns,
        } = this.props;

        const animateTranslateY = this.animatedFromBottom.interpolate({
            inputRange: [0, 1],
            outputRange: [550, 0],
        });

        let animateExpandRotate = this.animatedExpandValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg'],
        });

        return (
            <View style={[{flex:1},this.props.style]}>
                <TouchableOpacity
                    style={[styles.button,this.props.buttonStyle, {
                        flex: 1,
                        opacity: disabled ? .3 : 1,
                        borderColor: disabled ? '#777' : validation ? subTextItem : primaryColor,
                    }]}
                    onPress={() => {
                        Keyboard.dismiss();
                        this.setState({dialogVisible: true, selectedItems: selectedItems});
                        this.animateSnake(true, () => {
                        });
                    }}
                    disabled={disabled}
                >
                    {selectedItemCustom ? (
                        selectedItemCustom
                    ) : (
                        <View style={{flexDirection: 'row', flex: 1}}>
                            { selectedIcon &&
                            <Image
                                source={selectedIcon}
                                style={{
                                    marginHorizontal: 8,
                                    marginVertical: 8,
                                    height: 24,
                                    width: 24,
                                    tintColor: subTextItem,
                                }}
                            />
                            }

                            <Text
                                style={{
                                    fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
                                    paddingVertical: 8, marginStart: 8,
                                }}>
                                {selectedTitle}
                            </Text>

                        </View>
                    )}

                    {this.props.hideExpandImage!==true &&
                    <Animated.Image
                        source={images.ic_expand}
                        style={{
                            height: 24,
                            width: 24,
                            tintColor: textItem,
                            transform: [{rotate: animateExpandRotate}],
                        }}
                    />
                    }

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
                            backgroundColor: overlayColor,
                        }}>
                            <TouchableWithoutFeedback
                                onPress={() => this.animateSnake(false, () => this.setState({dialogVisible: false}))}>
                                <View
                                    style={{
                                        flex: 1,
                                        backgroundColor: overlayColor,
                                        opacity: 0.6,
                                        ...StyleSheet.absoluteFillObject,
                                    }}
                                    pointerEvents={'auto'}
                                />
                            </TouchableWithoutFeedback>
                            <Animated.View
                                style={{
                                    transform: [{translateY: animateTranslateY}],
                                    borderTopStartRadius: 20,
                                    borderTopEndRadius: 20,
                                    backgroundColor: 'white',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        borderBottomWidth: 1,
                                        borderColor: borderSeparate,
                                        flex: 1,
                                    }}>

                                    <TouchableOpacity
                                        onPress={() => this.animateSnake(false, () => this.setState({dialogVisible: false}))}
                                        style={{
                                            justifyContent: 'center',
                                            paddingHorizontal: 16,
                                            paddingTop: 30,
                                            paddingBottom: 21,
                                        }}>
                                        <Image
                                            source={images.ic_close}
                                            style={{height: 24, width: 24, tintColor: textItem}}
                                        />
                                    </TouchableOpacity>

                                    <Text
                                        style={{
                                            fontFamily: Platform.OS === 'ios' ? 'IRANYekan-Medium' : 'IRANYekanMedium',
                                            fontSize: 20,
                                            marginTop: 24,
                                            flex: 1,
                                        }}
                                    >{title}</Text>

                                    <Text
                                        style={{
                                            fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
                                            fontSize: 12,
                                            color: drawerItem,
                                            marginTop: 31,
                                            marginEnd: 16,
                                        }}>{this.state.selectedItems.length}/{items.length}</Text>

                                </View>
                                {search && (
                                    <SearchBox placeHolder="جستجو"/>
                                )}

                                <TouchableOpacity
                                    onPress={() => this.selectAll(items)}
                                    style={{}}
                                >
                                    <View style={styles.row}>
                                        <Image
                                            source={this.state.selectedItems.length === items.length ? images.checked_icon : images.unchecked_icon}
                                            style={{
                                                height: 24,
                                                width: 24,
                                                tintColor: this.state.selectedItems.length === items.length ? primaryDark : checkIcon,
                                            }}
                                        />

                                        <Text style={{
                                            flex: 1,
                                            alignSelf: 'flex-start',
                                            fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
                                            fontSize: 12,
                                            color: drawerItem,
                                            marginStart: 16,
                                            marginVertical: 10,
                                        }}>انتخاب همه</Text>
                                    </View>
                                </TouchableOpacity>

                                <FlatList
                                    keyExtractor={(item, index) => index.toString()}
                                    data={items}
                                    numColumns={numColumns}
                                    extraData={this.state.selectedItems.length}
                                    renderItem={({item,index}) => (
                                        <TouchableOpacity
                                            onPress={() => this.onCheck(item[idItem],index)}
                                            style={[{flex:1},this.props.listStyle]}
                                        >
                                            {itemComponent ? (
                                                itemComponent(item,index,this.state.selectedItems.includes(item[idItem]))
                                            ) : (
                                                <View style={styles.row}>
                                                    <Image
                                                        source={this.state.selectedItems.includes(item[idItem]) ? images.checked_icon : images.unchecked_icon}
                                                        style={{
                                                            height: 24,
                                                            width: 24,
                                                            tintColor: this.state.selectedItems.includes(item[idItem]) ? primaryDark : checkIcon,
                                                        }}
                                                    />

                                                    <Text style={{
                                                        flex: 1,
                                                        alignSelf: 'flex-start',
                                                        fontSize:12,
                                                        color: drawerItem,
                                                        marginStart: 16,
                                                        marginVertical: 16,
                                                    }}>{item[fieldItem]}</Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    )}
                                />


                                <TouchableOpacity
                                    style={{
                                        backgroundColor: primaryDark,
                                        alignItems: 'center',
                                        margin: 24,
                                        borderRadius: 10,
                                    }}
                                    onPress={this.onAccept}
                                >
                                    <Text style={{
                                        fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
                                        fontSize:14,
                                        paddingVertical: 10,
                                        color: 'white',
                                    }}>ثبت</Text>
                                </TouchableOpacity>

                            </Animated.View>
                        </View>
                    </Modal>
                </TouchableOpacity>
            </View>

        );
    }
}

ListMultiSelect.propTypes = {
    idItem: PropTypes.string,
    fieldItem: PropTypes.string,
};

ListMultiSelect.defaultProps = {
    idItem: 'id',
    fieldItem: 'persianName',
};

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 24,
        borderBottomWidth: 1,
        borderColor: borderSeparate,
        paddingStart: 8,
    },
    rowTitle: {
        flex: 1,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 4,
        borderRadius: 10,
        borderWidth: 1,
    },
});

