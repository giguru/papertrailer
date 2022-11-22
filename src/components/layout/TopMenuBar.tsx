import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import {useNavigate} from "react-router";
import {Link} from "react-router-dom";
import {routes} from "../../utils/routes";
import {useAuth} from "../auth-provider/AuthProvider";
import styles from './TopMenuBar.module.scss';


type ApiEndpoint = string;
type PageType = {[label: string] : ApiEndpoint };

const pages : PageType = {
    'My sources': routes.mySources,
};

const publicPages : PageType = {
    'Public Nets': routes.publicNets,
};

const settings : PageType = {
    'Profile': routes.myProfile,
    'Account Settings': routes.accountSettings,
};

const TopMenuBar = () => {
    const { loggedInUser, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static" variant="outlined" className={styles.Toolbar}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        <Link to={routes.home}>
                            PAPERTRAILER
                        </Link>
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {Object.keys(pages).map((label) => (
                                <MenuItem
                                    key={label}
                                    onClick={() => {
                                        navigate(pages[label])
                                        handleCloseNavMenu();
                                    }}
                                >
                                    <Typography textAlign="center">{label}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {Object.keys(publicPages).map((label) => (
                            <Button
                                key={label}
                                onClick={() => {
                                    navigate(publicPages[label])
                                    handleCloseNavMenu();
                                }}
                                sx={{ my: 1, mr: 2, display: 'block' }}
                                className={styles.MainMenuLink}
                            >
                                {label}
                            </Button>
                        ))}
                    </Box>
                    {loggedInUser ? (
                        <>
                            <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
                                {Object.keys(pages).map((label) => (
                                    <Button
                                        key={label}
                                        onClick={() => {
                                            navigate(pages[label])
                                            handleCloseNavMenu();
                                        }}
                                        sx={{ my: 1, mr: 2, display: 'block' }}
                                        className={styles.MainMenuLink}
                                    >
                                        {label}
                                    </Button>
                                ))}
                            </Box>
                            <Box sx={{ flexGrow: 0 }}>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt={`${loggedInUser.first_name} ${loggedInUser.last_name}`} src="/static/images/avatar/2.jpg" />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {Object.keys(settings).map((label) => (
                                        <MenuItem key={label} onClick={() => {
                                            navigate(settings[label]);
                                            handleCloseUserMenu();
                                        }}>
                                            <Typography textAlign="center">{label}</Typography>
                                        </MenuItem>
                                    ))}
                                    <MenuItem onClick={() => logout()}>
                                        <Typography textAlign="center">Log out</Typography>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </>
                    ) : (
                        <Link to={routes.login}>
                            Log in
                        </Link>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default TopMenuBar;
