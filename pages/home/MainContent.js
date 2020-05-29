import React from "react";
import images from "../../public/static/assets/images";
import Router from "next/router";
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles(() =>
    createStyles({
        root: {
            height:'100%',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            overflow: 'hidden',
            backgroundColor: 'paper',
        },
        gridList: {
            width: '100%',
            height: '100%',
        },
        titleBar: {
            height:50,
            background:'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',

        },
        title: {
            fontSize: 18,
            color: 'white',
        },
    }),
);
const MainContent = props => {
    const classes = useStyles();


    const tileData = [
        {page:props.isAdmin?'Costs':'MyUnit', img:props.isAdmin? images.bgh_01_Copy:images.bgh_05, title: props.isAdmin?'هزینه ها':'واحد من'},
        {page:props.isAdmin?'car/AllCar':'car/cars', img:images.bgh_06, title:props.isAdmin?'ماشینها':'ماشین های من' },
        {page:props.isAdmin?'PayAdmin':'PayAnnounce',img:props.isAdmin? images.bgh_02_Copy:images.bgh_07, title:props.isAdmin?'ساکنین':'صورتحساب' },
        {page:'facility/FacilityForReserve', img: images.bgh_03_Copy, title: 'امکانات رفاهی'},
        {page:'Announcements', img: images.bgh_04, title: 'تابلو اعلانات'},
    ]
    const navigate=function (page) {
         Router.replace('/'+page);
    }
    return (
            <div className={classes.root}>
                <div className="wrapper" style={{padding: 2}}>
                    <div className="first_child box-image" onClick={()=>navigate(tileData[0].page)}>
                            <img src={tileData[0].img} className='mainImageClass'/>
                            <div className="backgroundGradient nowrap_mobile"
                                 style={{bottom: '+0%'}}>{tileData[0].title}</div>
                    </div>
                    <div className="second_child box-image"  onClick={()=>navigate(tileData[2].page)}>
                            <img src={tileData[2].img} className='mainImageClass'/>
                            <div className="backgroundGradient nowrap_mobile"
                                 style={{bottom: '0%'}}>{tileData[2].title}</div>
                    </div>
                    <div className="third_child box-image"  onClick={()=>navigate(tileData[2].page)}>
                            <img src={tileData[3].img} className='mainImageClass'/>
                            <div className="backgroundGradient nowrap_mobile"
                                 style={{bottom: '0%'}}>{tileData[3].title}</div>
                    </div>
                    <div className="fourth_child box-image"  onClick={()=>navigate(tileData[2].page)}>
                            <img src={tileData[4].img} className='mainImageClass'/>
                            <div className="backgroundGradient nowrap_mobile"
                                 style={{bottom: '0%'}}>{tileData[4].title}</div>
                    </div>
                </div>
                <style jsx global>{`
            .wrapper {
                            display: grid;
                            grid-gap: 0.3%;
                        grid-template-columns: 50% 50% ;
                        grid-template-rows:35% auto;
                        background-color: #fff;
                        color: #444;
                        }
                        .mainImageClass{
                        width:100%;
                        max-height:100%;
                        height:100%;
                        border-radius:5px;
                        }
                        .box-image{
                        width:100%;
                        position:relative;
                        max-height:100%;
                        cursor:pointer;
                        }

                        .box {
                        background-color: #444;
                        color: #fff;
                        border-radius: 5%;
                        font-size: 150%;
                        
                        }
                        
                        .first_child {
                        grid-column: 1/3 ;
                        grid-row: 1;
                        }
                        .second_child {
                        grid-column: 1 ;
                        grid-row: 2/4 ;
                        }
                        .third_child{
                        grid-column:2;
                        grid-row:2;
                        }
                        .fourth_child{
                        grid-column:2;
                        grid-row:3;
                        }
                        .backgroundGradient{
                        width: 100%;
                        position: absolute;
                        background-image: linear-gradient(to top, rgba(0, 0, 0, 2.58), rgba(255, 30, 30, 0));
                        color: white;
                        font-size: 120%;
                        max-height:30%;
                        padding: 5.5%;
                        }
                        @supports (-webkit-touch-callout: none) {
                        .backgroundGradient{
                                            width: 100%;
                                            position: absolute;
                                            background-image: linear-gradient(to top, rgba(0, 0, 0, 2.58), rgba(0, 0, 0, 0));
                                            color: white;
                                            font-size: 120%;
                                            max-height:30%;
                                            padding: 5.5%;
                                            } 
                                                }
                      @media screen and (max-width: 768px){
                        .nowrap_mobile{
                        white-space:no-wrap;
                        font-size:100%;
                        }
                        }
            `}</style>
            </div>


       );
}

export default MainContent;
