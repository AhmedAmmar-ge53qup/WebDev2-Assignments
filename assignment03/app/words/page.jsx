"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import WordsTable from "../../components/words-table";

export default function Words() {
  // Get search input from localStorage or set it to an empty string
  const [query, setQuery] = useState(
    localStorage.getItem("searchInput") || ""
  );

  // Fetching the data based on query
  const wordsQuery = useQuery(["words", query], async () => {
    const res = await fetch(`https://api.datamuse.com/words?ml=${query}`);
    const json = await res.json();
    return json;
  });

  // Update localStorage when search input changes
  useEffect(() => {
    localStorage.setItem("searchInput", query);
  }, [query]);

  const rows = wordsQuery.data?.map(a => {
    return { word: a.word, score: a.score?.toLocaleString(), tags: a.tags };
  });
  if (rows && rows[0]) {
    rows[0].tags[rows[0].tags.length - 1] = "primary_rel";
  }

  return (
    <Box sx={{ width: '100%' }}>
      <WordsTable rows={rows} />
    </Box>
  );
}