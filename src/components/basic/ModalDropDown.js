import React, {PureComponent} from 'react';
import {FlatList, Modal, StyleSheet, TouchableOpacity, View} from '../../react-native';
export default class ModalDropDown extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {expanded: false, items: props.items || [], selectedItem: props.selectedItem}
    }

    changeLayout = () => {
        if (this.props.showMode) return
        this.setState({expanded: !this.state.expanded})
    }
    close = () => {
        this.setState({expanded: false})
    }
    onSelect = (item, index) => {
        this.setState({expanded: false, selectedItem: item, selectedIndex: index});
        this.props.onselect && this.props.onselect(item, index);
    }
    select = (item, index) => {
        this.setState({selectedItem: item, selectedIndex: index});
    }

    componentDidMount(){

    }

    render() {
        return (

            <View
                ref={(ref) => {
                    this.marker = ref
                }}
                onLayout={({nativeEvent}) => {
                    if (this.marker) {
                        this.marker.measure((x, y, width, height, pageX, pageY) => {
                            this.setState({pageY: pageY})
                            console.log(x, y, width, height, pageX, pageY);
                        })
                    }
                }}
                style={[{}, this.props.style]}
            >

                <TouchableOpacity activeOpacity={0.8} onPress={this.changeLayout}
                                  style={this.props.headerStyle || {height: 40}}>
                    {

                        this.props.renderHeader(this.state.selectedItem, this.state.selectedIndex)
                    }
                </TouchableOpacity>
                <View style={[this.props.bodyStyle]}>
                    <Modal

                        animationType="none"
                        transparent={true}

                        visible={this.state.expanded}
                       
                        onRequestClose={() => {
                            this.collapsible.changeLayout();
                            this.props.onCloseList && this.props.onCloseList();
                        }}>
                        <TouchableOpacity onPress={() => this.close()} style={[{
                            backgroundColor: '#fff',
                            marginTop: this.state.pageY || 55,
                            width:global.width,
                        }, this.props.bodyStyle]}>
                            <View style={this.props.listStyle}>
                                <FlatList
                                    keyExtractor={(item, index) => index.toString()}
                                    data={this.props.items}
                                    renderItem={({item, index}) => (

                                        <TouchableOpacity style={{flex: 1,}} onPress={() => this.onSelect(item, index)}>
                                            {
                                                this.props.renderItem && this.props.renderItem(item, index)
                                            }
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </TouchableOpacity>

                    </Modal>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {},

});


//by animate
// import React, { PureComponent } from 'react';
// import {Text, View, StyleSheet, Platform, UIManager, TouchableOpacity, Image, FlatList, Modal} from 'react-native';
// import Collapsible from "./Collapsible";
//
//
// export default class ModalDropDown extends PureComponent {
//     constructor(props) {
//         super();
//
//         this.state = { expanded: false,items:props.items || [] }
//
//
//     }
//     close=()=>{
//         this.setState({expanded:false})
//     }
//     onSelect=(item,index)=>{
//         this.setState({expanded:false,selectedItem:item,selectedIndex:index});
//         this.props.onselect && this.props.onselect(item,index);
//         this.collapsible.changeLayout();
//     }
//     select=(item,index)=>{
//         this.setState({selectedItem:item,selectedIndex:index});
//         this.props.onselect && this.props.onselect(item,index);
//     }
//     componentDidMount(): void {
//
//     }
//
//     render() {
//         return (
//             <View style={[{},this.props.style]}
//                   ref={(ref) => { this.marker = ref }}
//                   onLayout={({nativeEvent}) => {
//                       if (this.marker) {
//                           this.marker.measure((x, y, width, height, pageX, pageY) => {
//                               this.setState({pageY:pageY})
//                               console.log(x, y, width, height, pageX, pageY);
//                           })
//                       }
//                   }}
//             >
//
//                 <Collapsible
//
//                     onRef={(collapsible)=>{this.collapsible=collapsible}}
//                     style={this.props.style}
//                     headerStyle={this.props.headerStyle}
//                     bodyStyle={this.props.bodyStyle}
//                     onCollapsing={(state)=>this.setState({expanded:state})}
//                     renderHeader={()=> this.props.renderHeader(this.state.selectedItem,this.state.selectedIndex)}
//                 >
//                     <Modal
//
//                         animationType="fade"
//                         transparent={true}
//
//                         visible={this.state.expanded}
//                         onRequestClose={() => {
//                             this.collapsible.changeLayout();
//                             this.props.onCloseList && this.props.onCloseList();
//                         }}>
//                         <TouchableOpacity  onPress={()=>this.close()}  style={[{backgroundColor:'#fff',marginTop:this.state.pageY || 100},this.props.bodyStyle]}>
//                             <View  style={this.props.listStyle}>
//                                 <FlatList
//                                     keyExtractor={(item, index) => index.toString()}
//                                     data={this.props.items}
//                                     renderItem={({item,index}) => (
//
//                                         <TouchableOpacity  style={{flex:1, }}  onPress={()=>this.onSelect(item,index)} >
//                                             {
//                                                 this.props.renderItem && this.props.renderItem(item)
//                                             }
//                                         </TouchableOpacity>
//                                     )}
//                                 />
//                             </View>
//                         </TouchableOpacity>
//
//                     </Modal>
//                 </Collapsible>
//             </View>
//
//
//         );
//     }
// }
//
// const styles = StyleSheet.create({
//
//     container: {
//
//     },
//
// });
