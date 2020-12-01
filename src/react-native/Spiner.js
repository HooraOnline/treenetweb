import styled from "styled-components";


export const Spiner = styled.div`
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


{/* 
    <Skeleton animation="wave" style={{width:'100%',backgroundColor:bgWhite,height: 100,borderRadius:12}} />
    <Skeleton animation="wave" style={{width:'100%' ,backgroundColor:bgWhite,height:100,borderRadius:12}} />
    <Skeleton animation="wave" style={{width:'100%',backgroundColor:bgWhite,height:100,borderRadius:12}}/>
*/}






