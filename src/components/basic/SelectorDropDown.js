import React, { PureComponent } from 'react';
import {
    Animated,
    FlatList,
    IconApp,
    Image,
    Keyboard,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from '../../react-native';
import {
    bgWhite,
    border,
    borderSeparate,
    checkIcon,
    drawerItem,
    gray,
    overlayColor,
    primaryDark,
    subTextItem,
    textItem,
} from '../../constants/colors';

import images from "public/static/assets/images";
import { rgbToHex } from '@material-ui/core';

export default class SelectorDropDown extends PureComponent {
    constructor(props) {
        super(props);
        this.init = false;
        this.animatedFromBottom = new Animated.Value(0);
        this.animatedExpandValue = new Animated.Value(0);
        this.state = {
            selectedItem: props.selectedItem || null,
            dialogVisible: false,
            items: props.items || [],
        };
        this.myRef = React.createRef();
    }

    onSelect(item, index) {
        this.setState({ selectedItem: item, dialogVisible: false });
        this.props.onChangedValue(item, index)

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

    componentDidMount() {
        this.props.onRef && this.props.onRef(this);

        setTimeout(() =>{
            if(this.myRef.current){
                let top=this.myRef.current.offsetTop;
                top=top+(this.props.offsetTop || (this.myRef.current.offsetHeight+6));
                this.setState({offsetLeft:this.myRef.current.offsetLeft,offsetTop:top, pagewidth: this.myRef.current.offsetWidth,pageHeight:this.myRef.current.offsetHeight  })
            }

        } ,

         1000);
    }

    renderselectedItem = (isOpen) => {
        const {
            fieldItem = 'Name',
        } = this.props;
        let item = this.state.selectedItem;
        return (
            <TouchableOpacity
            onPress={() => { this.setState({ dialogVisible:!this.state.dialogVisible })}}
                style={[{
                    flex: 1,
                    flexDirection: 'row',
                    padding: 4,

                    borderRadius: 10,
                    borderWidth: 0,
                    borderColor: gray,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight:isOpen?40:undefined,


                }]}>

                {item && !isOpen ?
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 5,
                        
                    }}>
                        <View>
                            {item.Icon && (
                                <Image
                                    source={images[item.Icon]}
                                    style={{
                                        height: 20,
                                        width: 20,
                                        tintColor: checkIcon,

                                    }}
                                />
                            )
                            }
                            <Text style={{
                                paddingHorizontal: 5,
                                fontSize: 11
                            }}>{this.props.selectedDisplay ? this.props.selectedDisplay(item) : item[fieldItem]}</Text>
                        </View>
                    </View>
                    :
                    <View style={{ flex: 1, }}>
                        <Text style={{

                            color: border,
                            alignSelf: 'flex-start',
                            padding:4,

                        }}>{this.props.title || 'انتخاب کنید'}</Text>

                    </View>

                }

                <View
                    style={{
                        flex: 1,
                        height:'100%',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-start',
                        flexDirection: this.props.unit ? 'row' : 'column',
                        // transform: [{rotate: animateExpandRotate}],
                    }}
                    
                >
                    {this.props.unit &&
                        <View style={{ flex: 1, marginBottom: 3 }}>
                            <Text style={{ color: subTextItem, alignSelf: 'flex-end', }}>{this.props.unit}</Text>
                        </View>
                    }
                    <IconApp
                        class={'apic_expand'}
                        style={{
                            alignSelf: 'flex-end',
                            height: 30,
                            width: 30,
                            tintColor: textItem,
                           
                            // transform: [{rotate: animateExpandRotate}],
                        }}
                    />
                </View>
            </TouchableOpacity>
        )
    };

    onSearch(text) {
        if(!text) return;
        text=text.replaceAll('ي','ی');
        text=text.replaceAll('ك','ک');
        this.setState({ keyWord: text });
        let items = this.props.items.filter((item) => item[this.props.searchField].search(text) > -1);
        this.setState({ items: items })
    }

    render() {
        const {
            idItem,
            title,
            items=[],
            search = false,
            validation,
            disabled,
            selectedItemCustom,
            itemComponent,
            selectedItem,
            primaryColor = primaryDark,
            fieldItem = 'Name',
            numColumns,
            selectAll
        } = this.props;


        this.state.items = this.state.items && this.state.items.length>0 ? this.state.items : items;
        return (
            <div ref={this.myRef} style={{}}>
                <View
                    style={this.props.style}>
                    <TouchableOpacity
                        style={[styles.button, this.props.buttonStyle, {
                            flex: 1,
                            opacity: disabled ? .3 : 1,
                            borderColor: disabled ? '#777' : validation ? gray : primaryColor,
                            
                            
                            
                        }]}
                        onPress={() => {
                            Keyboard.dismiss();
                            this.setState({ selectedItem: selectedItem });
                            this.animateSnake(true, () => {
                            });
                        }}
                        disabled={disabled}
                    >
                        {selectedItemCustom ? (
                            selectedItemCustom(this.state.selectedItem)
                        ) : (
                                this.renderselectedItem()
                            )}



                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={this.state.dialogVisible}
                            presentationStyle="overFullScreen"
                            onRequestClose={() => {
                                this.animateSnake(false, () => this.setState({ dialogVisible: false }));
                            }}
                        >
                            <View style={{
                                flex: 1,
                                alignItems: 'center',
                                backgroundColor: 'transparent',


                            }}>

                                <TouchableWithoutFeedback
                                    onPress={() => this.animateSnake(false, () => this.setState({ dialogVisible: false }))}>
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

                                <View style={{
                                    width:'100%',
                                    position:'relative',
                                    alignItems:'center',
                                }}>
                                    <View
                                        style={{
                                            borderRadius: 10,
                                            backgroundColor: 'white',
                                            maxHeight: this.props.maxHeight || global.height / 1.5,
                                            position: 'absolute',
                                            width: this.state.pagewidth,
                                            top: this.state.offsetTop,

                                            borderWidth: 1,
                                            borderColor: gray,
                                        }}
                                    >
                                        {this.renderselectedItem(true)}
                                        <View style={{ backgroundColor: gray, minHeight: 1, marginVertical: 1 }} />
                                        {
                                            this.props.searchField &&
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    borderRadius: 10,
                                                    borderColor: borderSeparate,
                                                    borderWidth: 0.5,
                                                    margin: 10,
                                                    padding: 0,
                                                    minHeight:40,
                                                    shadowColor: 'rgb(0,0,0,0.2)',
                                                    shadowOffset: {width: 0, height: 1},
                                                    shadowOpacity: 0.5,
                                                }}>
                                                <IconApp
                                                    class={'apic_search'}
                                                    style={{
                                                        tintColor: textItem,
                                                        width: 24,
                                                        height: 24,
                                                        marginHorizontal: 10,
                                                    }}
                                                />
                                                <View style={{ flex: 1,height:37, }}>
                                                    <TextInput
                                                        style={{
                                                            height: 37,
                                                            borderWidth:0,
                                                            textAlign: 'right',
                                                            marginEnd:5,
                                                            fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                                                        }}
                                                        placeholder={"جستجو کنید"}
                                                        onChangeText={text => this.onSearch(text)}
                                                        value={this.state.keyWord}
                                                    />
                                                </View>

                                            </View>
                                        }

                                        <FlatList
                                            keyExtractor={(item, index) => index.toString()}
                                            data={this.state.items}
                                            numColumns={numColumns}
                                            //extraData={this.state.selectedItem}
                                            renderItem={({ item, index }) => (
                                                <TouchableOpacity
                                                    onPress={() => this.onSelect(item, index)}
                                                    style={[{ flex: 1 }, this.props.listStyle]}
                                                >
                                                    {itemComponent ? (
                                                        itemComponent(item, index,)
                                                    ) : (
                                                        <View style={styles.row}>
                                                            {item.Icon && (
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
                                                                alignSelf: 'flex-start',
                                                                fontSize: 12,
                                                                color: drawerItem,
                                                                marginStart: 6,
                                                                marginVertical: 16,
                                                            }}>{this.props.itemDisplay ? this.props.itemDisplay(item):item[fieldItem]}</Text>
                                                        </View>
                                                    )}
                                                </TouchableOpacity>
                                            )}
                                        />
                                    </View>
                                </View>

                            </View>
                        </Modal>
                    </TouchableOpacity>
                </View>
            </div>


        );
    }



}



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
        backgroundColor: bgWhite,
        paddingHorizontal: 4,
        borderRadius: 10,
        borderWidth: 1,
    },
});

