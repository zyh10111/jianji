import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import ErrorBoundary from './src/components/ErrorBoundary';
import HomeScreen from './src/screens/HomeScreen';
import NoteDetailScreen from './src/screens/NoteDetailScreen';
import CreateNoteScreen from './src/screens/CreateNoteScreen';
import SearchScreen from './src/screens/SearchScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ErrorBoundary>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4A90E2',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: '简记 NoteEase' }}
          />
          <Stack.Screen 
            name="CreateNote" 
            component={CreateNoteScreen}
            options={{ title: '创建笔记' }}
          />
          <Stack.Screen 
            name="NoteDetail" 
            component={NoteDetailScreen}
            options={{ title: '笔记详情' }}
          />
          <Stack.Screen 
            name="Search" 
            component={SearchScreen}
            options={{ title: '搜索笔记' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
}
