"use client";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React from "react";
import Box from '@mui/material/Box';
import WordsTable from "../../components/words-table";

export default function Words() {

  const searchParams = useSearchParams();

  // Fetching the data based on searchInput
  const wordsQuery = useQuery(["words", searchParams], async () => {
    const res = await fetch(`https://api.datamuse.com/words?ml=${searchParams.get("query")}`);
    const json = await res.json();
    return json;
  });

  const rows = wordsQuery.data?.map(a => {return {word: a.word, score: a.score?.toLocaleString(), tags: a.tags}});
  if (rows && rows[0])
    rows[0].tags[rows[0].tags.length-1] = "primary_rel"


  return (
    <Box sx={{ width: '100%' }}>
      <WordsTable rows={rows} />
    </Box>
  );
}

