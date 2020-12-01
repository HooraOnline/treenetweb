import React, {PureComponent} from 'react';
import {Animated, Platform, StyleSheet, Text, TouchableWithoutFeedback, View} from '../../react-native';

import {borderSeparate, textDisabled} from '../../constants/colors';
import {getTabWidth} from "../../utils";


export default class Swicher extends PureComponent {
    constructor(props, context) {
        super(props, context);
        this.labelField=props.labelField || 'Name'
        this.state = {
            backgroundMove: new Animated.Value(0),
        };
        this.myRef = React.createRef();
    }

    componentDidMount() {
        const {value} = this.props;
        this.setState({
            itemWidth:this.myRef.current.offsetWidth/this.props.data.length,
        });
        this.animateSwitch(value, () => null);
    }

    componentDidUpdate() {
        //this.animateSwitch(this.props.activeIndex, () => null);
    }


    /*   animateSwitch = (activeIndex, cb = () => {}) => {
           Animated.parallel([
               Animated.timing(this.state.backgroundMove, {
                   toValue: activeIndex * this.props.itemWidth,
                   duration: 150,
                   friction: 3,
                   tension: 40,
               }),
           ]).start(cb);
       };*/

    animateSwitch = (activeIndex=0)=>{

        this.state.itemWidth=this.state.itemWidth || this.myRef.current.offsetWidth/ this.props.data.length;
        this.props.onActivate && this.props.onActivate(this.props.data[activeIndex],activeIndex);
        let backgroundMove=activeIndex * this.state.itemWidth;
        this.setState({backgroundMove })

    };

    render() {
        const {style,data, activeIndex, backgroundActive, backgroundInactive, activeTextStyle, inactiveTextStyle, onActivate} = this.props;

        // const moveBackground = backgroundMove.interpolate({
        //     inputRange: [0, data.length],
        //     outputRange: [0, data.length],
        // });
        const itemWidth=this.state.itemWidth;
        return (

            <div ref={this.myRef} style={style}>
                <View
                    style={[style,{
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
                    }]}
                >
                    <Animated.View
                        style={
                            {
                                position: 'absolute',
                                backgroundColor: backgroundActive,
                                //height: '100%',
                                height:45,
                                width: itemWidth,
                                right: this.state.backgroundMove,
                                elevation: '50deg',
                                shadowColor: backgroundActive,
                                shadowOffset: {width: 0, height: 1},
                                shadowOpacity: 0.5,
                                borderRadius: 100,
                                alignItems: 'center',
                                justifyContent: 'center'

                            }}>
                        {/* <Text style={{color:'#fff',alignSelf:'center'  }} >{data[activeIndex]}</Text>*/}
                    </Animated.View>



                    {data.map((item, index) => {
                        return (
                            <TouchableWithoutFeedback
                                style={{flex:1,padding:3}}
                                onPress={() => this.animateSwitch(index)}>
                                <View style={[styles.item]} key={index.toString()}>
                                    <Text
                                        style={[styles.text, {
                                            fontFamily: index === activeIndex ?
                                                Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)' :
                                                Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                                            fontSize: index === activeIndex ? 14 : 12,
                                            color: index === activeIndex ? 'white' : textDisabled,
                                        }, index === activeIndex ? activeTextStyle : inactiveTextStyle]}>{item[this.labelField]}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        );
                    })}
                </View>
            </div>
        );
    }
}


const styles = StyleSheet.create({
    item: {
        elevation: 2,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        paddingHorizontal: 7,
        paddingVertical: 2,
    },
});
