import {Box, Card, CardActions, CardContent, CircularProgress, IconButton, List, ListItem} from "@mui/material";
import { Container } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BACKEND_API_URL } from "../../constants";
import { PasswordClassic } from "../../models/Classic";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";

export const ClassicPasswordDetails = () => {
    const [loading, setLoading] = useState(true);
    const { passwId } = useParams();
    const [passw, setPassw] = useState<PasswordClassic>();

    useEffect(() => {
        setLoading(true);
        axios.get(`${BACKEND_API_URL}/classic/${passwId}`)
            .then((response) => {
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
                        <IconButton component={Link} sx={{ ml: 0 }} to={`/classic`}>
                            <ArrowBackIcon />
                        </IconButton>{" "}
                        <h1>Details</h1>
                        <ul>
                            <li>Created: {passw?.created_at}</li>
                            <li>Modified: {passw?.last_modified}</li>
                            <li>Vault: <Link to={`/vault/${passw.vault.id}/details`} title="View vault details">
                                {passw.vault.title}
                            </Link></li>
                            <li>Used for: {passw?.used_for}</li>
                            <li>Note: {passw?.note}</li>
                            <li>Password: {passw?.password}</li>
                        </ul>
                        <br/>
                    </CardContent>
                    <CardActions>
                        <IconButton component={Link} sx={{ mr: 3 }} to={`/classic/${passwId}/edit`}>
                            <EditIcon />
                        </IconButton>

                        <IconButton component={Link} sx={{ mr: 3 }} to={`/classic/${passwId}/delete`}>
                            <DeleteForeverIcon sx={{ color: "red" }} />
                        </IconButton>
                    </CardActions>
                </Card>)}
        </Container>
    );
};