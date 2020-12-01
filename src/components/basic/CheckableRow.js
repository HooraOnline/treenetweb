import {Image, Text, TouchableOpacity, View} from "../../react-native";
import React, { PureComponent } from 'react';
import {black, primary, textDisabled} from "../../constants/colors";
import images from "public/static/assets/images";

export default class CheckableRow extends PureComponent {
    render() {
        const {text, state, onCheck} = this.props;
        return (
            <TouchableOpacity  onPress={onCheck}>
                <View style={{flexDirection: 'row',justifyContent:'flex-start',alignItems:'center'}}>
                    <Image
                        source={state ? images.checked_icon : images.unchecked_icon}
                        style={{height: 24, width: 24, tintColor:state ? primary:black}}
                    />
                    <Text style={{marginStart:5}}>{text}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}
