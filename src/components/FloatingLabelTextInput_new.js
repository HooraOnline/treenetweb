import React from 'react';
import styled from 'styled-components';
import {Input, InputAdornment} from "@material-ui/core";
import Platform from "../react-native/Platform";
import {inputNumberValidation, mapNumbersToEnglish} from "../utils";

const FloatingLabelInput = styled.div`
  width: 100%;
`;

const FloatingLabelInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  height: 2em;
  border-bottom: 1px solid #ddd;
  font-size: inherit;
`;

const FloatingLabel = styled.label`
  padding: 0;
  margin: 0;
  border: 0;
  position: absolute;
  color: #9b9b9b;
  bottom: 0;
  transition: all 0.2s ease-in-out;
  transform-origin: left top;
  font-size: 1em;
  cursor: text;
  pointer-events: none;
  width: 66.6%;
  transform: ${props =>
    props.active ? 'translate3d(0, -70%, 0) scale(0.70)' : 'none'};
`;

const FloatingInput = styled.input`
  padding: 0;
  margin: 0;
  border: none;
  outline: none;
  font-size: 1em;
  &::placeholder {
    color: #9b9b9b;
     //opacity: ${props => (props.active ? 1 : 0)};
    transition: opacity 0.2s cubic-bezier(0.6, 0.04, 0.98, 0.335);
  }
`;

export default class FloatingLabelTextInput_new extends React.PureComponent {
    constructor(props) {
        super(props);


        this.state = {
            active: props.value && props.value.length > 0
        };

        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    onFocus(event) {
        this.setState({ active: true });
        if (this.props.onFocus) {
            this.props.onFocus(event);
        }
    }

    onBlur(event) {
        this.setState({ active: event.target.value.length !== 0 });
        if (this.props.onBlur) {
            this.props.onBlur(event);
        }
    }

    render() {
        const { id='input11', label, onBlur, onFocus, type, ref, className,
            value,style,autoFocus=false, textInputStyle, placeholder,
            keyboardType, tintColor, highlightColor, underlineSize, underlineEnabled,
            floatingLabelAniDuration, floatingLabelEnable,maxLength=1000000,
            numberOfLines,onChangeText,adornment,
            ...otherProps } = this.props;
        const { active } = this.state;
        let pKeyboardType=type || 'string';
        if(keyboardType==='number-pad') pKeyboardType='tel'

        return (
            <FloatingLabelInput>
                <FloatingLabelInputContainer className={className}>
                    {floatingLabelEnable &&(
                        <FloatingLabel className={className} htmlFor={id} active={active}>
                            {placeholder}
                        </FloatingLabel>
                    )}
                    <FloatingInput
                        {...otherProps}
                        active={active}
                        className={className}
                        id={id}
                        onBlur={this.onBlur}
                        onFocus={this.onFocus}
                        ref={ref}
                        endAdornment={
                            <InputAdornment position="end"  >
                                {this.props.Adornment}
                            </InputAdornment>
                        }

                        style={{}}
                        fullWidth={true}
                        readOnly={this.state.readOnly}
                        inputProps={{
                            maxLength: maxLength,
                            style:{ ...textInputStyle,fontSize:(!value && Platform.Browser==='safari')?18:(12 || textInputStyle.fontSize)} //for solve font hiding problem in safary
                        }}
                        type={pKeyboardType}
                        autoFocus={autoFocus}
                        rows={numberOfLines}
                        disableUnderline={true}
                        //returnKeyType={returnKeyType}
                        floatingLabelEnable={floatingLabelEnable}
                        highlightColor={highlightColor}
                        underlineSize={underlineSize}
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
                        onLayout={event => {
                            let {x, y, width, height} = event.nativeEvent.layout;
                            this.refs.underline.updateLineLength(width);
                        }}
                    />

                </FloatingLabelInputContainer>
            </FloatingLabelInput>
        );
    }
}
