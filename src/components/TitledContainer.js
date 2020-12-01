import {IconApp, Image, Platform, Text, View} from '../react-native';
import React, {PureComponent} from 'react';
import {LineCustom} from './index';

export default class TitledContainer extends PureComponent {
    constructor() {
        super();

        this.state = {
            submitPressed: false,
            tels: [{value: ''}],
            showClosePopup: false,
        };

        this.documentTypeList = [];
    }

    componentDidMount() {

    }

    render() {
        const {style,title, icon, children, color = '#5D4A4A'} = this.props;
        return (
            <View
                style={[{
                    flexDirection: 'column',
                    marginTop: 32,
                    marginHorizontal: 24,
                },style]}
            >
                <View
                    style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        // borderBottomWidth: 0.5,
                        // borderBottom: 'dotted',
                    }}
                >

                    {icon &&
                    <IconApp
                        class={icon}
                        style={{tintColor: color, height: 24, width: 24, marginBottom: 8, marginEnd: 10}}
                    />
                    }

                    <Text style={{
                        fontSize: 13, textAlign: 'left', color: color,
                        fontFamily: Platform.OS === 'ios' ? 'IRANYekan-ExtraBold' : 'IRANYekanExtraBold',
                    }}>{title}</Text>

                </View>

                <View style={{marginBottom: 16}}>
                    <LineCustom color={'#D5CBCB'}/>
                </View>

                {children}

            </View>
        );
    }
}
