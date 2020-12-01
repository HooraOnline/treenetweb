import React, {Component} from 'react';
import {IOSSwipeCard} from "./index";
import {IconApp, Platform, Text, View} from "../react-native";
import {black, gray} from "../constants/colors";
import {userStore} from "../stores";

import {priceFormatter} from "../utils";

export default class ScheduleCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scheduleStatustext: '',
            daysText: ''
        };
    }

    getDayOfWeekText() {

        let days = '....';
        if (this.props.weekDayList && this.props.DayOfWeek.length) {
            days = '';
            this.props.DayOfWeek.map((dayID, index) => {
                let seperator = index ? ', ' : '';
                let day = this.props.weekDayList.find(item => item.ID == dayID.toString());
                let text = day ? day.Name : '...';
                days = days + seperator + text;
            })
        }
        this.state.daysText = days

    }

    setScheduleStatustext() {

        let scheduleStatustext = '';
        if (this.props.ScheduleStatusID !== undefined)
            scheduleStatustext = this.props.scheduleStatusList.find(item => item.ID.toString() === this.props.ScheduleStatusID.toString()).Name;
        this.state.scheduleStatustext = scheduleStatustext;
    }

    render() {
        const {
            FromHour,
            ToHour,
            GenderType,
            Price,
            IsSchedule,
            viewMode
        } = this.props;
        const {permission, idSwipeOpened, index} = this.props;
        this.getDayOfWeekText();
        this.setScheduleStatustext();
        return (
            <IOSSwipeCard
                noPadding
                //autoClose={true}
                index={index}
                permission={permission}
                onDelete={viewMode ? null : () => this.props.onSwipeRemove(this.props.item, index)}
                onEdit={viewMode ? null : () => this.props.onSwipeEdit(this.props.item, index)}
                onClose={() =>{}}
                onOpen={id => this.props.onOpenSwipe(id)}
                idSwipeOpened={idSwipeOpened}
            >
                <View style={{
                    flexDirection: 'column',
                    padding: 24,
                    paddingVertical: 15,
                    borderBottomWidth: 1,
                    borderColor: gray
                }}>
                    <View style={{}}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            marginTop: 0
                        }}>
                            {/*<IconApp
                            source={IsSchedule?'apic_pr_TwoMonth':'apic_nd4_pool'}
                            style={{

                                height: 24,
                                width: 24,
                                tintColor: bgDarkBrown,
                            }}
                        />*/}
                            <Text>{IsSchedule ? 'سانس' : 'شناور'}</Text>
                        </View>
                        <Text style={{
                            marginTop: 20,
                            fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
                        }}>{this.state.daysText}</Text>
                        <View style={{flexDirection: 'row', marginTop: 20}}>
                            <View style={{flexDirection: 'row'}}>
                                <IconApp
                                    source={'apic_timer'}
                                    style={{
                                        height: 24,
                                        width: 24,
                                        tintColor: black,
                                    }}
                                />
                                <Text style={{marginHorizontal: 8,}}>{FromHour ? FromHour : 'از ..'}</Text>
                                <Text style={{paddingHorizontal: 20}}>{ToHour ? ToHour : 'تا ...'}</Text>
                            </View>
                            {IsSchedule ? (
                                <View style={{flexDirection: 'row', marginStart: 50}}>

                                    <Text style={{color: black}}> {this.state.scheduleStatustext} </Text>
                                    {this.props.ScheduleStatusID === 0 && (
                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={{color: black}}>/</Text>
                                            <Text
                                                style={{color: black}}>{GenderType === undefined ? ' مختلط ' : GenderType === 0 ? ' بانوان ' : ' آقایان '}</Text>
                                        </View>
                                    )}

                                </View>
                            ) : null

                            }


                        </View>
                        {Price ? (
                            <View style={{flexDirection: 'row', marginTop: 20}}>
                                <IconApp
                                    source={'apic_money'}
                                    style={{
                                        height: 24,
                                        width: 24,
                                        tintColor: black,
                                    }}
                                />
                                <Text style={{
                                    marginHorizontal: 8,
                                    color: black
                                }}> {Price ? priceFormatter(Price) : '...'}</Text>
                                <Text style={{color: black}}> {userStore.CurrencyID}</Text>

                            </View>
                        ) : null
                        }

                    </View>


                </View>

            </IOSSwipeCard>
        );
    }
}
