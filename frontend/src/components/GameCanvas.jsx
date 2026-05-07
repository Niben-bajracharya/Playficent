import React, { useEffect, useRef, useState, useCallback } from 'react';

const VOCABULARY = [
  // Programming & Tech
  "REACT", "DJANGO", "PYTHON", "VITE", "TAILWIND", "CODE", "HACK", "TYPE", "FAST", "GAME", "SPACE", "LASER", "ALIEN", "BUG", "FLOAT", "GRID",
  "JAVASCRIPT", "TYPESCRIPT", "NODEJS", "EXPRESS", "MONGODB", "POSTGRESQL", "MYSQL", "REDIS", "DOCKER", "KUBERNETES", "GITHUB", "GITLAB", "BITBUCKET",
  "WEBPACK", "BABEL", "ESLINT", "PRETTIER", "GIT", "COMMIT", "BRANCH", "MERGE", "PULL", "PUSH", "FETCH", "CLONE", "FORK", "ISSUE", "PULL",
  "HTML", "CSS", "XML", "JSON", "YAML", "TOML", "MARKDOWN", "API", "REST", "GRAPHQL", "SOCKET", "PROTOCOL", "HTTP", "HTTPS", "FTP",
  "DATABASE", "SCHEMA", "TABLE", "QUERY", "INDEX", "TRIGGER", "STORED", "PROCEDURE", "FUNCTION", "VARIABLE", "CONSTANT", "PARAMETER",
  "CLASS", "OBJECT", "METHOD", "PROPERTY", "INHERITANCE", "POLYMORPHISM", "ENCAPSULATION", "ABSTRACTION", "INTERFACE", "MODULE",
  "ARRAY", "STRING", "NUMBER", "BOOLEAN", "NULL", "UNDEFINED", "CALLBACK", "PROMISE", "ASYNC", "AWAIT", "GENERATOR",
  "LOOP", "CONDITIONAL", "SWITCH", "CASE", "BREAK", "CONTINUE", "RETURN", "THROW", "CATCH", "FINALLY", "DEBUG",
  "COMPONENT", "PROPS", "STATE", "HOOK", "EFFECT", "REDUCER", "CONTEXT", "PROVIDER", "CONSUMER", "RENDER",
  "DEPLOY", "BUILD", "TEST", "UNIT", "INTEGRATION", "COVERAGE", "MOCK", "STUB", "PATCH", "FIXTURE",
  "SECURITY", "ENCRYPTION", "HASH", "SALT", "TOKEN", "SESSION", "COOKIE", "CACHE", "COMPRESSION", "OPTIMIZATION",
  "FRONTEND", "BACKEND", "FULLSTACK", "DEVOPS", "AGILE", "SCRUM", "SPRINT", "KANBAN", "WATERFALL",
  "FRAMEWORK", "LIBRARY", "PACKAGE", "DEPENDENCY", "SEMVER", "VERSION", "BUILD", "RELEASE", "PATCH",
  "SERVER", "CLIENT", "REQUEST", "RESPONSE", "ERROR", "STATUS", "CODE", "ROUTE", "MIDDLEWARE", "HANDLER",
  "PERFORMANCE", "BENCHMARK", "PROFILING", "MEMORY", "LATENCY", "THROUGHPUT", "SCALABILITY", "LOAD",
  
  // General words
  "ABOUT", "ABOVE", "ACROSS", "AFTER", "AGAIN", "AGAINST", "AGENCY", "AGENDA", "AGENT", "AGREE",
  "AHEAD", "ALARM", "ALBUM", "ALERT", "ALIEN", "ALIGN", "ALIKE", "ALIVE", "ALLOW", "ALONE",
  "ALONG", "ALTER", "ANGEL", "ANGER", "ANGLE", "ANGRY", "ANIMAL", "ANNEX", "ANNUAL", "ANSWER",
  "ANYONE", "ANYWAY", "APPEAL", "APPEAR", "APPLE", "APPLY", "ARENA", "ARGUE", "ARISE", "ARMED",
  "ARMOR", "AROMA", "AROSE", "ARRAY", "ARROW", "ARSON", "ARTIST", "ASCENT", "ASLEEP", "ASPECT",
  "ASPIRE", "ASSERT", "ASSESS", "ASSET", "ASSIGN", "ASSIST", "ASSUME", "ASSURE", "ASTHMA", "ASYLUM",
  "ATTACK", "ATTAIN", "ATTEND", "ATTEST", "ATTIRE", "ATTACH", "ATTACK", "ATTEND", "ATTIC", "ATTIRE",
  "AUDIO", "AUDIT", "AUGUST", "AUTHOR", "AUTUMN", "AVENUE", "AVIARY", "AVOID", "AWAKE", "AWARD",
  "AWARE", "AWAY", "AWESOME", "AWFUL", "AWNING", "AZURE", "BABBLE", "BACKED", "BADGER", "BAGEL",
  "BAILED", "BAKING", "BALANCE", "BALCONY", "BALLED", "BALLET", "BALLOT", "BAMBOO", "BANANA", "BANDIT",
  "BANGED", "BANKER", "BANNER", "BANNED", "BANTAM", "BARBEL", "BARBER", "BARGED", "BARIUM", "BARKED",
  "BARLEY", "BARN", "BARON", "BARREL", "BARREN", "BARTER", "BARELY", "BARGAIN", "BEHIND", "BELOVED",
  "BETTER", "BEYOND", "BIASED", "BIKING", "BINARY", "BINDER", "BIOPSY", "BIOTIC", "BITTEN", "BITTER",
  "BIZARRE", "BLADED", "BLAMED", "BLANCH", "BLANKS", "BLARED", "BLASTS", "BLAZED", "BLEACH", "BLEEDS",
  "BLIGHT", "BLIMEY", "BLINDS", "BLINKS", "BLISS", "BLOATS", "BLOCKS", "BLONDE", "BLOODS", "BLOOMS",
  "BLOUSE", "BLUFFS", "BLURRY", "BLURTS", "BOARDS", "BOASTS", "BOATS", "BOBBED", "BODIES", "BODILY",
  "BOGGLE", "BOGIES", "BOGIES", "BOILED", "BOLERO", "BOLTED", "BOLTS", "BOMBS", "BONDED", "BONGOS",
  "BONKED", "BONNET", "BONSAI", "BOOKED", "BOOMER", "BOOTED", "BOOTHS", "BOOZES", "BOOZEY", "BORAX",
  "BORDER", "BORED", "BORING", "BORNE", "BOSOM", "BOTANY", "BOTCH", "BOTTLE", "BOTTOM", "BOUGHS",
  "BOUGHT", "BOUNCE", "BOUNDS", "BOUNTRY", "BOUQUET", "BOURSE", "BOUSED", "BOUSHED", "BOUSTED", "BOUTED",
  "BOWELS", "BOWERS", "BOWLED", "BOWLER", "BOWMAN", "BOXES", "BOXING", "BOYISH", "BRACED", "BRACES",
  "BRACTS", "BREWED", "BREWER", "BRIBED", "BRIBER", "BRIBES", "BRICKS", "BRIDAL", "BRIDES", "BRIDGE",
  "BRIDLE", "BRIGHT", "BRINES", "BRINGS", "BRINKS", "BRINY", "BRISK", "BRITTLE", "BROACH", "BROADS",
  "BROADS", "BROAED", "BROBED", "BROGAN", "BROGUE", "BROILS", "BROILS", "BROKEN", "BROKER", "BRONC",
  "BRONZE", "BROOCH", "BROODS", "BROOKS", "BROOMS", "BROTHS", "BROWN", "BROWNS", "BROWNY", "BROWSE",
  "BROWNED", "BROWZE", "BROWNS", "REBUFF", "REBUKE", "RECALL", "RECENT", "RECESS", "RECIPE", "RECKON",
  "RECORD", "RECOUP", "REDUCE", "REFER", "REFILL", "REFINE", "REFORM", "REFUGE", "REFUSE", "REFUTE",
  "REGAIN", "REGARD", "REGENT", "REGIME", "REGION", "REGRET", "REGULAR", "REHASH", "REJECT", "RELATE",
  "RELAX", "RELAYS", "RELENT", "RELIEF", "RELIEVE", "RELIC", "RELISH", "RELOAD", "RELUCT", "RELUME",
  "REMARK", "REMEDY", "REMIND", "REMISS", "REMIT", "REMNANT", "REMORSE", "REMOTE", "REMOVE", "REMOUNT",
  "REND", "RENDER", "RENEW", "RENEWAL", "RENNET", "RENOWN", "RENT", "RENTAL", "RENUDE", "REOBTAIN",
  "REORDER", "REPAIR", "REPAND", "REPAST", "REPAVE", "REPAYS", "REPEAL", "REPEAT", "REPEL", "REPENT",
  "REPLACE", "REPLANT", "REPLANT", "REPLAY", "REPLETE", "REPLICA", "REPLIED", "REPLIES", "REPORTS", "REPOSE",
  "REPOST", "REPOSSESS", "REPOUND", "REPRISE", "REPROBE", "REPROACH", "REPROBE", "REPROBE", "REPROBE",
];


