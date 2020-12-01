import React, {useRef,useEffect, useState} from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import View from "./View";
import {placeholderTextColor} from "../constants/colors";
import {FlatList} from "./index";

const ExpansionPanel = withStyles({
  root: {
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: '0px solid rgba(0, 0, 0, .125)',
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    //backgroundColor: 'rgba(0, 0, 0, .03)',
    marginBottom: -1,
    minHeight: 40,
    '&$expanded': {
      minHeight: 40,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiExpansionPanelDetails);


export default function SectionList(props) {
  const [expanded, setExpanded] = React.useState(props.expendedIndex);
  const [height, setHeight] = useState(global.height);
  const [pageIndex, setPageIndex] = useState(0);
  const divRef = useRef(null);

  useEffect(() => {
    if(divRef.current){

      setHeight(divRef.current.clientHeight);
    }
    //window.addEventListener('scroll', handleScroll);
  }, [divRef.current]);

  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };



  const isNearInt=(int, target, range)=>{
    if( int < target + range && int > target - range){
      return true;
    }
  }

  const handlePagingOnScroll= (event)=> {
    let distanceFromEnd=divRef.current.scrollHeight-divRef.current.clientHeight-divRef.current.scrollTop;
    console.log(distanceFromEnd);
    if(distanceFromEnd<10){
      console.log('pageIndex=',pageIndex);
      props.onEndReached && props.onEndReached({distanceFromEnd:distanceFromEnd,pageIndex:pageIndex+1,})
      setPageIndex(pageIndex+1);
    }


    /*//solution2
    let pageIndexRange=(divRef.current.scrollTop/divRef.current.clientHeight);
    if(isNearInt(pageIndexRange,pageIndex,0.5)){
      console.log('pageIndex=',pageIndex);
      props.onEndReached && props.onEndReached({distanceFromEnd:distanceFromEnd,pageIndex:pageIndex+1,})
      setPageIndex(pageIndex+1);
    }*/

  }

  if(!props.loading && (!props.sections || props.sections.length===0)){
    return (props.ListEmptyComponent || null)
  }


  return (
      <div>
        <FlatList
            keyboardDismissMode={'on-drag'}
            keyExtractor={(item, index) => index.toString()}
            data={props.sections}
            onScroll={props.onScroll}
            style={props.style}
            renderItem={(section, sectionIndex) =>{
              return (
                  <ExpansionPanel key={sectionIndex}  style={props.style} square expanded={props.expandAll || expanded === section.index} onChange={handleChange(section.index)}>
                    <ExpansionPanelSummary style={props.headerStyle} aria-controls="panel1d-content" id="panel1d-header">
                      {
                        props.renderSectionHeader(section.item,section.index,expanded === section.index)
                      }
                    </ExpansionPanelSummary>
                    {(props.expandAll || expanded === section.index) &&(
                        <ExpansionPanelDetails style={props.chidStyle}>
                          <View  style={{flex:1}}>
                            {
                              section.item.data.map((child, index) =>
                                  <View  key={index} style={{}}>
                                    {
                                      props.renderItem(child, section.item, index)
                                    }
                                  </View>
                              )
                            }
                          </View>
                        </ExpansionPanelDetails>
                    )}
                  </ExpansionPanel>
              )
            } }
            loading={props.loading}
            loadMore={props.loadMore}
            offset={props.offset}
            onEndReached={props.onEndReached}
        />
          <style jsx global>{`
                .MuiExpansionPanelDetails-root{
                       padding: 0px 0px 0px;
                 }
                  .MuiExpansionPanelSummary-content {
                    margin: 0;
                
                  }
              .MuiExpansionPanelSummary-root {
                display: flex;
                padding: 0px 0px;
                min-height: 48px;
                transition: min-height 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
              }
              .MuiPaper-root {
                color: rgba(0, 0, 0, 0.87);
                transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
                background-color: transparent;
               }
               MuiExpansionPanelSummary-content.Mui-expanded {
                  margin: 0px 0 !important; 
               }
               .WithStyles\\(ForwardRef\\(ExpansionPanelSummary\\)\\)-content-190.WithStyles\\(ForwardRef\\(ExpansionPanelSummary\\)\\)-expanded-191 {
                    margin: 0px 0 !important; 
                }
              .MuiExpansionPanelSummary-content.Mui-expanded {
                   margin: 0px; 
               }
            `}</style>
      </div>




  );
}
