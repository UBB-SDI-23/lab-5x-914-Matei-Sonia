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
import { Vault } from "../../models/Vault";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import Pagination from "../Paginator";

export const AllVaults = () => {
    const [loading, setLoading] = useState(true);
    const [vaults, setVaults] = useState<Vault[]>([]);
    const [totalVaults, setTotalVaults ] = useState();
    const [pg, setpg] = React.useState(1);

    useEffect(() => {
        setLoading(true);
        axios.get(`${BACKEND_API_URL}/vault?page=${pg}`)
            .then((response1) => {
                axios.get(`${BACKEND_API_URL}/vault/number`).then( (response) => {
                    setTotalVaults(response.data["number"]);
                    setVaults(response1.data);
                    setLoading(false);
                })
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
        const info = vaults.map((vault: Vault, index) => {
            return {
                index: index + 1,
                ...vault
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
    const [PerPage] = useState(25);

    const paginate = (pageNB: React.SetStateAction<number>) => {
        setLoading(true);
        setpg(pageNB)
        axios.get(`${BACKEND_API_URL}/vault?page=${pageNB}`)
            .then((response) => {
                setVaults(response.data);
                setLoading(false);
            });}

    return (
        <Container>
            <h1>All vaults</h1>

            {loading && <CircularProgress />}
            {!loading && vaults.length === 0 && <p>No vaults found</p>}
            {!loading && (
                <IconButton component={Link} sx={{ mr: 3 }} to={`/vault/add`}>
                    <Tooltip title="Add a new vault" arrow>
                        <AddIcon color="primary" />
                    </Tooltip>
                </IconButton>
            )}
            {!loading && vaults.length > 0 && (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell align="left">
                                    <TableSortLabel
                                        active={orderColumn === "title"}
                                        direction={orderColumn === "title" ? orderDirection : undefined}
                                        onClick={() => handleSort("title")}
                                    >
                                        title
                                    </TableSortLabel>
                                    </TableCell>
                                <TableCell align="left">
                                    <TableSortLabel
                                        active={orderColumn === "description"}
                                        direction={orderColumn === "description" ? orderDirection : undefined}
                                        onClick={() => handleSort("description")}
                                    >
                                        description
                                    </TableSortLabel>
                                    </TableCell>
                                <TableCell align="left">
                                    <TableSortLabel
                                        active={orderColumn === "master_password"}
                                        direction={orderColumn === "master_password" ? orderDirection : undefined}
                                        onClick={() => handleSort("master_password")}
                                    >
                                        master_password
                                    </TableSortLabel>
                                    </TableCell>
                                <TableCell align="left">
                                    <TableSortLabel
                                        active={orderColumn === "accounts"}
                                        direction={orderColumn === "accounts" ? orderDirection : undefined}
                                        onClick={() => handleSort("accounts")}
                                    >
                                        account_passws
                                    </TableSortLabel>
                                    </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedInfo(orderColumn, orderDirection).map((vault, index) => (
                                    <TableRow key={vault.id}>
                                    <TableCell component="th" scope="row">{(pg - 1) * 25 + index + 1}</TableCell>
                                    <TableCell component="th" scope="row">
                                        <Link to={`/vault/${vault.id}/details`} title="View vault details">
                                            {vault.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="left">{vault.description}</TableCell>
                                    <TableCell align="left">{vault.master_password}</TableCell>
                                    <TableCell align="left">{vault.nb_acc}</TableCell>
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
            <br/>
            {!loading && ( <Pagination
                PerPage={PerPage}
                total={totalVaults}
                paginate={paginate}
                currPage={pg}
            />)}
        </Container>
    )};