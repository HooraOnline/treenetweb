import React, {PureComponent} from 'react';
import {IconApp, StyleSheet, SwipeOut, Text, TouchableOpacity, View} from '../react-native';
//import Swipeout from 'react-native-swipeout';
import {niceBlue, primaryDark} from '../constants/colors';
import {isMobile} from "../utils";

function BtnSwipe(props) {
    const {icon, color, text, corner, noPadding = false, disabled} = props;
    return (
        <View>
            {isMobile() ? (
                <View
                    style={{alignItems: 'center', justifyContent: 'center', marginHorizontal: 10}}
                >
                    <IconApp
                        source={icon}
                        class={icon}
                        style={{
                            height: 35,
                            width: 35,
                            tintColor: color,
                        }}
                    />
                    <Text
                        style={{
                            fontSize: 9,
                            color: color,
                        }}
                    >
                        {text}
                    </Text>
                </View>
            ) : (
                <View
                    style={{alignItems: 'center', justifyContent: 'center'}}
                >
                    <IconApp
                        //source={icon}
                        class={icon}
                        style={{
                            height: 20,
                            width: 20,
                            tintColor: color,
                        }}
                    />
                </View>
            )}

        </View>

    );


    /* return (
         <View style={{ width:60, backgroundColor: '#f5f1f1', paddingTop: noPadding ? 0 : 10, paddingBottom: noPadding ? 0 : 6, flex: 1}}>
             <View
                 style={[styles.btn, {backgroundColor: color}, {
                     borderTopEndRadius: corner ? 10 : 0,
                     borderBottomEndRadius: corner ? 10 : 0,
                 }]}
             >
                 <Image
                     source={icon}
                     style={{
                         height: 24,
                         width: 24,
                         tintColor: 'white',
                     }}
                 />
                 <Text
                     style={{
                         fontSize: 11,
                         color: 'white',
                     }}
                 >
                     {text}
                 </Text>
             </View>
         </View>
     )*/

}

export default class IOSSwipeCard extends PureComponent {
    constructor(props) {
        super(props);
        console.warn('****** SwipeCard constructor props.onDelete: ', props.onDelete);
        this.addLeftBtns(props)
        this.state = {
            close:true,
        }

    }

    addLeftBtns(props) {
        let disabledBtn = props.permission && !props.permission.deleteAccess;
        let deleteBtn = props.onDelete ? {

            component: (<BtnSwipe noPadding={props.noPadding} disabled={disabledBtn} corner={props.deleteBtnCorner}
                                  icon={this.props.deleteIcon || 'apic_delete'}
                                  color={this.props.deleteColor || '#e95959'} text={this.props.deleteLabel || 'حذف'}/>),

            onPress: () => {
                props.onDelete(this.props.data);
            },
            disabled: disabledBtn,
        } : false;
        let moreBtn = props.onMore ? {
            component: (
                <BtnSwipe noPadding={props.noPadding} corner={props.noPadding && !props.moreBtnCorner ? false : true}
                          icon={this.props.moreIcon || 'apic_more'} color={this.props.moreColor || '#8a7e7e'}
                          text={this.props.moreLabel || 'بیشتر'}/>),
            onPress: () => {
                props.onMore(this.props.data);
            },
            disabled: props.permission && !props.permission.writeAccess,
        } : false;

        let editBtn = props.onEdit ? {
            component: (<BtnSwipe noPadding={props.noPadding} icon={this.props.editIcon || 'apic_edit'}
                                  color={this.props.editColor || niceBlue}
                                  text={this.props.editLabel || 'ویرایش'} corner={this.props.editCorner}/>),
            onPress: () => {
                props.onEdit(this.props.data);
            },
            disabled: props.permission && !props.permission.writeAccess,

        } : false;
        this.swipeBtnsLeft = [];

        if (deleteBtn) {
            this.swipeBtnsLeft.push(deleteBtn);
        }
        if (editBtn) {
            this.swipeBtnsLeft.push(editBtn);
        }
        if (moreBtn) {
            this.swipeBtnsLeft.push(moreBtn);
        }

    }

    componentDidMount() {
        setTimeout(()=>this.setState({close:false}),100);
    }

    render() {
        this.addLeftBtns(this.props);
        const {bottom, title, permission, onItemPress, bgTitleColor = primaryDark, index, idSwipeOpened, disabled, actionIconStyle,autoClose=false} = this.props;
        const props = this.props;
        return (
            /*<Swipeout
                sensitivity={10}
                autoClose={true}
                right={this.swipeBtnsLeft}
                style={[styles.container,
                {
                    borderTopEndRadius: this.props.noPadding ? 0: 7,
                        borderBottomEndRadius: this.props.noPadding ? 0: 7,},this.props.style,
                ]}
                disabled={disabled ||( permission && !permission.deleteAccess && !permission.writeAccess)}
                onOpen={() => {
                    this.props.onOpen(index);
                }}
                onClose={() => {
                    this.props.onClose(index);
                }}
                close={index !== idSwipeOpened}
            >*/
            <SwipeOut
                right={this.swipeBtnsLeft}
                sensitivity={10}

                style={[{
                    backgroundColor: '#f5f1f1',
                    marginTop: 8,
                    borderTopEndRadius: props.noPadding ? 10 : 7,
                    borderBottomEndRadius: props.noPadding ? 10 : 7,
                }, this.props.style]}
                disabled={disabled || (permission && !permission.deleteAccess && !permission.writeAccess)}
                onOpen={() => {
                    this.props.onOpen(index);
                }}
                onClose={() => {
                    this.props.onClose(index);
                }}
                bottom={bottom}
                close={
                   // autoClose? index !== idSwipeOpened:false
                   this.state.close
                    //this.props.close
                }
                actionIconStyle={actionIconStyle}
            >
                <TouchableOpacity
                    onPress={onItemPress}
                    disabled={!onItemPress}
                    style={{
                        //borderTopEndRadius: 10,
                        //borderBottomEndRadius: 10,
                        borderRadius: 10,
                        overflow: 'hidden',
                    }}
                >
                    {title && (
                        <View
                            style={[styles.title, {backgroundColor: 'black'}]}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: 14,
                                }}
                            >
                                {title}
                            </Text>
                        </View>
                    )}
                    {this.props.children}
                </TouchableOpacity>
            </SwipeOut>

        );
    }
}

const styles = StyleSheet.create({

    title: {
        // paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    btn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // marginVertical: 10,
        // maxHeight: 99
    }
});
