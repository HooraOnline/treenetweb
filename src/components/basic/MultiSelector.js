import React, {PureComponent} from 'react';
import {
     Dimensions,
    FlatList,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from '../../react-native';
import {borderSeparate, checkIcon, drawerItem, primaryDark, textDisabled} from "../../constants/colors";
import images from "public/static/assets/images";

export default class MultiSelector extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value || [],
            selectedIndexes:[],
            selectedItems:[],
        };
        this.state.value.map((id) => {
            props.items.map((item, index) => {
                if (id == item[this.props.idItem]) {
                    selectedIndexes.push(index);
                    selectedItems.push(item)
                }
            })
        });

    }
    onChangedValue(entity, id, index) {
        if (this.state.value.includes(id)) {
            let value = this.state.value.filter(item => item !== id,);
            let selectedIndexes = this.state.selectedIndexes.filter(i => i !== index,);
            let selectedItems = this.state.selectedItems.filter(item => item[this.props.idItem] !== id,);
            this.state.value=value;
            this.state.selectedItems=selectedItems;
            this.state.selectedIndexes=selectedIndexes;
            this.setState({
                value: value,
                selectedIndexes: selectedIndexes,
                selectedItems: selectedItems
            });
        } else {
            this.state.value=[...this.state.value, id];
            this.state.selectedItems=[...this.state.selectedItems, entity];
            this.state.selectedIndexes=[...this.state.selectedIndexes, entity];
            this.setState({
                value: this.state.value,
                selectedItems: this.state.selectedItems,
                selectedIndexes: this.state.selectedIndexes,
            });
        }
        this.props.onChangedValue && this.props.onChangedValue(this.state.value, this.state.selectedItems, this.state.selectedIndexes,!this.state.value.includes(id))
    }

    removeAllSelecteds = () => {
        this.setState({value: [], selectedIndexes: [], selectedItems: []});
    };

    componentDidMount() {
        this.props.onRef && this.props.onRef(this);
    }
    renderItems=(item,index)=>{
        let id=item[this.props.pkName ||'ID'];
        let selected=this.state.value.includes(id);
       return(
           <TouchableOpacity onPress={()=>{
               this.onChangedValue(item,index,)
           }}>
               {
                   this.props.renderCustomItems?
                       this.props.renderCustomItems(item,index,selected):
                       (
                           <View>
                               <Text>{item.Name}</Text>
                           </View>
                       )
               }
           </TouchableOpacity>
       )

    }

    render() {
        const {
            idItem='ID',
            fieldItem='Name',
            itemComponent,
            numColumns,
            itemStyle
        } = this.props;



        return (
            <View style={this.props.style}>
                <FlatList
                    style={{}}
                    data={this.props.items}
                    numColumns={numColumns}
                    scrollEnabled={true}
                    renderItem={({item, index}) =>
                        <TouchableOpacity
                            onPress={() => this.onChangedValue(item, item[idItem], index)}
                            style={[{flex: 1}, this.props.listStyle]}
                        >
                            {itemComponent ? (
                                itemComponent(item, index, this.state.value.includes(item[idItem]))
                            ) : (
                                <View style={[styles.row,itemStyle]}>
                                    <Image
                                        source={this.state.value.includes(item[idItem]) ? images.checked_icon : images.unchecked_icon}
                                        style={{
                                            height: 24,
                                            width: 24,
                                            tintColor: this.state.value.includes(item[idItem]) ? primaryDark : checkIcon,
                                        }}
                                    />
                                    {item.Icon &&(
                                        <Image
                                            source={images[item.Icon]}
                                            style={{
                                                height: 24,
                                                width: 24,
                                                tintColor: checkIcon,
                                                marginVertical:5,

                                            }}
                                        />
                                    )
                                    }

                                    <Text style={{
                                        flex: 1,
                                        alignSelf: 'flex-start',
                                        fontSize: 12,
                                        color: drawerItem,
                                        marginStart: 6,
                                    }}>{item[fieldItem]}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    }/>
            </View>

        );
    }
}
const styles = StyleSheet.create({
    row: {
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 7,
        borderColor: borderSeparate,

    },

});




