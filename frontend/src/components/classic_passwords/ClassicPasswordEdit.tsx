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
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_API_URL } from "../../constants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { PasswordClassic } from "../../models/Classic";
import {toast, ToastContainer} from "react-toastify";

export const ClassicPasswordEdit = () => {
    const navigate = useNavigate();
    const { passwId } = useParams();
    const [loading, setLoading] = useState(true);

    const [passw, setPassw] = useState<PasswordClassic>({
        id: 0,
        created_at: "",
        last_modified: "",
        vault: 0,
        password: "",
        used_for: "",
        note: "",
    });

    const updatePassword = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        if (passw.password.length < 5) {
            notify("password length >= 5");
        }
        else {
            try {
                await axios.patch(`${BACKEND_API_URL}/classic/${passwId}`, passw);
                navigate("/classic");
            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        setLoading(true);
        axios.get(`${BACKEND_API_URL}/classic/${passwId}`)
            .then((response) => {
                setPassw(response.data);
                setLoading(false);
            })
    }, [passwId]);

    function notify(message: string) { toast(`🦄 ${message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });} []

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
                        <IconButton component={Link} sx={{ mr: 3 }} to={`/classic`}>
                            <ArrowBackIcon />
                        </IconButton>{" "}
                        <form onSubmit={updatePassword}>
                            <br/>
                            <TextField
                                id="used_for"
                                label="Used for"
                                defaultValue={passw.used_for}
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) => setPassw({ ...passw, used_for: event.target.value })}
                            />
                            <TextField
                                id="note"
                                label="Note"
                                defaultValue={passw.note}
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) => setPassw({ ...passw, note: event.target.value })}
                            />
                            <TextField
                                id="password"
                                label="Password"
                                defaultValue={passw.password}
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) => setPassw({ ...passw, password: event.target.value })}
                            />
                            <Button type="submit">Update Password</Button>
                        </form>
                    </CardContent>
                    <CardActions></CardActions>
                </Card>)}
            <ToastContainer/>
        </Container>
    );
};