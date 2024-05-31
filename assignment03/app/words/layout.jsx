"use client";

import SearchIcon from "@mui/icons-material/Search";
import {
  Chip,
  CircularProgress,
  Container,
  Grid,
  InputAdornment,
  Paper,
  TextField,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState, useTransition, useCallback } from "react";
import useWordsStore from "../../stores/wordsStore";
import { debounce } from "../../utils/debounce";

export default function Layout({ children }) {
  const router = useRouter();
  const pathName = usePathname();
  const [isPending, startTransition] = useTransition();

  const wordsOfInterest = useWordsStore((state) => state.words);
  const removeSelected = useWordsStore((state) => state.deleteWord);

  const [searchInput, setSearchInput] = useState("");
  const searchInputRef = useRef();

  const wordsQuery = useQuery(["words", searchInput], async () => {
    const res = await fetch(`https://api.datamuse.com/words?ml=${searchInput}`);
    const json = await res.json();
    return json;
  });

  const suggestionsQuery = useQuery(["suggestions", searchInput], async () => {
    const res = await fetch(`https://api.datamuse.com/sug?s=${searchInput}`);
    const json = await res.json();
    return json;
  });

  const updateQueryParam = useCallback(
    debounce((input) => {
      const currentQuery = new URLSearchParams(window.location.search).get("query");
      if (currentQuery !== input) {
        router.replace(`${pathName}?query=${input}`);
      }
    }, 300),
    [pathName, router]
  );

  useEffect(() => {
    updateQueryParam(searchInput);
  }, [searchInput, updateQueryParam]);

  return (
    <Container>
      <Container sx={{ margin: 1 }}>
        <Grid container alignItems="center">
          <TextField
            onInput={(e) =>
              startTransition(() => setSearchInput(e.target.value))
            }
            inputRef={searchInputRef}
            label="Search"
            type="search"
            error={isPending}
            helperText={isPending ? "Pending ..." : ""}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          {suggestionsQuery.data ? (
            suggestionsQuery.data.map((sug) => (
              <Chip
                key={sug.word}
                label={sug.word}
                sx={{ margin: 0.5 }}
                onClick={() => {
                  setSearchInput(sug.word);
                  searchInputRef.current.value = sug.word;
                }}
              />
            ))
          ) : (
            <CircularProgress />
          )}
        </Grid>
        {wordsOfInterest.length ? (
          <Paper sx={{ marginTop: 2, marginBottom: 2, padding: 1 }}>
            {wordsOfInterest.map((word) => (
              <Chip
                key={word}
                label={word}
                onDelete={() => removeSelected(word)}
                onClick={() => {
                  setSearchInput(word);
                  searchInputRef.current.value = word;
                }}
                sx={{ margin: 0.5 }}
              />
            ))}
          </Paper>
        ) : (
          <></>
        )}
      </Container>
      {wordsQuery.status === "loading" ? (
        <CircularProgress />
      ) : (
        <main>{children}</main>
      )}
    </Container>
  );
}
