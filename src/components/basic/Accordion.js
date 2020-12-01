import React, {Component} from 'react';
import {View, TouchableOpacity, Text, FlatList, StyleSheet, Image} from "../../react-native";
import {textDisabled, textItem} from "../../constants/colors";
const Colors = {
    PRIMARY:'#1abc9c',

    WHITE:'#ffffff',
    LIGHTGREEN:'#BABABA',
    GREEN:'#0da935',


    GRAY:'#f7f7f7',
    LIGHTGRAY: '#C7C7C7',
    DARKGRAY: '#5E5E5E',
    CGRAY: '#ececec',
    OFFLINE_GRAY: '#535353'
}

 class AccordianItem extends Component{

    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            expanded : false,
        }
    }

    render() {
        return (
            <View>
                <TouchableOpacity onPress={()=>this.toggleExpand()}>
                    {
                        this.props.renderHeader(this.state.expanded)
                    }
                </TouchableOpacity>
                {
                    this[this.props.singleOpen?'props':'state'].expanded &&
                    <View style={{flex:1,}}>
                        {this.props.renderItems(this.props.data,this.props.index,this.state.expanded)}
                    </View>
                }
            </View>
        )
    }

    onClick=(index)=>{
        const temp = this.state.data.slice()
        temp[index].value = !temp[index].value
        this.setState({data: temp})
    }

    toggleExpand=()=>{

        this.setState({expanded :!this.state.expanded });
        this.props.onToggle(this.props.index,this.state.expanded);
    }


}
export default class Accordion extends Component{

    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            expandedIndex : props.expandedIndex,
        }
    }
    onToggle(index,isOpen,item){
        this.setState({ expandedIndex: this.state.expandedIndex===index?null:index })
        this.props.onToggle && this.props.onToggle(index,isOpen,item)
    };
    render() {

        return (
            <View>
                <FlatList
                    data={this.props.data}
                    numColumns={1}
                    scrollEnabled={false}
                    renderItem={({item, index}) =>
                        <View key={index.toString()}>
                            <AccordianItem
                                data={item}
                                index={index}
                                onToggle={(index,isOpen)=>this.onToggle(index,isOpen,item)}
                                singleOpen={this.props.singleOpen}
                                expanded={this.state.expandedIndex==index}
                                renderHeader={(expanded)=>this.props.renderHeader(item,index,expanded)}
                                renderItems={(item, index,hItem,hIndex,expanded)=>this.props.renderItems(item, index,hItem,hIndex,expanded)}
                            />
                            <View style={styles.childHr}/>
                        </View>

                    }/>
            </View>

        )
    }

    onClick=(index)=>{
        const temp = this.state.data.slice()
        temp[index].value = !temp[index].value
        this.setState({data: temp})
    }

    toggleExpand=()=>{
        this.setState({expanded : !this.state.expanded})
    }

}
const styles = StyleSheet.create({
    childHr:{
        height:1,
        backgroundColor: textDisabled,
        width:'100%',
    },


});
