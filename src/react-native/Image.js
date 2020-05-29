import View from "./View";
import {makeStyles} from "@material-ui/core/styles";

export default function Image(props) {
    let {style={},source} = props;
    const styles = {
        main: {
           // filter:style.tintColor?'invert(408%) sepia(1009%) saturate(175%) hue-rotate(86deg) brightness(118%) contrast(119%)':' -webkit-filter: invert(90%) hue-rotate(175deg);  filter: invert(70%) hue-rotate(175deg);',
            filter:style.tintColor?'invert(408%) sepia(1009%) saturate(175%) hue-rotate(86deg) brightness(118%) contrast(119%)':'',
            'object-fit': 'cover',
        },
    }
    const useStyles = makeStyles(styles);
    const classes = useStyles();
    return (
        <img  src={source} {...props} style={style} className={classes.main} />
    );
}





