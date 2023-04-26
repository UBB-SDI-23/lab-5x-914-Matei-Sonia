import {Box, Card, CardActions, CardContent, CircularProgress, IconButton, List, ListItem} from "@mui/material";
import { Container } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BACKEND_API_URL } from "../../constants";
import { PasswordAccount } from "../../models/Account";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import {Vault} from "../../models/Vault";

export const AccountPasswordDetails = () => {
    const [loading, setLoading] = useState(true);
    const { passwId } = useParams();
    const [passw, setPassw] = useState<PasswordAccount>();

    useEffect(() => {
        setLoading(true);
        axios.get(`${BACKEND_API_URL}/account/${passwId}`)
            .then((response) => {
                console.log(response.data)
                setPassw(response.data);
                setLoading(false);
            })

    }, [passwId]);

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
                        <IconButton component={Link} sx={{ ml: 0 }} to={`/account`}>
                            <ArrowBackIcon />
                        </IconButton>{" "}
                        <h1>Details</h1>
                        <ul>
                            <li>Created: {passw?.created_at}</li>
                            <li>Modified: {passw?.last_modified}</li>
                            <li>Vault: <Link to={`/vault/${(passw?.vault as Vault).id}/details`} title="View vault details">
                                {(passw?.vault as Vault).title}
                            </Link></li>
                            <li>Website or App: {passw?.website_or_app}</li>
                            <li>Username or Email: {passw?.username_or_email}</li>
                            <li>Note: {passw?.note}</li>
                            <li>Password: {passw?.password}</li>
                        </ul>
                        <br/>
                        <p>Tags:</p>
                        <List>
                            {passw?.tags?.map((tag) => (
                                <ListItem key={tag.id}><Link to={`/tag/${tag.tag.id}/details`} title="View tag details">
                                    {tag.tag.title}</Link></ListItem>
                            ))}
                        </List>
                    </CardContent>
                    <CardActions>
                        <IconButton component={Link} sx={{ mr: 3 }} to={`/account/${passwId}/edit`}>
                            <EditIcon />
                        </IconButton>

                        <IconButton component={Link} sx={{ mr: 3 }} to={`/account/${passwId}/delete`}>
                            <DeleteForeverIcon sx={{ color: "red" }} />
                        </IconButton>
                    </CardActions>
                </Card>)}
        </Container>
    );
};