import { ToggleButton, Typography } from "@mui/material";
import React, { useEffect } from "react";

export default function Tile({ emoji, emojisForLevel, setEmojisForLevel, matched, setMatched }) {

  const temp = [...emojisForLevel];
  const pair = temp.filter(a => a.emoji === emoji.emoji).find(e => e.id !== emoji.id);

  useEffect(() => {
    setMatched(prev => {
      if (!emoji.isFinal && !pair.isFinal && (emoji.isSelected && pair.isSelected))
        {
          setEmojisForLevel(prev => {
            const otherEmojis = prev.filter(a => a != emoji);
            return [...otherEmojis, {...emoji, isFinal: true}].sort((a, b) => b.id - a.id);
          });
          return [...new Set([...prev, emoji.emoji])];
        }
      else
        return [...new Set([...prev])]
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emojisForLevel])


  const passSelectedToParent = () => {

    if (emojisForLevel.find(a => !a.isFinal)) 
    {
      if (emoji.isSelected && !matched.find(a => a == emoji.emoji))
        setEmojisForLevel(prev => {
          const otherEmojis = prev.filter(a => a != emoji);
          return [...otherEmojis, {...emoji, isSelected: false, isFinal: false}].sort((a, b) => b.id - a.id);
        });
      
      else if (emoji.isSelected && matched.find(a => a == emoji.emoji))
        setEmojisForLevel(prev => {
          const otherEmojis = prev.filter(a => a != emoji);
          return [...otherEmojis, {...emoji, isSelected: true, isFinal: true}].sort((a, b) => b.id - a.id);
        });

      //else if (!emoji.isSelected && (!emojisForLevel.find(a => a.isSelected) || pair.isSelected == true))
      else if (!emoji.isSelected && !emoji.isFinal && (emojisForLevel.filter(a => a.isSelected && !a.isFinal).length == 0 || pair.isSelected == true))
        setEmojisForLevel(prev => {
          const otherEmojis = prev.filter(a => a != emoji);
          return [...otherEmojis, {...emoji, isSelected: true, isFinal: false}].sort((a, b) => b.id - a.id);
        });

      else if (!emoji.isSelected && (emojisForLevel.filter(a => a.isSelected && !a.isFinal).length == 1))
        setEmojisForLevel(prev => {
          const otherEmojis = prev.filter(a => a != emojisForLevel.find(a => a.isSelected && !a.isFinal));
          return [...otherEmojis, {...emojisForLevel.find(a => a.isSelected && !a.isFinal), isSelected: false}].sort((a, b) => b.id - a.id);
        });
      
    }
  }
  
  return (
    <ToggleButton
      value="check"
      size="large"
      selected={emoji.isSelected}
      onChange={passSelectedToParent}
      color={emoji.isFinal ? "secondary" : "standard"}
      disabled={emoji.isFinal ? true : false}
      
    >
      <Typography variant="h4" sx={{transform: `rotate(${emoji.rotation}deg)`}}>{emoji.emoji}</Typography>
    </ToggleButton>
  );
}
