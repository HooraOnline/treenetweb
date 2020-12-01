
import View from "./View";
import {makeStyles} from "@material-ui/core/styles";
import React from "react";

export default function ScrollView(props) {
    let {style={},contentContainerStyle} = props;
    const styles = {
        main: {
            maxHeight:style.maxHeight || '100%',
            overflowY:props.horizontal?'hidden':'auto',
            overflowX:props.horizontal?'auto':'hidden',
            width:'100%'
        },
    }
    const useStyles = makeStyles(styles);
    const classes = useStyles();
    return (
        <View {...props} style={style} className={classes.main}>
            <View style={contentContainerStyle}>
                {props.children}
            </View>
        </View>
    );
}




