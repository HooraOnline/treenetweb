import React, {PureComponent} from 'react';
import {
    FlatList,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from '../react-native';

import {borderSeparate, subTextItem, textItem} from '../constants/colors';
import {Overlay} from './index';
import Dialog from "@material-ui/core/Dialog";


export default class ListDialog extends PureComponent {

    render() {
        const {
            visible,
            title,
            items,
            itemComponent,
            fieldItem,
            onDismiss,
            style
        } = this.props;

        if(!visible){
            return null;
        }

        return (
            <Overlay catchTouch={true} onPress={onDismiss}>
                <View   style={{ width:'100%',alignSelf:'center', }}>
                    <TouchableWithoutFeedback style={[{flex:1,alignItems:'center',},]} >
                        <View
                            style={[{
                                backgroundColor: 'white',
                                justifyContent: 'center',
                                marginHorizontal: 24,
                                width:'95%',
                                paddingVertical: 16,
                                borderRadius: 10,
                                maxWidth:300,

                            },style]}>

                            <View
                                style={{
                                    alignItems: 'center',
                                    marginBottom: 14,
                                }}>
                                <Text style={[styles.title]}>{title}</Text>
                            </View>
                            {/*<View
                            style={{flex: 1, justifyContent: 'center', marginHorizontal: 14}}>
                            <LineCustom
                                color={subTextItem}
                            />
                        </View>*/}
                            <FlatList
                                style={{flexGrow: 0}}
                                keyExtractor={(item, index) => index.toString()}
                                data={items}
                                renderItem={({item}) => (
                                    <TouchableOpacity
                                        onPress={this.select.bind(this, item)}
                                        style={{
                                            flex:1,
                                            borderBottomWidth:2 ,
                                            borderColor: borderSeparate,
                                            marginHorizontal: 24,
                                        }}>
                                        {itemComponent ? (
                                            itemComponent(item)
                                        ) : (
                                            <View>
                                                <Text style={[styles.text]}>{fieldItem ? item[fieldItem] : item.Name}</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                )}
                            />

                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </Overlay>


            /*<Modal
                visible={visible}
                onClose={onDismiss}
                animationType="fade"
                transparent={true}
                presentationStyle="overFullScreen"
                scroll='paper'
            >


                    <View
                        style={{
                            flex: 1,
                            backgroundColor: 'white',
                            justifyContent: 'center',
                            marginHorizontal: 24,
                            width:'95%',
                            paddingVertical: 16,
                            borderRadius: 10,
                            marginTop:70,
                            maxWidth:300,

                        }}>

                        <View
                            style={{
                                alignItems: 'center',
                                marginBottom: 14,
                            }}>
                            <Text style={[styles.title]}>{title}</Text>
                        </View>
                        {/!*<View
                            style={{flex: 1, justifyContent: 'center', marginHorizontal: 14}}>
                            <LineCustom
                                color={subTextItem}
                            />
                        </View>*!/}
                        <FlatList
                            style={{flexGrow: 0}}
                            keyExtractor={(item, index) => index.toString()}
                            data={items}
                            renderItem={({item}) => (
                                <TouchableOpacity
                                    onPress={this.select.bind(this, item)}
                                    style={{
                                        borderBottomWidth:2 ,
                                        borderColor: borderSeparate,
                                        marginHorizontal: 24,
                                    }}>
                                    {itemComponent ? (
                                        itemComponent(item)
                                    ) : (
                                        <View>
                                            <Text style={[styles.text]}>{fieldItem ? item[fieldItem] : item.Name}</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            )}
                        />

                    </View>

            </Modal>*/
        );
    }

    select(item) {
        this.props.onValueChange(item);
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
    },
    text: {
        flex:1,
        alignSelf:'center',
        color:textItem,
        fontSize: 13,
        fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
        paddingVertical: 14,
        textAlign: 'center'
    },
});

