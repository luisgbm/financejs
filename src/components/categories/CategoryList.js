import React from 'react';

import {Link} from 'react-router-dom'
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import {Add} from '@material-ui/icons';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import {Container, IconButton, makeStyles, Tab, Tabs} from '@material-ui/core';
import CategoryCard from "./CategoryCard";
import {useSelector} from "react-redux";

const useStyles = makeStyles(theme => ({
    container: {
        padding: theme.spacing(3)
    },
    appBarTitle: {
        flexGrow: 1
    }
}));

const CategoryList = (props) => {
    const tabNameToValue = (tabName) => {
        let tabValue = 0;

        if (tabName) {
            if (tabName === 'expense') {
                tabValue = 0;
            } else {
                tabValue = 1;
            }
        }

        return tabValue;
    };

    const tabValueToName = (tabValue) => {
        return tabValue === 0 ? 'expense' : 'income';
    };

    const currentTab = tabNameToValue(props.match.params.type);

    const categories = useSelector(state => state.categories);

    const classes = useStyles();

    const onChangeTab = (event, newValue) => {
        props.history.push(`/categories/${tabValueToName(newValue)}`);
    };

    return (
        <>
            <AppBar position='sticky'>
                <Toolbar>
                    <Typography variant='h6' className={classes.appBarTitle}>Categories</Typography>
                    <IconButton color='inherit' component={Link}
                                to={`/categories/new/${tabValueToName(currentTab)}`}>
                        <Add/>
                    </IconButton>
                </Toolbar>
                <Tabs value={currentTab} onChange={onChangeTab} centered>
                    <Tab icon={<ThumbDownIcon/>} label='Expenses'/>
                    <Tab icon={<ThumbUpIcon/>} label='Incomes'/>
                </Tabs>
            </AppBar>
            <Container maxWidth='sm' className={classes.container}>
                {
                    categories
                        .filter(category => currentTab === 0 ?
                            category.categorytype === 'Expense' :
                            category.categorytype === 'Income')
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(category =>
                            <CategoryCard
                                key={category.id}
                                categoryId={category.id}
                                categoryName={category.name}
                            />
                        )
                }
            </Container>
        </>
    );
};

export default CategoryList;
