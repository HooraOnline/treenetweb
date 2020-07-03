import React, {PureComponent} from 'react';
import {
    Alert,
    Image,
    ImageBackground,
    Platform,
    StyleSheet, Text,
    TouchableOpacity,
    View,
    BgImageChacheProgress,
    Progress,
} from '../react-native';

import images from "../../public/static/assets/images";
import { globalState, persistStore,} from '../stores';
import {getFileDownloadURL, uploadFileByFormData} from '../utils';
import {fab, bgScreen, subTextItem, textItem, grayVD7} from "../constants/colors";
import {AlertMessage, OverlayModal,} from "./index";
import FileInput from "../react-native/FileInput";
import {getFileUri, upload} from "../../dataService/apiService";
//import Permissions from "react-native-permissions";

export default class ImageSelector extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            sliderActiveSlide: 1,
            imageIndeterminate: true,
            imageProgress: 0,
            showRemoveImage: false,
            loadImageCompelete: false,
            image: props.image,
        };
    }

    removeImage() {
        this.setState({selectedImage:null,image: null,showRemoveImage: false,});
        this.props.onRemoveImage && this.props.onRemoveImage(this.state.selectedImage || this.state.image);
    }

   uploadFile(files){
      globalState.showBgLoading();
       upload(files, this.props.folderName, (r)=>{console.log(r)})
           .then(result => {
               console.log(result);
               if(result.result && result.result.fields && result.result.fields.name && result.result.fields.name[0]){
                   const fileName=result.result.fields.name[0];
                   this.setState({image: fileName,});
                   this.props.onUplodedFile && this.props.onUplodedFile(fileName);
               }

           })
           .finally(() => globalState.hideBgLoading());



  }


    renderSelectBtn() {
        if(this.state.image || this.state.selectedImage){
            return null
        }
        return this.props.SelectBtn || <Image
            source={images.ic_camera}
            style={{
                width: 24,
                height: 24,
                tintColor: bgScreen,
            }}
        />
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        //if (nextProps.image != nextState.image)
            //this.setState({image: nextProps.image})

    }

    componentDidMount() {

    }

    render() {
        const {style,canUpload=true,hideDeleteBtn,image, noImage, imageStyle, children, renderContent, selectBtnStyle} = this.props;

        return (
            <View style={[{ position: 'relative',alignItems:'center',justifyContent:'center' },style]}>

                <piperecorder pipe-width={400} pipe-height={330}/>
                {canUpload &&(

                    <FileInput
                        style={{}}
                        accept={'image/jpeg, image/png'}
                        onSelectFile={(files,formData,file0,url,filebase64)=>{
                            this.props.onSelectFile && this.props.onSelectFile(formData,file0,url,filebase64);
                            this.setState({selectedImage:url});
                            if(this.props.autoUpload){
                               this.uploadFile(files)

                            }

                        }}
                    >
                        <BgImageChacheProgress
                            style={[{width:100,height:100},imageStyle]}
                            resizeMode="cover"
                            source={this.state.selectedImage?this.state.selectedImage: image ? getFileUri('member',image) : noImage}
                            indicator={() => <Progress.Circle
                                progress={this.state.imageProgress}
                                indeterminate={this.state.imageIndeterminate}
                            />}
                            indicatorProps={{
                                borderWidth: 3,
                                color: fab,
                                // unfilledColor: primaryDark,
                            }}

                            onError={e => {
                                this.setState({imageIndeterminate: true});
                                console.warn('!!!!!!!!!!!!!!!!!! onError Image e:', e);
                                this.props.onErrorImage && this.props.onErrorImage();
                            }}
                            onLoadStart={() => console.warn('!!!!!!!!!!!!!!!!!! onLoadStart Image ')}
                            onProgress={e => {
                                console.warn('%%%%%%%%%%% onProgress loaded:', e.nativeEvent.loaded);
                                console.warn('%%%%%%%%%%% onProgress total:', e.nativeEvent.total);
                                const progress = e.nativeEvent.loaded / e.nativeEvent.total;
                                this.setState({imageProgress: progress});
                                console.warn('!!!!!!!!!!!!!!!!!!!! onProgress p:', progress);
                            }}
                            onLoad={e => console.warn('!!!!!!!!!!!!!!!!!!!! onLoad Success', e.nativeEvent.width, e.nativeEvent.height)}
                            onLoadEnd={() => {
                                this.setState({loadImageCompelete: true})
                            }}
                        >
                            {
                                renderContent && renderContent(this.state.image, this.state.imageProgress)
                            }

                            {children}
                        </BgImageChacheProgress>
                    </FileInput>
                )
                }

                {canUpload && !hideDeleteBtn && (this.state.image || this.state.selectedImage) && (
                    <TouchableOpacity
                        onPress={() => this.setState({showRemoveImage: true})}
                        style={{
                            backgroundColor: 'rgba(38, 32, 32, 0.6)',
                            position: 'absolute',
                            top: 34,
                            end: 8,
                            borderWidth: 1,
                            borderRadius: 10,
                            borderColor: 'white',
                        }}>
                        <Image
                            source={images.ic_delete}
                            style={{
                                elevation: 40,
                                margin: 4,
                                height: 24,
                                width: 24,
                                tintColor: 'white',
                            }}
                        />
                    </TouchableOpacity>
                )}

               {/* <TypeImageSelector
                    visible={this.state.showImageTypeSelector}
                    onCameraPress={() => this.onImageSelector(true)}
                    onGalleryPress={() => this.onImageSelector(false)}
                    onDismiss={() => this.setState({showImageTypeSelector: false})}
                />*/}
                <AlertMessage
                    onModal
                    visible={this.state.showRemoveImage}
                    title='حذف تصویر!'
                    message='آیا از حذف تصویر مطمئن هستید؟'
                    onConfirm={() => this.removeImage()}
                    onDismiss={() => this.setState({showRemoveImage: false})}
                    confirmTitle='حذف'
                    dismissTitle='انصراف'
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
});
