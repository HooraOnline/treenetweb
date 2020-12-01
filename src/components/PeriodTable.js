import React, {Component,PureComponent} from 'react';
import {
    Keyboard,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList, Platform, Image, Modal,
    TextInput,
    TouchableWithoutFeedback,

} from '../react-native';


import {mapNumbersToEnglish, parseTimeToGregorian, parseTimeToJalaali} from "../utils";
import {primary, primaryDark, subTextItem, textItem, textItemBlack} from "../constants/colors";
import images from "public/static/assets/images";
var jMoment = require('moment-jalaali');
import { Calendar } from "react-modern-calendar-datepicker";
import { Dialog } from '@material-ui/core';

class PeriodTableItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            period:props.period,
            title:props.period.name,
            showDatePickerDialog: false,
        }
    }
    showDatePicker=(periodItemType)=> {
        if(this.props.showMode)
            return;
        this.periodItemType=periodItemType;
        let date=new Date();
        if(this.state.period[periodItemType]){
            date= new Date(this.state.period[periodItemType]);
        }
        let pdate=parseTimeToJalaali(mapNumbersToEnglish(jMoment(date).format('YYYY-M-D')), false)
        pdate = mapNumbersToEnglish(pdate).split('/');
      
        this.selectedDate={
            year: Number(pdate[0]),
            month: Number(pdate[1]),
            day: Number(pdate[2]),
        }
      
        this.setState({showDatePickerDialog: true});
    }

    hideDatePicker=()=> {
        this.selectedDateId = null;
        this.periodItemType = null;
        this.selectedDate = null;
        this.setState({showDatePickerDialog: false});
    }
    onDateChange(date) {
       
        let newDate=parseTimeToGregorian(date.year,date.month,date.day);
        this.props.period[this.periodItemType] = newDate;
        this.props.period.error=false;
        this.setState({period: this.state.period});
        this.props.onDateChange && this.props.onDateChange(new Date(newDate),this.periodItemType);
        this.hideDatePicker();

    }
    onMonthChange(date) {
        //this.setState({previousTitle:false,nextTitle:false})
    }
    onTitleChanged=(title)=>{
        this.props.period.name=title;
        this.setState({title:title})
    }
    componentDidMount() {
        this.setState({title:this.props.period.name})
    }

    render() {
        this.state.period=this.props.period;
        const {
            validation = true,
            disabled,
            selectedDate = new Date(),
            minWidth = 250,
            selectedItemCustom,
            defaultTitle = 'تاریخ',
            showToday = false,
            minDate,
            simple,
            iconColor = textItem,
            style,
        } = this.props;
        let width=340;
        return (
            <View style={{flex:1,borderRadius:10,backgroundColor:'#fff',margin:8,padding:16}}>
                {


                    !this.state.editTitle ?
                        <TouchableOpacity onPress={()=>{
                            if(!this.props.writePermission ||  this.props.showMode)
                                return;
                            this.setState({editTitle:true,title:this.props.period.name});
                        }}>
                            <Text style={styles.title}>{this.props.period.name}</Text>
                        </TouchableOpacity>

                        :
                        <TextInput
                            style={[{
                                flex:1,
                                fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
                                marginBottom:25,
                                height:42,
                                width:'100%',
                                fontSize: 12,
                                borderColor:'#BFACAC',
                                borderBottomWidth: 0.5,
                                alignSelf: 'center',
                                textAlign: 'right',
                                fontWeight: 'normal',
                                //borderRadius: 10,
                            }]}
                            autoFocus={true}
                            placeholder={'عنوان دوره'}
                            onChangeText={this.onTitleChanged}
                            onBlur={()=>{
                                this.setState({editTitle:false});
                            }
                            }
                            value={this.state.title}
                        />


                }
                <View style={{flexDirection:'row',justifyContent:"space-between",alignItems:'center'}}>
                    <Text style={styles.label} >شروع</Text>
                    <TouchableOpacity
                        disabled={!this.props.showMode && this.state.period.chmod & 1 ? false : true}
                        style={[{flex:1},styles.buttonIn, {borderColor: !this.props.showMode && this.state.period.chmod & 1 ? primaryDark : subTextItem}]}
                        onPress={() => {
                            this.showDatePicker('startDate');
                            Keyboard.dismiss();
                        }}
                    >
                        <View style={{flexDirection: 'row'}}>
                            <View style={styles.dateRow}>

                                <Text style={[{color:!this.props.showMode && this.state.period.chmod & 1 ? primaryDark : textItemBlack,},styles.date]}>
                                    {this.state.period.startDate ? jMoment(this.state.period.startDate).format('jYY/jMM/jDD') : ''}

                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{flexDirection:'row',justifyContent:"space-between",marginVertical: 15,alignItems:'center'}}>
                    <Text style={styles.label} >پایان</Text>
                    <TouchableOpacity
                        disabled={!this.props.showMode && this.state.period.chmod & 2 ? false : true}
                        style={[{flex:1},styles.buttonIn, {borderColor:!this.props.showMode && this.state.period.chmod & 2 ? primaryDark : subTextItem}]}
                        onPress={() => {
                            this.showDatePicker('endDate');
                            Keyboard.dismiss();
                        }}
                    >
                        <View style={{flexDirection: 'row'}}>
                            <View style={styles.dateRow}>

                                <Text style={[{color:!this.props.showMode && this.state.period.chmod & 2 ? primaryDark : textItemBlack,},styles.date]}>
                                    {this.state.period.endDate ?jMoment(this.state.period.endDate).format('jYY/jMM/jDD') : ''}

                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:'row',justifyContent:"space-between",marginVertical:10,alignItems:'center'}}>
                    <Text style={styles.label} >مهلت</Text>
                    <TouchableOpacity
                        disabled={!this.props.showMode && this.state.period.chmod & 4 ? false : true}
                        style={[{flex:1},styles.buttonIn, {borderColor:!this.props.showMode && this.state.period.chmod & 4 ? primaryDark : subTextItem}]}
                        onPress={() => {
                            this.showDatePicker('deadLine');
                            Keyboard.dismiss();
                        }}
                    >
                        <View style={{flexDirection: 'row'}}>
                            <View style={styles.dateRow}>

                                <Text style={[{color:!this.props.showMode && this.state.period.chmod & 4 ? primaryDark : 'black',},styles.date]}>
                                    {this.state.period.deadLine ?jMoment(this.state.period.deadLine).format('jYY/jMM/jDD') : ''}

                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <Dialog
                    open={this.state.showDatePickerDialog}
                    onClose={() => {
                        this.hideDatePicker();
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    scroll={'body'}
                    fullWidth={false}
                    //maxWidth={'sm'}
                    style={{width:'100%', height:'100%',alignSelf:'center', }}
                >
                    <View   style={{ width:'100%',alignSelf:'center', }}>
                        <TouchableWithoutFeedback  >
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>

                                <View
                                    style={{
                                        backgroundColor: 'white',
                                        elevation: 7,
                                        minWidth: minWidth,
                                        borderRadius: 10,
                                        alignItems: 'center',
                                        width:width,

                                        //maxWith:maxWith,
                                    }}
                                >
                                    {
                                        <Text style={{alignSelf:'center',marginVertical:10}} >{this.props.title ||'انتخاب روز'}</Text>
                                    }
                                     {/* <PersianCalendarPickerPopup
                                        onDateChange={date => this.onDateChange(date)}
                                        onMonthChange={date => this.onMonthChange(date)}
                                        selectedStartDate={this.selectedDate}
                                        minDate={this.props.minDate}
                                        maxDate={this.props.maxDate}
                                        selectedDayColor={primary}
                                        selectedDayTextColor={'white'}
                                        initialDate={this.selectedDate}
                                        // minDate={jMoment()}
                                    /> */}
                                    <Calendar
                                        value={this.selectedDate}
                                        onChange={(date,date2) =>this.onDateChange(date)}
                                        shouldHighlightWeekends
                                        locale="fa" // add this
                                    />
                                    {showToday && (
                                        <TouchableOpacity
                                            style={{alignSelf: 'flex-end', paddingHorizontal: 30, marginVertical:10}}
                                            onPress={() => this.selectToday()}
                                        >
                                            <View style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}>
                                                <Text style={{
                                                    marginRight: 7,
                                                    marginLeft: 7,
                                                    color: primaryDark
                                                }}
                                                >امروز</Text>
                                                <IconApp
                                                    source={'apic_Calendar'}
                                                    style={{
                                                        tintColor: primaryDark,
                                                        height: 18, width: 18}}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>

                </Dialog>

                {/* <Modal
                    animationType="none"
                    transparent={true}
                    visible={this.state.showDatePickerDialog}
                    style={{}}
                    onRequestClose={() => {
                        this.hideDatePicker();
                    }}>
                    <View   style={{flex:1, backgroundColor: 'rgba(38, 32, 32, 0.7)',}}>
                        <TouchableOpacity onPress={()=>this.hideDatePicker()}   style={{flex:1,height:100}}>

                        </TouchableOpacity>
                        <View
                            style={{
                                backgroundColor: 'white',
                                elevation: 3,
                                borderRadius: 4,

                            }}>

                            <PersianCalendarPickerPopup
                                onDateChange={date => this.onDateChange(date)}
                                onMonthChange={date => this.onMonthChange(date)}
                                selectedStartDate={this.selectedDate}
                                minDate={this.props.minDate}
                                maxDate={this.props.maxDate}
                                selectedDayColor={primary}
                                selectedDayTextColor={'white'}
                                initialDate={this.selectedDate}
                                // minDate={jMoment()}
                            />
                            <TouchableOpacity
                                style={{alignSelf: 'flex-end', paddingHorizontal: 13, paddingBottom: 13}}
                                onPress={() => this.onDateChange(jMoment())}
                            >
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                    <Text style={{marginRight: 7, marginLeft: 7, color: primaryDark}}>امروز</Text>
                                    <Image
                                        source={images.goToTodayIcon}
                                        style={{tintColor: primaryDark, height: 18, width: 18}}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={()=>this.hideDatePicker()}   style={{flex:1,}}>
                        </TouchableOpacity>
                    </View>
                </Modal> */}
                 <style jsx global>{`
                .DatePicker {
                    position: relative;
                    display: inline-block;
                    z-index: 10;
                    }
                    .MuiDialog-container{
                    height:auto
                    }

.DatePicker__input {
background: #fff;
border: 1px solid #ddd;
padding: 0.4em 0.8em;
font-family: inherit;
text-align: center;
font-size: 12px;
}

.DatePicker__input.-rtl {
  direction: rtl;
}

.DatePicker__input::placeholder {
  color: #979797;
}

.DatePicker__calendarContainer.-top + .DatePicker__calendarArrow {
  top: auto;
  bottom: calc(100% + 10px);
  transform: translateY(-2.5rem) rotate(180deg);
  animation: fadeArrowFlipped 0.3s forwards;
}

.DatePicker__calendarContainer {
  position: absolute;
  top: calc(100% + 20px);
  left: 50%;
  transform: translateX(-50%);
  direction:rtl;
}

.DatePicker__calendarContainer.-top {
  top: auto;
  bottom: calc(100% + 20px);
}

.Calendar,
.Calendar * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  direction: ltr;
}

.Calendar,
.Calendar.-rtl * {
  direction: rtl;
}

.DatePicker__calendarArrow {
  position: absolute;
  width: 0;
  height: 0;
  top: calc(100% + 10px);
  left: 0;
  right: 0;
  margin: 0 auto;
  border-style: solid;
  z-index: 10;
  border-width: 0 10px 10px 10px;
  border-color: transparent transparent #fff transparent;
}

.Calendar {
  --cl-color-black: #777777;
  --cl-color-disabled: #d4d4d4;
  --cl-color-error: #ff2929;
  font-size: 9px;
  background: #fff;
  box-shadow: 0 1em 4em rgba(0, 0, 0, 0.07);
  border-radius: 1em;
  position: relative;
  user-select: none;
  padding-top: 0.1em;
  display: flex;
  flex-direction: column;
  width: 33em;
  z-index: 10;
  max-width: 90vw;
  min-height: 20.7em;
}

.DatePicker .Calendar,
.DatePicker__calendarArrow {
  transform: translateY(2.5em);
  opacity: 0;
  animation: fadeCalendar 0.3s forwards;
}

.DatePicker__calendarContainer.-top .Calendar {
  transform: translateY(-2.5em);
}

.Calendar.-noFocusOutline *:focus {
  outline: none !important;
}

.Calendar *:not(.Calendar__footer) button {
  font-family: inherit;
  background: transparent;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  outline: none;
}

.Calendar__header {
  display: flex;
  color: var(--cl-color-black);
  padding: 1em 2.9em;
  align-items: center;
  overflow: hidden;
}

.Calendar__monthArrowWrapper {
  line-height: 0;
  font-size: 0.6em;
  padding: 3px;
  position: relative;
  border: none;
  z-index: 1;
  opacity: 1;
  transition: 0.2s;
}

.Calendar__monthArrowWrapper:focus {
  outline: 1px dashed rgba(0, 0, 0, 0.4);
  outline-offset: 2px;
}

.Calendar__monthArrowWrapper:disabled,
.Calendar__monthArrowWrapper.-hidden {
  opacity: 0;
  pointer-events: none;
}

.Calendar__monthArrowWrapper.-left {
  transform: rotate(90deg);
}
.Calendar.-rtl .Calendar__monthArrowWrapper.-left {
  transform: rotate(-90deg);
}

.Calendar__monthArrowWrapper.-right {
  transform: rotate(-90deg);
}
.Calendar.-rtl .Calendar__monthArrowWrapper.-right {
  transform: rotate(90deg);
}
.Calendar.-rtl * {
  direction: rtl;
 
}

.Calendar__monthArrowWrapper:active .Calendar__monthArrow {
  transform: scale(0.7);
}

.Calendar__monthArrow {
  border-radius: 50%;
  transition: var(--animation-duration) transform;
  pointer-events: none;
  background-repeat: no-repeat;
  display: block;
  width: 1.7em;
  height: 1.7em;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg class='nc-icon-wrapper' fill='%23000000'%3E%3Cdefs stroke='none'%3E%3C/defs%3E%3Cpath class='cls-1' d='M12 23.25V.75' fill='none' stroke='%23000000' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5px'%3E%3C/path%3E%3Cpath class='cls-2' d='M22.5 11.25L12 .75 1.5 11.25' fill='none' stroke='%23000000' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5px' fill-rule='evenodd'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
  background-size: 100% 100%;
}

.Calendar__monthYearContainer {
  flex: 1;
  position: relative;

}

.Calendar__monthYear {
  font-size: 0.9em;
  font-weight: 500;
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  will-change: transform, opacity;
  backface-visibility: hidden;
  transform: translateZ(0);
  transition: var(--animation-duration);
  line-height: 1;
}

.Calendar__monthYear.-hiddenNext {
  opacity: 0;
  transform: translateX(50%);
}

.Calendar.-rtl .Calendar__monthYear.-hiddenNext {
  transform: translateX(-150%);
}

.Calendar__monthYear.-hiddenPrevious {
  opacity: 0;
  transform: translateX(-150%);
}

.Calendar.-rtl .Calendar__monthYear.-hiddenPrevious {
  transform: translateX(50%);
}

.Calendar__monthYear.-shown {
  opacity: 1;
  margin-top: auto;
  margin-bottom: auto;
  transform: translateX(-50%);
}

.Calendar__monthYear.-shownAnimated {
  animation: var(--animation-duration) fadeTextToCenter forwards;
}

.Calendar__monthYear > * {
  padding: 0.2em 0.5em;
  border: 1px solid transparent;
  transition: var(--animation-duration);
  font-size: 1.05em;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateX(0) scale(0.95);
  will-change: transform;
  border-radius: 5px;
}

.Calendar__monthYear:not(.-shown) > *,
.Calendar__monthYear > *.-hidden {
  cursor: default;
  pointer-events: none;
}

.Calendar__monthText {
  margin-left: -0.3em;
}
.Calendar__yearText:last-child {
  margin-right: -0.3em;
}

.Calendar__monthYear.-shown > *:hover,
.Calendar:not(.-noFocusOutline) .Calendar__monthYear.-shown > *:focus,
.Calendar__monthYear > *.-activeBackground {
  background: #f5f5f5;
}

.Calendar__monthText:hover {
  transform: translateX(-0.2em) scale(0.95);
}
.Calendar.-rtl .Calendar__monthText:hover {
  transform: translateX(0.2em) scale(0.95);
}
.MuiPaper-elevation24 {
    box-shadow: 0px 0px 0px 0px rgba(0,0,0,0), 0px 0px 0px 0px rgba(0,0,0,0), 0px 0px 0px 0px rgba(0,0,0,0);
    }
.Calendar__yearText:hover {
  transform: translateX(0.2em) scale(0.95);
}
.Calendar.-rtl .Calendar__yearText:hover {
  transform: translateX(-0.2em) scale(0.95);
}

.Calendar__monthYear .Calendar__yearText.-hidden {
  transform: translateX(50%);
  opacity: 0;
}

.Calendar.-rtl .Calendar__monthYear .Calendar__yearText.-hidden {
  transform: translateX(-50%);
}

.Calendar__monthYear .Calendar__monthText.-hidden {
  transform: translateX(-50%);
  opacity: 0;
}

.Calendar.-rtl .Calendar__monthYear .Calendar__monthText.-hidden {
  transform: translateX(50%);
}

.Calendar__monthYear:not(.-shown) > * {
  pointer-events: none;
}

.Calendar__monthSelectorAnimationWrapper,
.Calendar__yearSelectorAnimationWrapper {
  position: absolute;
  width: 100%;
  height: 80%;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.Calendar__monthSelectorWrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.Calendar__monthSelector {
  padding: 0 2.5em;
  align-content: center;
  padding-bottom: 2em;
}

.Calendar__monthSelector,
.Calendar__yearSelector {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  z-index: 2;
  background-color: #fff;
  transform: translateY(-150%);
  will-change: transform;
  transition: 0.6s;
  height: 100%;
}

.Calendar__yearSelectorWrapper {
  width: 100%;
  height: 100%;
}

.Calendar__yearSelectorWrapper::after,
.Calendar__yearSelectorWrapper::before {
  content: '';
  width: 100%;
  height: 5em;
  position: absolute;
  left: 0;
  opacity: 0;
  transition: 0.4s;
  transition-delay: 0.2s;
}

.Calendar__yearSelectorWrapper::after {
  background-image: linear-gradient(to bottom, #fff, #fff 10%, rgba(245, 245, 245, 0));
  top: -0.1em;
}

.Calendar__yearSelectorWrapper::before {
  background-image: linear-gradient(to top, #fff, #fff 10%, rgba(245, 245, 245, 0));
  bottom: 0;
}

.Calendar__yearSelectorWrapper.-faded::after,
.Calendar__yearSelectorWrapper.-faded::before {
  opacity: 1;
  z-index: 3;
}

.Calendar__yearSelector {
  align-content: flex-start;
  scrollbar-width: 0;
  overflow: scroll;
  position: relative;
  width: 100%;
  padding: 5em 2em;
  -ms-overflow-style: none;
}

.Calendar__yearSelector::-webkit-scrollbar {
  display: none;
}

.Calendar__yearSelectorItem {
  width: 25%;
  display: flex;
  justify-content: center;
}

.Calendar__yearSelectorItem:not(:nth-child(-n + 4)) {
  margin-top: 1.5em;
}

.Calendar__yearSelectorText {
  border: none;
  font-size: 1.4em;
  min-width: 85%;
  padding: 0.2em 0.5em;
  border-radius: 8.5px;
}

.Calendar__monthSelector.-open,
.Calendar__yearSelector.-open {
  transform: translateY(0);
}

.Calendar__yearSelectorText:focus,
.Calendar__monthSelectorItemText:focus {
  outline: 1px dashed rgba(0, 0, 0, 0.4);
  outline-offset: 2px;
}

.Calendar__monthSelectorItem {
  width: calc(100% / 3);
  display: flex;
  justify-content: center;
}

.Calendar__monthSelectorItem:not(:nth-child(-n + 3)) {
  margin-top: 2em;
}

.Calendar__monthSelectorItemText {
  border: none;
  padding: 0.4em 0.4em;
  border-radius: 8.5px;
  font-size: 1.3em;
  min-width: 70%;
  transition: 0.3s;
}

.Calendar__monthSelectorItem:not(.-active) .Calendar__monthSelectorItemText:not(:disabled):hover,
.Calendar__yearSelectorItem:not(.-active) .Calendar__yearSelectorText:not(:disabled):hover {
  background: #f5f5f5;
}

.Calendar__monthSelectorItemText:disabled,
.Calendar__yearSelectorText:disabled {
  opacity: 0.5;
  cursor: default;
}

.Calendar__monthSelectorItem.-active .Calendar__monthSelectorItemText,
.Calendar__yearSelectorItem.-active .Calendar__yearSelectorText {
  background-color: var(--cl-color-primary);
  color: #fff;
}

.Calendar__weekDays {
  display: flex;
  justify-content: space-between;
  color: var(--cl-color-disabled);
  font-size: 1.2em;
  margin-bottom: 0.7em;
  padding: 0 2.6em;
  position: relative;
}

.Calendar__weekDay {
  display: block;
  width: calc(100% / 7);
  text-align: center;
  text-decoration: none;
}

.Calendar__sectionWrapper {
  position: relative;
  min-height: 12em;
  overflow: hidden;
}

.Calendar__section {
  display: flex;
  flex-direction: column;
  padding: 0 2.3em;
  position: absolute;
  color: var(--cl-color-black);
  top: 0;
  padding-top: 0.5em;
  left: 0;
  width: 100%;
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
  transition: var(--animation-duration);
}

.Calendar__section.-hiddenPrevious {
  opacity: 0.5;
  transform: translateX(-90%);
}

.Calendar.-rtl .Calendar__section.-hiddenPrevious {
  transform: translateX(90%);
}

.Calendar__section.-hiddenNext {
  opacity: 0.5;
  transform: translateX(90%);
}

.Calendar.-rtl .Calendar__section.-hiddenNext {
  transform: translateX(-90%);
}

.Calendar__section.-shown {
  opacity: 1;
  transform: translateX(0);
}

.Calendar__section.-shownAnimated {
  animation: var(--animation-duration) FadeContentToCenter forwards;
}

.Calendar__weekRow {
  display: flex;
  width: 100%;
}

.Calendar__day {
  display: block;
  width: calc(100% / 7);
  text-align: center;
  padding: calc(0.25em - 1px) 0;
  font-size: 11px !important;
  border-radius: 50%;
  transition: 0.2s;
  border: 1px solid transparent;
  margin-bottom: 0.3em;
  color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.Calendar__day:focus {
  outline: 1px dashed rgba(0, 0, 0, 0.4);
  outline-offset: 2px;
}

.Calendar__day.-ltr {
  min-height: 2.6em;
  font-size: 1.45em;
}

.Calendar__day.-rtl {
  font-size: 1.0em;
  height: 2.45em;
}

.Calendar__day:not(.-blank):not(.-selectedStart):not(.-selectedEnd):not(.-selectedBetween):not(.-selected):hover {
  background: #eaeaea;
  border-radius: 50%;
  color: var(--cl-color-black);
  border-color: transparent;
}

.Calendar__day.-selected,
.Calendar__day.-selectedStart,
.Calendar__day.-selectedEnd {
  background: var(--cl-color-primary);
  color: #fff;
}

.Calendar__day.-ltr.-selectedStart {
  border-radius: 0;
  border-top-left-radius: 100em;
  border-bottom-left-radius: 100em;
}

.Calendar__day.-rtl.-selectedStart {
  border-radius: 0;
  border-top-right-radius: 100em;
  border-bottom-right-radius: 100em;
}

.Calendar__day.-selectedBetween {
  background: var(--cl-color-primary-light);
  color: var(--cl-color-primary);
  border-radius: 0;
}

.Calendar__day.-ltr.-selectedEnd {
  border-top-right-radius: 100em;
  border-bottom-right-radius: 100em;
}

.Calendar__day.-rtl.-selectedEnd {
  border-top-left-radius: 100em;
  border-bottom-left-radius: 100em;
}

.Calendar__day.-weekend:not(.-selected):not(.-blank):not(.-selectedStart):not(.-selectedEnd):not(.-selectedBetween) {
  color: var(--cl-color-error);
}

.Calendar__day.-weekend.-today:not(.-selectedStart):not(.-selectedEnd):not(.-selectedBetween)::after {
  background: var(--cl-color-error);
}

.Calendar__day.-disabled {
  color: var(--cl-color-disabled) !important;
  background: transparent !important;
  cursor: default !important;
}
.Calendar__day.-selected {
  border-radius: 50%;
}
.Calendar__day.-today:not(.-selectedStart):not(.-selectedEnd):not(.-selectedBetween) {
  font-weight: 600;
  color: var(--cl-color-black);
  color: #000;
  position: relative;
}

.Calendar__day.-today:not(.-selectedStart):not(.-selectedEnd):not(.-selectedBetween)::after {
  content: '';
  position: absolute;
  bottom: 0.2em;
  display: block;
  width: 0.6em;
  height: 1px;
  background: #000;
  left: 50%;
  opacity: 0.5;
  transform: translateX(-50%);
  transition: 0.2s;
}

.Calendar__day.-today:hover:not(.-selectedStart):not(.-selectedEnd):not(.-selectedBetween)::after {
  opacity: 0;
}

.Calendar__day.-blank {
  color: transparent;
  cursor: default;
  pointer-events: none;
}

.Calendar__footer {
  position: relative;
  z-index: 1;
}

@keyframes fadeCalendar {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeArrowFlipped {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
    transform: translateY(0) rotate(180deg);
  }
}

@keyframes fadeTextToCenter {
  to {
    opacity: 1;
    transform: translateX(-50%);
  }
}

@keyframes FadeContentToCenter {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

                `}</style>
            </View>
        );
    }
}

