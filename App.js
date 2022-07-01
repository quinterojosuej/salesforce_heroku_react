/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { createContext, useContext, useState } from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';
import Toast from 'react-native-root-toast';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { Node } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  TextInput,
} from 'react-native';

// const axios = require('axios'); // need to npm purge/remove
const Stack = createNativeStackNavigator();

let UserContext = createContext();

const App: () => Node = () => { // root

  const [theResponse, setTheResponse] = useState([]);
  const [username, setUsername] = useState('');

  return (
    <UserContext.Provider value={[username, setUsername]}>
        <RootSiblingParent>

            <NavigationContainer>
              <Stack.Navigator>

                <Stack.Screen
                name='Home' 
                component={ InitialScreen } 
                options={{ title: 'Welcome' }} 
                />

              <Stack.Screen
                name="HomeScreen"
                component={ HomeScreen }
                />

              <Stack.Screen
                name="CreationScreen"
                component={ CreationScreen }
                options={{ title:'Creation Screen'}}
                />

              <Stack.Screen
                name="StudyScreen"
                component={ StudyScreen }
                options={{ title:'Study Screen' }}
                />

              <Stack.Screen
                name="ActualStudyScreen"
                component={ ActualStudyScreen }
                options={{ title:'Actual Study Screen' }}
                />

              </Stack.Navigator> 
            </NavigationContainer>
          
        </RootSiblingParent>
    </UserContext.Provider>
  );

};

const InitialScreen = ({ navigation }) => { // User will log in here
  
  const [username, setUsername] = useContext(UserContext)
  const [password, setPassword] = useState('')

  const checkUser = async() => {
    try {
      const response = await fetch('https://testing-salesforce-mine.herokuapp.com/checkUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'userName': username,
          'passWord': password
        })
      });

      const json = await response.json();
      console.log('check User:', json[0].username__c);
      setUsername(json[0].username__c);
      setPassword('');

      navigation.navigate('HomeScreen');

    } catch(error) {
      console.log('error:', error);

      Toast.show('Request failed to send.', {
        duration: Toast.durations.LONG,
      });
    }


  };

  return (
    <SafeAreaView>
      <View>

        <TextInput
        placeholder='user_name1'
        style={styles.inputNormal}
        onChangeText={setUsername}
        value={username}
      />

        <TextInput
        placeholder='passWord1!'
        style={styles.inputPassword}
        onChangeText={setPassword}
        secureTextEntry
        value={password}
      />
      <Button title='checkUser' onPress={() => checkUser()}/>
      {/* <Button title='getAPI' onPress={() => getAPI()}/> */}
    </View>
  </SafeAreaView>
  );
};


const HomeScreen = ({ navigation, route }) => {
  return (
    <SafeAreaView>
      <View>
        <Button title='Create!' onPress={() => navigation.navigate('CreationScreen')} />
        <Button title='Study!' onPress={() => navigation.navigate('StudyScreen')} />
      </View>
    </SafeAreaView>
  );
};

const CreationScreen = ({navigation, route }) => {

  return (
    <SafeAreaView>
      <View>

      </View>
    </SafeAreaView>
  )

};

const StudyScreen = ({ navigation, route }) => {

  const getFlashcards = async() => {
    try {
      const call = await fetch('https://testing-salesforce-mine.herokuapp.com/checkUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'userName': username
      })
      });

      const res = await call.json();
      console.log('res', res);
    } catch(error) {
      console.log('error');
    }
  };

  return (
    <SafeAreaView>
      <View>

      <Button title='Study!' onPress={() => navigation.navigate('ActualStudyScreen')} />
      </View>
    </SafeAreaView>
  );
};

const ActualStudyScreen = ({ navigation, route }) => {

  return (
    <SafeAreaView>
      <View>

      </View>

    </SafeAreaView>
  )
};



const styles = StyleSheet.create({
  inputNormal: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  inputPassword: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  }
});

export default App;
