import View from "./View";
const jMoment = require('moment-jalaali');
//import fa from "moment/src/locale/fa";
//jMoment.locale("fa", fa);
jMoment.loadPersian();
jMoment.loadPersian({dialect: 'persian-modern'})
jMoment.loadPersian({usePersianDigits: true})
//let format='jYYYY/jM/jD HH:mm'
export default function DateTime(props) {
    let {children} = props;

    return (
        <View dir={props.dir} {...props}>
            {props.children &&(
                <div dir='ltr' style={props.style}>{jMoment( new Date(props.children)).format(props.format || 'jYYYY/jM/jD')}</div>
            )
            }
        </View>
    );
}


