import React,{PureComponent} from 'react';
import Dialog from '@material-ui/core/Dialog';
import {

    View,
    TextInput, TouchableWithoutFeedback
} from './index';

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
            style,
            scroll='body'
        } = this.props;


        return (
            <TouchableWithoutFeedback  style={{flex:1,position:'absolute',}} onPress={this.onClose} >
                <Dialog
                    fullScreen
                    {...this.props}
                    open={this.props.visible}
                    onClose={this.onClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    scroll={scroll}
                    fullWidth={true}
                    //maxWidth={'sm'}
                    style={{width:'100%', height:'100%',alignSelf:'center', }}
                >
                    <View   style={{ width:'100%',alignSelf:'center', }}>
                        <TouchableWithoutFeedback style={[{flex:1,alignItems:'center'},style]} >
                            {children}
                        </TouchableWithoutFeedback>
                    </View>

                </Dialog>
                <style jsx global>{`
                    .MuiDialog-paperWidthSm {
                       
                       max-width: ${this.props.dialogWidth}px;
                      
                       
                    }
                    .MuiDialog-container {
                        width:100%
                    }
                    
                   
            `}</style>


            </TouchableWithoutFeedback>
        );
    }

}


