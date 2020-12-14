import React, { useEffect } from 'react';
import {borderLight } from '../constants/colors';
export default function Line(props) {
  
    //const [color, setColor] = React.useState(props.color ||border);
    
    useEffect(() => { }, []);
        
    return (
        <div {...props}   style={{...props.style,height:1,fontSize:0,backgroundColor:borderLight}}>.</div>
    );
}
