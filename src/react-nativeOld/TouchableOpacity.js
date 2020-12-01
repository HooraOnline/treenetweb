import {bgWhite, border, textDisabled} from "../constants/colors";
import View from "./View";
import {makeStyles} from "@material-ui/core/styles";
let btnDisabled;
export default function TouchableOpacity(props) {
    let {style={},onPress,disabled,} = props;

    const useStyles = makeStyles(styles);
    const classes = useStyles();
    return (
        <View {...props} style={[style,{ backgroundColor:disabled?textDisabled:style.backgroundColor,color:disabled?bgWhite:style.color}]} className={classes.main}    onClick={disabled?null:onPress}/>
    );
}

const styles = {
    main: {
        cursor:'pointer',


    },
}

