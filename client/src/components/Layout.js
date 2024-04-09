import React from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

function Layout() {
    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Stock Trading Platform
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar />
                <Divider />
                <List>
                    {['Home', 'Tickers', 'Place Stock Order', 'View Order Status'].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton component={Link} to={index === 0 ? "/" :
                                index === 1 ? "/ticker" :
                                index === 2 ? "/place-order" : "/view-order"}>
                                <ListItemIcon>
                                    {index === 0 ? <HomeIcon /> :
                                    index === 1 ? <AssessmentIcon /> :
                                    index === 2 ? <AddShoppingCartIcon /> :
                                    <VisibilityIcon />}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}

export default Layout;
