import React, {PureComponent} from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View} from '../react-native';

import {border, borderLight, niceBlue, overlayColor, primary, textRedLight} from '../constants/colors';
import {ShowDateTime} from './index';
import images from "../../public/static/assets/images";
import {withStyles} from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import IconApp from "../react-native/IconApp";
const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 10,
        borderRadius: 5,
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        borderRadius: 5,
        backgroundColor: textRedLight,
    },
}))(LinearProgress);


class Selection extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            id,
            onClick = null,
            title = '',
            selected = true,
            percentage = null,
            selectable,
        } = this.props;
        return (
            <View>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: 1,
                        paddingVertical: 7,
                        height: 40,
                        borderColor: selected ? '#FFC7BB' : '#E5DEDE',
                        borderRadius: 10,
                        backgroundColor: selected ? '#FFF3F1' : 'white',
                        paddingStart: 10, marginBottom: 10,
                        position:'relative',
                    }}
                    onPress={() => {
                        onClick(id);
                    }}
                    disabled={!selectable}
                >

                    <View
                        style={{
                            position: 'absolute',
                            start: 0,
                            top: 0,
                            bottom: 0,
                            width: (global.width - 48) * percentage,
                            backgroundColor: selected ? '#FFC7BB' : '#E5DEDE',
                            borderRadius: 9,
                        }}
                    />

                    <View
                        style={{
                            width: 16, height: 16, borderWidth: 1, backgroundColor: selected ? '#EA4523' : 'white',
                            borderRadius: 10, borderColor: selected ? '#EA4523' : '#E5DEDE', marginEnd: 16,
                        }}
                    />

                    <Text style={{
                        fontFamily: Platform.OS === 'ios' ? 'IRANYekan-Medium' : 'IRANYekanMedium',
                        fontSize: 12,
                        color: '#5D4A4A',
                    }}>{title}</Text>

                    {(percentage > 0 || percentage === 0) && (
                        <Text style={{
                            position: 'absolute',
                            end: 10,
                            top: 10,
                            alignSelf: 'flex-end',
                            fontSize: 12,
                            color: '#8A7E7E',
                        }}>{Math.round(percentage * 100)}٪</Text>
                    )}

                  {/*  <View style={{ width:'90%', }}>
                        <BorderLinearProgress style={{height:20,color:'#00c400'}} variant="determinate" value={50} />
                    </View>*/}
                </TouchableOpacity>

            </View>
        );
    }

}

class SelectionList extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            titleList = [],
            percentageList = [],
            selected = -1,
            onSelect,
            selectable = true,
        } = this.props;

        const answerBoxes = titleList.map((o, index) => {
            return (
                <Selection
                    key={index.toString()}
                    selectable={selectable}
                    id={index}
                    onClick={onSelect} title={o}
                    selected={index == selected ? true : false}
                    percentage={percentageList.length > 0 ? percentageList[index] : null}/>);
        });

        return (
            <View>
                {answerBoxes}
            </View>
        );
    }

}

export default class SurveyCard extends PureComponent {
    constructor() {
        super();
    }

