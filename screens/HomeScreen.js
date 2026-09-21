import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { ThemeContext } from '../App';
import { Colors } from '../theme';

export default function HomeScreen({ navigation }) {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const c = Colors[isDark ? 'dark' : 'light'];

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: c.text }]}>TIC TAC TOE</Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          thumbColor={c.btnBg}
          trackColor={{ false: c.border, true: c.border }}
        />
      </View>

      <Text style={[styles.sub, { color: c.subtext }]}>Choose a mode</Text>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: c.btnBg }]}
        onPress={() => navigation.navigate('Game', { mode: '2player' })}
      >
        <Text style={[styles.btnText, { color: c.btnText }]}>Two Players</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: c.btnBg }]}
        onPress={() => navigation.navigate('Difficulty')}
      >
        <Text style={[styles.btnText, { color: c.btnText }]}>vs AI</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 48 },
  title: { fontSize: 32, fontWeight: '800', letterSpacing: 6 },
  sub: { fontSize: 14, letterSpacing: 2, marginBottom: 32, textTransform: 'uppercase' },
  btn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 16,
  },
  btnText: { fontSize: 16, fontWeight: '600', letterSpacing: 2 },
});
