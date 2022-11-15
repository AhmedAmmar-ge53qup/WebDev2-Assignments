import { Button, Container, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();

  const questions = ["السؤال الأول", "السؤال الثاني", "السؤال الثالث"]
  shuffleArray(questions);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

  const [question, setQuestion] = useState("");
  useEffect(() => {
    setQuestion(questions[0]);
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

  return (
    <Container maxWidth="80%" sx={{textAlign: "center", paddingTop: 10}}>
      <Grid container alignItems="center" flexDirection="column" rowGap={10} maxWidth="100%">
        <Typography variant='h2' maxWidth="100%">{question}</Typography>
        <Button variant='contained' sx={{minWidth: 200}} onClick={() => router.reload()}>السؤال التالي</Button>
      </Grid>
    </Container>
  )
}