export default class PeriodTable extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }

    }
    onDateChange=(date,periodItemType,index)=>{
       
        if(periodItemType=='endDate'){
            let endDate=new Date(date);
            if(this.state.items[index+1]){
                endDate.setDate(endDate.getDate() + 1);
                this.state.items[index+1].startDate=endDate.toISOString().split('T')[0];
            }
            endDate=new Date(date);
            endDate.setDate(endDate.getDate() + this.props.insertedDeadline)
            this.state.items[index].deadLine= endDate.toISOString().split('T')[0];

            this.setState({items:  this.state.items });
        }
        this.props.onDateChange&& this.props.onDateChange(date,periodItemType,index);
    }
    render() {
        this.state.items=this.props.items;
        return <FlatList
            listFormat='wrap'
            keyExtractor={(item, index) => index.toString()}
            data={this.props.items}
            numColumns={2}
            renderItem={({item,index}) => (
                <View  style={{flex:1,width:global.width/2 }}   >
                    <PeriodTableItem
                        period={item}
                        showMode={this.props.showMode}
                        writePermission={this.props.writePermission}
                        minDate={new Date(this.props.minDate)}
                        maxDate={new Date(this.props.maxDate)}
                        onDateChange={(date,periodItemType)=>this.onDateChange(date,periodItemType,index)}
                    />
                </View>
            )}
        />
    }
    onNameEdited(event) {

    }
}

const styles = StyleSheet.create({
    title:{
        fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
        alignSelf:"center",
        paddingBottom:25,
        fontSize: 12,
        color:"#5D4A4A"
    },
    label:{
        //width:35,
        fontSize: 11,
        color:'#BFACAC'
    },
    dateRow:{
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    date:{
        fontSize: 12,
        marginRight: 3,
        marginLeft: 3,

    },

    text: {
        textAlign: 'right',
        fontSize: 13,
        color: 'black',
        marginStart: 7,
        marginEnd: 13,
    },
    buttonIn: {
        borderColor:'#BFACAC',
        borderWidth: 1,
        alignItems: 'center',
        borderRadius: 10,
        width:65,
        height: 32,
        justifyContent: 'center',
        marginLeft: 7,
        marginRight: 7,

    },
    noneBorder: {
        borderWidth: 0,
    },

});
