import { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronDown, ChevronUp, ChevronRight, Camera } from 'lucide-react-native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const SHEETS = [
  {
    title: 'Film Simulations',
    items: [
      { name: 'Provia/Standard', desc: 'Balanced, natural colors. Good all-rounder for any situation.' },
      { name: 'Velvia/Vivid', desc: 'Punchy saturation, high contrast. Best for landscapes and nature.' },
      { name: 'Astia/Soft', desc: 'Soft contrast, accurate skin tones. Ideal for portraits.' },
      { name: 'Classic Chrome', desc: 'Muted, faded look. Great for documentary and street photography.' },
      { name: 'Classic Neg', desc: 'High contrast, saturated shadows. Strong film feel.' },
      { name: 'Reala Ace', desc: 'Natural color, fine grain. Great everyday simulation.' },
      { name: 'Eterna Cinema', desc: 'Low saturation, lifted shadows. Cinematic video look.' },
      { name: 'Acros', desc: 'High contrast B&W with grain. The best B&W simulation.' },
      { name: 'Nostalgic Neg', desc: 'Warm highlights, faded tones. Perfect for travel and nostalgia.' },
    ],
  },
  {
    title: 'Shooting Modes',
    items: [
      { name: 'P — Program', desc: 'Camera sets aperture + shutter. Rotate the command dial to shift the program.' },
      { name: 'A — Aperture Priority', desc: 'You set the aperture, camera picks shutter speed. Best for controlling depth of field.' },
      { name: 'S — Shutter Priority', desc: 'You set the shutter speed, camera picks aperture. Best for freezing or blurring motion.' },
      { name: 'M — Manual', desc: 'Full control over both aperture and shutter speed.' },
    ],
  },
  {
    title: 'AF Modes',
    items: [
      { name: 'Single Point', desc: 'Focus on one small area. Most precise for stationary subjects.' },
      { name: 'Zone', desc: 'Focus within a defined zone. Good for moving subjects.' },
      { name: 'Wide/Tracking', desc: 'Camera picks the focus point. Good for fast action.' },
      { name: 'Face/Eye Detection', desc: 'Automatically detects and locks on faces and eyes. Best for portraits.' },
      { name: 'AF-S', desc: 'Single autofocus — locks focus when shutter is half-pressed.' },
      { name: 'AF-C', desc: 'Continuous autofocus — keeps tracking a moving subject.' },
    ],
  },
  {
    title: 'Key Custom Settings',
    items: [
      { name: 'Q Menu', desc: 'Quick access to 16 customizable settings. Hold Q button to edit which settings appear.' },
      { name: 'C1–C7', desc: 'Custom presets. Save your full camera configuration to each slot for quick switching.' },
      { name: 'Fn Buttons', desc: 'Assign any function to the Fn buttons via D BUTTON/DIAL SETTING > FUNCTION SETTING.' },
      { name: 'ISO Auto', desc: 'Set minimum shutter speed and max ISO under A SHOOTING SETTING > ISO AUTO SETTING.' },
      { name: 'Auto Update Custom', desc: 'Automatically saves changes back to your active custom setting slot.' },
    ],
  },
  {
    title: 'Image Quality',
    items: [
      { name: 'RAW', desc: 'Unprocessed sensor data. Maximum editing flexibility. Use RAF format.' },
      { name: 'JPEG Fine', desc: 'High quality compressed image. Film simulations applied in-camera.' },
      { name: 'HEIF', desc: 'Modern format with better compression than JPEG at same quality.' },
      { name: 'RAW + JPEG', desc: 'Saves both simultaneously. Best of both worlds for important shoots.' },
      { name: 'Dynamic Range', desc: 'DR100/200/400 — higher values recover more highlight detail.' },
      { name: 'D Range Priority', desc: 'Auto, Strong, Weak — intelligently adjusts tone curve for high contrast scenes.' },
    ],
  },
];

function AccordionSection({ title, items }: { title: string; items: { name: string; desc: string }[] }) {
  const [open, setOpen] = useState(false);

  function toggle() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((v) => !v);
  }

  return (
    <View style={styles.section}>
      <TouchableOpacity style={styles.header} onPress={toggle} activeOpacity={0.7}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {open
          ? <ChevronUp color="#999" size={18} strokeWidth={2.5} />
          : <ChevronDown color="#999" size={18} strokeWidth={2.5} />
        }
      </TouchableOpacity>
      {open && (
        <View style={styles.items}>
          {items.map((item, i) => (
            <View key={item.name} style={[styles.item, i < items.length - 1 && styles.itemBorder]}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDesc}>{item.desc}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default function CheatsheetsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity style={styles.controlsCard} onPress={() => router.push('/controls')} activeOpacity={0.85}>
          <View style={styles.controlsLeft}>
            <Camera color="#fff" size={20} strokeWidth={2} />
            <Text style={styles.controlsText}>Camera Controls & Diagrams</Text>
          </View>
          <ChevronRight color="rgba(255,255,255,0.6)" size={18} strokeWidth={2.5} />
        </TouchableOpacity>
        {SHEETS.map((sheet) => (
          <AccordionSection key={sheet.title} title={sheet.title} items={sheet.items} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  scroll: { padding: 16, gap: 10 },
  section: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  items: { borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  item: { padding: 14, gap: 3 },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  itemName: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  itemDesc: { fontSize: 13, color: '#666', lineHeight: 19 },
  controlsCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlsLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  controlsText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
