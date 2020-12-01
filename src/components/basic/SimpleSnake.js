import React, {PureComponent} from 'react';
import {
    Animated, IconApp,
    Image,
    Modal,
    Platform, ScrollView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from '../../react-native';
import images from "public/static/assets/images";

import colors, {bgWhite, borderSeparate, itemListText, overlayColor, primaryDark} from '../../constants/colors';


export default class SimpleSnake extends PureComponent {
    constructor() {
        super();
        this.animatedFromBottom = new Animated.Value(0);
        this.state = {};
        this.height = global.height - global.height / 4;
    }

    animateSnake(open, fn) {
        Animated.timing(this.animatedFromBottom, {
            toValue: open ? 1 : 0,
            useNativeDriver: true,
            duration: 300,
        }).start(fn);
    }

    render() {
        const {
            visible,
            title,
            fieldItem,
            search = false,
            itemComponent,
            primaryColor = primaryDark,
            fromTop = false,
            onClose,
            catchTouch = true,
            reRender = false,
        } = this.props;

        const animateTranslateY = this.animatedFromBottom.interpolate({
            inputRange: [0, 1],
            outputRange: [fromTop ? this.height * -1 : this.height, 0],
        });

        if (visible) {
            this.animateSnake(true, () => {
            });
        }

        return (
            <Modal
                animationType="fade"
                transparent
                visible={visible}
                presentationStyle="overFullScreen"
                onRequestClose={() => {
                    this.animateSnake(false, onClose);
                }}>
                <View style={{flex: 1, marginTop: 55,width:global.width-2}}>
                    <Animated.View
                        style={[
                            fromTop ? styles.fromTop : styles.fromBottom,
                            {
                                transform: [{translateY: animateTranslateY}],
                                backgroundColor: 'white',
                                minHeight: 170,
                                maxHeight: this.height,
                                // position: 'absolute',
                                // left: 0,
                                // right: 0,
                                borderBottomRightRadius: 17,
                                borderBottomLeftRadius: 17,
                                paddingTop: fromTop && Platform.OS === 'ios' ? 20 : 0,
                            },
                        ]}>
                        {/*{search && <SearchBox placeHolder="جستجو" />}*/}
                        {(fromTop && title)  && (
                            <TouchableWithoutFeedback
                                onPress={() => this.animateSnake(false, onClose)}
                                disabled={!catchTouch}
                                style={{

                                    elevation: 2,
                                    shadowColor: '#000',
                                    shadowOffset: {width: 0, height: 1},
                                    shadowOpacity: 0.5,
                                    backgroundColor: 'white',
                                }}>
                                <View
                                    style={[
                                        styles.actionIcon,
                                        {
                                            padding:20,
                                            backgroundColor: bgWhite,
                                            flexDirection: 'row',
                                            // justifyContent: 'center',
                                            alignItems: 'center',
                                        },
                                    ]}>
                                    <IconApp
                                        source={catchTouch ? 'apic_close' : 'apic_circleDone'}
                                        style={styles.img}
                                    />

                                    <Text
                                        style={{
                                            color: 'black',
                                            fontSize: 14,
                                            fontFamily:
                                                Platform.OS === 'ios'
                                                    ? 'IRANYekanFaNum-Bold'
                                                    : 'IRANYekanBold(FaNum)',
                                        }}>
                                        {title}
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        )}
                        {
                            this.props.children
                        }
                    </Animated.View>
                </View>
            </Modal>
        );
    }

    onSelect(item) {
        this.animateSnake(false, this.props.onClose);
        this.props.onItemSelected(item);
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
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 16,
        height: '100%',
    },
});
