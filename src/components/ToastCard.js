import React, {PureComponent} from 'react';
import {Animated, IconApp, Image, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from '../react-native';
import {bgWhite, primary, primaryDark} from "../constants/colors";
import images from 'public/static/assets/images';
import { Overlay } from '.';
class Content extends PureComponent {

    constructor(props) {
        super(props);
        this.init = false;
        this.animatedFromBottom = new Animated.Value(0);

        this.state = {
            keyboardSpace: 0,
            value: null,
        };

        const {type = 'success', title, message} = props;

        switch (type) {
            case 'success':
                this.title = 'تبریک!';
                this.message = 'عملیات با موفقیت انجام شد';
                this.titleColor = '#00A28C';
                this.messageColor = '#1CC4AD';
                this.image = images.bg_ntf_Success;
                this.timeOut = 4000;
                break;
            case 'warning':
                this.title = 'مشکلی پیش آمده!';
                this.message = 'خطایی رخ داده، لطفا دوباره سعی کنید';
                this.titleColor ='#B28600' ;
                this.messageColor ='#B28600' ;
                this.image = images.bg_ntf_Warning;
                this.timeOut = 6000;
                break;
            case 'error':
                this.title = 'خطایی رخ داد';
                this.message = 'متاسفانه اینکار انجام نشد';
                this.titleColor = '#C73618';
                this.messageColor = '#C73618';//'#FF9D88'
                this.image = images.bg_ntf_Error;
                this.timeOut = 10000;
                break;
            case 'info':
                this.title = '';
                this.message = '';
                this.titleColor = '#B28600';
                this.messageColor = primary;
                this.image = images.bg_ntf_Warning;
                this.timeOut = 5000;
                break;
        }

        if (title) {
            this.title = title;
        }

        if (message) {
            this.message = message;
        }
    }

    componentDidMount() {
        this.animateSnake(true, () => {});
        setTimeout(() => {
            this.animateSnake(false, () => this.props.onClose());
        }, this.timeOut);
    }

    animateSnake(open, fn) {
        Animated.timing(
            this.animatedFromBottom,
            {
                toValue: open ? 1 : 0,
                duration: 200,
                useNativeDriver: true,
            },
        ).start(fn);
    }

    onPriceEdit(event) {
        let newPriceList = this.state.pricesList;

        newPriceList[event.index] = event.price;

        this.setState({
            pricesList: newPriceList,
        });
    }

    onSignChange(event) {
        let newPriceList = this.state.pricesList;

        newPriceList[event.index] = event.price;

        this.setState({
            pricesList: newPriceList,
        });
    }

    render() {
        const {onClose,title} = this.props;

        const animateTranslateY = this.animatedFromBottom.interpolate({
            inputRange: [0, 1],
            outputRange: [200, 0],
        });

        return (
          
                <View
                    style={{
                        position: 'fixed',
                        bottom:80,
                        left: 0,
                        right: 0,
                        alignItems: 'center',
                        zIndex:10000
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderWidth: 1,
                            //borderColor: 'white',
                            height: 60,
                            backgroundColor: 'white',
                            marginHorizontal: 10,
                            borderRadius: 10,
                            overflow: 'hidden',
                            elevation: 4,
                            borderColor:this.messageColor,
                           
                            //justifyContent:'space-between',
                            //marginHorizontal: 30,

                            maxWidth:600,
                            minWidth:280,
                            
                            zIndex:10000,
                        }}>

                        <Image
                            source={this.image}
                            style={{ height: 60, }}
                        />
                        
                        <View style={{flex:1}}>
                            {title &&(
                                <Text style={{
                                    color: this.titleColor,
                                    fontSize: 15,
                                    fontFamily: Platform.OS === 'ios' ? 'IRANYekan-ExtraBold' : 'IRANYekanExtraBold',

                                    start: 52,
                                    top: 1,
                                }}>{title}</Text>
                            )}
                           

                            <Text style={{
                                color: this.messageColor,
                                fontSize: 11,
                            }}>{this.message}</Text>
                        </View>

                         <TouchableOpacity
                            onPress={() => this.animateSnake(false, () => onClose())}
                        >
                            <View
                                style={{
                                   
                                    end: 2,
                                    padding: 10,
                                }}
                            >
                                <IconApp
                                    class={'apic_close'}
                                    style={{
                                        tintColor: this.titleColor,
                                        height: 16,
                                        width: 16,
                                    }}
                                />
                            </View>

                        </TouchableOpacity>
                    </View>
                </View>
           
        );
    }
}

export default class ToastCard extends PureComponent {

    constructor() {
        super();
    }

    render() {
        const {onClose, type, title, message} = this.props;
        return (
           
             <View style={{zIndex:10000}}>
                {this.props.visible && (
                     <Overlay
                     catchTouch={true}
                    
                    
                 >
                        <Content
                            onClose={onClose}
                            type={type}
                            title={title}
                            message={message}
                        />
                 </Overlay>
                )}
            </View>
     
           

        );
    }
}

const styles = StyleSheet.create({
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
    fromTop: {
        top: 0,
    },
    fromBottom: {
        bottom: 0,
    },
    img: {
        tintColor: 'black',
        height: 24,
        width: 24,
        marginEnd: 24,

    },
    actionIcon: {
        //paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 16,
        height: '100%',
    },

});