const WORDS_TO_SPAWN = 1;
const DEFAULT_SPAWN_INTERVAL_MS = 2500;
const DEFAULT_FALL_SPEED = 0.45;
const MIN_WORD_SPACING = 100;
const LOSE_Y_THRESHOLD_OFFSET = 100;

const POWER_UP_TYPES = {
  DOUBLE_POINTS: { name: 'DOUBLE', color: '#FFD700', duration: 8000 },
  SLOW_MO: { name: 'SLOW', color: '#00D9FF', duration: 6000 },
  SHIELD: { name: 'SHIELD', color: '#FF10F0', duration: 1 }
};

export default function GameCanvas({ onGameOver, updateScoreDisplay, difficultySettings }) {
  const requestRef = useRef();
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  
  const SPAWN_INTERVAL_MS = difficultySettings?.spawnInterval || DEFAULT_SPAWN_INTERVAL_MS;
  const BASE_FALL_SPEED = difficultySettings?.fallSpeed || DEFAULT_FALL_SPEED;
  const [currentInput, setCurrentInput] = useState('');
  const [lasers, setLasers] = useState([]);
  const [explosions, setExplosions] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [particles, setParticles] = useState([]);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [combo, setCombo] = useState(0);
  const [screenShake, setScreenShake] = useState(0);
  const [counter, setCounter] = useState(0);
  const [powerUps, setPowerUps] = useState([]);
  const [activePowerUp, setActivePowerUp] = useState(null);

  // Internal game state
  const gameState = useRef({
    baseSpeedY: BASE_FALL_SPEED,
    score: 0,
    wordsTyped: 0,
    startTime: Date.now(),
    words: [],
    isPaused: false,
    combo: 0,
    lastSpawnTime: Date.now(),
    activePowerUps: {}
  });

  // Particle animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => {
        return prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.1, // gravity
            life: p.life - 0.05
          }))
          .filter(p => p.life > 0);
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Floating text animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingTexts(prev => {
        return prev
          .map(t => ({
            ...t,
            y: t.y - 2,
            life: t.life - 0.03
          }))
          .filter(t => t.life > 0);
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Create particles on hit
  const spawnParticles = useCallback((x, y, count = 12) => {
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = 3 + Math.random() * 3;
      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color: ['#39FF14', '#00FF41', '#0FFF50', '#FFD700'][Math.floor(Math.random() * 4)]
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  // Screen shake effect
  const triggerScreenShake = useCallback(() => {
    setScreenShake(1);
    setTimeout(() => setScreenShake(0), 100);
  }, []);

  // Floating damage text
  const spawnFloatingText = useCallback((x, y, text, color = '#39FF14') => {
    const id = Date.now() + Math.random();
    setFloatingTexts(prev => [...prev, {
      id,
      x,
      y,
      text,
      color,
      life: 1
    }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 1500);
  }, []);

  // Spawn power-ups randomly
  const spawnPowerUp = useCallback((x, y) => {
    // 25% chance to spawn a power-up on word kill
    if (Math.random() > 0.25) return;
    
    const types = Object.keys(POWER_UP_TYPES);
    const typeKey = types[Math.floor(Math.random() * types.length)];
    const type = POWER_UP_TYPES[typeKey];
    
    const newPowerUp = {
      id: Date.now() + Math.random(),
      x,
      y,
      type: typeKey,
      active: true
    };
    
    gameState.current.powerUps = (gameState.current.powerUps || []);
    gameState.current.powerUps.push(newPowerUp);
  }, []);

  // Apply power-up effects
  const applyPowerUp = useCallback((powerUpType) => {
    const type = POWER_UP_TYPES[powerUpType];
    gameState.current.activePowerUps[powerUpType] = Date.now() + type.duration;
    
    spawnFloatingText(window.innerWidth / 2, window.innerHeight / 2, `${type.name} MODE!`, type.color);
    triggerScreenShake();
    
    // Update state to trigger re-render
    setActivePowerUp({...gameState.current.activePowerUps});
    
    // Reset after duration (except SHIELD which is single-use)
    if (powerUpType !== 'SHIELD') {
      setTimeout(() => {
        delete gameState.current.activePowerUps[powerUpType];
        setActivePowerUp({...gameState.current.activePowerUps});
      }, type.duration);
    }
  }, []);

  // Spawn new words falling from top
  const spawnNewWords = useCallback(() => {
    const activeWords = gameState.current.words.filter(w => w.active);
    
    // Get all active Y positions
    const activeYPositions = activeWords.map(w => w.y);
    
    // Find a safe X position with sufficient spacing from other words
    let newX;
    let isValidPosition = false;
    let attempts = 0;
    
    while (!isValidPosition && attempts < 10) {
      newX = Math.random() * (window.innerWidth - 100) + 50;
      
      // Check if this X would conflict with any active word
      isValidPosition = !activeWords.some(w => Math.abs(w.x - newX) < 80);
      attempts++;
    }
    
    if (!isValidPosition) {
      // Fallback to random position if can't find safe spot
      newX = Math.random() * (window.innerWidth - 100) + 50;
    }
    
    // Determine if this is a special word (higher value)
    const rand = Math.random();
    let multiplier = 1;
    if (rand < 0.15) multiplier = 2; // 15% chance for 2x
    else if (rand < 0.18) multiplier = 3; // 3% chance for 3x
    
    const newWord = {
      id: Date.now(),
      x: newX,
      y: -60,
      text: VOCABULARY[Math.floor(Math.random() * VOCABULARY.length)],
      active: true,
      multiplier
    };
    
    gameState.current.words.push(newWord);
    gameState.current.lastSpawnTime = Date.now();
  }, []);

  // Initialize game with first batch of words
  useEffect(() => {
    gameState.current.startTime = Date.now();
    gameState.current.lastSpawnTime = Date.now();
    spawnNewWords();
  }, [spawnNewWords]);

  // Pause listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsPaused(prev => {
          const next = !prev;
          gameState.current.isPaused = next;
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerCombat = (word) => {
    const targetX = word.x;
    const targetY = word.y;
    const sourceX = window.innerWidth / 2;
    const sourceY = window.innerHeight - 80;

    const laserId = Date.now();
    setLasers(prev => [...prev, { id: laserId, start: {x: sourceX, y: sourceY}, end: {x: targetX, y: targetY} }]);
    
    triggerScreenShake();
    spawnParticles(targetX, targetY, 16);
    
    setTimeout(() => {
      setLasers(prev => prev.filter(l => l.id !== laserId));
      setExplosions(prev => [...prev, { id: Date.now(), x: targetX, y: targetY }]);
      setTimeout(() => {
        setExplosions(prev => prev.filter(e => e.id !== laserId));
      }, 500);
    }, 150);

    word.active = false;
    gameState.current.combo += 1;
    gameState.current.wordsTyped += 1;

    // Calculate score with multipliers
    let baseScore = 10 * (word.multiplier || 1);
    
    // Combo multiplier (starts at 1x, increases)
    const comboMultiplier = Math.min(1 + gameState.current.combo * 0.2, 5);
    
    // Power-up multiplier (stackable)
    let powerUpMultiplier = 1;
    if (gameState.current.activePowerUps['DOUBLE_POINTS']) {
      powerUpMultiplier *= 2;
    }
    
    const finalScore = Math.floor(baseScore * comboMultiplier * powerUpMultiplier);
    gameState.current.score += finalScore;
    
    // Visual feedback
    const scoreText = `+${finalScore}`;
    const scoreColor = word.multiplier > 1 ? '#FFD700' : '#39FF14';
    spawnFloatingText(targetX, targetY, scoreText, scoreColor);
    
    // Milestone combos
    if (gameState.current.combo % 10 === 0) {
      spawnFloatingText(targetX, targetY - 30, `x${gameState.current.combo} COMBO!`, '#FF10F0');
      spawnParticles(targetX, targetY, 24);
    } else if (gameState.current.combo % 5 === 0) {
      spawnFloatingText(targetX, targetY - 30, `x${gameState.current.combo}`, '#FFD700');
    }
    
    setCombo(gameState.current.combo);
    spawnPowerUp(targetX, targetY);
    
    const minutes = (Date.now() - gameState.current.startTime) / 60000;
    const wpm = gameState.current.wordsTyped / minutes;
    updateScoreDisplay(gameState.current.score, wpm);
  };

  const handleInputChange = (e) => {
    const val = e.target.value.toUpperCase();
    setCurrentInput(val);
    
    // Check for matches - find ALL words with this text
    const activeWords = gameState.current.words.filter(w => w.active);
    const matches = activeWords.filter(w => w.text === val);
    
    if (matches.length > 0) {
      // Trigger combat for ALL matching words at once
      matches.forEach(match => {
        triggerCombat(match);
      });
      
      setCurrentInput('');
    } else if (val.length > 0) {
      // Check if the input is still a valid prefix for any word
      const validPrefixes = activeWords.some(w => w.text.startsWith(val));
      
      // If no word starts with this text, it's a mistake - reset combo
      if (!validPrefixes) {
        gameState.current.combo = 0;
        setCombo(0);
      }
    }
  };

  const gameLoop = () => {
    if (!containerRef.current) return;
    const state = gameState.current;
    
    if (state.isPaused) {
      requestRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    // Apply slow-mo if active
    let speedMultiplier = 1 + state.score * 0.015;
    if (state.activePowerUps['SLOW_MO']) {
      speedMultiplier *= 0.5;
    }
    const currentSpeed = state.baseSpeedY * speedMultiplier;
    
    // Clean up expired power-ups (shield only expires when used against a word)
    const now = Date.now();
    Object.keys(state.activePowerUps).forEach(key => {
      if (key !== 'SHIELD' && state.activePowerUps[key] < now) {
        delete state.activePowerUps[key];
      }
    });

    // Move all active words down
    const activeWords = state.words.filter(w => w.active);
    activeWords.forEach(word => {
      word.y += currentSpeed;
    });

    // Update power-ups
    if (state.powerUps && state.powerUps.length > 0) {
      state.powerUps = state.powerUps.filter(pu => pu.active);
      state.powerUps.forEach(pu => {
        // Check collision with player base (bottom center)
        const playerX = window.innerWidth / 2;
        const playerY = window.innerHeight - 80;
        
        // Calculate direction to player
        const dx = playerX - pu.x;
        const dy = playerY - pu.y;
        const dist = Math.hypot(dx, dy);
        
        // Move towards center
        const speed = 4; // Adjust speed of attraction
        if (dist > 20) {
          const angle = Math.atan2(dy, dx);
          pu.x += Math.cos(angle) * speed;
          pu.y += Math.sin(angle) * speed;
        }
        
        if (dist < 60) {
          pu.active = false;
          applyPowerUp(pu.type);
        }
        
        // Remove if off-screen
        if (pu.y > window.innerHeight) {
          pu.active = false;
        }
      });
    }

    // Spawn new words periodically (faster with high combos)
    let spawnInterval = SPAWN_INTERVAL_MS;
    if (state.combo > 20) spawnInterval *= 0.85;
    else if (state.combo > 10) spawnInterval *= 0.9;
    
    if (now - state.lastSpawnTime > spawnInterval) {
      spawnNewWords();
    }

    // Check lose condition - if any word reaches bottom
    const h = containerRef.current.clientHeight;
    for (let word of activeWords) {
      if (word.y > h - LOSE_Y_THRESHOLD_OFFSET) {
        // Check if shield is active
        if (state.activePowerUps['SHIELD']) {
          // Destroy this word instead of losing
          word.active = false;
          delete state.activePowerUps['SHIELD'];
          setActivePowerUp({...state.activePowerUps});
          spawnFloatingText(word.x, word.y, 'SHIELD!', '#FF10F0');
        } else {
          const minutes = (Date.now() - state.startTime) / 60000;
          const wpm = state.wordsTyped / minutes;
          onGameOver(state.score, wpm);
          return;
        }
      }
    }

    setCounter(prev => prev + 1);
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full crt-overlay overflow-hidden bg-black"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Star field background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.4
            }}
          />
        ))}
      </div>
      
      {/* Falling Words */}
      {gameState.current.words.filter(w => w.active).map(word => {
        const x = word.x;
        const y = word.y;
        const isMatchedPrefix = currentInput && word.text.startsWith(currentInput);
        const isSpecial = (word.multiplier || 1) > 1;
        
        return (
          <div
            key={word.id}
            className={`absolute font-press-start text-sm ${
              isMatchedPrefix ? 'text-white' : isSpecial ? 'text-neonYellow' : 'text-neonGreen'
            }`}
            style={{ 
              transform: `translate(${Math.round(x)}px, ${Math.round(y)}px) translateZ(0)`,
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              WebkitFontSmoothing: 'antialiased',
              textRendering: 'optimizeLegibility',
              contain: 'layout style paint',
              letterSpacing: '0.05em',
              fontWeight: 'bold',
              textShadow: isSpecial ? `0 0 15px #FFD700` : 'none'
            }}
          >
            {word.text}
            {isSpecial && <span style={{ marginLeft: '0.2em', fontSize: '0.7em' }}>✦</span>}
          </div>
        );
      })}

      {/* Particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: p.x,
            top: p.y,
            width: '4px',
            height: '4px',
            backgroundColor: p.color,
            opacity: p.life,
            boxShadow: `0 0 8px ${p.color}`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}

      {/* Power-ups */}
      {gameState.current.powerUps && gameState.current.powerUps.filter(pu => pu.active).map(pu => {
        const type = POWER_UP_TYPES[pu.type];
        return (
          <div
            key={pu.id}
            className="absolute pointer-events-none font-press-start text-xs font-bold animate-bounce"
            style={{
              left: pu.x,
              top: pu.y,
              color: type.color,
              textShadow: `0 0 12px ${type.color}`,
              transform: 'translate(-50%, -50%)',
              padding: '4px 8px',
              border: `2px solid ${type.color}`,
              borderRadius: '4px',
              background: `${type.color}20`
            }}
          >
            {type.name}
          </div>
        );
      })}

      {/* Floating Text (Score & Combo) */}
      {floatingTexts.map(t => (
        <div
          key={t.id}
          className="absolute font-press-start text-xs pointer-events-none"
          style={{
            left: t.x,
            top: t.y,
            color: t.color,
            opacity: t.life,
            textShadow: `0 0 10px ${t.color}`,
            transform: 'translate(-50%, -50%)',
            fontWeight: 'bold'
          }}
        >
          {t.text}
        </div>
      ))}

      {/* Lasers */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
        {lasers.map(l => (
          <g key={l.id}>
            <line x1={l.start.x} y1={l.start.y} x2={l.end.x} y2={l.end.y} stroke="#39FF14" strokeWidth="3" opacity="0.8" />
            <line x1={l.start.x} y1={l.start.y} x2={l.end.x} y2={l.end.y} stroke="#00FF41" strokeWidth="1.5" opacity="0.5" />
          </g>
        ))}
      </svg>
      
      {/* Explosions - Enhanced */}
      {explosions.map(e => (
        <div key={e.id} className="absolute flex justify-center items-center pointer-events-none z-20" style={{ left: e.x, top: e.y, transform: 'translate(-50%, -50%)' }}>
          <div className="absolute w-20 h-20 bg-yellow-400 rounded-full opacity-0 animate-ping" style={{ boxShadow: '0 0 30px #FFD700' }} />
          <div className="absolute w-12 h-12 bg-orange-500 rounded-full opacity-0 animate-pulse" />
        </div>
      ))}

      {/* Combo Counter */}
      {combo > 0 && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none z-40">
          <div className="font-press-start text-yellow-400 animate-bounce" style={{ 
            fontSize: 'clamp(10px, 2.5vw, 16px)',
            textShadow: '0 0 20px #FFD700' 
          }}>
            COMBO x{combo}
          </div>
        </div>
      )}

      {/* Active Power-ups Display */}
      {activePowerUp && Object.keys(activePowerUp).length > 0 && (
        <div className="absolute top-40 left-1/2 -translate-x-1/2 pointer-events-none z-40 flex flex-col gap-2">
          {Object.keys(activePowerUp).map((puType) => {
            const type = POWER_UP_TYPES[puType];
            return (
              <div key={puType} className="font-press-start text-sm animate-pulse" style={{ 
                color: type.color,
                textShadow: `0 0 20px ${type.color}`,
                padding: '8px 12px',
                border: `2px solid ${type.color}`,
                background: `${type.color}20`
              }}>
                ⚡ {type.name}
              </div>
            );
          })}
        </div>
      )}

      {/* Shield Visual Effect */}
      {activePowerUp && activePowerUp['SHIELD'] && (
        <svg className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none z-20" width="200" height="200" viewBox="0 0 200 200" style={{ transform: 'translateX(-50%)' }}>
          <defs>
            <filter id="shieldGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* Outer shield circle - largest */}
          <circle cx="100" cy="100" r="93" fill="none" stroke="#FF10F0" strokeWidth="4" opacity="0.9" filter="url(#shieldGlow)" style={{ filter: 'drop-shadow(0 0 20px #FF10F0)' }} />
          {/* Middle pulsing ring */}
          <circle cx="100" cy="100" r="79" fill="none" stroke="#FF10F0" strokeWidth="2.5" opacity="0.6" style={{ filter: 'drop-shadow(0 0 12px #FF10F0)', animation: 'pulse 1s ease-in-out infinite' }} />
          {/* Inner ring */}
          <circle cx="100" cy="100" r="61" fill="none" stroke="#FF10F0" strokeWidth="1.5" opacity="0.4" style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
          {/* Solid semi-transparent protective field */}
          <circle cx="100" cy="100" r="90" fill="#FF10F0" opacity="0.05" />
          {/* Shield corner indicators */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => {
            const rad = (angle * Math.PI) / 180;
            const x = 100 + 97 * Math.cos(rad);
            const y = 100 + 97 * Math.sin(rad);
            return (
              <circle key={angle} cx={x} cy={y} r="4" fill="#FF10F0" opacity="0.95" style={{ filter: 'drop-shadow(0 0 10px #FF10F0)' }} />
            );
          })}
        </svg>
      )}

      {/* Gunner Base */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-30">
        <div className="w-8 h-8 bg-neonGreen mb-2 clip-path-triangle animate-pulse" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', boxShadow: '0 0 15px #39FF14' }} />
        <div className="w-24 h-6 bg-neonGreen rounded-t-sm" style={{ boxShadow: '0 0 10px #39FF14' }} />
        <input 
          ref={inputRef}
          className="mt-4 bg-transparent border-b-2 border-neonGreen text-white font-press-start text-center text-xl outline-none uppercase tracking-widest"
          style={{ textShadow: '0 0 5px #39FF14', boxShadow: '0 2px 10px rgba(57, 255, 20, 0.5)' }}
          value={currentInput}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setCurrentInput('');
            }
          }}
          placeholder=""
          autoFocus
        />
      </div>

      {/* Pause Overlay */}
      {isPaused && (
        <div 
          className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 style={{ 
            fontSize: 'clamp(16px, 5vw, 32px)',
            color: '#39FF14',
            marginBottom: '2rem',
            animation: 'pulse 2s infinite',
            textShadow: '0 0 20px #39FF14' 
          }}>PAUSED</h2>
          <div className="flex flex-col gap-4 w-64">
            <button 
              className="border-2 border-neonGreen py-3 px-6 hover:bg-neonGreen hover:text-black transition-colors"
              onClick={() => {
                setIsPaused(false);
                gameState.current.isPaused = false;
              }}
            >
              RESUME
            </button>
            <button 
              className="border-2 border-neonGreen py-3 px-6 hover:bg-neonGreen hover:text-black transition-colors"
              onClick={() => window.location.reload()}
            >
              RESTART
            </button>
          </div>
        </div>
      )}

      <div className="absolute w-full border-t border-red-500/30 border-dashed z-0" style={{ bottom: `${LOSE_Y_THRESHOLD_OFFSET}px` }} />
    </div>
  );
}