    render() {
        const {
            Question,
            QuestionType,
            AnswerOne,
            AnswerTwo,
            AnswerThree,
            AnswerFour,
            AnswerOneCount,
            AnswerTwoCount,
            AnswerThreeCount,
            AnswerFourCount,
            CreatedAtDatetime,
            StartFromDate,
            HasAccessToSubmit,
            HasAccessToViewResult,
            MyOpinion,

        } = this.props.item;

        const {permission, onDelete, navigateToEdit,ongetOpinionPress} = this.props;

        const sum = AnswerOneCount + AnswerTwoCount + AnswerThreeCount + AnswerFourCount;

        let titleList = [AnswerOne, AnswerTwo];
        if (!QuestionType) {
            if (AnswerThree != '') {
                titleList.push(AnswerThree);
            }
            if (AnswerFour != '') {
                titleList.push(AnswerFour);
            }
        }
        return (
            <View
                style={{
                    marginStart: 24,
                    marginEnd: 24,
                    marginTop: 24,
                    marginBottom: 16,
                    borderBottomWidth: 1,
                    borderColor: borderLight,
                    paddingBottom: 16,
                }}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{
                        flex: 1,
                        color: '#5D4A4A',
                        fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
                        fontSize: 14,
                    }}>{Question}</Text>
                    {permission.writeAccess && (
                        <TouchableOpacity
                            onPress={() => navigateToEdit(this.props.item)}
                            style={{padding: 5, marginEnd: 5}}
                        >
                            <IconApp
                                class={'apic_edit'}
                                style={{width: 24, height: 24, tintColor: niceBlue}}
                            />
                        </TouchableOpacity>
                    )}
                    {permission.deleteAccess && (
                        <TouchableOpacity
                            onPress={() => onDelete(this.props.item)}
                            style={{padding: 5}}
                        >
                            <IconApp
                                source={'apic_delete'}
                                style={{width: 24, height: 24, tintColor: '#e95959'}}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={{flexDirection: 'row', paddingTop: 5, paddingBottom: 15, justifyContent: 'space-between'}}>
                    <ShowDateTime
                        time={CreatedAtDatetime}
                        showTime
                        fontSize={12}
                        color={border}
                        dotSize={2}
                    />

                    {HasAccessToViewResult ? (
                       <TouchableOpacity style={{
                           borderBottomWidth:sum?1:0,
                           paddingStart:5,
                           borderColor: '#5D4A4A'

                       }}
                         onPress={sum?()=>ongetOpinionPress(this.props.item):null}
                       >
                           <Text style={{
                               color: '#5D4A4A',
                               fontSize: 12,
                           }}>{sum} رای </Text>
                       </TouchableOpacity>
                    ) : (<View/>)}
                </View>
                <View>
                    <View style={{opacity: new Date(StartFromDate) > new Date() ? .5 : 1}}>
                        {QuestionType ? (
                            <SelectionList
                                titleList={['بله', 'خیر']}
                                percentageList={HasAccessToViewResult && (!HasAccessToSubmit || MyOpinion) ?
                                    [sum?AnswerOneCount / sum:0, sum?AnswerTwoCount / sum:0] : []}
                                selected={MyOpinion ? MyOpinion - 1 : -1}
                                onSelect={(id) => this.submitServeyResult(id)}
                                selectable={HasAccessToSubmit && new Date(StartFromDate) <= new Date()}
                            />

                        ) : (
                            <SelectionList
                                titleList={titleList}
                                percentageList={HasAccessToViewResult && (!HasAccessToSubmit || MyOpinion) ?
                                    [AnswerOneCount / sum, AnswerTwoCount / sum, AnswerThreeCount / sum, AnswerFourCount / sum] : []}
                                selected={MyOpinion ? MyOpinion - 1 : -1}
                                onSelect={(id) => this.submitServeyResult(id)}
                                selectable={HasAccessToSubmit && new Date(StartFromDate) <= new Date()}
                            />
                        )}
                    </View>

                    {new Date(StartFromDate) > new Date() && (
                        <View
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    padding: 8,
                                    borderRadius: 10,
                                    backgroundColor: overlayColor,
                                }}>
                                <Text style={{color: 'white'}}> انتشار در </Text>
                                <ShowDateTime
                                    time={StartFromDate}
                                    fontSize={14}
                                    color={'white'}
                                    dotSize={2}
                                />
                            </View>

                        </View>
                    )}
                </View>
            </View>
        );
    }

    async submitServeyResult(opinionID) {
        opinionID += 1;
        const newItem = {
            BuildingSurveyID: this.props.item.ID,
            Answer: opinionID,
        };
        this.props.onOpinionPress(newItem);

    }
}
const styles = StyleSheet.create({
    optionBtn: {
        borderWidth: 1,
        borderColor: primary,
        padding: 8,
        borderRadius: 2,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
});
