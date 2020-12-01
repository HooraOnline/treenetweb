import React, {PureComponent} from 'react';
import {
    Animated,
    IconApp,
    Image,
    Keyboard,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from "../../react-native";

import {bgWhite, overlayColor, textItem} from "../../constants/colors";
import images from "public/static/assets/images";

export default class DialogPopUp extends PureComponent {
    constructor(props) {
        super(props);
        this.init = false;
        this.animatedFromBottom = new Animated.Value(0);
        this.state = {
            keyboardSpace: 0,
            value: null,
        };
        //for get keyboard height
        // Keyboard.addListener('keyboardDidShow', frames => {
        //     if (!frames.endCoordinates) {
        //         return;
        //     }
        //     this.setState({keyboardSpace: frames.endCoordinates.height});
        // });
        // Keyboard.addListener('keyboardDidHide', frames => {
        //     this.setState({keyboardSpace: 0});
        // });
    }

    componentDidMount() {
        this.animateSnake(true, () => {
        });

        this.setState({
            value: this.props.value,
            showClosePopup: false,
        });
    }

    animateSnake(open, fn) {
        Animated.timing(this.animatedFromBottom, {
            toValue: open ? 1 : 0,
            useNativeDriver: true,
        }).start(fn);
    }

    render() {
        const {
            title='',
            onClose,
            onAccept,
            onDelete = null,
            value = null,
            catchTouch = true,
        } = this.props;
        const animateTranslateY = this.animatedFromBottom.interpolate({
            inputRange: [0, 1],
            outputRange: [370, 0],
        });
        return (
            <Modal
            animationType="fade"
            transparent={true}
            presentationStyle="overFullScreen"
            visible={true}
            onRequestClose={onClose}
           
            >
                <View
                    style={{
                        flex: 1,
                        //backgroundColor: overlayColor,
                        alignItems:'center',
                        bottom: 0,//Platform.OS === 'ios' ? this.state.keyboardSpace : 0,
                        left: 0,
                        right: 0,
                        position: 'fixed',
                    }}>
                  
                    <Animated.View
                        style={[{
                            transform: [{translateY: animateTranslateY}],
                            width:global.width,
                        }, this.props.style || {
                            minHeight: 170,
                            maxHeight: 370,
                           
                        }
                        ]}>
                        <TouchableWithoutFeedback
                            onPress={() => this.animateSnake(false, () => onClose())}
                            style={{
                                elevation: 2,
                                shadowColor: '#000',
                                shadowOffset: {width: 0, height: 1},
                                shadowOpacity: 0.5,
                                backgroundColor: 'white',
                                borderTopRightRadius: 20,
                                borderTopLeftRadius: 20,
                            }}>

                            <View style={{}} >
                               
                                    <View
                                        style={[
                                            styles.actionIcon,
                                            {
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                borderBottomWidth: 1,
                                                borderBottomColor: '#E5DEDE',
                                                padding:10,
                                                flex: 1,
                                            },
                                        ]}>
                                        <IconApp class={'apic_close'}
                                               style={{
                                                   tintColor: textItem,
                                                   height: 24,
                                                   width: 24,
                                                   margin:10,
                                               }}/>

                                        <Text
                                            style={{
                                                fontSize: 13,
                                            }}>
                                            {title}
                                        </Text>
                                    </View>
                             
                            </View>


                        </TouchableWithoutFeedback>
                        <ScrollView style={{flex:1,backgroundColor:bgWhite}}>
                             {this.props.children}
                        </ScrollView>
                       
                    </Animated.View>


                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    btnIcon: {
        height: '100%',
        justifyContent: 'center',
        paddingHorizontal: 12,

    },
});
