
import View from "./View";
import {makeStyles} from "@material-ui/core/styles";

export default function LinearGradient(props) {
    let {style={}} = props;
    const styles = {
        main: {
            width:'100%',
            backgroundImage: `linear-gradient(${props.colors.join(',')})`
        },
    }
    const useStyles = makeStyles(styles);
    const classes = useStyles();
    return (
        <View {...props}   className={classes.main}>
                {props.children}
        </View>
    );
}




