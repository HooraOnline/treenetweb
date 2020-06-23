import React, {Component} from 'react';

import Modal from '@material-ui/core/Modal';

import {overlayColor, primary, primaryDark} from '../constants/colors';
import {View,Text} from "../react-native";

export default class LoadingPopUp extends Component {
    render() {

        const {visible = false, onFinish, onModal = false, message} = this.props;
        return (
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={visible}
                //onClose={handleClose}
            >
                <View style={{
                    flex: 1,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: overlayColor,
                }}>
                    {message &&(
                        <Content message={message}/>
                    )}
                </View>
            </Modal>
        );
    }
}

function Content({message}) {
    return (
        <View
            style={{
                backgroundColor: 'white',
                elevation: 7,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.8,
                borderRadius: 10,
                marginHorizontal: 24,
            }}
        >
            <View style={{padding: 16, alignItems: 'center'}}>
              {/*  <Progress.CircleSnail duration={700} spinDuration={3000}
                                      color={[primary, 'red', primaryDark]}/>*/}
                {/*<LinearProgress variant="determinate" />*/}
                <Text style={{color: primaryDark, fontSize: 14,alignSelf:'center'}}>
                    {message}
                </Text>
            </View>
        </View>
    );
}
