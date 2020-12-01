import React, {PureComponent} from 'react';
import {Animated, Platform, StyleSheet, Text, TouchableWithoutFeedback, View} from '../react-native';

import {borderSeparate, textDisabled} from '../constants/colors';


export default class SwitchText extends PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            itemWidth:0,
        };
        this.myRef = React.createRef();
    }

    componentDidMount() {
        this.setState({itemWidth:this.myRef.current.clientWidth/2})
    }

    handleSwitch(value) {

        const {
            onValueChange,
            disabled,
        } = this.props;
        if (disabled) {
            return;
        }
        onValueChange && onValueChange(!value);
    };


    render() {
        const {value, activeText, inactiveText, backgroundActive, backgroundInactive, activeTextStyle, inactiveTextStyle, big,activeBtnHeight,small} = this.props;

        const right=value?0:this.state.itemWidth;
        
        return (
            <div ref={this.myRef} style={{flex: 1}}>
                <TouchableWithoutFeedback
                    onPress={() => this.handleSwitch(value)}
                >
                    <View
                        style={
                            {
                                backgroundColor: backgroundInactive,
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row',
                                minHeight: this.props.height ? this.props.height : 24,
                                borderWidth: 1,
                                borderColor: borderSeparate,
                                borderRadius: 100,
                                position: 'relative',
                                paddingVertical: 5,
                            }}
                    >
                        <Animated.View
                            style={
                                {
                                    position: 'absolute',
                                    backgroundColor: backgroundActive,
                                    height:activeBtnHeight || '105%',
                                    width: this.state.itemWidth,
                                    right: right,
                                    borderRadius: 100,
                                   
                                }}>
                        </Animated.View>
                        <View
                            style={[styles.item,{width:this.state.itemWidth,zIndex:1}]}>
                            <Text
                                style={[styles.text, {
                                    color: value ? 'white' : textDisabled,
                                    fontFamily: value?'IRANYekanFaNum-Bold':'IRANYekanFaNum',
                                    fontSize: big ? value ? 16 : 14 : 14,
                                }, activeTextStyle]}>{activeText}</Text>

                        </View>
                        <View
                            style={[styles.item,{width:this.state.itemWidth,zIndex:1}]}>
                            <Text
                                style={[styles.text, {
                                    color: value ? textDisabled : 'white',
                                    fontFamily: !value ? 'IRANYekanFaNum-Bold':'IRANYekanFaNum',
                                    fontSize: big ? !value ? 16 : 14 : 14,
                                }, inactiveTextStyle]}>{inactiveText}</Text>

                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </div>
        );
    }

}


const styles = StyleSheet.create({
    item: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        paddingHorizontal: 7,
        paddingVertical: 2,
    },
});
