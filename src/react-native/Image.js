import View from "./View";
import {makeStyles} from "@material-ui/core/styles";
import images from "../../public/static/assets/images";
import {useState} from "react";

export default function Image(props) {
    let {style={},source,onErrorImage} = props;
    const [src, setSrc] = useState(source);
    const styles = {
        main: {
           // filter:style.tintColor?'invert(408%) sepia(1009%) saturate(175%) hue-rotate(86deg) brightness(118%) contrast(119%)':' -webkit-filter: invert(90%) hue-rotate(175deg);  filter: invert(70%) hue-rotate(175deg);',
            filter:style.tintColor?'invert(408%) sepia(1009%) saturate(175%) hue-rotate(86deg) brightness(118%) contrast(119%)':'',
            'object-fit': 'cover',
        },
    }
    const useStyles = makeStyles(styles);
    const classes = useStyles();
    const errorImage=onErrorImage ||images.default_ProPic;
    let onError=(props.onError) || (()=>setSrc(errorImage));
    return (
        <img
            src={src}
            {...props}
            style={style}
            className={classes.main}
            onError={onError}
        />
    );
}





