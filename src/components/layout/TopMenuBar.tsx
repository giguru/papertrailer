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
import {Link, Search} from "react-router-dom";
import {routes} from "../../utils/routes";
import {useAuth} from "../auth-provider/AuthProvider";
import styles from './TopMenuBar.module.scss';
import NewFileButton from "../files/NewFileButton";
import {useId, useRef, useState} from "react";
import axios from "axios";
import {useQuery} from "react-query";
import {ServerIndexResponse} from "../../api/api";
import {ApiCommentsInterface, ApiSearchInterface} from "../../api/models";
import {useTimeout} from "../../utils/hooks/useTimeout";
import ErrorBoundary from "../ErrorBoundary";
import NoResults from "../NoResults";
import Loader from "../loader/Loader";
import {relationOptions, RelationValue} from "../../utils/enums";

function useSearch() {
    const id = useId();
    const { doTimeout } = useTimeout({ time: 500 });
    const [value, setValue] = useState('');
    const [isDelaying, setDelaying] = useState(false);
    const [immediateValue, setImmediateValue] = useState('');
    const { data: fullData, error, isLoading, isFetching, refetch } = useQuery(
        ['search', id, value],
        () => axios.get<ServerIndexResponse<ApiSearchInterface[]>>(`/search?q=${value}`),
        { enabled: Boolean(value) }
    );

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImmediateValue(e.target.value);
        setDelaying(true);
        doTimeout(() => {
            setDelaying(false);
            setValue(e.target.value);
        })
    };

    const results : ApiSearchInterface[] | undefined = fullData?.data.data || undefined;

    return {
        value: immediateValue,
        results,
        onChange,
        error,
        isSearching: isFetching || isDelaying,
    }
}

function searchLink(item: ApiSearchInterface) {
    if (item.type === 'file') {
        return routes.editFile(item.object.id)
    } else if (item.type === 'relation') {
        const fbbs = item.object.file_bounding_blocks;
        if (fbbs?.length) {
            return routes.viewRelation(fbbs[0]?.file_id, item.object.id);
        }
    }
    return '';
}
function replaceRelationTag(context: string) {
    const regex = /\<relation\>([A-Z\_]+)<\/relation>/g;
    const found = context.match(regex);
    if (found && found.length > 0) {
        const relationString = found[0]
            .replace('<relation>', '')
            .replace('</relation>', '') as RelationValue;
        const relation = relationOptions[relationString];

        return context.replace(found[0], `<b style="color: ${relation.color}">${relation.label}</b>`)
    }
    return context
}

function SearchBar() {
    const [focus, setFocus] = useState(false)
    const { value, onChange, results, isSearching } = useSearch();
    const { doTimeout } = useTimeout({ time: 200 });

    return (
        <div className={[styles.SearchBarContainer, focus ? styles.Focus : ''].join(' ')}>
            <input
                className={styles.SearchBar}
                placeholder="Search files, relations or comments..."
                value={value}
                onFocus={() => setFocus(true)}
                onBlur={() => doTimeout(() => setFocus(false))}
                onChange={(e) => {
                    e.persist()
                    setFocus(true);
                    onChange(e);
                }}
            />
            {focus && (
                <div className={styles.SearchBarResultsContainer}>
                    {isSearching && <Loader />}
                    <div className={styles.ResultsList}>
                        {!isSearching && Array.isArray(results) && results.length > 0 && results.map((item) => {
                            const content = (
                                <>
                                    <div className={styles.PreHeader}>
                                        <span className={styles.Type}>{item.type}</span>
                                        <span className={styles.Div} />
                                        <span className={styles.Id}>{item.object.id}</span>
                                    </div>
                                    <div className={styles.Title} dangerouslySetInnerHTML={{ __html: item.title }} />
                                    {item.context && (
                                        <span className={styles.Context} dangerouslySetInnerHTML={{__html: replaceRelationTag(item.context) }} />
                                    )}
                                </>
                            )
                            const link = searchLink(item);
                            return link ? (
                                <Link to={link} className={styles.ResultItem} key={item.object.id}>
                                    {content}
                                </Link>
                            ) : <a className={styles.ResultItem} key={item.object.id}>{content}</a>;
                        })}
                    </div>
                    {!isSearching && Array.isArray(results) && results.length === 0 && (
                        <NoResults>No results found</NoResults>
                    )}
                </div>
            )}
        </div>
    );
}

function Logo () {
    return (

        <Link to={routes.home} className={styles.Logo}>
            {'PAPERTRAILER'.split('').map((char, idx) => (
                <span
                    key={idx}
                    style={{
                        top: ([11, 10, 9, 3, 4].indexOf(idx) > -1 ? 2 : 0) + ([1].indexOf(idx) > -1 ? -2 : 0),
                        position: 'relative',
                    }}
                >
                    {char}
                </span>
            ))}
        </Link>
    );
}

type ApiEndpoint = string;
type PageType = {[label: string] : ApiEndpoint };

const pages : PageType = {
    'My files': routes.myFiles,
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
                <Toolbar disableGutters sx={{ columnGap: '1rem' }}>
                    <Logo />

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
                        <Logo />
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
                    <SearchBar />
                    <NewFileButton />
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
