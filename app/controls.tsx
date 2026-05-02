import { useState, useRef } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, StyleSheet, Dimensions, Animated, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, X } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const DIAGRAMS = [
  { title: 'Front & Top Controls', image: require('../assets/diagrams/page_30.png') },
  { title: 'Back & Side Controls', image: require('../assets/diagrams/page_31.png') },
];

function ZoomableImage({ source }: { source: ReturnType<typeof require> }) {
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const isZoomed = useRef(false);
  const lastTap = useRef(0);
  const lastX = useRef(0);
  const lastY = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => isZoomed.current && (Math.abs(g.dx) > 2 || Math.abs(g.dy) > 2),
      onPanResponderGrant: () => {
        translateX.setOffset(lastX.current);
        translateY.setOffset(lastY.current);
        translateX.setValue(0);
        translateY.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        if (isZoomed.current) {
          translateX.setValue(gestureState.dx);
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        translateX.flattenOffset();
        translateY.flattenOffset();
        lastX.current = (translateX as any)._value ?? 0;
        lastY.current = (translateY as any)._value ?? 0;

        // Double-tap detection
        const now = Date.now();
        if (now - lastTap.current < 300) {
          lastTap.current = 0;
          if (isZoomed.current) {
            isZoomed.current = false;
            lastX.current = 0;
            lastY.current = 0;
            Animated.parallel([
              Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
              Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
              Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
            ]).start();
          } else {
            isZoomed.current = true;
            Animated.spring(scale, { toValue: 2.5, useNativeDriver: true }).start();
          }
        } else {
          lastTap.current = now;
        }
      },
    })
  ).current;

  return (
    <View style={zoomStyles.container} {...panResponder.panHandlers}>
      <Animated.Image
        source={source}
        style={[zoomStyles.image, { transform: [{ scale }, { translateX }, { translateY }] }]}
        resizeMode="contain"
      />
      <View style={zoomStyles.hint} pointerEvents="none">
        <Text style={zoomStyles.hintText}>Double-tap to zoom · Drag to pan</Text>
      </View>
    </View>
  );
}

const zoomStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width, height },
  hint: { position: 'absolute', bottom: 40 },
  hintText: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
});

export default function ControlsScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft color="#1a1a1a" size={22} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Camera Controls</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.hint}>Tap a diagram · Double-tap to zoom</Text>
        {DIAGRAMS.map((d, i) => (
          <TouchableOpacity key={i} style={styles.card} onPress={() => setSelected(i)} activeOpacity={0.85}>
            <Text style={styles.cardTitle}>{d.title}</Text>
            <Image source={d.image} style={styles.thumbnail} resizeMode="contain" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={selected !== null} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <View style={styles.modalBg}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setSelected(null)}>
            <X color="#fff" size={22} strokeWidth={2.5} />
          </TouchableOpacity>
          {selected !== null && <ZoomableImage source={DIAGRAMS[selected].image} />}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
    gap: 12,
  },
  backBtn: { padding: 2 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1a1a1a', letterSpacing: -0.3 },
  scroll: { padding: 16, gap: 14 },
  hint: { fontSize: 13, color: '#aaa', textAlign: 'center', marginBottom: 4 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  thumbnail: { width: '100%', height: 220 },
  modalBg: { flex: 1, backgroundColor: '#000' },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 8,
  },
});
