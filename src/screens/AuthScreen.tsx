import React, { useState } from 'react'
import { 
  Alert, 
  StyleSheet, 
  View, 
  Keyboard, 
  TouchableWithoutFeedback,
  Image,
  Text
} from 'react-native'
import { supabase } from '../utils/supabase'
import TextInput from '../components/UI/TextInput'
import Button from '../components/UI/Button' 
import Dialog from '../components/UI/Dialog'


export default function AuthScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    
    if (error) Alert.alert(error.message)
    setLoading(false)
  }
  async function signUpWithEmail() {
    setLoading(true);
    const { data: { session }, error } = await supabase.auth.signUp({
      email: signUpEmail,
      password: signUpPassword,
    });
    if (error) Alert.alert(error.message);
    if (!session) Alert.alert('Please check your inbox for email verification!');
    setLoading(false);
    setShowSignUpDialog(false);
    }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <View style={styles.container}> 
            {/* <Image source={require('../../assets/cogram.png')} style={{ width: 100, alignSelf: 'center' }} resizeMode="contain" /> */}
            <Text style={{ fontSize: 16, textAlign: 'center', fontWeight: 'bold', height: 40 }}>clone:it</Text>
            <TextInput
              onChangeText={(text: string) => setEmail(text)}
              value={email}
              placeholder="Email"
            />
            <TextInput
              onChangeText={(text: string) => setPassword(text)}
              value={password}
              password={true}
              placeholder="Password"
            />
          <View style={{ flexDirection: 'column', gap: 12, marginTop: 12 }}>
            <Button title="Sign in" onPress={signInWithEmail} disabled={loading || !email || !password} />
            <Button title="Sign up" 
            variant="text" 
            onPress={() => setShowSignUpDialog(true)} />
          </View>
        </View>
        {showSignUpDialog && (
          <Dialog
            visible={showSignUpDialog}
            onClose={() => setShowSignUpDialog(false)}
            animationType="slide"

          >
           <View style={styles.container}>
            {/* <Image source={require('../../assets/cogram.png')} style={{ width: 100, alignSelf: 'center' }} resizeMode="contain" /> */}
              {/* <View style={{ flexDirection: 'column', gap: 12, alignItems: 'center', marginTop: 30, marginBottom: 20 }}>   */}
                <Text style={{ fontSize: 16, textAlign: 'center', height: 40 }}>Please Sign up</Text>
              {/* </View> */}
              <TextInput
                onChangeText={setSignUpEmail}
                value={signUpEmail}
                placeholder="Email"
              />
              <TextInput
                onChangeText={setSignUpPassword}
                value={signUpPassword}
                placeholder="Password"
                password={true}
              />
              <View style={{ flexDirection: 'column', gap: 12, marginTop: 12 }}>
                <Button
                  title="Sign up"
                  onPress={signUpWithEmail}
                  disabled={loading || !signUpEmail || !signUpPassword}
                />
                <Button
                  title="Cancel"
                  variant="text"
                  onPress={() => setShowSignUpDialog(false)}
                />
              </View>
              </View>

          </Dialog>
        )}
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 170,
    padding: 12,
    alignSelf: 'center',
    gap: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  mt20: {
    marginTop: 50,
  },
  customButton: {
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
})