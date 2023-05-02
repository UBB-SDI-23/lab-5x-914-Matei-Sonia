import {
    Autocomplete, Box,
    Button,
    Card,
    CardActions,
    CardContent, CircularProgress, debounce,
    IconButton,
    TextField,
} from "@mui/material";
import { Container } from "@mui/system";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_API_URL } from "../../constants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { PasswordAccount } from "../../models/Account";
import { Tag } from "../../models/Tag";

export const TagsEdit = () => {
    const navigate = useNavigate();
    const { tagId } = useParams();
    const [loading, setLoading] = useState(true);

    const [tag, setTag] = useState<Tag>({
        nb_acc: 0,
        id: 0,
        title: "",
        vault: 0,
        tagged_passwords: []
    });

    const updateTag = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            console.log(tag.vault)
            await axios.patch(`${BACKEND_API_URL}/tag/${tagId}`, tag);
            navigate("/tag");
        } catch (error) {
            console.log(error);
        }
    };

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
                        <IconButton component={Link} sx={{ mr: 3 }} to={`/tag`}>
                            <ArrowBackIcon />
                        </IconButton>{" "}
                        <form onSubmit={updateTag}>
                            <br/>
                            <TextField
                                id="title"
                                label="Title"
                                defaultValue={tag.title}
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) => setTag({ ...tag, title: event.target.value })}
                            />
                            <Button type="submit">Update Tag</Button>
                        </form>
                    </CardContent>
                    <CardActions></CardActions>
                </Card>)}
        </Container>
    );
};