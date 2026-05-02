import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { SafeAreaView } from 'react-native-safe-area-context';
import { askClaude } from '../../lib/claude';

type Message = { id: string; role: 'user' | 'assistant'; text: string };

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await askClaude([...messages, userMsg]);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + '_a', role: 'assistant', text: reply },
      ]);
    } catch (e) {
      console.error('Claude error:', e);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + '_e', role: 'assistant', text: `Error: ${e instanceof Error ? e.message : String(e)}` },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>Ask anything about your Fuji X100VI</Text>
          }
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}>
              {item.role === 'user' ? (
                <Text style={styles.userText}>{item.text}</Text>
              ) : (
                <Markdown style={markdownStyles}>{item.text}</Markdown>
              )}
            </View>
          )}
        />
        {loading && <ActivityIndicator style={styles.spinner} color="#1a1a1a" />}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask about your X100VI..."
            placeholderTextColor="#999"
            multiline
            onSubmitEditing={send}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={send} disabled={loading}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  flex: { flex: 1 },
  list: { padding: 16, paddingTop: 20, gap: 14 },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 80, fontSize: 15, lineHeight: 24, paddingHorizontal: 40 },
  bubble: { maxWidth: '85%', borderRadius: 18, padding: 14, flexShrink: 1 },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#1a1a1a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#f5f4f2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  userText: { color: '#fff', fontSize: 15, lineHeight: 22 },
  spinner: { marginVertical: 8 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ebebeb',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    color: '#1a1a1a',
    backgroundColor: '#fafafa',
  },
  sendBtn: {
    backgroundColor: '#1a1a1a',
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 11,
  },
  sendText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});

const markdownStyles = {
  body: { color: '#1a1a1a', fontSize: 15, lineHeight: 23 },
  heading1: { fontSize: 18, fontWeight: '700', marginTop: 4, marginBottom: 8, color: '#1a1a1a' },
  heading2: { fontSize: 16, fontWeight: '700', marginTop: 4, marginBottom: 6, color: '#1a1a1a' },
  heading3: { fontSize: 15, fontWeight: '600', marginTop: 4, marginBottom: 4, color: '#333' },
  strong: { fontWeight: '700', color: '#1a1a1a' },
  em: { fontStyle: 'italic', color: '#555' },
  hr: { backgroundColor: '#ebebeb', height: 1, marginVertical: 10 },
  bullet_list: { marginVertical: 6 },
  ordered_list: { marginVertical: 6 },
  list_item: { marginBottom: 5 },
  table: { borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 8, marginVertical: 10, overflow: 'hidden' },
  th: { backgroundColor: '#eceae7', padding: 8, fontWeight: '700', fontSize: 13 },
  td: { padding: 8, fontSize: 13 },
  code_inline: { backgroundColor: '#f0f0f0', borderRadius: 4, paddingHorizontal: 5, fontFamily: 'monospace', fontSize: 13 },
};
