import {Image, Text, TouchableOpacity, View} from "../../react-native";
import React, { PureComponent } from 'react';
import {black, border, primary,} from "../../constants/colors";
import images from "public/static/assets/images";

export default class NumberSelector extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            value:props.value || 0,
        };
    }
    setNumber(num){
        if(this.props.disable)
            return;
        let newValue=Number(this.state.value)+num;
        if(newValue>this.props.max || newValue<this.props.min )
            return;
        this.setState({value:newValue});
        this.props.onValueChange && this.props.onValueChange(newValue,num)
    }
    render() {
        this.state.value=Number(this.props.value) || 0;
        return (
            <View style={this.props.style}>
                <View style={{flexDirection:'row',alignItems:'center',}} >
                    <TouchableOpacity style={{height: 26, width: 26,borderWidth:1,borderRadius:4,borderColor:border,alignItems:'center',justifyContent:'center'}}
                                      onPress={()=>this.setNumber(1)}>
                            <Image
                                source={images.ic_add}
                                style={{height: 24, width: 24, primary}}
                            />
                    </TouchableOpacity>
                    <Text style={{minWidth:20,textAlign:'center',marginHorizontal:5}}>{this.state.value}</Text>
                    {this.props.children}
                    <TouchableOpacity style={{height: 27, width: 27,borderWidth:1,borderRadius:4,borderColor:border,alignItems:'center',justifyContent:'center'}}
                                      onPress={()=>this.setNumber(-1)}>
                        <Image
                            source={images.ic_minus}
                            style={{height: 24, width: 50,primary}}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
