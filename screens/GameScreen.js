import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ThemeContext } from '../App';
import { Colors } from '../theme';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width - 64;
const CELL_SIZE = BOARD_SIZE / 3;

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

// Minimax
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
  if (difficulty === 'medium') {
    // 60% chance of best move, else random
    return Math.random() < 0.6 ? getBestMove(board) : empty[Math.floor(Math.random() * empty.length)];
  }
  return getBestMove(board);
}

export default function GameScreen({ route, navigation }) {
  const { mode, difficulty } = route.params;
  const { isDark } = useContext(ThemeContext);
  const c = Colors[isDark ? 'dark' : 'light'];

  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [result, setResult] = useState(null);
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });

  const isAITurn = mode === 'ai' && !xIsNext;

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
      }, 400);
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
      return mode === 'ai' ? 'Your turn  (X)' : `Player ${xIsNext ? 'X' : 'O'}'s turn`;
    }
    if (result.winner === 'draw') return "It's a draw!";
    if (mode === 'ai') return result.winner === 'X' ? 'You win! 🎉' : 'AI wins!';
    return `Player ${result.winner} wins! 🎉`;
  }

  const playerLabel = (p) => (mode === 'ai' ? (p === 'X' ? 'You' : 'AI') : `P${p === 'X' ? 1 : 2}`);

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      {/* Score */}
      <View style={[styles.scoreRow, { borderColor: c.border }]}>
        {['X', 'draw', 'O'].map((key) => (
          <View key={key} style={styles.scoreCell}>
            <Text style={[styles.scoreLabel, { color: c.subtext }]}>
              {key === 'draw' ? 'DRAW' : playerLabel(key)}
            </Text>
            <Text style={[styles.scoreNum, { color: c.text }]}>{scores[key] || 0}</Text>
          </View>
        ))}
      </View>

      {/* Status */}
      <Text style={[styles.status, { color: c.text }]}>{statusText()}</Text>

      {/* Board */}
      <View style={[styles.board, { width: BOARD_SIZE, height: BOARD_SIZE }]}>
        {board.map((cell, i) => {
          const isWinCell = winLine.includes(i);
          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.cell,
                {
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  borderColor: c.cellBorder,
                  backgroundColor: isWinCell ? (isDark ? '#2A2A2A' : '#EBEBEB') : c.cell,
                },
              ]}
              onPress={() => handlePress(i)}
              activeOpacity={0.7}
            >
              {cell && (
                <Text
                  style={[
                    styles.cellText,
                    { color: cell === 'X' ? c.x : c.o, fontSize: CELL_SIZE * 0.45 },
                  ]}
                >
                  {cell}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Actions */}
      <TouchableOpacity style={[styles.btn, { backgroundColor: c.btnBg }]} onPress={reset}>
        <Text style={[styles.btnText, { color: c.btnText }]}>Play Again</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={[styles.back, { color: c.subtext }]}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  scoreRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 32,
    overflow: 'hidden',
  },
  scoreCell: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  scoreLabel: { fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' },
  scoreNum: { fontSize: 24, fontWeight: '700', marginTop: 4 },
  status: { fontSize: 16, letterSpacing: 1, marginBottom: 24, fontWeight: '500' },
  board: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 32 },
  cell: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: { fontWeight: '700' },
  btn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 16,
  },
  btnText: { fontSize: 15, fontWeight: '600', letterSpacing: 2 },
  back: { fontSize: 14, letterSpacing: 1 },
});
