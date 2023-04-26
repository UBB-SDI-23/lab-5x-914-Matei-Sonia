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
import { BACKEND_API_URL } from "../../constants";
import { PasswordAccount } from "../../models/Account";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export const AllAccountPasswords = () => {
    const [loading, setLoading] = useState(true);
    const [passw, setPassw] = useState<PasswordAccount[]>([]);

    useEffect(() => {
        setLoading(true);
        axios.get(`${BACKEND_API_URL}/account`)
            .then((response) => {
                setPassw(response.data);
                setLoading(false);
            });
    }, []);

    const [orderColumn, setOrderColumn] = useState("id");
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");

    const handleSort = (column: string) => {
        let newOrderColumn = column;
        let newOrderDirection = "asc";
        if (column == orderColumn) {
            if (orderDirection == "asc") {
                newOrderDirection = "desc";
            } else {
                newOrderColumn = "id";
                newOrderDirection = "asc";
                (document.activeElement as HTMLElement).blur();
            }
        }
        setOrderColumn(newOrderColumn);
        // @ts-ignore
        setOrderDirection(newOrderDirection);
    };

    const sortedInfo = (column: string, direction: string) => {
        const info = passw.map((passw: PasswordAccount, index) => {
            return {
                index: index + 1,
                ...passw
            }
        });
        return info.sort((a, b) => {
            if (direction == "asc")
            { // @ts-ignore
                return (a[column] < b[column]) ? -1 : 1;
            }
            else
            { // @ts-ignore
                return (a[column] > b[column]) ? -1 : 1;
            }
        });
    };

    const [pg, setpg] = React.useState(1);

    const handleNext = () => {
        setLoading(true);
        setpg(pg + 1)
        axios.get(`${BACKEND_API_URL}/account?page=${pg}`)
            .then((response) => {
                setPassw(response.data);
                setLoading(false);
            });
    }
    const handleBack = () => {
        setLoading(true);
        setpg(pg - 1)
        axios.get(`${BACKEND_API_URL}/account?page=${pg}`)
            .then((response) => {
                setPassw(response.data);
                setLoading(false);
            });
    }

    return (
        <Container>
            <h1>All account passwords</h1>

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
                                <TableCell align="left">
                                    <TableSortLabel
                                        active={orderColumn === "website_or_app"}
                                        direction={orderColumn === "website_or_app" ? orderDirection : undefined}
                                        onClick={() => handleSort("website_or_app")}
                                    >
                                        website_or_app
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="left">
                                    <TableSortLabel
                                        active={orderColumn === "username_or_email"}
                                        direction={orderColumn === "username_or_email" ? orderDirection : undefined}
                                        onClick={() => handleSort("username_or_email")}
                                    >
                                        username_or_email
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="left">
                                    <TableSortLabel
                                        active={orderColumn === "note"}
                                        direction={orderColumn === "note" ? orderDirection : undefined}
                                        onClick={() => handleSort("note")}
                                    >
                                        note
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedInfo(orderColumn, orderDirection).map((passw, index) => (
                                <TableRow key={passw.id}>
                                    <TableCell component="th" scope="row">{(pg - 1) * 25 + index + 1}</TableCell>
                                    <TableCell component="th" scope="row">
                                        <Link to={`/account/${passw.id}/details`} title="View passwords details">
                                            {passw.website_or_app}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="left">{passw.username_or_email}</TableCell>
                                    <TableCell align="left">{passw.note}</TableCell>
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
            <br/>
            <Container>
                <IconButton onClick={handleBack} disabled={pg === 1}>
                    <Tooltip title="Back" arrow>
                        <ArrowBackIosNewIcon color="primary" />
                    </Tooltip>
                </IconButton>
                <IconButton onClick={handleNext} disabled={pg === 40000}>
                    <Tooltip title="Next" arrow>
                        <ArrowForwardIosIcon color="primary" />
                    </Tooltip>
                </IconButton>
            </Container>
        </Container>
    );
};