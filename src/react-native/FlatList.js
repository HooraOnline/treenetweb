import View from "./View";
import ReactDOM from 'react-dom';
import ScrollView from "./ScrollView";
import Text from "./Text";
import React, {useRef, useEffect, useState, PureComponent} from "react";
import Skeleton from '@material-ui/lab/Skeleton';
import {bgWhite} from "../constants/colors";
import styled from "styled-components";
let Spiner = styled.div`
 border-radius: 50%;
  width: 7em;
  height: 7em;
  margin: 60px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid rgba(227,38,38, 0.2);
  border-right: 1.1em solid rgba(227,38,38, 0.2);
  border-bottom: 1.1em solid rgba(227,38,38, 0.2);
  border-left: 1.1em solid #e32626;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
    `;
export default class FlatList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            EmptyComponentDisplay:'none'
        };
        this.listRef = React.createRef();
        this.divRef = React.createRef();
        this.animationRequestId;
        this.beforeOffset;
    }

    componentDidMount() {
        setTimeout(()=> this.setState({EmptyComponentDisplay:''}),500)
    }

    handlePagingOnScroll= (event)=> {
        this.props.onScroll &&  this.props.onScroll(this.divRef.current) 
        if(this.props.offset===undefined || !this.props.loadMore){
            return ;
        }
        const scrolableDiv=this.divRef.current;
        if (this.animationRequestId) {
            window.cancelAnimationFrame(this.animationRequestId);
        }
        let distanceFromEnd=scrolableDiv.scrollHeight-scrolableDiv.clientHeight-scrolableDiv.scrollTop;
        this.animationRequestId = window.requestAnimationFrame((t) => {
            if (distanceFromEnd<1 && !this.props.loading) {
                this.props.onEndReached && this.props.onEndReached({distanceFromEnd:distanceFromEnd})
                this.addNewRows(this.props.data);
            }
        });
    }

    addNewRows=(items)=>{

        if(items.length===0 || (this.beforeOffset && this.beforeOffset===this.props.offset)){
            return;
        }
        this.beforeOffset=this.props.offset;
        setTimeout(()=>{
            let list = this.listRef.current;
            if(this.props.offset===0){
                items=[];
                list.innerHTML = '';
            }
            if(!list){
                return;
            }
            let fragment = new DocumentFragment();
            let rows=<div>
                {
                    items.map((item,index)=> {
                        return (
                            <div>
                                <div>
                                    {
                                        this.props.renderItem({item,index})
                                    }
                                </div>
                                <View>
                                    {
                                        this.props.ItemSeparatorComponent && this.props.ItemSeparatorComponent()
                                    }
                                </View>
                            </div>
                        )
                    })
                }
            </div>
            ReactDOM.render(rows, fragment);
            list.appendChild(fragment);
            //if(this.props.offset===0){
               // items=[];
            //}

        },0)
    }

    renderRows=(items)=>{
        return(
            <div style={ this.props.listFormat==='wrap'?{
               /*  'display': 'grid',
                'grid-template-columns':' repeat(3, 1fr)',
                'grid-gap': 10,*/
                display: 'flex',
                flexDirection:'row',
                flexWrap: 'wrap',
                alignItems:'center',
                overflow:'scroll',
                maxHeight:this.props.maxHeight
            }: { display: 'flex',
                       flexDirection:this.props.horizontal ?'row':'column', 
                        overflow:'scroll',
                        maxHeight:this.props.maxHeight
                    }}>
                {
                    items.map((item,index)=> {
                        return (
                            <div style={{}}>
                                <div style={{}}>
                                    {
                                        this.props.renderItem({item,index})
                                    }
                                </div>
                                <View>
                                    {
                                        this.props.ItemSeparatorComponent &&  this.props.ItemSeparatorComponent()
                                    }
                                </View>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    renderList=()=>{

        if(!this.props.data || this.props.data.length===0){
            return null;
        }
        if(this.props.offset===undefined){
            return   this.renderRows(this.props.data);
        }
        else
            this.addNewRows(this.props.data);
    }

    render() {
        const {flexWrap,horizontal,data=[],renderItem,offset,keyExtractor,ListEmptyComponent=null,ItemSeparatorComponent,LoadingComponent,ListFooterComponent,loading,onScroll,style,key,mHeight,ListHeaderComponent}=this.props;

        if(data.length===0 && !loading && !offset){
            return (
                <div style={{display:this.state.EmptyComponentDisplay}}>
                    { ListEmptyComponent}
                </div>
                // || <View style={{flex:1,alignItems:'center',marginTop:30}}> <Text>هیچ آیتمی وجود ندارد</Text> </View>
            );
        }

        return (
            <div ref={this.divRef} onScroll={this.handlePagingOnScroll} style={{overflowY:'auto',position:'relative',maxHeight:global.height, }} >
                <input style={{display:'none'}} onChange={()=>console.log(2)} />
                <View style={[{style},{width:'100%',justifyContent22:'center',alignItems22:'center',alignSelf:'center'}]}>
                    {ListHeaderComponent}
                    <div ref={this.listRef} style={{width:'100%',}}>
                        {
                            this.renderList()
                        }
                    </div>
                   
                    {loading && (
                        LoadingComponent ||  <View style={{flex:1,width:'100%',paddingHorizontal:30,marginBottom:24,alignContent:'center',alignItems:'center',}}>
                           {/* <Text style={{flex:1,alignSelf:'center',textAlign:'center'}} >در حال دریافت ...</Text>*/}
                             <Spiner/>
                           {/* 
                            <Skeleton animation="wave" style={{width:'100%',backgroundColor:bgWhite,height: 100,borderRadius:12}} />
                            <Skeleton animation="wave" style={{width:'100%' ,backgroundColor:bgWhite,height:100,borderRadius:12}} />
                            <Skeleton animation="wave" style={{width:'100%',backgroundColor:bgWhite,height:100,borderRadius:12}}/>
                          */}
                        </View>
                    )}
                     {ListFooterComponent}

                </View>
            </div>
        );
    }
}


