import React, {PureComponent} from 'react';
import {FlatList, IconApp, Modal, Platform, StyleSheet, Text, TouchableOpacity, View} from '../react-native';
import {
    bgWhite,
    border,
    borderSeparate,
    placeholderTextColor,
    primaryDark,
    subTextItem,
    textItem
} from '../constants/colors';
import {FloatingLabelTextInput} from "./index";
import {showMassage} from '../utils';


export default class ListDialogPopUp extends PureComponent {
    constructor(props) {
        super(props);
        this.height = global.height - global.height / 4;
        this.state = {};

        props.ref && props.ref(this);

    }

    handleOpen = () => {
        if (this.props.items.length == 0) {

            let message = this.props.emptyListmessage || 'لیست خالی';
            showMassage(message, '', 'error');
        } else {
            this.setState({open: true});
        }
    }
    handleClose = () => {
        this.setState({open: false});
    }

    onSearch(text) {
        if(!text) return;
        text=text.replaceAll('ي','ی');
        text=text.replaceAll('ك','ک');
        this.setState({keyWord: text})
        let items = this.props.items.filter((item) => item[this.props.searchField].search(text) > -1);
        this.setState({searchItems: items})
    }

    select(item, index) {
        this.props.onValueChange(item);
        this.handleClose();

    }

