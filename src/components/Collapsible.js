import React, {useEffect, useState} from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import { getHeight, getWidth} from "../utils";
import useWindowDimensions from "../hooks/windowDimensions";

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
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '0px 0',
    },
  },
  expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiExpansionPanelDetails);


export default function Collapsible(props) {
  const [expanded, setExpanded] = React.useState(props.expanded || false);
  const [height, setHeight] = useState(900);
  const handleChange = panel => (event, newExpanded) => {
   
    setExpanded(newExpanded ? panel : false);
  };

  useEffect(() => {
    setHeight(getHeight());

  }, []);
  return (

      <ExpansionPanel style={{width:'100%'}} square expanded={props.outoExpand?expanded:props.expand}  onChange={()=>{
          if(props.outoExpand){
            setExpanded(!expanded);
          }
          props.onExpand &&  props.onExpand();
          
      }} >
        <ExpansionPanelSummary style={{width:'100%'}} aria-controls="panel1d-content" id="panel1d-header">
          {
            props.renderHeader()
          }
        </ExpansionPanelSummary>

        <ExpansionPanelDetails style={{width:'100%'}}>

          {props.children}

        </ExpansionPanelDetails>
        <style jsx global>{`
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
            `}</style>

      </ExpansionPanel>

  );
}
