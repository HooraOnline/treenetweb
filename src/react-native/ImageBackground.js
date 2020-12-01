import View from "./View";
import {makeStyles} from "@material-ui/core/styles";
import images from "../../public/static/assets/images";

export default function ImageBackground(props) {
    let {style={},source} = props;
    const styles = {
        main: {
            "background-image":`url(${props.source})`,
            "background-repeat": 'no-repeat',
            "background-size": '100% 100%',

        },
    }
    const useStyles = makeStyles(styles);
    const classes = useStyles();
    return (
        <View  src={source} {...props}  className={classes.main}/>
    );
}










// import View from "./View";
// import {makeStyles} from "@material-ui/core/styles";
// import images from "../../public/static/assets/images";


// export default function ImageBackground(props) {
//     let {style={},imageStyle,source,resizeMode,blurRadius} = props;

//     const styles = {
//         main: {
//             "background-image":`url(${props.source})`,
//             "background-repeat": 'no-repeat',
//             "background-size": '100% 100%',
//             filter:`blur(${blurRadius}px)`,  // grayscale(10%) brightness(100%) contrast(100%) invert(10%),
//             opacity:1,
//         },
//         img: {
           
//         },
//     }
//     const useStyles = makeStyles(styles);
//     const classes = useStyles();
//     return (
       
//         <View style={{...style,position:'relative',alignItems:'center',justifyContent:'center'}}>
//              <div  {...props} style={{ width: '100%',...style}}  className={classes.main}/>
//              <div style={{position:'absolute',top:0,bottom:0,left:0,right:0,alignSelf:'center',zIndex:2}}>{props.children}</div>
//              {blurRadius &&(
//                   <img  src={props.source}  style={{height:'100%',width:undefined,  objectFit: 'contain',position:'absolute',top:0,bottom:0,alignSelf:'center',...imageStyle}}/>
//              )
//              }
//         </View>
      
//     );
// }





// import View from "./View";
// import {makeStyles} from "@material-ui/core/styles";
// import images from "../../public/static/assets/images";

// export default function ImageBackground(props) {
//     let {style={},source,resizeMode,blure} = props;

//     const styles = {
//         main: {
//             "background-image":`url(${props.source})`,
//             "background-repeat": 'no-repeat',
//             "background-size": '100% 100%',


//         },
//         img: {
           
          

//         },
//     }
//     const useStyles = makeStyles(styles);
//     const classes = useStyles();
//     return (
//         <View  {...props}  style={{...style,}} className={classes.main}>
//             {style.backgroundColor?(
//                 <img  src={props.source}  style={{...style,height:'100%',width:undefined,  objectFit: 'contain',}}/>
//             ):props.children
            
//             }
//         </View>
//     );
// }





