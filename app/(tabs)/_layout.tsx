import { Tabs } from 'expo-router';
import { Calendar, Clock, Plus, Settings, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3cc743c7',
        tabBarInactiveTintColor: '#858585a9',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5E7',
          height: 88,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
       <Tabs.Screen
        name="index"
        options={{
          title: 'schedule',
          tabBarIcon: ({ size, color }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'add med',
          tabBarIcon: ({ size, color }) => (
            <Plus size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: 'log',
          tabBarIcon: ({ size, color }) => (
            <Clock size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'settings',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
