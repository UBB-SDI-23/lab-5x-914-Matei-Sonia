import {
    Autocomplete,
    Button,
    Card,
    CardActions,
    CardContent,
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
import { PasswordClassic } from "../../models/Classic";
import { Tag } from "../../models/Tag";

export const VaultAdd = () => {
    const navigate = useNavigate();

    const [vault, setVault] = useState<Vault>({
        title: "",
        description: "",
        master_password: "",
        account_passwords: [],
        classic_passwords: [],
        created_at: "",
        id: 0,
        last_modified: "",
        tags: []
    });

    const addVault = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios.post(`${BACKEND_API_URL}/vault`, vault);
            navigate("/vault");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Container>
            <Card>
                <CardContent>
                    <IconButton component={Link} sx={{ mr: 3 }} to={`/vault`}>
                        <ArrowBackIcon />
                    </IconButton>{" "}
                    <form onSubmit={addVault}>
                        <TextField
                            id="title"
                            label="Title"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setVault({ ...vault, title: event.target.value })}
                        />
                        <TextField
                            id="description"
                            label="Description"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setVault({ ...vault, description: event.target.value })}
                        />
                        <TextField
                            id="master_password"
                            label="Master Password"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setVault({ ...vault, master_password: event.target.value })}
                        />

                        <Button type="submit">Add Vault</Button>
                    </form>
                </CardContent>
                <CardActions></CardActions>
            </Card>
        </Container>
    );
};