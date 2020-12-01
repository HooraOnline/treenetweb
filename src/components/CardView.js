import React, {Component} from 'react';
import {View} from '../react-native';

export default class CardView extends Component {
    render() {
        return (
            <View
                style={[{
                    backgroundColor: 'white',
                    // marginTop: 6,
                    // marginHorizontal: 6,
                    padding: 8,
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 1},
                    shadowOpacity: 0.5,
                }, this.props.style]}
            >
                {this.props.children}
            </View>
        );
    }
}
