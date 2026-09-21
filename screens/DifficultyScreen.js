import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeContext } from '../App';
import { Colors } from '../theme';

const LEVELS = [
  { label: 'Easy', value: 'easy', desc: 'Random moves' },
  { label: 'Medium', value: 'medium', desc: 'Blocks & attacks' },
  { label: 'Hard', value: 'hard', desc: 'Unbeatable' },
];

export default function DifficultyScreen({ navigation }) {
  const { isDark } = useContext(ThemeContext);
  const c = Colors[isDark ? 'dark' : 'light'];

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <Text style={[styles.title, { color: c.text }]}>AI LEVEL</Text>
      <Text style={[styles.sub, { color: c.subtext }]}>Pick your challenge</Text>

      {LEVELS.map((lvl) => (
        <TouchableOpacity
          key={lvl.value}
          style={[styles.btn, { backgroundColor: c.surface, borderColor: c.border }]}
          onPress={() => navigation.navigate('Game', { mode: 'ai', difficulty: lvl.value })}
        >
          <Text style={[styles.label, { color: c.text }]}>{lvl.label}</Text>
          <Text style={[styles.desc, { color: c.subtext }]}>{lvl.desc}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: 6, marginBottom: 8 },
  sub: { fontSize: 13, letterSpacing: 2, marginBottom: 40, textTransform: 'uppercase' },
  btn: {
    width: '100%',
    padding: 20,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 16,
  },
  label: { fontSize: 18, fontWeight: '700', letterSpacing: 1 },
  desc: { fontSize: 13, marginTop: 4 },
});
