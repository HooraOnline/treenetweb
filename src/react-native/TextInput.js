import React from 'react';
import {borderLight} from "../constants/colors";
import {Text, View} from "../react-native";
import {TextField} from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";
export default function TextInput(props) {
    let {style={}} = props;
    let style2=Object.assign({},style);
    style2.display='flex';
    style2.flexDirection=style2.flexDirection || 'column';
    style2.marginRight=style2.marginRight || style2.marginStart ||style2.marginHorizontal ||style2.margin;
    style2.marginLeft=style2.marginLeft|| style2.marginEnd ||style2.marginHorizontal ||style2.margin;
    style2.marginTop=style2.marginTop  ||style2.marginVertical ||style2.margin;
    style2.marginBottom=style2.marginBottom ||style2.marginVertical ||style2.margin;

    style2.paddingRight=style2.paddingRight || style2.paddingStart ||style2.paddingHorizontal || style2.padding;
    style2.paddingLeft=style2.paddingLeft|| style2.paddingEnd ||style2.paddingHorizontal || style2.padding;
    style2.paddingTop=style2.paddingTop  ||style2.paddingVertical ||style2.padding;
    style2.paddingBottom=style2.paddingBottom ||style2.paddingVertical ||style2.padding;
    style2.border=`${style2.borderWidth}px ${style2.borderStyle||'solid'}  ${style2.borderColor || '#000'}`

    style2.borderTop=`${style2.borderTopWidth}px ${style2.borderStyle||'solid'}  ${style2.borderTopColor || style2.borderColor || '#000'}`
    style2.borderBottom=`${style2.borderBottomWidth}px ${style2.borderStyle||'solid'}  ${style2.borderBottomColor|| style2.borderColor || '#000'}`
    style2.borderRight=`${style2.borderRightWidth ||style2.borderStartWidth}px ${ style2.borderStyle||'solid'}  ${style2.borderRightColor|| style2.borderStartColor|| style2.borderColor || '#000'}`
    style2.borderLeft=`${style2.borderLeftWidth ||style2.borderEndWidth}px ${style2.borderStyle||'solid'}  ${style2.borderLeftColor|| style2.borderEndColor|| style2.borderColor || '#000'}`



    style2.borderTopRightRadius=style2.borderTopRightRadius || style2.borderTopStartRadius || style2.borderRadius;
    style2.borderTopLeftRadius=style2.borderTopLeftRadius || style2.borderTopEndRadius || style2.borderRadius;
    style2.borderBottomRightRadius=style2.borderBottomRightRadius || style2.borderBottomStartRadius || style2.borderRadius;
    style2.borderBottomLeftRadius=style2.borderBottomLeftRadius || style2.borderBottomEndRadius || style2.borderRadius;

    if(style2.left==undefined) style2.left=style2.end;
    if(style2.right==undefined) style2.right=style2.start;

    style2.shadowOffset && (style2['-webkit-box-shadow']= `${style2.shadowOffset.width}px ${style2.shadowOffset.height}px 4px ${hex2rgb(style2.shadowColor,style2.shadowOpacity || 1)}`);
    style2.zIndex=  style2.zIndex || style2.elevation;
    if(props.tintColor){
        style2.border=`1px solid  ${props.tintColor}`
    }



    let {
        ref,
        value,
        autoFocus,
        placeholder,
        placeholderTextColor,
        numberOfLines,
        label,
        multiline,
        onChangeText,
        maxLength,
        floatingLabelEnable,
        returnKeyType,
        textInputStyle,
        underlineSize,
        highlightColor,
        fullWidth=true,
    } = props;


    const styles = {
        main: {
            outline: 'none',
        },
    }
    const useStyles = makeStyles(styles);
    const classes = useStyles();

    return(
        <>
            {numberOfLines>1 || multiline?(
                    <textarea {...props}  style={{ outline: 'none',padding:10,...style2}} className={classes.main}
                           ref={ref}
                           inputProps={{
                               maxLength: maxLength,
                               style: textInputStyle,
                           }}

                           value={value}
                           autoFocus={autoFocus}
                           placeholder={placeholder}
                           rows={numberOfLines}
                           multiline={multiline}
                           label={label}
                           disableUnderline={true}
                           returnKeyType={returnKeyType}
                           floatingLabelEnable={floatingLabelEnable}
                           highlightColor={highlightColor}
                           underlineSize={underlineSize}
                           onChange={event => {
                               let text=event.target.value;
                               onChangeText && onChangeText(text,event)
                           }}
                    />
                )
                :(
                    <input {...props}  style={style2} className={classes.main}

                           ref={ref}
                           inputProps={{
                               maxLength: maxLength,
                               style: textInputStyle
                           }}

                           value={value}
                           autoFocus={autoFocus}
                           placeholder={placeholder}
                           rows={numberOfLines}
                           multiline={multiline}
                           label={label}
                           disableUnderline={true}
                           returnKeyType={returnKeyType}
                           floatingLabelEnable={floatingLabelEnable}
                           highlightColor={highlightColor}
                           underlineSize={underlineSize}
                           onChange={event => {
                               let text=event.target.value;
                               onChangeText && onChangeText(text,event)
                           }}
                    />
                )

            }


            <style jsx global>{`
                    .MuiInput-underline:before{
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border-bottom:1px solid ${borderLight};
                    position: absolute;
                    transition: border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
                    pointer-events: none;
                }
                .MuiInput-underline:after{
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border-bottom:0px solid;
                    position: absolute;
                    transform: scaleX(0);
                    transition: transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms;
                    pointer-events: none
                }
            `}</style>
        </>
    );
}
const styles = {
    main: {

    },
}






