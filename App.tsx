import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { Session } from '@supabase/supabase-js';
import { supabase } from './src/utils/supabase';
import AuthScreen from './src/screens/AuthScreen';


export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (!session) {
    return <AuthScreen />;
  }

  return (
    <NavigationContainer>
      <AppNavigator session={session}/>
    </NavigationContainer>
  );
}