    render() {
        const {
            title,
            items,
            itemComponent,
            validation = true,
            disabled,
            selectedItem,
            defaultTitle = '',
            minWidth = 250,
            selectedItemCustom,
            selectedComponentCustom,
            primaryColor = primaryDark,
            placeholder = '',
            fieldItem,
            onFinish,
            snake,
            styleText,
            hasBorderBottom = true,
            horizontal = false,
            numColumns = 1,
            listStyle,
            catchTouch,
            dialogOpacity,
            dialogStyle,
            maxHeight,
            marginTop = 0,//53,
            style = {},
            contentStyle = {},
            listFormat,
            bottom
        } = this.props;


        let selectedTitle = defaultTitle;
        if (selectedItem) {
            if (fieldItem) {
                selectedTitle = selectedItem[fieldItem];
            } else if (selectedItem.name) {
                selectedTitle = selectedItem.name;
            } else if (selectedItem.Name) {
                selectedTitle = selectedItem.Name;
            } else if (selectedItem.title) {
                selectedTitle = selectedItem.title;
            } else if (selectedItem.Title) {
                selectedTitle = selectedItem.Title;
            }
        }

        let listItems = this.state.searchItems || items;
        return (
            <View style={{flex: 1,}}>
                <TouchableOpacity
                    style={[style, {
                        flex: 1,
                        width: '100%',
                        flexDirection: 'row',
                        borderWidth:this.props.borderWith==0?0:1,
                        // alignItems: 'center',
                        justifyContent: 'center',
                        borderColor: validation ? subTextItem : primaryColor,
                        borderRadius: 10,
                        // marginVertical: 7
                    },]}
                    onPress={this.handleOpen}
                    disabled={disabled}>
                    {selectedComponentCustom ? (
                        selectedComponentCustom
                    ) : (
                        <View
                            style={[{
                                flexDirection: 'row',
                                // minHeight: 37,
                                alignItems: 'center',
                                backgroundColor: 'white',
                                flex: 1,
                                // paddingTop: 4,
                                // paddingBottom: 3,
                                paddingHorizontal: 4,
                                borderRadius: 10,
                                opacity: disabled ? 0.3 : 1,
                            }, this.props.selectedItemStyle]}>
                            <View style={{flex: 1}}>
                                {selectedItemCustom ? (
                                    selectedItemCustom
                                ) : selectedTitle ? (
                                    <Text
                                        style={[
                                            styles.text,
                                            {
                                                alignSelf: 'flex-start',
                                                marginStart: 8,
                                            },
                                            styleText,
                                        ]}>
                                        {selectedTitle}
                                    </Text>
                                ) : (
                                    <Text
                                        style={[
                                            styles.text,
                                            {
                                                alignSelf: 'center',
                                                marginStart: 8,
                                                color: '#8A7E7E',
                                            },
                                            styleText,
                                        ]}>
                                        {title}
                                    </Text>
                                )}
                            </View>

                            <IconApp
                                source={'apic_dropdown'}
                                style={{
                                    height: 24,
                                    width: 24,
                                    tintColor: textItem,
                                }}
                            />
                        </View>
                    )}
                </TouchableOpacity>

                <Modal
                    animationType="fade"
                    transparent={true}
                    presentationStyle="overFullScreen"
                    visible={this.state.open}
                    fullWidth={true}
                    onRequestClose={this.handleClose}>
                    <View style={[{
                        position: 'fixed',
                        bottom: bottom ? 0 : undefined,
                        top: bottom ? undefined : marginTop,
                        width: global.width - 3,
                        backgroundColor: bgWhite,
                        borderBottomLeftRadius: bottom ? 0 : snake ? 20 : 10,
                        borderBottomRightRadius: bottom ? 0 : snake ? 20 : 10,
                        borderTopLeftRadius: (snake && !bottom) ? 0 : 10,
                        borderTopRightRadius: (snake && !bottom) ? 0 : 10,
                        elevation: 7,
                        zIndex: 7,

                        //marginTop:marginTop?marginTop:0,
                        //height:'90%',
                        opacity: 1,
                        marginBottom: 0,
                        minWidth: snake ? global.width : minWidth,
                        //maxHeight: this.height,
                        paddingBottom: 5,
                    }, dialogStyle,]}>
                        <View style={{flex: 1,}}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    // justifyContent: 'center',
                                    borderBottomWidth: 1,
                                    borderColor: borderSeparate,
                                    alignItems: 'center',
                                    padding: 16,
                                    shadowColor: '#000',
                                    shadowOffset: {width: 0, height: 1},
                                    shadowOpacity: 0.5,
                                    minHeight: 50,

                                }}>
                                <TouchableOpacity
                                    onPress={this.handleClose}
                                    style={{height: '100%',}}>
                                    <IconApp
                                        class={'apic_close'}
                                        style={{
                                            tintColor: textItem,
                                            width: 24,
                                            height: 24,
                                        }}
                                    />
                                </TouchableOpacity>
                                <Text
                                    style={{
                                        fontSize: 13,
                                        fontWeight: 800,
                                        paddingTop: 4,
                                        color: textItem,
                                        paddingHorizontal: 10,

                                    }}>
                                    {title}
                                </Text>
                            </View>

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
                        </View>
                        <View style={{marginTop:0}}>
                            <FlatList
                                style={this.props.listContainerStyle}
                                listFormat={listFormat}
                                keyExtractor={(item, index) => index.toString()}
                                numColumns={numColumns}
                                data={listItems}
                                maxHeight={global.height/3}
                                horizontal={horizontal}
                                renderItem={({item, index}) => (
                                    <TouchableOpacity
                                        key={item}
                                        onPress={this.select.bind(this, item, index)}
                                        style={[{
                                            borderBottomWidth: hasBorderBottom ? 1 : 0,
                                            borderColor: borderSeparate,
                                            marginHorizontal: 24,
                                        }, listStyle]}>
                                        {itemComponent ? (
                                            itemComponent(item, index)
                                        ) : (
                                            <View>
                                                <Text
                                                    style={{
                                                        textAlign: 'center',
                                                        paddingVertical: 16,
                                                    }}>
                                                    {fieldItem ? item[fieldItem] : item.Name}
                                                </Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                )}
                            />
                        </View>


                        </View>


                </Modal>


                {/*<Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth={true}
                    maxWidth={'sm'}
                >
                    <DialogTitle id="alert-dialog-title">
                        <View style={{
                           flex:1,
                            backgroundColor:bgScreen
                        }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    // alignItems: 'flex-start',
                                    // justifyContent: 'center',
                                    borderBottomWidth: 1,
                                    borderColor: borderSeparate,
                                    alignItems: 'center',

                                }}>
                                <TouchableOpacity
                                    onPress={this.handleClose}
                                    style={{paddingHorizontal: 16, height: '100%'}}>
                                    <Image
                                        source={images.ic_close}
                                        style={{
                                            tintColor: textItem,
                                            width: 24,
                                            height: 24,
                                            marginTop: 30,
                                            marginBottom: 21,
                                        }}
                                    />
                                </TouchableOpacity>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        // paddingHorizontal: 24,
                                        paddingTop: 24,
                                        paddingBottom: 16,
                                        alignSelf: 'flex-start',
                                    }}>
                                    {title}
                                </Text>
                            </View>

                            {
                                this.props.searchField &&
                                <View
                                    style={{
                                        height:44,
                                        flexDirection:'row',
                                        alignItems:'center',
                                        borderColor: border,
                                        borderWidth: 1,
                                        border:'1px solid #ececec',
                                        borderRadius:10,
                                        justifyCenter:'center',
                                        margin:10,
                                        padding:0,
                                        backgroundColor:'#fff'

                                    }}>
                                    <Image
                                        source={images.ic_search}
                                        style={{
                                            tintColor: textItem,
                                            width: 24,
                                            height: 24,
                                            marginHorizontal:10,
                                        }}
                                    />
                                    <TextInput
                                        style={{
                                            textAlign:'right',
                                            fontFamily:'IRANYekanFaNum',
                                        }}
                                        placeholder={"جستجو کنید"}
                                        onChangeText={text => this.onSearch(text)}
                                        value={this.state.keyWord}
                                    />

                                </View>

                            }
                        </View>
                    </DialogTitle>
                    <DialogContent Viewiders={true}>
                        <View
                            style={{
                                flex: 1,

                                justifyContent: snake ? 'flex-end' : 'center',
                                alignItems: 'center',
                                backgroundColor: overlayColor,
                            }}>
                            <View
                                style={{
                                    backgroundColor: 'white',
                                    // minHeight: 170,
                                    maxHeight: this.props.height || this.height ,
                                    // position: 'absolute',
                                    // left: 0,
                                    // right: 0,
                                    borderBottomStartRadius: snake ? 0 : 10,
                                    borderBottomEndRadius: snake ? 0 : 10,
                                    borderTopStartRadius: snake ? 20 : 10,
                                    borderTopEndRadius: snake ? 20 : 10,
                                    elevation: 7,
                                    minWidth: snake ? '100%' : minWidth,
                                    bottom:  0,
                                    paddingBottom:  0,
                                }}>


                                <FlatList
                                    style={{flexGrow: 0}}
                                    keyExtractor={(item, index) => index.toString()}
                                    numColumns={numColumns}
                                    data={listItems}
                                    horizontal={horizontal}
                                    renderItem={({item, index}) => (
                                        <TouchableOpacity
                                            key={item}
                                            onPress={this.select.bind(this, item,index)}
                                            style={[{
                                                borderBottomWidth: hasBorderBottom ? 1 : 0,
                                                borderColor: borderSeparate,
                                                marginHorizontal: 24,
                                            },listStyle]}>
                                            {itemComponent ? (
                                                itemComponent(item,index)
                                            ) : (
                                                <View>
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            paddingVertical: 16,
                                                        }}>
                                                        {fieldItem ? item[fieldItem] : item.Name}
                                                    </Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </View>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Disagree
                        </Button>
                        <Button onClick={this.handleClose} color="primary" autoFocus>
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>*/}
            </View>
        );
    }

}


const styles = StyleSheet.create({
    text: {
        fontSize: 12,
        fontFamily: 'IRANYekanFaNum-Bold',
        marginStart: 16,
        paddingVertical: 8,
        // marginTop: 8,
        // marginBottom: 7
    },
});
