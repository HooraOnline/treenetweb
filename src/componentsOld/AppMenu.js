import React, { useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MenuButton from "./MenuButton";
import { fetchStore } from '../utils';
import { userStore } from '../stores';
import SectionList from './SectionList';

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        height:'100%'
    },
}));

export default function AppMenu(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const [menuItems, setMenuItems] = React.useState([]);
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
            <div style={{ height:'100%', flex:1, backgroundColor: '#efefef' }}>
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

        </div>
    );
}
