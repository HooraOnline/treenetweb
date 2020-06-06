import React, { useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuButton from "./MenuButton";
import { fetchStore } from '../../utils';
import { userStore } from '../../stores';

import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Router from "next/router";
import {SectionList} from "../../react-native";
const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: drawerWidth,
    },
    title: {
        //flexGrow: 1,
    },
    hide: {
        display: 'none',
    },
    menuItems: {
        display: 'flex',
        'flex-direction': 'row',
        'justify-content': 'flex-end'
    },
    drawer: {
        //width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        //display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        //marginRight: -drawerWidth,
    },
    contentShift: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: drawerWidth,
    },
}));

export default function MenuBar(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const [menuItems, setMenuItems] = React.useState([]);
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const initMenuData = async () => {
        await fetchStore();
        let nonGroupedItem = [];
       let items=[];
        userStore.Form.map(item => {
            if (item.hasShow) {
                if (item.formID < 0) {
                    items.push({
                        title: item.persianName,
                        items: userStore.Form.filter(filterItem => filterItem.parentID === item.formID && filterItem.hasShow),
                    });
                } else if (!item.parentID) {
                    nonGroupedItem.push(item);
                }
            }
        });
        if (nonGroupedItem.length > 0) {
            groupedItem.push({ title: 'سایر', data: nonGroupedItem });
        }
        setMenuItems(items);
    }

    const onRoleSelected=(role)=>{
        initMenuData();
        props.onRoleSelected && props.onRoleSelected(role)
    }
    useEffect(() => {
        if (menuItems.length==0){
            initMenuData();
        }
    }, []);

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar style={{ backgroundColor: '#FA4141',alignItems:'flex-start' }}>

                    <IconButton
                        style={{marginTop:10}}
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={handleDrawerOpen}
                        className={clsx(open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <FontAwesomeIcon icon={faArrowRight} style={{marginTop:28}} onClick={()=> Router.back()} />
                    <p style={{paddingRight:10,marginTop:24}}>{props.title}</p>
                    <div className={classes.menuItems} style={{ flex: 1, }}>

                    </div>


                </Toolbar>
            </AppBar>

            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="right"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >

                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <div style={{flex:1, backgroundColor: '#efefef' }}>
                    <SectionList
                        headerStyle={{backgroundColor:'fefefe'}}
                        chidStyle={{backgroundColor:'#fff'}}
                        items={menuItems}
                        expendedIndex={0}
                        renderHeader={(item, index) => (
                            <>
                                <img
                                    style={{ height: "25px", width: "25px", display: "block" }}
                                    src="../static/assets/images/theme/ic_expand.png"
                                />
                                <Typography key={index} >{item.title}</Typography>
                            </>
                        )
                        }
                        renderChildren={(child, parent, index) => (
                            <MenuButton
                                key={child.index}
                                path={child.destination}
                                label={child.persianName}
                                icon={child.icon}
                            />
                        )
                        }
                    />

                </div>

            </Drawer>

            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />
                {props.children}
            </main>

        </div>
    );
}
