import React, {Component} from 'react';
import {Image, Keyboard, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from '../react-native';
import images from "public/static/assets/images";
import {lightRed, placeholderTextColor, primaryDark} from '../constants/colors';
import {isValidate,
   // OsDependantKeyboardAvoidingView
} from '../utils';
import {ListMultiSelect, PersianCalendarPickerPopup} from './index';
import {persistStore, userStore} from '../stores';
import FloatingLabelTextInput from './FloatingLabelTextInput';
const jMoment = require('moment-jalaali');

export default class SurveyPopUp extends Component {
    constructor(props) {
        super(props);
        this.personCount = persistStore.roles.length;

        this.state = {
            id: '',
            Title: '',
            QuestionType: true,
            AnswerOne: '',
            AnswerTwo: '',
            Question: '',
            AnswerThree: '',
            AnswerFour: '',
            showMultiSelect: false,
            selectedStartDate: null,

            DestinationBuildingID: [], //building
            DestinationRoleID: [], // person
            ViewResultDestinationRoleID: [], //resulPerson

            validationTitle: true,
            validationQuestion: true,
            validationMultiOp1: true,
            validationMultiOp2: true,
            validationDate: true,
            validationBuilding: true,
            validationPerson: true,
            validationResulPerson: true,
        };
    }

    componentDidMount() {
        const {showMultiSelect, calendarState, item} = this.props;
        if (item) {
            const perBuilding = [];
            const perPerson = [];
            const perResultPerson = [];

            JSON.parse(item.BuildingSurveyBuilding).map(obj => {
                perBuilding.push(obj.id);
            });
            JSON.parse(item.BuildingSurveyDestinationRole).map(obj => {
                perPerson.push(obj.id);
            });
            JSON.parse(item.ViewResultDestinationRoleID).map(obj => {
                perResultPerson.push(obj.id);
            });


            this.setState({
                id: item.ID,
                Title: item.Title,
                QuestionType: item.QuestionType,
                AnswerOne: item.AnswerOne,
                AnswerTwo: item.AnswerTwo,
                Question: item.Question,
                AnswerThree: item.AnswerThree,
                AnswerFour: item.AnswerFour,
                showMultiSelect: showMultiSelect,
                selectedStartDate: item.StartFromDate,
                DestinationBuildingID: perBuilding,
                DestinationRoleID: perPerson,
                ViewResultDestinationRoleID: perResultPerson,
            });
        }
    }

    render() {
        return (
            <View
                style={{
                    backgroundColor: 'white',
                    elevation: 2,
                    width: global.width - (global.width / 5),
                    borderRadius: 4,
                }}
            >

                <ScrollView>
                   {/* <OsDependantKeyboardAvoidingView>*/}
                        <View style={{padding: 16}}>
                            <View
                                style={{
                                    marginVertical: 23,
                                }}
                            >
                                <FloatingLabelTextInput
                                    ref="textInput"
                                    multiline={false}
                                    keyboardType="default"
                                    returnKeyType="done"
                                    floatingLabelEnable={true}
                                    underlineColor={this.state.validationTitle ? placeholderTextColor : lightRed}
                                    textInputStyle={{
                                        fontSize: 12,
                                        color: 'black',
                                        textAlign: 'right',
                                    }}
                                    underlineSize={1}
                                    placeholder="عنوان نظرسنجی(نظرسنجی شماره ۱) "
                                    onChangeText={text => this.setState({Title: text, validationTitle: true})}
                                    highlightColor={primaryDark}
                                    value={this.state.Title}
                                    onSubmitEditing={() => Keyboard.dismiss()}
                                />
                            </View>

                            <View
                                style={{
                                    marginBottom: 16,
                                }}
                            >
                                <FloatingLabelTextInput
                                    ref="textInput"
                                    multiline={false}
                                    keyboardType="default"
                                    returnKeyType="done"
                                    floatingLabelEnable={true}
                                    underlineColor={this.state.validationQuestion ? placeholderTextColor : lightRed}
                                    textInputStyle={{
                                        fontSize: 12,
                                        color: 'black',
                                        textAlign: 'right',
                                    }}
                                    underlineSize={1}
                                    placeholder="لطفا سوال نظرسنجی را در اینجا وارد کنید"
                                    onChangeText={text => this.setState({
                                        Question: text,
                                        validationQuestion: true,
                                    })}
                                    highlightColor={primaryDark}
                                    value={this.state.Question}
                                    onSubmitEditing={() => Keyboard.dismiss()}
                                />
                            </View>
                            <View style={{flexDirection: 'row', marginVertical: 16}}>
                                <TouchableOpacity style={[styles.buttonIn, styles.noneBorder]}
                                                  onPress={() => this.setState({QuestionType: true})}>
                                    <View style={{flexDirection: 'row', marginRight: 16}}>
                                        <Text>دو گزینه‌ای</Text>
                                        <Image
                                            source={
                                                this.state.QuestionType
                                                    ? images.checked_icon
                                                    : images.unchecked_icon
                                            }
                                            style={{tintColor: primaryDark, height: 18, width: 18}}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.buttonIn, styles.noneBorder]}
                                                  onPress={() => this.setState({QuestionType: false})}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text>چند گزینه‌ای</Text>
                                        <Image
                                            source={
                                                !this.state.QuestionType
                                                    ? images.checked_icon
                                                    : images.unchecked_icon
                                            }
                                            style={{tintColor: primaryDark, height: 18, width: 18}}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {!this.state.QuestionType && (
                                <View>
                                    <View style={{marginVertical: 8}}>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={{marginRight: 16, textAlign: 'left'}}>
                                                گزینه اول
                                            </Text>
                                            <FloatingLabelTextInput
                                                ref="textInput"
                                                multiline={false}
                                                keyboardType="default"
                                                returnKeyType="done"
                                                floatingLabelEnable={false}
                                                underlineColor={this.state.validationMultiOp1 ? placeholderTextColor : lightRed}
                                                textInputStyle={{
                                                    fontSize: 12,
                                                    color: 'black',
                                                    flexGrow: 1,
                                                    textAlign: 'center',
                                                }}
                                                underlineSize={1}
                                                placeholder="نوشته گزینه اول"
                                                style={{flex: 1}}
                                                onChangeText={text => this.setState({
                                                    AnswerOne: text,
                                                    validationMultiOp1: true,
                                                })}
                                                highlightColor={primaryDark}
                                                value={this.state.AnswerOne}
                                                onSubmitEditing={() => Keyboard.dismiss()}
                                            />
                                        </View>
                                    </View>

                                    <View style={{marginVertical: 8}}>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={{marginRight: 16, textAlign: 'left'}}>
                                                گزینه دوم
                                            </Text>
                                            <FloatingLabelTextInput
                                                ref="textInput"
                                                multiline={false}
                                                keyboardType="default"
                                                returnKeyType="done"
                                                floatingLabelEnable={false}
                                                underlineColor={this.state.validationMultiOp2 ? placeholderTextColor : lightRed}
                                                textInputStyle={{
                                                    fontSize: 12,
                                                    color: 'black',
                                                    flexGrow: 1,
                                                    textAlign: 'center',
                                                }}
                                                underlineSize={1}
                                                placeholder="نوشته گزینه دوم"
                                                style={{flex: 1}}
                                                onChangeText={text => this.setState({
                                                    AnswerTwo: text,
                                                    validationMultiOp2: true,
                                                })}
                                                highlightColor={primaryDark}
                                                value={this.state.AnswerTwo}
                                                onSubmitEditing={() => Keyboard.dismiss()}
                                            />
                                        </View>
                                    </View>

                                    <View style={{marginVertical: 8}}>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={{marginRight: 16, textAlign: 'left'}}>
                                                گزینه سوم
                                            </Text>
                                            <FloatingLabelTextInput
                                                ref="textInput"
                                                multiline={false}
                                                keyboardType="default"
                                                returnKeyType="done"
                                                floatingLabelEnable={false}
                                                underlineColor={placeholderTextColor}
                                                textInputStyle={{
                                                    fontSize: 12,
                                                    color: 'black',
                                                    flexGrow: 1,
                                                    textAlign: 'center',
                                                }}
                                                underlineSize={1}
                                                placeholder="نوشته گزینه سوم"
                                                style={{flex: 1}}
                                                onChangeText={text => this.setState({AnswerThree: text})}
                                                highlightColor={primaryDark}
                                                value={this.state.AnswerThree}
                                                onSubmitEditing={() => Keyboard.dismiss()}
                                            />
                                        </View>
                                    </View>

                                    <View style={{marginVertical: 8}}>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={{marginRight: 16, textAlign: 'left'}}>
                                                گزینه چهارم
                                            </Text>
                                            <FloatingLabelTextInput
                                                ref="textInput"
                                                multiline={false}
                                                keyboardType="default"
                                                returnKeyType="done"
                                                floatingLabelEnable={false}
                                                underlineColor={placeholderTextColor}
                                                textInputStyle={{
                                                    fontSize: 12,
                                                    color: 'black',
                                                    flexGrow: 1,
                                                    textAlign: 'center',
                                                }}
                                                underlineSize={1}
                                                placeholder="نوشته گزینه چهارم"
                                                style={{flex: 1}}
                                                onChangeText={text => this.setState({AnswerFour: text})}
                                                highlightColor={primaryDark}
                                                value={this.state.AnswerFour}
                                                onSubmitEditing={() => Keyboard.dismiss()}
                                            />
                                        </View>
                                    </View>
                                </View>
                            )}

                            <View style={{flexDirection: 'row', marginVertical: 17}}>
                                <View style={{flex: 1}}>
                                    <PersianCalendarPickerPopup
                                        showToday
                                        selectedDate={this.state.selectedStartDate}
                                        onValueChange={date => this.setState({selectedStartDate: date})}
                                        defaultTitle={'زمان اجرا'}
                                        minDate={jMoment.utc()}
                                    />
                                </View>
                            </View>

                            <Text style={{
                                borderBottomWidth: 0.5,
                                borderColor: primaryDark,
                                marginHorizontal: 10,
                                alignSelf: 'flex-start',
                            }}>دسترسی</Text>

                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
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

                            <View style={{flexDirection: 'row', marginTop: 17}}>
                                <ListMultiSelect
                                    title='مشاهده نتایج'
                                    validation={this.state.validationResulPerson}
                                    items={persistStore.roles}
                                    selectedIcon={images.people_icon}
                                    selectedTitle='مشاهده نتایج(اشخاص)'
                                    selectedItems={this.state.ViewResultDestinationRoleID}
                                    onAccept={selectedItems => this.setState({ViewResultDestinationRoleID: selectedItems})}
                                />
                            </View>

                        </View>
                   {/* </OsDependantKeyboardAvoidingView>*/}
                </ScrollView>

                <TouchableOpacity
                    onPress={() => this.checkValidation()}
                    style={{marginBottom: !this.state.QuestionType ? 17 : 0}}

                >
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
        );
    }

    checkValidation() {
        Keyboard.dismiss();
        if (!isValidate(this.state.Title)) {
            this.setState({validationTitle: false});
            return;
        }

        if (!isValidate(this.state.Question)) {
            this.setState({validationQuestion: false});
            return;
        }

        if (!this.state.QuestionType) {
            if (!isValidate(this.state.AnswerOne)) {
                this.setState({validationMultiOp1: false});
                return;
            }
            if (!isValidate(this.state.AnswerTwo)) {
                this.setState({validationMultiOp2: false});
                return;
            }
        }

        if (userStore.BuildingIds.length > 1 && !isValidate(this.state.DestinationBuildingID)) {
            this.setState({validationBuilding: false});
            return;
        }

        if (!isValidate(this.state.DestinationRoleID)) {
            this.setState({validationPerson: false});
            return;
        }

        if (!isValidate(this.state.ViewResultDestinationRoleID)) {
            this.setState({validationResulPerson: false});
            return;
        }


        let item = {
            Title: this.state.Title,
            Question: this.state.Question,
            QuestionType: this.state.QuestionType,
            AnswerOne: this.state.QuestionType ? '' : this.state.AnswerOne,
            AnswerTwo: this.state.QuestionType ? '' : this.state.AnswerTwo,
            AnswerThree: this.state.QuestionType ? '' : this.state.AnswerThree,
            AnswerFour: this.state.QuestionType ? '' : this.state.AnswerFour,
            StartFromDate: this.state.selectedStartDate,
            DestinationBuildingID: userStore.BuildingIds.length > 1 ? this.state.DestinationBuildingID : [userStore.BuildingIds[0].id],
            DestinationRoleID: this.personCount === this.state.DestinationRoleID.length ? null : this.state.DestinationRoleID,
            ViewResultDestinationRoleID: this.personCount === this.state.ViewResultDestinationRoleID.length ? null : this.state.ViewResultDestinationRoleID,
        };

        if (this.state.id) {
            item = Object.assign(item, {ID: this.state.id});
        }

        item = Object.assign(item, {BuildingID: userStore.BuildingID, UnitID: userStore.UnitID});


        this.props.onSave(item);
    }
}

const styles = StyleSheet.create({
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
    noneBorder: {
        borderWidth: 0,
    },
});
