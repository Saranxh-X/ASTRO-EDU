import React, { useState, useEffect } from 'react';

interface GameProps {
  subject: string;
  opponent: 'computer' | 'player2';
  onGameEnd: (winner: string, score1: number, score2: number) => void;
}

const OneVOneGameScreen: React.FC<GameProps> = ({ subject, opponent, onGameEnd }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [winnerThisRound, setWinnerThisRound] = useState<number | null>(null);
  
  const TOTAL_QUESTIONS = 10;
  
  // Generating generic mock options
  const correctIndex = currentQIndex % 4; 

  useEffect(() => {
    // Computer logic
    if (opponent === 'computer' && !questionAnswered) {
      // Computer answers correctly in between 2 to 5 seconds
      const ms = Math.random() * 3000 + 2000; 
      const timeout = setTimeout(() => {
        if (!questionAnswered) {
          handleAnswer(2, true); 
        }
      }, ms);
      return () => clearTimeout(timeout);
    }
  }, [currentQIndex, questionAnswered]);

  const handleAnswer = (playerNum: 1 | 2, pickIndex: number | boolean) => {
    if (questionAnswered) return;
    
    // Check correctness. If pickIndex is boolean (computer), it's already correct.
    const isCorrect = typeof pickIndex === 'boolean' ? pickIndex : pickIndex === correctIndex;
    
    if (isCorrect) {
       setQuestionAnswered(true);
       setWinnerThisRound(playerNum);
       
       let finalP1 = p1Score;
       let finalP2 = p2Score;
       if (playerNum === 1) finalP1 = p1Score + 1;
       if (playerNum === 2) finalP2 = p2Score + 1;
       
       setP1Score(finalP1);
       setP2Score(finalP2);
       
       setTimeout(() => {
         if (currentQIndex + 1 < TOTAL_QUESTIONS) {
           setCurrentQIndex(currentQIndex + 1);
           setQuestionAnswered(false);
           setWinnerThisRound(null);
         } else {
           const winner = finalP1 > finalP2 ? 'Player 1' : finalP2 > finalP1 ? (opponent === 'computer' ? 'Computer' : 'Player 2') : 'Tie';
           onGameEnd(winner, finalP1, finalP2);
         }
       }, 2000);
    } else {
       // Optional: punish wrong answer
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '900px' }}>
      <div className="au-panel" style={{ width: '100%', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', padding: '15px 30px' }}>
         <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: 'var(--au-cyan)' }}>Player 1</h2>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{p1Score}</div>
         </div>
         <div style={{ textAlign: 'center' }}>
            <h3 style={{ textTransform: 'uppercase' }}>{subject} - Q{currentQIndex + 1}/{TOTAL_QUESTIONS}</h3>
            {questionAnswered && winnerThisRound && (
               <div style={{ color: 'var(--au-yellow)', marginTop: '10px' }}>
                  {winnerThisRound === 1 ? 'Player 1' : (opponent === 'computer' ? 'Computer' : 'Player 2')} answers first!
               </div>
            )}
         </div>
         <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: opponent === 'computer' ? 'var(--au-purple)' : 'var(--au-green)' }}>
              {opponent === 'computer' ? 'Computer' : 'Player 2'}
            </h2>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{p2Score}</div>
         </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
         {/* Player 1 Interface */}
         <div className="au-panel" style={{ flex: '1', opacity: (questionAnswered && winnerThisRound !== 1) ? 0.5 : 1 }}>
            <h2 style={{ marginBottom: '20px', color: 'var(--au-cyan)' }}>Player 1 (Click)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[0, 1, 2, 3].map((idx) => (
                 <button 
                   key={idx} 
                   className="au-button" 
                   disabled={questionAnswered}
                   onClick={() => handleAnswer(1, idx)}
                 >
                   Option {idx + 1}
                 </button>
              ))}
            </div>
         </div>

         {/* Player 2 Interface (Only clickable if local player 2) */}
         <div className="au-panel" style={{ flex: '1', opacity: (questionAnswered && winnerThisRound !== 2) ? 0.5 : 1 }}>
            <h2 style={{ marginBottom: '20px', color: opponent === 'computer' ? 'var(--au-purple)' : 'var(--au-green)' }}>
              {opponent === 'computer' ? 'Computer Thinking...' : 'Player 2 (Click)'}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[0, 1, 2, 3].map((idx) => (
                 <button 
                   key={idx} 
                   className="au-button" 
                   style={{ 
                     borderColor: opponent === 'computer' ? 'var(--au-purple)' : 'var(--au-green)',
                     pointerEvents: opponent === 'computer' ? 'none' : 'auto'
                   }}
                   disabled={questionAnswered || opponent === 'computer'}
                   onClick={() => handleAnswer(2, idx)}
                 >
                   Option {idx + 1}
                 </button>
              ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default OneVOneGameScreen;
