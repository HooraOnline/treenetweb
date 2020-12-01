import React, {Component} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {primaryDark} from '../constants/colors';
import images from '@assets/images';

class RadioButton extends Component {
    render() {

        return <View
            style={{
                backgroundColor: 'white',
                elevation: this.props.hasBorder ? 7 : 0,
                alignContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                marginHorizontal: 10,
                marginVertical: this.props.hasBorder ? 5 : 2,
                height: this.props.hasBorder ? 45 : 30,
                justifyContent: 'flex-start',
            }}
        >
            <TouchableOpacity
                style={{height: '100%', paddingLeft: 13, paddingRight: 5}}
                onPress={() => {
                    this.props.onClick({id: this.props.id});
                }}
            >
                {!this.props.multiselect &&
                <Image
                    source={
                        this.props.checked
                            ? images.radioSelectedIcon
                            : images.radioEmptyIcon
                    }
                    style={{tintColor: primaryDark, height: 20, width: 20, marginTop: this.props.hasBorder ? 12 : 4}}
                />
                }

                {this.props.multiselect &&
                <Image
                    source={
                        this.props.checked
                            ? images.checked_icon
                            : images.unchecked_icon
                    }
                    style={{tintColor: primaryDark, height: 20, width: 20, marginTop: this.props.hasBorder ? 12 : 4}}
                />
                }
            </TouchableOpacity>
            <View
                style={{
                    justifyContent: 'center',
                    height: '77%',
                }}
            >
                <Text style={{color: 'black', alignSelf: 'flex-start'}}>{this.props.text}</Text>

            </View>
        </View>;

    }
}

export default class RadioButtonList extends Component {

    constructor(props) {
        super(props);

        let checked = [];
        this.props.items.map(o => {
            checked.push(!!o.checked);
        });

        this.state = {
            checkedList: checked,
        };
    }

    render() {

        let rows = this.props.numberOfRows ? this.props.numberOfRows : 1;

        let bundle = new Array(rows).fill(null).map((o, i) => {
            let elements = this.props.items.map((o, j) => {
                if (j % rows == i) {
                    return <RadioButton
                        key={j}
                        id={j}
                        text={o.text}
                        checked={this.state.checkedList[j]}
                        hasBorder={this.props.hasBorder}
                        multiselect={this.props.multiselect}
                        textSizeFactor={6 / 2 ** (rows - 1)}
                        onClick={o => this.onItemClicked(o)}>
                    </RadioButton>;
                }
            });

            return <View
                style={{
                    flex: 1 / rows,
                }}>
                {elements}
            </View>;
        });

        return (
            <View
                style={{
                    flexDirection: 'row',
                    marginVertical: 13,
                    borderRadius: 3,
                    borderWidth: this.props.hasBorder ? .5 : 0,
                    borderStyle: 'solid',
                    padding: this.props.hasBorder ? 10 : 7,
                    marginHorizontal: 10,
                    alignItems: 'center',
                }}
            >
                {bundle}
            </View>
        );
    }

    onItemClicked(event) {
        let newCheckedList = [];
        if (this.props.multiselect) {
            newCheckedList = this.state.checkedList;
        } else {
            this.state.checkedList.push(o => {
                newCheckedList.push(false);
            });
        }
        newCheckedList[event.id] = !newCheckedList[event.id];
        this.setState({
            checkedList: newCheckedList,
        });

        this.props.onSelectionChanged({id: event.id, newState: newCheckedList[event.id]});
    }
}
