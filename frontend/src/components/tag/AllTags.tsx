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
import { Tag } from "../../models/Tag";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export const AllTags = () => {
    const [loading, setLoading] = useState(true);
    const [tags, setTags] = useState<Tag[]>([]);

    useEffect(() => {
        setLoading(true);
        axios.get(`${BACKEND_API_URL}/tag`)
            .then((response) => {
                setTags(response.data);
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
        const info = tags.map((tag: Tag, index) => {
            return {
                index: index + 1,
                ...tag
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
        axios.get(`${BACKEND_API_URL}/tag?page=${pg}`)
            .then((response) => {
                setTags(response.data);
                setLoading(false);
            });
    }
    const handleBack = () => {
        setLoading(true);
        setpg(pg - 1)
        axios.get(`${BACKEND_API_URL}/tag?page=${pg}`)
            .then((response) => {
                setTags(response.data);
                setLoading(false);
            });
    }

    return (
        <Container>
            <h1>All tags</h1>

            {loading && <CircularProgress />}
            {!loading && tags.length === 0 && <p>No tags found</p>}
            {!loading && (
                <IconButton component={Link} sx={{ mr: 3 }} to={`/tag/add`}>
                    <Tooltip title="Add a new tag" arrow>
                        <AddIcon color="primary" />
                    </Tooltip>
                </IconButton>
            )}
            {!loading && tags.length > 0 && (
                <TableContainer  sx={{display: "flex", justifyContent: "center", alignItems: "center"}} component={Paper}>
                    <Table sx={{width:500}} aria-label="simple table">
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
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedInfo(orderColumn, orderDirection).map((tags, index) => (
                                <TableRow key={tags.id}>
                                    <TableCell component="th" scope="row">{(pg - 1) * 25 + index + 1}</TableCell>
                                    <TableCell component="th" scope="row">
                                        <Link to={`/tag/${tags.id}/details`} title="View tag details">
                                            {tags.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="left">
                                        <IconButton
                                            component={Link}
                                            sx={{ mr: 3 }}
                                            to={`/tag/${tags.id}/details`}>
                                            <Tooltip title="View tag details" arrow>
                                                <ReadMoreIcon color="primary" />
                                            </Tooltip>
                                        </IconButton>

                                        <IconButton component={Link} sx={{ mr: 3 }} to={`/tag/${tags.id}/edit`}>
                                            <EditIcon />
                                        </IconButton>

                                        <IconButton component={Link} sx={{ mr: 0 }} to={`/tag/${tags.id}/delete`}>
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