import React, { useContext, useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Dimensions, Switch, ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeContext } from '../App';
import { Colors } from '../theme';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width - 48;
const GAP = 6;
const CELL_SIZE = (BOARD_SIZE - GAP * 2) / 3;

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function checkWinner(board) {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return { winner: board[a], line: [a, b, c] };
  }
  if (board.every(Boolean)) return { winner: 'draw', line: [] };
  return null;
}

function minimax(board, isMax, depth, alpha, beta) {
  const result = checkWinner(board);
  if (result) {
    if (result.winner === 'O') return 10 - depth;
    if (result.winner === 'X') return depth - 10;
    return 0;
  }
  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O';
        best = Math.max(best, minimax(board, false, depth + 1, alpha, beta));
        board[i] = null;
        alpha = Math.max(alpha, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'X';
        best = Math.min(best, minimax(board, true, depth + 1, alpha, beta));
        board[i] = null;
        beta = Math.min(beta, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  }
}

function getBestMove(board) {
  let best = -Infinity, move = -1;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'O';
      const score = minimax(board, false, 0, -Infinity, Infinity);
      board[i] = null;
      if (score > best) { best = score; move = i; }
    }
  }
  return move;
}

function getAIMove(board, difficulty) {
  const empty = board.map((v, i) => (!v ? i : null)).filter((v) => v !== null);
  if (difficulty === 'easy') return empty[Math.floor(Math.random() * empty.length)];
  if (difficulty === 'medium')
    return Math.random() < 0.6 ? getBestMove(board) : empty[Math.floor(Math.random() * empty.length)];
  return getBestMove(board);
}

export default function GameScreen({ route, navigation }) {
  const { mode, difficulty } = route.params;
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const c = Colors[isDark ? 'dark' : 'light'];

  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [result, setResult] = useState(null);
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });

  const isAITurn = mode === 'ai' && !xIsNext;

  const overlayColors = isDark
    ? ['rgba(10,10,10,0.4)', 'rgba(10,10,10,0.75)', 'rgba(10,10,10,0.96)']
    : ['rgba(232,228,220,0.35)', 'rgba(232,228,220,0.72)', 'rgba(232,228,220,0.96)'];

  useEffect(() => {
    if (isAITurn && !result) {
      const timer = setTimeout(() => {
        const newBoard = [...board];
        const move = getAIMove(newBoard, difficulty);
        if (move !== undefined && move !== -1) {
          newBoard[move] = 'O';
          const res = checkWinner(newBoard);
          setBoard(newBoard);
          if (res) {
            setResult(res);
            setScores((s) => ({ ...s, [res.winner]: (s[res.winner] || 0) + 1 }));
          } else {
            setXIsNext(true);
          }
        }
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [board, xIsNext, result]);

  function handlePress(index) {
    if (board[index] || result || isAITurn) return;
    const newBoard = [...board];
    newBoard[index] = xIsNext ? 'X' : 'O';
    const res = checkWinner(newBoard);
    setBoard(newBoard);
    if (res) {
      setResult(res);
      setScores((s) => ({ ...s, [res.winner]: (s[res.winner] || 0) + 1 }));
    } else {
      setXIsNext(!xIsNext);
    }
  }

  function reset() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setResult(null);
  }

  const winLine = result?.line || [];

  function statusText() {
    if (!result) {
      if (isAITurn) return 'AI is thinking…';
      if (mode === 'ai') return 'Your turn  (X)';
      return `Player ${xIsNext ? 'X' : 'O'}'s turn`;
    }
    if (result.winner === 'draw') return "Cat's game — Draw!";
    if (mode === 'ai') return result.winner === 'X' ? 'You win! 🎉' : 'AI wins!';
    return `Player ${result.winner} wins! 🎉`;
  }

  const playerLabel = (p) =>
    mode === 'ai' ? (p === 'X' ? 'You' : 'AI') : `P${p === 'X' ? '1' : '2'}`;

  const rows = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];

  return (
    <ImageBackground
      source={require('../assets/gamification.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <LinearGradient colors={overlayColors} locations={[0, 0.4, 1]} style={styles.overlay}>

        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.back, { color: c.subtext }]}>← Back</Text>
          </TouchableOpacity>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            thumbColor={c.btnBg}
            trackColor={{ false: c.border, true: c.border }}
          />
        </View>

        {/* Score */}
        <View style={[styles.scoreCard, { backgroundColor: c.scoreCard, borderColor: c.border }]}>
          {['X', 'draw', 'O'].map((key, idx) => (
            <View
              key={key}
              style={[
                styles.scoreCell,
                idx < 2 && { borderRightWidth: 1, borderColor: c.border },
              ]}
            >
              <Text style={[styles.scoreLabel, { color: c.subtext }]}>
                {key === 'draw' ? 'DRAW' : `${playerLabel(key)} (${key})`}
              </Text>
              <Text style={[styles.scoreNum, { color: c.text }]}>{scores[key] || 0}</Text>
            </View>
          ))}
        </View>

        {/* Status */}
        <Text style={[styles.status, { color: c.text }]}>{statusText()}</Text>

        {/* Board */}
        <View style={[styles.board, { width: BOARD_SIZE }]}>
          {rows.map((row, rowIdx) => (
            <View key={rowIdx} style={[styles.row, rowIdx < 2 && { marginBottom: GAP }]}>
              {row.map((cellIdx, colIdx) => {
                const cell = board[cellIdx];
                const isWin = winLine.includes(cellIdx);
                return (
                  <TouchableOpacity
                    key={cellIdx}
                    style={[
                      styles.cell,
                      colIdx < 2 && { marginRight: GAP },
                      {
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        backgroundColor: isWin
                          ? isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)'
                          : isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
                        borderColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.22)',
                      },
                    ]}
                    onPress={() => handlePress(cellIdx)}
                    activeOpacity={0.7}
                  >
                    {cell ? (
                      <Text
                        style={[
                          styles.mark,
                          {
                            fontSize: CELL_SIZE * 0.44,
                            color: cell === 'X' ? c.x : c.o,
                          },
                        ]}
                      >
                        {cell}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {/* New Game */}
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: c.btnBg }]}
          onPress={reset}
        >
          <Text style={[styles.btnText, { color: c.btnText }]}>New Game</Text>
        </TouchableOpacity>

      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { flex: 1, paddingHorizontal: 24, paddingTop: 56, paddingBottom: 40 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  back: { fontSize: 15, letterSpacing: 1 },
  scoreCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  scoreCell: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  scoreLabel: { fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' },
  scoreNum: { fontSize: 28, fontWeight: '700', marginTop: 2 },
  status: { fontSize: 17, fontWeight: '600', letterSpacing: 0.5, marginBottom: 18, textAlign: 'center' },
  board: { alignSelf: 'center', marginBottom: 28 },
  row: { flexDirection: 'row' },
  cell: {
    borderWidth: 2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mark: { fontWeight: '800' },
  btn: {
    paddingVertical: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnText: { fontSize: 15, fontWeight: '700', letterSpacing: 2 },
});
