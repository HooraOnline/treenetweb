import React,{PureComponent} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    View,
    TextInput, TouchableWithoutFeedback
} from './index';
import Slide from '@material-ui/core/Slide';
import {
    bgScreen, bgWhite, border,
    borderSeparate,
    gray, lightGrey,
    overlayColor,
    primaryDark,
    subTextItem,
    textItem
} from '../constants/colors';
import images from "../../public/static/assets/images";
import PopupBase from "../components/PopupBase";


export default class Modal extends PureComponent {
    constructor(props) {
        super();
        this.height = global.height - global.height / 4;

    }
    onClose=()=>{
        this.props.onRequestClose && this.props.onRequestClose();
        this.props.onClose && this.props.onClose();
    }
    render() {
        const {
            title,
            children,
            defaultTitle = '',
            minWidth = 250,
            snake,

        } = this.props;


        return (
            <TouchableOpacity  style={{flex:1,}} onPress={this.onClose} >
                <Dialog
                    {...this.props}
                    open={this.props.visible}
                    onClose={this.onClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    scroll={'body'}
                    //fullWidth={true}
                    //maxWidth={'sm'}
                    //style={{width:400, height:700,alignSelf:'center',backgroundColor:'red'}}
                >
                    <TouchableWithoutFeedback>
                      {children}
                    </TouchableWithoutFeedback>
                </Dialog>
                <style jsx global>{`
                    .MuiDialog-paperWidthSm {
                       max-width: ${this.props.dialogWidth}px;
                       background-color:rgb(0,0,0,0.2)
                    }
            `}</style>


            </TouchableOpacity>
        );
    }

}


