import React, {PureComponent} from 'react';
import {bool, number, string} from 'prop-types';
import colors, {border, borderLight, grayVD7, grL5, primaryDark, subTextItem, textItem} from '../constants/colors';
import {Text, View, Animated, StyleSheet, IconApp,} from "../react-native";

import {Input,FormControl,InputAdornment,InputLabel} from '@material-ui/core';
import Platform from "../react-native/Platform";
import {inputNumberValidation, mapNumbersToEnglish} from "../utils";
//import { faUsers } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTree } from "@fortawesome/free-solid-svg-icons";


class Underline extends PureComponent {
    static propTypes = {
        underlineEnabled: bool,
        underlineAniDur: number,
    };

    static defaultProps = {
        underlineEnabled: true,
        underlineAniDur: 200,
    };

    constructor(props) {
        super(props);
        this.animatedLeft = new Animated.Value(0);
        this.animatedLineLength = new Animated.Value(0);
        this.state = {
            lineLength: 0,
        };
    }

    // update the length of stretched underline
    updateLineLength(lineLength, cb) {
        this.setState({lineLength}, cb);
    }

    // stretch the line, from center
    aniStretchUnderline() {
        this.animatedLeft.setValue(this.state.lineLength / 2);
        Animated.parallel([
            Animated.timing(this.animatedLeft, {
                toValue: 0,
                duration: this.props.underlineAniDur,
            }),
            Animated.timing(this.animatedLineLength, {
                toValue: this.state.lineLength,
                duration: this.props.underlineAniDur,
            }),
        ]).start();
    }

    // collapse the the line to a single point at center
    aniShrinkUnderline() {
        if (!this.props.underlineEnabled) {
            return [];
        }

        Animated.parallel([
            Animated.timing(this.animatedLeft, {
                toValue: this.state.lineLength / 2,
                duration: this.props.underlineAniDur,
            }),
            Animated.timing(this.animatedLineLength, {
                toValue: 0,
                duration: this.props.underlineAniDur,
            }),
        ]).start();
    }

    // the colorful forefront line, animation enabled
    renderUnderline() {
        return this.props.underlineEnabled && (
            <Animated.View
                style={{
                    //position: 'absolute',
                    backgroundColor: this.props.highlightColor ,
                    height: this.props.underlineSize,
                    left: 0,//this.animatedLeft,
                    width:'100%',// this.animatedLineLength,

                }}
            >

            </Animated.View>);
    }

    render() {
        return (
            <View pointerEvents="none"
                  style={{
                      // top: -this.props.underlineSize,
                      marginTop:0,
                      height: this.props.underlineSize,
                  }}
            >
                <View  // the default silver border
                    style={{
                        //position: 'absolute',
                        backgroundColor: this.props.underlineColor,
                        height: this.props.underlineSize,
                        width:'100%',// this.state.lineLength,
                    }}
                />
              {/*  {this.renderUnderline()}*/}
            </View>
        );
    }
}

export default class FloatingLabelTextInput extends PureComponent {
    static propTypes = {
        value: string.isRequired,
        underlineSize: number,
        underlineColor: string,
        labelColor: string,

    };

    static defaultProps = {
        underlineSize: 1,
        underlineColor: primaryDark,
        labelColor: border,
    };

    constructor(props) {
        super(props);
        this.position = new Animated.Value(props.value ? 1 : 0);
        this.fontSize = 10;
        this.state = {
            isFieldActive: false,
            isFocused: false,
            readOnly:props.readOnly || props.editMode===2,
        };
        this.textInput = React.createRef();

    }


    componentDidMount() {
        this.fontSize = this.props.textInputStyle && this.props.textInputStyle.fontSize ? this.props.textInputStyle.fontSize : 14;
        this.props.refInput ? this.props.refInput(this.refs.txtInput) : {};
        //
        // this._handleFocus();
        // this._handleBlur()
    }

    componentDidUpdate() {
        if (!this.state.isFieldActive) {
            this._handleAnimate(!!this.props.value);
        }
    }

    _handleAnimate(state) {
        Animated.timing(this.position, {
            toValue: state ? 1 : 0,
            duration: 150,
        }).start();
    }

    _handleFocus = () => {
        //this.refs.underline.aniStretchUnderline();
        this.setState({isFocused: true});
       /* if (!this.state.isFieldActive) {
            this.setState({isFieldActive: true});
            this._handleAnimate(true);
        }*/
        this.props.onFocus && this.props.onFocus(this.textInput.value);
    };

    _handleBlur = () => {
        this.refs.underline.aniShrinkUnderline();
        this.setState({isFocused: false,readOnly:this.props.editMode===2?true:this.props.readOnly});
        if (this.state.isFieldActive && !this.props.value) {
            this.setState({isFieldActive: false});
            this._handleAnimate(false);
        }
    };

    _returnAnimatedTitleStyles = () => {
        return {
            bottom: this.position.interpolate({
                inputRange: [0, 1],
                outputRange: [this.props.labelMarginButtom || 6, this.fontSize + 15],
            }),
            fontSize: this.state.isFieldActive || !!this.props.value ? this.props.labelActiveFontSize || 12 : this.props.labelFontSize || 14,
            color: this.state.isFocused ? this.props.highlightColor : this.props.labelColor,
        };
    };

