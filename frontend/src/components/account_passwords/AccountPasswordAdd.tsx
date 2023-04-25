import {
    Autocomplete,
    Button,
    Card,
    CardActions,
    CardContent, debounce,
    IconButton,
    TextField,
} from "@mui/material";
import { Container } from "@mui/system";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_API_URL } from "../../constants";
import { Vault } from "../../models/Vault";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { PasswordAccount } from "../../models/Account";
import { Tag } from "../../models/Tag";

export const AccountPasswordAdd = () => {
    const navigate = useNavigate();

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

    const [vault, setVault] = useState<Vault[]>([]);

    const fetchSuggestions = async (query: string) => {
        try {
            const response = await axios.get<Vault[]>(
                `${BACKEND_API_URL}/vault/autocomplete?query=${query}`
            );
            const data = await response.data;
            setVault(data);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 500), []);

    useEffect(() => {
        return () => {
            debouncedFetchSuggestions.clear(); //cancel??
        };
    }, [debouncedFetchSuggestions]);

    const addPassword = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios.post(`${BACKEND_API_URL}/account`, passw);
            navigate("/account");
        } catch (error) {
            console.log(error);
        }
    };

    const handleInputChange = (event: any, value: any, reason: any) => {
        console.log("input", value, reason);

        if (reason === "input") {
            debouncedFetchSuggestions(value);
        }
    };

    return (
        <Container>
            <Card>
                <CardContent>
                    <IconButton component={Link} sx={{ mr: 3 }} to={`/account`}>
                        <ArrowBackIcon />
                    </IconButton>{" "}
                    <form onSubmit={addPassword}>
                        <Autocomplete
                            id="vault"
                            options={vault}
                            getOptionLabel={(option) => `${option.title}`}
                            renderInput={(params) => <TextField {...params} label="Vault" variant="outlined" />}
                            filterOptions={(x) => x}
                            onInputChange={handleInputChange}
                            onChange={(event, value) => {
                                if (value) {
                                    console.log(value);
                                    setPassw({ ...passw, vault: value.id });
                                }
                            }}
                        />
                        <br/>
                        <TextField
                            id="website_or_app"
                            label="Website or App"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setPassw({ ...passw, website_or_app: event.target.value })}
                        />
                        <TextField
                            id="username_or_email"
                            label="Username or Email"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setPassw({ ...passw, username_or_email: event.target.value })}
                        />
                        <TextField
                            id="note"
                            label="Note"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setPassw({ ...passw, note: event.target.value })}
                        />
                        <TextField
                            id="password"
                            label="Password"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setPassw({ ...passw, password: event.target.value })}
                        />
                        <Button type="submit">Add Password</Button>
                    </form>
                </CardContent>
                <CardActions></CardActions>
            </Card>
        </Container>
    );
};