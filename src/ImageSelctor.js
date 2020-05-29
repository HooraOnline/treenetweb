import React, {PureComponent} from 'react';
import {
    Alert,
    Dimensions,
    Image,
    ImageBackground,
    Platform,
    StyleSheet, Text,
    TouchableOpacity,
    View,
} from '../src/react-native';
import ImagePicker from 'react-native-image-crop-picker';
import images from '@assets/images';
import {accountsStore, globalState, persistStore,} from '../src/stores';
import {getFileDownloadURL, uploadFile} from '../src/utils';
import FastImage from 'react-native-fast-image';
import * as Progress from 'react-native-progress';
import {createImageProgress} from 'react-native-image-progress';

const BgImageChacheProgress = createImageProgress(FastImage);
import Color, {fab, bgScreen, subTextItem, textItem} from "../../constants/colors";
import {AlertMessage, Overlay, OverlayModal,} from "../index";
import Permissions from "react-native-permissions";


const {height, width} = Dimensions.get('window');


function TypeImageSelector({
                               visible,
                               onCameraPress,
                               onGalleryPress,
                               onDismiss,
                           }) {
    if (visible) {
        return (
            <OverlayModal
                catchTouch={true} onOutPress={onDismiss} visible={visible} style={{backgroundColor: 'transparent'}}>
                <View
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 10,
                        paddingVertical: 12,
                        marginHorizontal: 40,
                    }}>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderEndWidth: 1,
                                borderEndColor: subTextItem,
                            }}
                            onPress={onCameraPress}>
                            <Image
                                source={images.ic_camera}
                                style={{
                                    tintColor: textItem,
                                    width: 24,
                                    height: 24,
                                    marginEnd: 8,
                                }}
                            />
                            <Text
                                style={{
                                    fontFamily:
                                        Platform.OS === 'ios'
                                            ? 'IRANYekan-Medium'
                                            : 'IRANYekanMedium',
                                    paddingVertical: 8,
                                }}>
                                با دوربین
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPress={onGalleryPress}>
                            <Image
                                source={images.ic_gallery}
                                style={{
                                    tintColor: textItem,
                                    width: 24,
                                    height: 24,
                                    marginEnd: 8,
                                }}
                            />
                            <Text
                                style={{
                                    fontFamily:
                                        Platform.OS === 'ios'
                                            ? 'IRANYekan-Medium'
                                            : 'IRANYekanMedium',
                                    paddingVertical: 8,
                                }}>
                                از گالری
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </OverlayModal>
        );
    } else {
        return <View/>;
    }
}

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
        this.bannerHeight = width * 9 / 16;


    }

    removeImage() {
        this.setState({showRemoveImage: false});
        this.setState({image: null});
        this.props.onRemoveImage && this.props.onRemoveImage(this.state.image);
    }

    checkPermissions = () => {
        Permissions.checkMultiple(['camera', 'photo']).then(response => {
            // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
            this.setState({
                cameraPermission: response.camera,
                photoPermission: response.photo,
            });
        });
    };


    _requestPermission(type) {
        Permissions.request(type).then(response => {

            if (type === 'camera') {
                this.setState({cameraPermission: response});
            } else {
                this.setState({imagePermission: response});
            }
            if (response === 'authorized') {
                this.onImageSelector(type === 'camera');
            }
        });
    }

    alertForIosPermission(title) {
        Alert.alert(
            'اجازه دسترسی به ' + title,
            'شما مجوز لازم را صادر نکرده اید از طریق تنظیمات اقدام نمایید!',
            [
                {
                    text: 'لغو',
                    onPress: () => console.log('Permission denied'),
                    style: 'cancel',
                },
                {text: 'باز کردن تنظیمات', onPress: Permissions.openSettings},
            ],
        );
    }
    uploadFile(path){
        globalState.showBgLoading();
        uploadFile(path)
            .then(result => {
                const fileName = result.fileName;

                this.setState({
                    image: fileName,
                });
                this.props.onUplodedFile && this.props.onUplodedFile(fileName);
            })
            .finally(() => globalState.hideBgLoading());
    }
    onImageSelector(isCamera) {

        this.setState({showImageTypeSelector: false});
        if (isCamera) {
            if (this.state.cameraPermission === 'authorized') {
                ImagePicker.openCamera({
                    width: 600,
                    height: 600,
                    cropping: true,
                }).then(async image => {
                    const {path} = image;
                    await this.uploadFile(path)

                }) .catch(e => globalState.showToastCard())
            } else if (this.state.cameraPermission !== 'restricted') {
                if (Platform.OS === 'ios' && this.state.cameraPermission === 'denied') {
                    this.alertForIosPermission('دوربین');
                } else {
                    this._requestPermission('camera');
                }
            }
        } else {
            if (this.state.imagePermission === 'authorized') {
                ImagePicker.openPicker({
                    width: 600,
                    height: 600,
                    cropping: true,
                }).then(async image => {
                    const {path} = image;
                    await this.uploadFile(path)
                }) .catch(e => globalState.showToastCard())
            } else if (this.state.imagePermission !== 'restricted') {
                if (Platform.OS === 'ios' && this.state.imagePermission === 'denied') {
                    this.alertForIosPermission('گالری تصاویر');
                } else {
                    this._requestPermission('photo');
                }
            }
        }
    }

    renderSelectBtn() {
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
        if (nextProps.image != nextState.image)
            this.setState({image: nextProps.image})

    }

    componentDidMount() {
        this.checkPermissions();
    }

    render() {
        const {style,canUpload=true,hideDeleteBtn, noImage, imageStyle, children, renderContent, selectBtnStyle} = this.props;

        return (
            <View>
                <BgImageChacheProgress
                    style={[{
                        height: this.bannerHeight,
                        //width: width,
                    },style]}
                    imageStyle={imageStyle}
                    resizeMode="cover"

                    source={this.state.image ? {
                        uri: getFileDownloadURL(this.state.image),
                        headers: {Authorization: 'Bearer ' + persistStore.token},
                        priority: FastImage.priority.high,
                    } : noImage}
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
                {canUpload &&(
                    <TouchableOpacity
                        onPress={() => this.setState({showImageTypeSelector: true})}
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
                            // marginTop: -30,
                            // transform: [{translateY: -30}]
                        }}>
                        {
                            this.renderSelectBtn()
                        }
                    </TouchableOpacity>
                )
                }

                {canUpload && !hideDeleteBtn && this.state.image && (
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

                <TypeImageSelector
                    visible={this.state.showImageTypeSelector}
                    onCameraPress={() => this.onImageSelector(true)}
                    onGalleryPress={() => this.onImageSelector(false)}
                    onDismiss={() => this.setState({showImageTypeSelector: false})}
                />
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
