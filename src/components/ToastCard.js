import React, {PureComponent} from 'react';
import {Animated, Image, StyleSheet, Text, TouchableWithoutFeedback, View} from '../react-native';
import {bg5, grL5, primary, primaryDark} from "../constants/colors";
import images from 'public/static/assets/images';
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
                this.titleColor = '#C73618';
                this.messageColor = '#FF9D88';
                this.image = images.bg_ntf_Warning;
                this.timeOut = 6000;
                break;
            case 'error':
                this.title = 'خطایی رخ داد';
                this.message = 'متاسفانه اینکار انجام نشد';
                this.titleColor = '#B28600';
                this.messageColor = '#FFC107';
                this.image = images.bg_ntf_Error;
                this.timeOut = 10000;
                break;
            case 'info':
                this.title = '';
                this.message = '';
                this.titleColor = '#B28600';
                this.messageColor = primary;
                this.image = images.bg_ntf_Error;
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
        const {onClose} = this.props;

        const animateTranslateY = this.animatedFromBottom.interpolate({
            inputRange: [0, 1],
            outputRange: [200, 0],
        });

        return (
            <View style={{
                position: 'absolute',
                bottom: 10,
                width: '100%',



            }}>
                <Animated.View
                    style={{
                        transform: [{translateY: animateTranslateY}],
                        minHeight: 60,
                        position: 'fixed',
                        //borderTopRightRadius: 20,
                        //borderTopLeftRadius: 20,
                        top:100,
                        left: 0,
                        right: 0,
                        zIndex:1000,
                        alignItems: 'center'

                    }}
                >

                    <View
                        style={ {
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderWidth: 10,
                            borderColor: grL5,
                            backgroundColor: 'white',
                            marginHorizontal: 24,
                            borderRadius: 10,
                            overflow: 'hidden',
                            elevation: 4,
                            position:'relative',
                            width:'98%',
                            maxWidth:600,
                            justifyContent:'space-between',
                            padding:5,
                        }}>

                       {/* <Image
                            source={this.image}
                            style={{position: 'absolute', start: 0, top: 0, height: 59, width: 57}}
                        />*/}
                        <Text style={{
                            color: this.messageColor,
                            fontSize: 12,

                        }}>{this.message}</Text>
                        <TouchableWithoutFeedback

                            onPress={() => this.animateSnake(false, onClose)}
                        >
                            <Image
                                source={images.ic_close}
                                style={{
                                    //tintColor: '#BFACAC',
                                    height: 24,
                                    width: 24,
                                }}
                            />
                        </TouchableWithoutFeedback>


                    </View>


                </Animated.View>

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
            <View>
                {this.props.visible && (
                    <Content
                        onClose={onClose}
                        type={type}
                        title={title}
                        message={message}
                    />
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
