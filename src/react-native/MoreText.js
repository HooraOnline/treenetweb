import View from "./View";
import { Collapse } from '@material-ui/core';
import { niceBlue } from "../constants/colors";

export default function MoreText(props) {
    let {shortLength=100,children,morTitle='نمایش بیشتر',lessTitle='نمایش کمتر'} = props;
    const [showMore, setShowMore] = React.useState(false);
    return (
         
        <View dir={props.dir} {...props} style={{flexDirection:'column',...props.style,whiteSpace: 'pre-line',}}>
            {!showMore &&(
                <p> 
                {children.substring(0,shortLength)}
                {(children.length>shortLength)?' ...':''}
                {children.length>shortLength &&(
                    <a style={{color:niceBlue,fontSize:10,paddingRight:10}} onClick={() => setShowMore(true)}>{morTitle}</a>
                )
                }
                </p> 
            )}
            <Collapse in={showMore}>
                <div>
                    <p style={{}}>
                        {children}  ...  
                        <a style={{color:niceBlue,fontSize:10,}} onClick={() => setShowMore(false)}>{lessTitle}</a>       
                    </p>
                </div>
            </Collapse>

        </View>
    );
}


