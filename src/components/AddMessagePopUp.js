import React, {Component} from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from '../react-native';
import images from "../../public/static/assets/images";

import {lightRed, placeholderTextColor, primaryDark, transparent} from '../constants/colors';

import {isValidate} from '../utils';
import {persistStore, userStore} from '../stores';
import {ListMultiSelect} from './index';
import FloatingLabelTextInput from './FloatingLabelTextInput';

export default class AddMessagePopUp extends Component {
    constructor() {
        super();
        this.personCount = persistStore.roles.length;
        this.state = {
            title: '',
            message: '',
            id: '',
            DestinationBuildingID: [], //building
            DestinationRoleID: [], // person
            validationTitle: true,
            validationMessage: true,
            validationBuilding: true,
            validationPerson: true,
        };
    }

    componentDidMount() {
        const {item} = this.props;
        if (item) {
            const perBuilding = [];
            const perPerson = [];

            JSON.parse(item.BuildingNoticeBoardBuilding).map(obj => {
                perBuilding.push(obj.id);
            });
            JSON.parse(item.BuildingNoticeBoardDestinationRole).map(obj => {
                perPerson.push(obj.id);
            });

            this.setState({
                title: item.Title,
                message: item.Description,
                id: item.ID,
                DestinationBuildingID: perBuilding,
                DestinationRoleID: perPerson,
            });
        }
    }

    render() {
        const {hasMultiSelect} = this.props;

        return (
            <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={13}>
                <View
                    style={{
                        backgroundColor: 'white',
                        elevation: 2,
                        width: global.width - (global.width / 5),
                        borderRadius: 4,
                    }}
                >

                    <ScrollView>
                        <View style={{padding: 16}}>
                            <FloatingLabelTextInput
                                ref="textInput"
                                multiline={false}
                                keyboardType="default"
                                returnKeyType="next"
                                floatingLabelEnable={false}
                                underlineColor={this.state.validationTitle ? placeholderTextColor : lightRed}
                                textInputStyle={{
                                    fontSize: 14,
                                    textAlign: 'right',
                                }}
                                underlineSize={1}
                                placeholder="عنوان"
                                onChangeText={text => this.setState({title: text, validationTitle: true})}
                                highlightColor={primaryDark}
                                value={this.state.title}
                            />

                            <TextInput
                                placeholder="پیام خود را وارد کنید"
                                placeholderTextColor={placeholderTextColor}
                                style={[styles.textInput, {
                                    borderColor: this.state.validationMessage ? primaryDark : lightRed,
                                    textAlign: 'right',
                                }]}
                                multiline={true}
                                underlineColorAndroid={transparent}
                                onChangeText={text => this.setState({message: text, validationMessage: true})}
                                returnKeyType="done"
                                value={this.state.message}
                            />
                        </View>

                        {hasMultiSelect &&
                        <View>

                            <Text style={{
                                marginHorizontal: 10,
                                marginBottom: 3,
                                alignSelf: 'flex-start',
                            }}>دسترسی</Text>

                            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 16}}>
                                {userStore.BuildingIds.length > 1 && (
                                    <ListMultiSelect
                                        title='ساختمان های شما'
                                        validation={this.state.validationBuilding}
                                        items={userStore.BuildingIds}
                                        selectedIcon={images.units_icon}
                                        selectedTitle='ساختمان ها'
                                        selectedItems={this.state.DestinationBuildingID}
                                        onAccept={selectedItems => this.setState({DestinationBuildingID: selectedItems})}
                                    />
                                )}

                                <ListMultiSelect
                                    title='اشخاص'
                                    validation={this.state.validationPerson}
                                    items={persistStore.roles}
                                    selectedIcon={images.people_icon}
                                    selectedTitle='اشخاص'
                                    selectedItems={this.state.DestinationRoleID}
                                    onAccept={selectedItems => this.setState({DestinationRoleID: selectedItems})}
                                />
                            </View>
                        </View>
                        }


                    </ScrollView>
                    <TouchableOpacity onPress={() => this.checkValidation()}>
                        <View style={{flexDirection: 'row'}}>
                            <View
                                style={{
                                    flex: 1,
                                    height: 48,
                                    backgroundColor: primaryDark,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderBottomLeftRadius: 4,
                                    borderBottomRightRadius: 4,
                                }}
                            >
                                <Text style={{fontSize: 16, color: 'white'}}>ذخیره</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        );
    }

    checkValidation() {

        Keyboard.dismiss();
        if (!isValidate(this.state.title)) {
            this.setState({validationTitle: false});
            return;
        }

        if (!isValidate(this.state.message)) {
            this.setState({validationMessage: false});
            return;
        }

        if (this.props.hasMultiSelect) {
            if (userStore.BuildingIds.length > 1 && !isValidate(this.state.DestinationBuildingID)) {
                this.setState({validationBuilding: false});
                return;
            }

            if (!isValidate(this.state.DestinationRoleID)) {
                this.setState({validationPerson: false});
                return;
            }
        }

        let item = {
            title: this.state.title,
            description: this.state.message,
        };
        if (this.props.hasMultiSelect) {
            item = Object.assign(item, {
                DestinationBuildingID: userStore.BuildingIds.length > 1 ? this.state.DestinationBuildingID : [userStore.BuildingIds[0].id],
                DestinationRoleID: this.personCount === this.state.DestinationRoleID.length ? null : this.state.DestinationRoleID,
            });
        }
        if (this.state.id) {
            item = Object.assign(item, {ID: this.state.id});
        }

        item = Object.assign(item, {BuildingID: userStore.BuildingID, UnitID: userStore.UnitID});

        this.props.onSave(item);
    }

    // save() {
    //   let data = {
    //     title: this.state.title,
    //     description: this.state.message,
    //   };
    //   if (this.state.id) {
    //     data = Object.assign(data, { ID: this.state.id });
    //   }
    //   this.props.onPress(data);
    // }
}

const styles = StyleSheet.create({
    textInput: {
        paddingHorizontal: 4,
        borderWidth: 0.5,
        height: 120,
        borderRadius: 2,
        fontSize: 12,
        textAlignVertical: 'top',
        marginTop: 32,
    },
    buttonIn: {
        flex: 1,
        borderWidth: 0.5,
        alignItems: 'center',
        borderRadius: 4,
        height: 33,
        justifyContent: 'center',
        marginLeft: 7,
        marginRight: 7,
    },
});
