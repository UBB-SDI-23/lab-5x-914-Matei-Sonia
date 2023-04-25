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
import { Vault } from "../models/Vault";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

export const StatVaults = () => {
    const [loading, setLoading] = useState(true);
    const [vaults, setVaults] = useState<{
        id: number;
        created_at: string;
        last_modified: string;
        title: string;
        description: string;
        avg_password_length: number;
    }[]>([]);

    useEffect(() => {
        setLoading(true);
        axios.get(`${BACKEND_API_URL}/statistics-vault`)
            .then((response) => {
                setVaults(response.data);
                setLoading(false);
            });
    }, []);

    return (
        <Container>
            <h3>Vaults in the descending order of the average length of the account passwords.</h3>

            {loading && <CircularProgress />}
            {!loading && vaults.length === 0 && <p>No vaults found</p>}
            {!loading && vaults.length > 0 && (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell align="right">created_at
                                </TableCell>
                                <TableCell align="right">last_modified</TableCell>
                                <TableCell align="center">title</TableCell>
                                <TableCell align="center">description</TableCell>
                                <TableCell align="center">avg_password_length</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {vaults.map((vault, index) => (
                                <TableRow key={vault.id}>
                                    <TableCell component="th" scope="row">{index + 1}</TableCell>
                                    <TableCell component="th" scope="row">{vault.created_at}</TableCell>
                                    <TableCell component="th" scope="row">{vault.last_modified}</TableCell>
                                    <TableCell component="th" scope="row">
                                        <Link to={`/vault/${vault.id}/details`} title="View vault details">
                                            {vault.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="left">{vault.description}</TableCell>
                                    <TableCell align="left">{vault.avg_password_length}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            component={Link}
                                            sx={{ mr: 3 }}
                                            to={`/vault/${vault.id}/details`}>
                                            <Tooltip title="View vault details" arrow>
                                                <ReadMoreIcon color="primary" />
                                            </Tooltip>
                                        </IconButton>

                                        <IconButton component={Link} sx={{ mr: 3 }} to={`/vault/${vault.id}/edit`}>
                                            <EditIcon />
                                        </IconButton>

                                        <IconButton component={Link} sx={{ mr: 3 }} to={`/vault/${vault.id}/delete`}>
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