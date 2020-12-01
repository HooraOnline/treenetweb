import React, {PureComponent} from 'react';
import PopupBase from "./PopupBase";
import accountsStore from "../stores/Accounts";

import {
    bgItemRed,
    bgScreen,
    bgWhite,
    textItemRed,
    borderSeparate,
    border,
    primaryDark,
    lightGrey, borderLight
} from "../constants/colors";

import ButtonBase from '@material-ui/core/ButtonBase';
import images from "../../public/static/assets/images";
import {getHeight} from "../utils";
import Grow from "@material-ui/core/Grow";
import {TouchableOpacity, View, Text, Image, ScrollView, IconApp} from "../react-native";

export default class SnakePopup extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {open:false};
    }

    animateSnake(open, fn) {
        this.setState({open:false});
    }
    handleClose=()=>{
        this.setState({open:false});
        this.props.onClose && this.props.onClose();
    }
    render() {
        const {
            visible,
            toolbarTitle,
            items,
            fieldItem,
            search = false,
            itemComponent,
            primaryColor = primaryDark,
            fromTop = false,
            onClose,
            catchTouch = true,
            reRender = false,
            ListHeaderComponent=()=>{return null},
            ListHeaderComponentStyle={},
            style,
            dialogOpacity,
            position,
            contentStyle={},
            children,
            containerStyle,
        } = this.props;

        if (visible) {
            this.animateSnake(true, () => { });


        }
        console.log(items);
            let cStyle={
                marginTop:'80%',
                width:global.width-2,backgroundColor:bgWhite, borderTopRightRadius: 40,borderTopLeftRadius:40,borderColor:bgScreen};
            if(fromTop)
                cStyle={ width:global.width-2,backgroundColor:bgWhite, borderBottomRightRadius: 30,borderBottomLeftRadius:30,borderColor:bgScreen};

            let marginTop;
            if(fromTop){
                marginTop=typeof(fromTop)=='number'?fromTop:50;
            }
            return (
                <PopupBase
                    opener={this.item}
                    top={false}
                    visible={visible}
                    onClose={onClose}
                    dialogOpacity={dialogOpacity}
                    style={style || {marginTop:marginTop,height:'100%',backgroundColor:bgScreen,opacity:1}}
                    contentStyle={[contentStyle,cStyle].reduce(function(acc, x) {
                        for (var key in x) acc[key] = x[key];
                        return acc;
                    } )}
                >
                    <View>
                        {
                            this.props.headerComponent
                        }
                        <TouchableOpacity
                            onPress={ ()=> this.handleClose()}
                            style={{
                                paddingRight: 24,
                                paddingLeft: 24,
                                paddingVertical:16,
                                height: 50,
                                //marginBottom:16,
                                 //backgroundColor: border,
                                flexDirection: 'row',
                                // justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <IconApp
                                class={catchTouch ? 'apic_close' : 'apic_done_circle'}
                                style={styles.img}
                            />

                            <Text
                                style={{
                                    flex:1,
                                    paddingHorizontal:5,
                                    //color: bgWhite,
                                    fontSize: 12,
                                    fontWeight:800,
                                    fontFamily:'IRANYekanFaNum-Bold',
                                }}>
                                {toolbarTitle}
                            </Text>
                        </TouchableOpacity>
                        <View style={{borderWidth:0,borderBottomWidth:1, borderColor:borderLight,  borderStyle:'dotted',marginBottom:5 }}/>
                        <ScrollView style={{paddingBottom:16,margin:5, maxHeight: global.height/1.5, }}>
                            {items.map((item,index) => {
                                    return (
                                        <View style={{ cursor: 'pointer',}}
                                              onClick={()=>this.onSelect(item)}>
                                            {itemComponent ? (
                                                itemComponent(item,index)
                                            ) : (
                                                <View style={{
                                                    marginRight: 16,
                                                    marginLeft:16,
                                                    display:'flex',
                                                    flexDirection:'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}>

                                                    {index>0 &&
                                                    <View style={{height:1,width:'100%',backgroundColor:lightGrey,opacity:0.3,}} />
                                                    }


                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            padding: 13,
                                                        }}>
                                                        {fieldItem ? item[fieldItem] : item.Name}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    )
                                }
                            )}
                        </ScrollView>
                        {children}
                    </View>
                    <style jsx global>{`
                     .MuiPaper-rounded {
                        border-radius: 0px;
                      }
                      `}
                    </style>
                </PopupBase>


        );
    }

    onSelect(item) {
        this.animateSnake(false, this.props.onClose);
        this.props.onItemSelected(item);
    }
}

const styles ={
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingEnd: 13,
        paddingStart: 13,
        height: 45,
    },
    rowTitle: {
        flex: 1,
    },
    button: {
        flex: 1,
        borderWidth: 0.5,
        borderRadius: 4,
        height: 33,
        marginHorizontal: 7,
    },
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
    },
    fromTop: {
        top: 0,
    },
    fromBottom: {
        bottom: 0,

    },
    img: {
        tintColor: border,
        height: 24,
        width: 24,
        marginEnd: 5,
    },
    actionIcon: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 16,
        height: '100%',
    },
};
