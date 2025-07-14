import React, { useEffect, useState } from 'react';
import { supabase } from './utils/supabase';
import AuthScreen from './screens/AuthScreen';
import TabNavigator from './navigation/AppNavigator';
import DetailScreen from './screens/DetailScreen';

import { Session } from '@supabase/supabase-js';
import { NavigationContainer } from '@react-navigation/native';


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
        <TabNavigator session={session} />
    </NavigationContainer>
  );
}