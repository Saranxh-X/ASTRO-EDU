import React, { useState } from 'react';
import SpaceBackground from './components/SpaceBackground';
import TaskBar from './components/TaskBar';
import CharacterSelection from './components/CharacterSelection';
import SubjectSelector from './components/SubjectSelector';
import SubtopicSelector from './components/SubtopicSelector';
import GameScreen from './components/GameScreen';
import ImpostorScreen from './components/ImpostorScreen';
import HomeScreen from './components/HomeScreen';
import LoginScreen from './components/LoginScreen';
import Navbar from './components/Navbar';
import LearnScreen from './components/LearnScreen';
import PracticeScreen from './components/PracticeScreen';
import SubjectListScreen from './components/SubjectListScreen';
import OneVOneSetupScreen from './components/OneVOneSetupScreen';
import OneVOneGameScreen from './components/OneVOneGameScreen';
import MarioGameScreen from './components/MarioGameScreen';
import AIChatbot from './components/AIChatbot';
import TestSetupScreen from './components/TestSetupScreen';
import TestGameScreen from './components/TestGameScreen';
import CodexGameScreen from './components/CodexGameScreen';
import BlasterGameScreen from './components/BlasterGameScreen';
import './App.css';

type Screen = 'login' | 'home' | 'about' | 'settings' | 'learn' | 'practice' | 'subject_list' | '1v1_setup' | '1v1_game' | 'mario_game' | 'character' | 'subjects' | 'subtopics' | 'game' | 'impostor' | 'ai_chat' | 'test_setup' | 'test_game' | 'codex_game' | 'blaster_game';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [username, setUsername] = useState<string>('');
  const [playerColor, setPlayerColor] = useState<string>('red');
  const [progress, setProgress] = useState<number>(0);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string | null>(null);
  const [isLightMode, setIsLightMode] = useState<boolean>(false);
  const [learnMode, setLearnMode] = useState<'video' | 'library' | 'mario' | 'game2' | '1v1' | 'test'>('video');
  const [lastScreenBeforeSubject, setLastScreenBeforeSubject] = useState<'learn' | 'practice' | 'home'>('learn');
  const [opponent, setOpponent] = useState<'computer' | 'player2'>('computer');
  const [testConfig, setTestConfig] = useState({ questions: 10, timerMinutes: 10 });

  const handleModeSelect = (mode: string) => {
    if (mode === 'learn') {
      setCurrentScreen('learn');
    } else if (mode === 'practice') {
      setCurrentScreen('practice');
    } else if (mode === 'test') {
      setLearnMode('test');
      setLastScreenBeforeSubject('home');
      setCurrentScreen('subject_list');
    } else if (mode === 'subject_tasks') {
      setCurrentScreen('character');
    } else if (mode === 'ai_chat') {
      setCurrentScreen('ai_chat');
    } else {
      alert("This mode is coming soon!");
    }
  };

  const handleCharacterSelect = (color: string) => {
    setPlayerColor(color);
    setCurrentScreen('subjects');
  };

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    setCurrentScreen('subtopics');
  };

  const handleSubtopicSelect = (subtopic: string) => {
    setSelectedSubtopic(subtopic);
    setCurrentScreen('game');
  };

  return (
    <div className={`app-container ${isLightMode ? 'light-mode' : ''}`}>
      <SpaceBackground />
      
      <Navbar 
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen as Screen)}
        isLoggedIn={!!username}
        username={username}
        isLightMode={isLightMode}
        toggleLightMode={() => setIsLightMode(!isLightMode)}
        onLogout={() => {
          setUsername('');
          setCurrentScreen('login');
        }}
      />
      
      {/* Show TaskBar only in game screens */}
      {(currentScreen === 'subjects' || currentScreen === 'subtopics' || currentScreen === 'game') && (
        <TaskBar progress={progress} />
      )}

      <div className="screen-container">
        {currentScreen === 'login' && (
          <LoginScreen onLogin={(name) => {
            setUsername(name);
            setCurrentScreen('home');
          }} />
        )}

        {currentScreen === 'about' && (
          <div className="au-panel">
            <h1 className="main-title">About Astro Edu</h1>
            <p style={{fontSize: '1.2rem'}}>Astro Edu is a space-themed learning platform inspired by Among Us!</p>
          </div>
        )}

        {currentScreen === 'settings' && (
          <div className="au-panel" style={{ width: '600px' }}>
            <h1 className="main-title">Settings & Records</h1>
            <p style={{fontSize: '1.2rem'}}>Here you will be able to configure game settings, sound, and more.</p>
            
            <h2 style={{ color: 'var(--au-yellow)', marginTop: '30px' }}>Daily 1v1 Records</h2>
            <ul style={{ textAlign: 'left', marginTop: '10px', maxHeight: '150px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px' }}>
              {JSON.parse(localStorage.getItem('daily_records') || '[]').length === 0 && (
                 <li>No matches played yet.</li>
              )}
              {JSON.parse(localStorage.getItem('daily_records') || '[]').map((rec: string, i: number) => (
                <li key={i} style={{ padding: '8px 0', borderBottom: '1px solid #444', color: '#ccc' }}>{rec}</li>
              ))}
            </ul>
          </div>
        )}

        {currentScreen === 'home' && (
          <HomeScreen onSelectMode={handleModeSelect} />
        )}

        {currentScreen === 'learn' && (
          <LearnScreen 
            onSelectOption={(option) => {
              setLearnMode(option);
              setLastScreenBeforeSubject('learn');
              setCurrentScreen('subject_list');
            }}
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'practice' && (
          <PracticeScreen 
            onSelectGame={(game) => {
              if (game === 'mario') {
                setCurrentScreen('mario_game');
              } else if (game === 'codex') {
                setCurrentScreen('codex_game');
              } else if (game === 'blaster') {
                setCurrentScreen('blaster_game');
              } else {
                setLearnMode(game);
                setLastScreenBeforeSubject('practice');
                setCurrentScreen('subject_list');
              }
            }}
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'subject_list' && (
          <SubjectListScreen 
            mode={learnMode}
            onSelectSubject={(subj) => {
              setSelectedSubject(subj);
              if (learnMode === '1v1') {
                setCurrentScreen('1v1_setup');
              } else if (learnMode === 'test') {
                setCurrentScreen('test_setup');
              } else {
                alert(`Opening ${learnMode} content for ${subj}...`);
              }
            }}
            onBack={() => setCurrentScreen(lastScreenBeforeSubject as Screen)}
          />
        )}

        {currentScreen === '1v1_setup' && (
          <OneVOneSetupScreen
            subject={selectedSubject || 'Unknown Subject'}
            onStart={(opp) => {
              setOpponent(opp);
              setCurrentScreen('1v1_game');
            }}
            onBack={() => setCurrentScreen('subject_list')}
          />
        )}

        {currentScreen === '1v1_game' && (
          <OneVOneGameScreen
            subject={selectedSubject || 'Unknown Subject'}
            opponent={opponent}
            onGameEnd={(winner, score1, score2) => {
              const record = `${new Date().toLocaleDateString()} - ${winner} Won (${score1}-${score2}) in ${selectedSubject}`;
              const pastRecords = JSON.parse(localStorage.getItem('daily_records') || '[]');
              localStorage.setItem('daily_records', JSON.stringify([record, ...pastRecords].slice(0, 50))); // Keep last 50
              
              alert(`Game Over! ${winner} Wins!\nScore: ${score1} - ${score2}\n(Result saved to Daily Records in Settings)`);
              setCurrentScreen('practice'); // Go back to practice menu
            }}
          />
        )}

        {currentScreen === 'test_setup' && (
          <TestSetupScreen 
            subject={selectedSubject || 'Unknown Subject'}
            onStartTest={(q, t) => {
              setTestConfig({ questions: q, timerMinutes: t });
              setCurrentScreen('test_game');
            }}
            onBack={() => setCurrentScreen('subject_list')}
          />
        )}

        {currentScreen === 'test_game' && (
          <TestGameScreen 
            subject={selectedSubject || 'Unknown Subject'}
            questionCount={testConfig.questions}
            timerMinutes={testConfig.timerMinutes}
            onFinish={(score, total) => {
              alert(`Test Finished! You scored ${score} out of ${total}`);
              setCurrentScreen('home');
            }}
          />
        )}

        {currentScreen === 'mario_game' && (
          <MarioGameScreen onBack={() => setCurrentScreen('practice')} />
        )}

        {currentScreen === 'codex_game' && (
          <CodexGameScreen onBack={() => setCurrentScreen('practice')} />
        )}

        {currentScreen === 'blaster_game' && (
          <BlasterGameScreen onBack={() => setCurrentScreen('practice')} />
        )}

        {currentScreen === 'ai_chat' && (
          <AIChatbot onBack={() => setCurrentScreen('home')} />
        )}

        {currentScreen === 'character' && (
          <CharacterSelection onSelectCharacter={handleCharacterSelect} />
        )}
        
        {currentScreen === 'subjects' && (
          <SubjectSelector onSelectSubject={handleSubjectSelect} />
        )}

        {currentScreen === 'subtopics' && selectedSubject && (
          <SubtopicSelector 
            subject={selectedSubject} 
            onSelectSubtopic={handleSubtopicSelect}
            onBack={() => setCurrentScreen('subjects')} 
          />
        )}

        {currentScreen === 'game' && (
          <GameScreen 
            subtopic={selectedSubtopic}
            onCorrectAnswer={() => setProgress(p => Math.min(p + 20, 100))}
            onWrongAnswer={() => setCurrentScreen('impostor')}
            onGameComplete={() => {
              setTimeout(() => {
                alert("Task Completed!");
                setCurrentScreen('subjects');
                setProgress(0);
              }, 1000);
            }}
          />
        )}

        {currentScreen === 'impostor' && (
          <ImpostorScreen 
            playerColor={playerColor} 
            onRestart={() => {
              setCurrentScreen('subjects');
              setProgress(0);
            }} 
          />
        )}
      </div>
    </div>
  );
}

export default App;
