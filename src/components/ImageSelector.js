import React, {PureComponent} from 'react';
import {
    Image,
    StyleSheet, Text,
    TouchableOpacity,
    View,
    BgImageChacheProgress,
    Progress, IconApp
} from '../react-native';

import images from "../../public/static/assets/images";
import { globalState, persistStore,} from '../stores';
import {getFileDownloadURL, uploadFileByFormData} from '../utils';
import {fab, bgScreen, subTextItem, textItem} from "../constants/colors";
import {AlertMessage, OverlayModal,} from "./index";
import FileInput from "../react-native/FileInput";


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

        this.state.image=null;
        this.setState({selectedImage:null,image: null,showRemoveImage: false,});
        this.props.onRemoveImage && this.props.onRemoveImage(this.state.selectedImage || this.state.image);
    }

   uploadFile(fileData){
   
      globalState.showBgLoading();
       uploadFileByFormData(fileData)
          .then(result => {
              const fileName = result.fileName;
              console.log(fileName);
              this.setState({
                  image: fileName,
              });
              this.props.onUplodedFile && this.props.onUplodedFile(fileName);
          })
          .finally(() =>{ 
             
              globalState.hideBgLoading();
            });
  }


    renderSelectBtn() {
      

        return this.props.SelectBtn || <IconApp
            class={'apic_camera'}
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
        const {onRender,style,canUpload=true,hideDeleteBtn,image, noImage, imageStyle, children, renderContent, selectBtnStyle,blureColor,blurRadius} = this.props;
        onRender && onRender(this);
        this.state.image=this.state.image || image;

        return (
            <View style={{ position: 'relative'}}>
                <BgImageChacheProgress
                    style={{...style, 
                         backgroundColor:blureColor  //'rgba(166, 214, 208, .8)',
                        }}
                    imageStyle={imageStyle}
                    resizemode="cover"

                    source={this.state.selectedImage?this.state.selectedImage: this.state.image ? {
                        imageName:this.state.image,
                        uri: getFileDownloadURL(this.state.image),
                        headers: {Authorization: 'Bearer ' + persistStore.token},
                    } : noImage}
                    //source={this.state.selectedImage?this.state.selectedImage:noImage}
                    indicator={() => <Progress.Circle
                        progress={this.state.imageProgress}
                        indeterminate={this.state.imageIndeterminate}
                    />}
                    indicatorProps={{
                        borderWidth: 3,
                        color: fab,
                        // unfilledColor: primaryDark,
                    }}
                    blurRadius={blurRadius}
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
                <piperecorder pipe-width={400} pipe-height={330}/>
                {canUpload &&(
                    <FileInput
                        ref={fileInput=>this.fileInput=fileInput}
                        style={{zIndex:2 }}
                        accept={'image/jpeg, image/png'}
                        onSelectFile={(formData,file0,url,filebase64)=>{
                           
                            this.props.onSelectFile && this.props.onSelectFile(formData,file0,url,filebase64);
                            this.setState({selectedImage:url});
                            if(this.props.autoUpload){
                                this.uploadFile(formData);
                            }
                        }}
                    >
                       
                        {( (!this.state.selectedImage && !this.state.image) || this.props.showSelectBtnAlways) ?(
                            <TouchableOpacity
                                //onPress={() => this.setState({showImageTypeSelector: true})}
                                style={selectBtnStyle || {
                                    elevation: 40,
                                    marginStart: 24,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 25,
                                    backgroundColor: 'black',
                                    width: 50,
                                    height: 50,
                                    position: 'absolute',
                                    bottom: -20,
                                }}>
                                {
                                    this.renderSelectBtn()
                                }
                            </TouchableOpacity>
                        ):<div/>
                        }
                    </FileInput>
                )
                }

                {canUpload && !hideDeleteBtn && (this.state.image || this.state.selectedImage) && (
                    <TouchableOpacity
                        onPress={() => this.setState({showRemoveImage: true})}
                        stopPropagation
                        style={{
                            backgroundColor: 'rgba(38, 32, 32, 0.6)',
                            position: 'absolute',
                            top: 10,
                            end: 10,
                            borderWidth: 1,
                            borderRadius: 10,
                            borderColor: 'white',
                            padding:3,
                        }}>
                        <IconApp
                            class={'apic_delete'}
                            style={{
                                elevation: 3,
                                margin: 4,
                                height: 22,
                                width: 22,
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
