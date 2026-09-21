import React, { useContext } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Switch,
  ImageBackground, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeContext } from '../App';
import { Colors } from '../theme';

export default function HomeScreen({ navigation }) {
  const { isDark, toggleTheme } = useContext(ThemeContext);
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
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

        {/* Theme toggle */}
        <View style={styles.topBar}>
          <Text style={[styles.themeLabel, { color: c.subtext }]}>
            {isDark ? '🌙 Dark' : '☀️ Light'}
          </Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            thumbColor={c.btnBg}
            trackColor={{ false: c.border, true: c.border }}
          />
        </View>

        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={[styles.title, { color: c.text }]}>TIC</Text>
          <Text style={[styles.title, { color: c.text }]}>TAC</Text>
          <Text style={[styles.title, { color: c.text }]}>TOE</Text>
          <View style={[styles.titleLine, { backgroundColor: c.cellBorder }]} />
        </View>

        {/* Buttons */}
        <View style={styles.btnGroup}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: c.btnBg }]}
            onPress={() => navigation.navigate('Game', { mode: '2player' })}
          >
            <Text style={[styles.btnText, { color: c.btnText }]}>Two Players</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnOutline, { borderColor: c.cellBorder }]}
            onPress={() => navigation.navigate('Difficulty')}
          >
            <Text style={[styles.btnText, { color: c.text }]}>vs AI</Text>
          </TouchableOpacity>
        </View>

      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { flex: 1, paddingHorizontal: 32, paddingTop: 56, paddingBottom: 48 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    marginBottom: 40,
  },
  themeLabel: { fontSize: 13, letterSpacing: 1 },
  titleBlock: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 64, fontWeight: '900', letterSpacing: 8, lineHeight: 70 },
  titleLine: { width: 48, height: 3, marginTop: 16, borderRadius: 2 },
  btnGroup: { gap: 14 },
  btn: {
    paddingVertical: 17,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnOutline: {
    paddingVertical: 17,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  btnText: { fontSize: 16, fontWeight: '700', letterSpacing: 2 },
});
