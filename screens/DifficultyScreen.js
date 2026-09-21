import React, { useContext } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeContext } from '../App';
import { Colors } from '../theme';

const LEVELS = [
  { label: 'Easy', value: 'easy', desc: 'Random moves — just for fun' },
  { label: 'Medium', value: 'medium', desc: 'Blocks & attacks — a fair fight' },
  { label: 'Hard', value: 'hard', desc: 'Unbeatable — good luck' },
];

export default function DifficultyScreen({ navigation }) {
  const { isDark } = useContext(ThemeContext);
  const c = Colors[isDark ? 'dark' : 'light'];

  const overlayColors = isDark
    ? ['rgba(10,10,10,0.55)', 'rgba(10,10,10,0.82)', 'rgba(10,10,10,0.97)']
    : ['rgba(232,228,220,0.45)', 'rgba(232,228,220,0.78)', 'rgba(232,228,220,0.97)'];

  return (
    <ImageBackground
      source={require('../assets/gamification.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <LinearGradient colors={overlayColors} locations={[0, 0.45, 1]} style={styles.overlay}>

        <View style={styles.titleBlock}>
          <Text style={[styles.title, { color: c.text }]}>AI LEVEL</Text>
          <Text style={[styles.sub, { color: c.subtext }]}>Pick your challenge</Text>
          <View style={[styles.titleLine, { backgroundColor: c.cellBorder }]} />
        </View>

        <View style={styles.levels}>
          {LEVELS.map((lvl) => (
            <TouchableOpacity
              key={lvl.value}
              style={[styles.card, { backgroundColor: c.scoreCard, borderColor: c.cellBorder }]}
              onPress={() => navigation.navigate('Game', { mode: 'ai', difficulty: lvl.value })}
              activeOpacity={0.75}
            >
              <Text style={[styles.label, { color: c.text }]}>{lvl.label}</Text>
              <Text style={[styles.desc, { color: c.subtext }]}>{lvl.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={[styles.back, { color: c.subtext }]}>← Back</Text>
        </TouchableOpacity>

      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { flex: 1, paddingHorizontal: 32, paddingTop: 80, paddingBottom: 48 },
  titleBlock: { marginBottom: 40 },
  title: { fontSize: 40, fontWeight: '900', letterSpacing: 6 },
  sub: { fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', marginTop: 6 },
  titleLine: { width: 40, height: 3, marginTop: 14, borderRadius: 2 },
  levels: { flex: 1, justifyContent: 'center', gap: 14 },
  card: {
    padding: 22,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  label: { fontSize: 20, fontWeight: '800', letterSpacing: 1 },
  desc: { fontSize: 13, marginTop: 5 },
  backBtn: { alignSelf: 'flex-start' },
  back: { fontSize: 14, letterSpacing: 1 },
});
