import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDailyTip } from '../../lib/notifications';

type Tip = { id: string; text: string; date: string };

const TIPS_KEY = 'askfuji_tips';

export default function TipsScreen() {
  const [tips, setTips] = useState<Tip[]>([]);
  const todayTip = getDailyTip();

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem(TIPS_KEY).then((raw) => {
        if (raw) setTips(JSON.parse(raw));
      });
    }, [])
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={tips}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.todayCard}>
            <Text style={styles.todayLabel}>TODAY'S TIP</Text>
            <Text style={styles.todayText}>{todayTip}</Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>Past tips will appear here as you receive them.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  list: { padding: 16, gap: 12 },
  todayCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 18,
    marginBottom: 8,
    gap: 8,
  },
  todayLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#aaa',
  },
  todayText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#fff',
    fontWeight: '500',
  },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 20, fontSize: 14, lineHeight: 22 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  date: { fontSize: 11, color: '#aaa', fontWeight: '600', letterSpacing: 0.5 },
  text: { fontSize: 15, color: '#1a1a1a', lineHeight: 22 },
});
