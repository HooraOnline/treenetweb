import View from "./View";

export default function ActivityIndicator(props) {
    let {children} = props;
    return (
        <View dir={props.dir} {...props}>loading</View>
    );
}


