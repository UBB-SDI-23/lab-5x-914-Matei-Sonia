import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardActions,
    CardContent, CircularProgress, debounce,
    IconButton, List, ListItem, Paper, TableBody, TableCell, TableContainer, TableRow,
    TextField,
} from "@mui/material";
import { Container } from "@mui/system";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_API_URL } from "../../constants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import {PasswordAccount} from "../../models/Account";
import {Vault} from "../../models/Vault";
import {Tag} from "../../models/Tag";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
export const AcountPasswordEdit = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { passwId } = useParams();
    const [passw, setPassw] = useState<PasswordAccount>({
        username_or_email: "",
        website_or_app: "",
        note: "",
        password: "",
        vault: 0,
        created_at: "",
        id: 0,
        last_modified: "",
        tags: []
    });
    const [tagFinalId, setTagFinal] = useState({
        tag: 0,
    });

    const updatePassword = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios.patch(`${BACKEND_API_URL}/account/${passwId}`, passw);
            navigate("/account");
        } catch (error) {
            console.log(error);
        }
    };

    const addTag = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            console.log(tagFinalId)
            await axios.post(`${BACKEND_API_URL}/account/${passwId}/tag`, tagFinalId);
            // navigate(`/account/${passwId}/edit`);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    const deleteTag = async (tagId: number) => {
        // event.preventDefault();
        try {
            await axios.delete(`${BACKEND_API_URL}/account/${passwId}/tag/${tagId}`);
            // navigate(`/account/${passwId}/edit`);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setLoading(true);
        axios.get(`${BACKEND_API_URL}/account/${passwId}`)
            .then((response) => {
                setPassw(response.data);
                setLoading(false);
            })

    }, [passwId]);

    const [tag, setTag] = useState<Tag[]>([]);

    const fetchSuggestions = async (query: string) => {
        try {
            const response = await axios.get<Tag[]>(
                `${BACKEND_API_URL}/tag/${passw.vault.id}/autocomplete?query=${query}`
            );
            const data = await response.data;
            setTag(data);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 500), [passw.vault]);

    useEffect(() => {
        return () => {
            debouncedFetchSuggestions.clear();
        };
    }, [debouncedFetchSuggestions]);

    const handleInputChange = (event: any, value: any, reason: any) => {
        console.log("input", value, reason);

        if (reason === "input") {
            debouncedFetchSuggestions(value);
        }
    };

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
                        <IconButton component={Link} sx={{ mr: 3 }} to={`/account`}>
                            <ArrowBackIcon />
                        </IconButton>{" "}
                        <form onSubmit={updatePassword}>
                            <br/>
                            <TextField
                                id="website_or_app"
                                defaultValue={passw.website_or_app}
                                label="Website or App"
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) => setPassw({ ...passw, website_or_app: event.target.value })}
                            />
                            <TextField
                                id="username_or_email"
                                defaultValue={passw.username_or_email}
                                label="Username or Email"
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) => setPassw({ ...passw, username_or_email: event.target.value })}
                            />
                            <TextField
                                id="note"
                                defaultValue={passw.note}
                                label="Note"
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) => setPassw({ ...passw, note: event.target.value })}
                            />
                            <TextField
                                id="password"
                                defaultValue={passw.password}
                                label="Password"
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) => setPassw({ ...passw, password: event.target.value })}
                            />
                            <Button type="submit">Update Password</Button>
                        </form>
                        <br/>
                        <Container sx={{display: "flex", justifyContent: "space-between"}}>
                            <form onSubmit={addTag} style={{flexGrow: 1, marginRight: 30}}>
                                <Autocomplete
                                    id="tag"
                                    options={tag}
                                    getOptionLabel={(option) => `${option.title}`}
                                    renderInput={(params) => <TextField {...params} label="Tag" variant="outlined" />}
                                    filterOptions={(x) => x}
                                    onInputChange={handleInputChange}
                                    onChange={(event, value) => {
                                        if (value) {
                                            console.log(value);
                                            setTagFinal({...tagFinalId, tag: value.id});
                                        }
                                    }}
                                />
                                <Button type="submit">Add Tag</Button>
                            </form>
                        <br/>

                        <List sx={{flexGrow: 1}}><p>Tags:</p>
                            {passw?.tags?.map((tag) => (
                                <ListItem key={tag.id}>{tag.tag.title}
                                    <IconButton sx={{ mr: 3 }} onClick={() => deleteTag(tag.tag.id)}>
                                        <DeleteForeverIcon sx={{ color: "red" }} />
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>
                        </Container>
                    </CardContent>
                    <CardActions></CardActions>
                </Card>)}
        </Container>
    );
};