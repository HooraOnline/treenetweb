import React, {PureComponent} from 'react';
import {Animated, Platform, StyleSheet, Text, TouchableWithoutFeedback, View} from '../react-native';
import {persistStore} from "../stores";
import {border, borderSeparate, textDisabled} from '../constants/colors';


export default class SwitchTextMulti extends PureComponent {
    constructor(props, context) {
        super(props, context);
        this.firsSet = true;
        // this.backgroundMove = useState();
        this.state = {
            backgroundMove: 0,
        };

    }

    componentDidMount() {
         const {selectedIndex} = this.props;

         this.setState({backgroundMove: selectedIndex * this.props.itemWidth});
    }

    onselect = (index)=>{

        this.setState({backgroundMove: index * this.props.itemWidth});
        this.props.onSelect && this.props.onSelect(index);
    };

    render() {
        const {style,data, selectedIndex, itemWidth, backgroundActive, backgroundInactive, activeTextStyle, inactiveTextStyle, onActivate} = this.props;

        // const moveBackground = backgroundMove.interpolate({
        //     inputRange: [0, data.length],
        //     outputRange: [0, data.length],
        // });

        return (

            <View
                style={[{
                    flex: 1,
                    flexDirection: 'row',
                    backgroundColor: backgroundInactive,
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: this.props.height ? this.props.height : 24,
                    borderWidth: 1,
                    borderColor: borderSeparate,
                    borderRadius: 100,
                    position:'relative'
                },style]}
            >
                <Animated.View
                    style={
                        {
                            position: 'absolute',
                            backgroundColor: backgroundActive,
                            //height: '100%',
                            height:50,
                            width: itemWidth,
                            right:persistStore.isRtl? this.state.backgroundMove:undefined,
                            left:persistStore.isRtl?undefined :this.state.backgroundMove,
                            elevation: '50deg',
                            shadowColor: backgroundActive,
                            shadowOffset: {width: 0, height: 1},
                            shadowOpacity: 0.5,
                            borderRadius: 100,
                            alignItems: 'center',
                            justifyContent: 'center'

                        }}>
                </Animated.View>

                {data.map((item, index) => {

                    let selected=index ==Number(selectedIndex)
                    return (
                        <TouchableWithoutFeedback
                            style={{flex:1,padding:5}}
                            onPress={() => this.onselect(index)}>
                            <View style={[styles.item]} key={index.toString()}>
                                <Text
                                    style={[styles.text, {
                                        fontFamily: selected ?
                                            'IRANYekanFaNum-Bold': 'IRANYekanFaNum' ,
                                        fontSize: selected ? 16 : 14,
                                        color: selected ? 'white' : border,
                                    },selected ? activeTextStyle : inactiveTextStyle]}>{item}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                })}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    item: {
        elevation: 7,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        paddingHorizontal: 7,
        paddingVertical: 2,
    },
});
