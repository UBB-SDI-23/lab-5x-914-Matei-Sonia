import { Container, Card, CardContent, IconButton, CardActions, Button } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { BACKEND_API_URL } from "../../constants";
import {useEffect, useContext} from "react";
import AuthContext from "../../context/AuthProvider";


export const ClassicPasswordDelete = () => {
    // @ts-ignore
    const { user } = useContext(AuthContext);
    const { passwId } = useParams();
    const navigate = useNavigate();

    const handleDelete = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        await axios.delete(`${BACKEND_API_URL}/classic/${passwId}`);
        navigate("/classic");
    };

    const handleCancel = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        // go to courses list
        navigate("/classic");
    };

    useEffect(() => {
        if (user == null){
            navigate("/login");
        }
    })

    return (
        <Container>
            <Card>
                <CardContent>
                    <IconButton component={Link} sx={{ mr: 3 }} to={`/classic`}>
                        <ArrowBackIcon />
                    </IconButton>{" "}
                    Are you sure you want to delete this password? This cannot be undone!
                </CardContent>
                <CardActions>
                    <Button onClick={handleDelete}>Delete it</Button>
                    <Button onClick={handleCancel}>Cancel</Button>
                </CardActions>
            </Card>
        </Container>
    );
};