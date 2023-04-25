import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent, CircularProgress,
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
export const VaultEdit = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { vaultId } = useParams();

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

    const updateVault = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios.put(`${BACKEND_API_URL}/vault/${vaultId}`, vault);
            navigate("/vault");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setLoading(true);
            axios.get(`${BACKEND_API_URL}/vault/${vaultId}`)
                .then((response) => {
                    setVault(response.data);
                    setLoading(false);
                })

    }, [vaultId]);

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
                    <IconButton component={Link} sx={{ mr: 3 }} to={`/vault`}>
                        <ArrowBackIcon />
                    </IconButton>{" "}
                    <form onSubmit={updateVault}>
                        <TextField
                            id="title"
                            label="Title"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setVault({ ...vault, title: event.target.value })}
                            defaultValue={vault.title}
                        />
                        <TextField
                            id="description"
                            label="Description"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setVault({ ...vault, description: event.target.value })}
                            defaultValue={vault.description}
                        />
                        <TextField
                            id="master_password"
                            defaultValue={vault.master_password}
                            label="Master Paswword"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setVault({ ...vault, master_password: event.target.value })}

                        />

                        <Button type="submit">Update Vault</Button>
                    </form>
                </CardContent>
                <CardActions></CardActions>
            </Card>)}
        </Container>
    );
};