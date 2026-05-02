import { Tabs } from 'expo-router';
import { MessageCircle, BookOpen, Lightbulb } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1a1a1a',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#ebebeb',
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#1a1a1a',
        headerTitleStyle: { fontWeight: '800', fontSize: 20, letterSpacing: -0.3 },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ask',
          headerTitle: 'AskFuji',
          tabBarIcon: ({ color }) => <MessageCircle color={color} size={24} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="cheatsheets"
        options={{
          title: 'Cheatsheets',
          tabBarIcon: ({ color }) => <BookOpen color={color} size={24} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="tips"
        options={{
          title: 'Tips',
          tabBarIcon: ({ color }) => <Lightbulb color={color} size={24} strokeWidth={2} />,
        }}
      />
    </Tabs>
  );
}