    _handleonKeyUp=(event)=>
        {
            //for ios delete
            if(event.key==='Backspace'){
                let element=this.textInput.current.childNodes[0];
                let textLength=element.value.length;
                try{
                    element.setSelectionRange(textLength,textLength);
                }catch(e){}
            }
        }

        
     focus=(event)=>{
          this.textInput.current.focus();
          //this.textInput.current.firstChild.focus();
      }

    render() {

        const {unitStyle,style,isAccept,autoFocus=false, textInputStyle, placeholder,keyboardType, underlineColor, highlightColor, underlineSize, underlineEnabled, floatingLabelAniDuration, floatingLabelEnable, type,maxLength=1000000,numberOfLines,onChangeText,adornment} = this.props;
        let props=this.props;
        let pKeyboardType=type || 'string';
        if(keyboardType==='number-pad') pKeyboardType='tel'
        return (
            <View style={[style,{flexDirection:'row',}]}>
                {
                    this.props.label &&
                    <div style={{textAlign:'right', paddingTop:5,paddingLeft:10,fontSize: 12,...this.props.labelStyle}}>{this.props.label}</div>
                }

                <View style={{flex:1}}>
                    {/*<TextField {...props}  label={floatingLabelEnable?placeholder:''} />*/}
                    <View >
                        {floatingLabelEnable &&(
                            <InputLabel style={{
                                fontFamily: Platform.OS === 'ios' ? 'IRANYekanRegular' : 'IRANYekanRegular',
                                fontSize: 12,
                                color: textItem,
                                marginStart: 4,
                                textAlign:'right',
                                ...props.labelStyle,position:'relative',marginBottom:5}} htmlFor="standard-adornment-password">{placeholder}</InputLabel>
                        )}
                        <View style={{flex:1,flexDirection:'row'}}>
                            <Input
                                {...props}
                                ref={this.textInput}
                                endAdornment={
                                    this.props.Adornment &&(
                                        <InputAdornment position="end"  >
                                            {this.props.Adornment}
                                        </InputAdornment>
                                    )

                                }

                                style={{}}
                                // className={classes.main}
                                fullWidth={true}
                                readOnly={this.state.readOnly}

                                inputProps={{
                                    maxLength: maxLength,
                                    direction:'ltr',
                                    style:{fontSize:12, ...textInputStyle,} //for solve font hiding problem in safary
                                }}
                                type={pKeyboardType}
                                //value={value}
                                autoFocus={autoFocus}
                                rows={numberOfLines}
                                //multiline={multiline}
                                //label={label}
                                disableUnderline={true}
                                //returnKeyType={returnKeyType}
                                floatingLabelEnable={floatingLabelEnable}
                                highlightColor={highlightColor}
                                underlineSize={underlineSize}
                                underlineColor={underlineColor}
                                
                                onChange={event => {
                                    let text=event.target.value;
                                    if(text && text.length>maxLength){
                                        return;
                                    }
                                   if(pKeyboardType==='tel'){
                                       text=mapNumbersToEnglish(text);
                                      this.beforText=this.beforText || '';
                                       text= inputNumberValidation(text,'', /[\d]+$/);
                                       this.beforText=text;
                                    }
                                    onChangeText && onChangeText(text,event)
                                }}

                                placeholder={floatingLabelEnable ? '' : placeholder}
                                underlineColorAndroid='transparent'
                                onKeyUp={ this._handleonKeyUp}
                                onFocus={this._handleFocus}
                                onBlur={this._handleBlur}
                                onLayout={event => {
                                    let {x, y, width, height} = event.nativeEvent.layout;
                                    this.refs.underline.updateLineLength(width);
                                }}
                            />
                            {adornment?adornment: this.props.unit?(
                                <Text style={[{
                                    fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                                    fontSize: 11,
                                    color: border,
                                    marginHorizontal: 4,
                                    alignSelf: 'left',
                                    textAlign:'left',
                                    paddingTop:7
                                },unitStyle]}>{this.props.unit}</Text>
                            ):null}
                              {isAccept!==undefined &&(
                                  <FontAwesomeIcon icon={faTree} 
                                    color={isAccept?grL5:grayVD7}
                                    style={{
                                       width:24,
                                       height:24

                                    }}
                                />
                                )}
                        </View>





                    </View>

                    <Underline
                        ref="underline"
                        underlineEnabled={underlineEnabled}
                        underlineSize={underlineSize}
                        underlineAniDur={floatingLabelAniDuration}
                        highlightColor={highlightColor}
                        underlineColor={underlineColor}
                    />

                </View>
                {props.editMode===2 &&(
                    <IconApp source={'apic_edit'}
                             style={{
                                underlineColor: border,
                                 height: 24,
                                 width: 24,
                             }}
                    onClick={()=>{
                        this.setState({readOnly:false})
                        this.focus();
                    }}
                    />
                )}

                <style jsx global>{`
                .MuiInputLabel-shrink {
                    transform: translate(0, 1.5px) scale(0.75);
                    transform-origin: top right !important;
                }  

               
                
            `}</style>
            </View>
        );
    }
}

const Styles = StyleSheet.create({
    container: {
        // flex: 1,

    },

    labelStyles: {
        position: 'absolute',
        left: 3,
    },
});






