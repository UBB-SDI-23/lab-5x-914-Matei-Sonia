import {Box, Card, CardActions, CardContent, CircularProgress, IconButton, List, ListItem} from "@mui/material";
import { Container } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BACKEND_API_URL } from "../../constants";
import { Tag } from "../../models/Tag";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import {Vault} from "../../models/Vault";

export const TagsDetails = () => {
    const [loading, setLoading] = useState(true);
    const { tagId } = useParams();
    const [tag, setTag] = useState<Tag>();

    useEffect(() => {
        setLoading(true);
        axios.get(`${BACKEND_API_URL}/tag/${tagId}`)
            .then((response) => {
                setTag(response.data);
                setLoading(false);
            })

    }, [tagId]);

    return (
        <Container>
            {loading && (
                <Box>
                    <CircularProgress sx={{mt: 3}}/>
                </Box>
            )}
            {!loading &&(
                <Card>
                    <CardContent>
                        <IconButton component={Link} sx={{ ml: 0 }} to={`/tag`}>
                            <ArrowBackIcon />
                        </IconButton>{" "}
                        <h1>Details</h1>
                        <ul>
                            <li>Vault: <Link to={`/vault/${(tag?.vault as Vault).id}/details`} title="View tag details">
                                {(tag?.vault as Vault).title}
                            </Link></li>
                            <li>Title: {tag?.title}</li>
                        </ul>
                        <br/>
                        <p>Tagged Passwords:</p>
                        <List>
                            {tag?.tagged_passwords?.map((passw) => (
                                <ListItem key={passw.id}><Link to={`/account/${passw.password.id}/details`} title="View tag details">
                                    {passw.password.website_or_app} --- {passw.password.password}</Link></ListItem>
                            ))}
                        </List>
                    </CardContent>
                    <CardActions>
                        <IconButton component={Link} sx={{ mr: 3 }} to={`/tag/${tagId}/edit`}>
                            <EditIcon />
                        </IconButton>

                        <IconButton component={Link} sx={{ mr: 3 }} to={`/tag/${tagId}/delete`}>
                            <DeleteForeverIcon sx={{ color: "red" }} />
                        </IconButton>
                    </CardActions>
                </Card>)}
        </Container>
    );
};