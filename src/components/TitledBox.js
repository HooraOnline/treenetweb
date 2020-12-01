import React, {Component} from 'react';
import {Image, Text, TouchableOpacity, View} from '../react-native';
import images from "public/static/assets/images";
import {primaryDark} from '../constants/colors';
export default class TitledBox extends Component {
    render() {
        return (
            <View
                style={{
                    flexDirection: 'column',
                    marginVertical: 8,
                    borderRadius: 3,
                    borderWidth: this.props.borderWidth ? this.props.borderWidth : .7,
                    borderStyle: this.props.borderStyle ? this.props.borderStyle : 'dashed',
                    borderColor: this.props.borderColor ? this.props.borderColor : 'black',
                    padding: this.props.padding ? this.props.padding : 7,
                    marginHorizontal: 10,
                    alignItems: 'center',
                }}
            >
                {this.props.editableTitle &&
                <TouchableOpacity
                    onPress={() => this.props.onEditPressed()}
                    style={{
                        flexDirection: 'row',
                        marginVertical: 17,
                        position: 'absolute',
                        backgroundColor: 'white',
                        top: -30,
                        left: 3,
                        paddingHorizontal: 5,
                    }}>
                    <Image
                        source={images.edit_icon}
                        style={{
                            marginTop: 5,
                            tintColor: primaryDark, height: 17, width: 17,
                        }}
                    />
                    <Text
                        style={{
                            alignSelf: 'flex-start',
                            paddingHorizontal: 3,
                        }}
                    >{this.props.title}</Text>

                </TouchableOpacity>
                }

                {!this.props.editableTitle &&
                <Text style={{
                    position: 'absolute',
                    backgroundColor: 'white',
                    top: -13,
                    left: 5,
                    alignSelf: 'flex-start',
                    paddingHorizontal: 5,
                }}>{this.props.title}</Text>
                }

                {this.props.children}
            </View>
        );
    }
}
