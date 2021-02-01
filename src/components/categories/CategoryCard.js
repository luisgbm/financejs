import {Card, CardHeader, IconButton, makeStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import CreateIcon from "@material-ui/icons/Create";
import Typography from "@material-ui/core/Typography";
import React from "react";

const useStyles = makeStyles(theme => ({
    card: {
        marginBottom: theme.spacing(3)
    }
}));

const CategoryCard = (props) => {
    const classes = useStyles();

    return (
        <Card key={props.categoryId} variant='outlined' className={classes.card}>
            <CardHeader
                action={
                    <IconButton component={Link} to={`/categories/edit/${props.categoryId}`}>
                        <CreateIcon/>
                    </IconButton>
                }
                title={<Typography variant='h6'>{props.categoryName}</Typography>}
            />
        </Card>
    );
};

export default CategoryCard;