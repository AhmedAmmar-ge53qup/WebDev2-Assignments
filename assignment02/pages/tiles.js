import React, { useEffect, useState } from 'react'
import emojisList from 'emojis-list'
import { Container, Grid, Link, Typography } from '@mui/material';
import Tile from '../components/Tile';
import { useRouter } from 'next/router';

export default function Tiles() {

    const router = useRouter();
    const [level, setLevel] = useState(1);
    const [isFinished, setIsFinished] = useState(false);
    const [emojisForLevel, setEmojisForLevel] = useState([]);
    const [matched, setMatched] = useState([]);


    // Change the tails based on the URL level parameter
    useEffect(() => {
        if (router.query.level > 1) 
            setLevel(parseInt(router.query.level));     
    }, [router.query.level])

    // Set the level to finished when all tails are selected
    useEffect(() => {
        if (emojisForLevel.length !== 0 && !emojisForLevel.find(a => a.isSelected === false))
            setIsFinished(true);

    }, [emojisForLevel])
    
    

    // Filtering the imported emojis to lessen the number
    let emojis = [];
    emojisList.forEach((emoji, i) => i > 300 && i < 400 ? emojis.push(emoji) : 0);
    emojis = shuffleArray(emojis);

    // Setting the emojis for each level
    useEffect(() => {
        setEmojisForLevel([]);
        emojis.forEach((emoji, i) => {
            if (level > i) { 
                setEmojisForLevel(prev => [...prev, emoji]);
                setEmojisForLevel(prev => [...prev, emoji]);
            }   
        });

        setEmojisForLevel(prev => fromArrayToArrayOfObjects(prev));
        setEmojisForLevel(prev => prev.sort((a, b) => b.id - a.id));

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [level])

    function fromArrayToArrayOfObjects(emojis) {
        const temp = [...emojis];
        const arrayOfObjects = [];
        temp.forEach(emoji => arrayOfObjects.push({emoji: emoji, isSelected: false, isFinal: false, id: Math.floor(Math.random() * 9999999), rotation: Math.floor(Math.random() * (90 + 90) - 90)}));
        return arrayOfObjects;
    }

    // Takes an array and returns a deeply copied array with randomized elements
    function shuffleArray(array) {
        const temp = [...array];
        for (let i = temp.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [temp[i], temp[j]] = [temp[j], temp[i]];
        }
        return temp;
    }

    

  return (
    <Container>
        <Container sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", minWidth: 120 }}>
            <Typography variant='h4' sx={{margin: "10px"}}>Level {level}</Typography>
            {isFinished && <Link href={`?level=${level+1}`} variant='h4' sx={{color: "white"}}>Level {level+1} →</Link>}
        </Container>
        <Grid container gap={1.5}>
            {emojisForLevel.map(emoji => <Tile key={emoji.id} emoji={emoji} emojisForLevel={emojisForLevel} setEmojisForLevel={setEmojisForLevel} matched={matched} setMatched={setMatched} />)}
        </Grid>
    </Container>
  )
}


