import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    CircularProgress,
    Container,
    IconButton,
    Tooltip, TableSortLabel,
} from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BACKEND_API_URL } from "../constants";
import { PasswordAccount } from "../models/Account";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import {Vault} from "../models/Vault";

export const StatPassws = () => {
    const [loading, setLoading] = useState(true);
    const [passw, setPassw] = useState<{
        id: number;
        created_at: string;
        last_modified: string;
        vault: Vault | number;
        website_or_app: string;
        username_or_email: string;
        note: string;
        count_tags: number;
    }[]>([]);

    useEffect(() => {
        setLoading(true);
        axios.get(`${BACKEND_API_URL}/statistics-password`)
            .then((response) => {
                setPassw(response.data);
                setLoading(false);
            });
    }, []);

    return (
        <Container>
            <h3>Account passwords in the descending order of the number of their tags.</h3>

            {loading && <CircularProgress />}
            {!loading && passw.length === 0 && <p>No passwords found</p>}
            {!loading && (
                <IconButton component={Link} sx={{ mr: 3 }} to={`/account/add`}>
                    <Tooltip title="Add a new password" arrow>
                        <AddIcon color="primary" />
                    </Tooltip>
                </IconButton>
            )}
            {!loading && passw.length > 0 && (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell align="left">created_at</TableCell>
                                <TableCell align="left">last_modified</TableCell>
                                <TableCell align="left">website_or_app</TableCell>
                                <TableCell align="left">username_or_email</TableCell>
                                <TableCell align="left">note</TableCell>
                                <TableCell align="left">count_tags</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {passw.map((passw, index) => (
                                <TableRow key={passw.id}>
                                    <TableCell component="th" scope="row">{index + 1}</TableCell>
                                    <TableCell component="th" scope="row">{passw.created_at}</TableCell>
                                    <TableCell component="th" scope="row">{passw.last_modified}</TableCell>
                                    <TableCell component="th" scope="row">
                                        <Link to={`/account/${passw.id}/details`} title="View passwords details">
                                            {passw.website_or_app}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="left">{passw.username_or_email}</TableCell>
                                    <TableCell align="left">{passw.note}</TableCell>
                                    <TableCell align="left">{passw.count_tags}</TableCell>
                                    <TableCell align="left">
                                        <IconButton
                                            component={Link}
                                            sx={{ mr: 3 }}
                                            to={`/account/${passw.id}/details`}>
                                            <Tooltip title="View password details" arrow>
                                                <ReadMoreIcon color="primary" />
                                            </Tooltip>
                                        </IconButton>

                                        <IconButton component={Link} sx={{ mr: 3 }} to={`/account/${passw.id}/edit`}>
                                            <EditIcon />
                                        </IconButton>

                                        <IconButton component={Link} sx={{ mr: 3 }} to={`/account/${passw.id}/delete`}>
                                            <DeleteForeverIcon sx={{ color: "red" }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};