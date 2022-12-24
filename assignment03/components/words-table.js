import {
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import useWordsStore from "../stores/wordsStore.js";

export default function WordsTable({ rows }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const selected = useWordsStore(state => state.words);
  const setSelected = useWordsStore(state => state.setWords);

  const headCells = [
    {
      id: "word",
      numeric: false,
      disablePadding: false,
      label: "Word",
    },
    {
      id: "score",
      numeric: false,
      disablePadding: false,
      label: "Score",
    },
    {
      id: "tags",
      numeric: false,
      disablePadding: false,
      label: "Tags",
    },
  ];

  function EnhancedTableHead() {
    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell key={headCell.id} align={"left"} padding={"checkbox"}>
              {headCell.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  return (
    <>
      {rows ? (
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={"medium"}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows?.length}
              />
              <TableBody>
                {rows?.map((row, index) => {
                  const isItemSelected = isSelected(row.word);
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.word)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.word}
                      selected={isItemSelected}
                    >
                      <TableCell align="left">{row.word}</TableCell>
                      <TableCell align="left">{row.score}</TableCell>
                      <TableCell align="left">
                        {row?.tags?.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            variant="outlined"
                            color={tag == "primary_rel" ? "success" : "primary"}
                          />
                        ))}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <CircularProgress />
      )}
    </>
  );
}
