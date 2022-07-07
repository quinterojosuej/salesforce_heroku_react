/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';
// import Toast from 'react-native-root-toast'; // need to npm purge/remove 
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { Node } from 'react';

import {URL} from '@env';

import {
  SafeAreaView,
  StyleSheet,
  View,
  Button,
  TextInput,
  FlatList,
  ActivityIndicator,
  Text,
} from 'react-native';

// const axios = require('axios'); // need to npm purge/remove
const Stack = createNativeStackNavigator();

let UserContext = createContext();

let FlashContent = createContext();

const App: () => Node = () => { // root

  const [theResponse, setTheResponse] = useState([]);
  const [username, setUsername] = useState('');
  const [currentFlash, setCurrentFlash] = useState('');
  const [beat, setBeat] = useState('');

  return (
    <UserContext.Provider value={{ Username: [username, setUsername], Flash: [currentFlash, setCurrentFlash], Beat: [beat, setBeat]}}>
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
  
  const {Username, } = useContext(UserContext);
  const [username, setUsername] = Username;
  const [password, setPassword] = useState('');

  const checkUser = async() => {
    try {
      const response = await fetch(URL + '/checkUser', {
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

        Toast.show({
          type: 'error',
          text1: 'Incorrect information provided',
          text2: 'Please try again'
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
      <Toast />
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

  const {Username, Flash, Beat} = useContext(UserContext);

  const [username, ] = Username;

  const [currentFlash, setCurrentFlash] = Flash;

  const [showBool, setShowBool] = useState(false);
  const [data, setData] = useState([]);

  const [beat, setBeat] = Beat;

  const getFlashcards = async() => {
    try {
      const call = await fetch(URL + '/flashcardsFromUser/' + username, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'userName': username
        })
      });

      let callJSON = await call.json();
      console.log('res', callJSON[0]);
      setData(callJSON);

    } catch(error) {
      console.log('error', error);

      Toast.show({
        type: 'error',
        text1: 'No study set available,',
        text2: 'go back and make one!',
      });

      setData([]);

    } finally {
      setShowBool(true);
    }
  };

  useEffect(() => {
    getFlashcards();
 }, []);

 const DATA = [
  {
    id: '1',
    title: 'First Item',
  },
  {
    id: '2',
    title: 'Second Item',
  },
  {
    id: '3',
    title: 'Third Item',
  },
];

  return (
    <SafeAreaView>
      <View>
      <View style={ styles.basicView }>
        { showBool ?  
        <FlatList 
          data={ data }
          keyExtractor={ ({ id }, index) => id }

          renderItem={({ item }) => (
              // <Text> { item.name } </Text>
              <Button title={ item.name } onPress={() => setCurrentFlash( item.content__c )} />
          )}
        /> : <ActivityIndicator />}
      </View>

      <View style={ styles.basicView }>
        <FlatList 
        data={ DATA }
        keyExtractor={ ({ id }, index) => id}

        renderItem={({ item }) => (
          // <Text> { item.title } </Text>
          <Button title={ item.title } onPress={() => setBeat(item.title)} />
        )}
        />
      </View>
      
      <Button title='Study!' onPress={() => navigation.navigate('ActualStudyScreen')} />
      <Toast />
      </View>
    </SafeAreaView>
  );
};

const ActualStudyScreen = ({ navigation, route }) => {

  const {Username, Flash, Beat} = useContext(UserContext)

  const [username, ] = Username;
  const [currentFlash, setCurrentFlash] = Flash;
  const [beat, setBeat] = Beat;

  const [initial, setInitial] = useState(true);

  const [data, setData] = useState([]);
  const [answered, setAnswered] = useState(true);

  useEffect(() => {

    if(initial) {
      let res1 = currentFlash.split(/\r?\n/); // probably wrong here
      
      setCurrentFlash(
        res1.map(val => {
          return val.split(',');
      })
      );
      setInitial(false);
    } else {

      setData(currentFlash.shift()); // maybe work?
    }
    
  }, [answered]); // if something needs to load on change, use this
    
  const beatSwitch = (param) => { // This will set the thing
    switch(param) {
      case '1':
        return <Text> TEST</Text>;
      default:
        return (
          // <View>
          //   <View  style={ styles.flexHorizontal }>
          //     <Text>TESTED </Text>
          //     <View nativeID="jj" style={ styles.circle } />
          //     <View style={ styles.circle } />
          //   </View>
          //   <View>
          //     <Text> { currentFlash } </Text>
          //   </View>
          // </View>
          <View>
            <View>
              <Button title="push me!" onPress={() => setAnswered(!answered)} />
            </View>
          </View>
        );
    }
  };

  const questionSwitch = () => { // logic for changing bool
    return (
      <View>
        <Text>question</Text>
        <Text> { data[0] } </Text>
      </View>
    )
  };

  const choiceSwitch = () => { // logic for changing bool
    return (
      <View>
        <Text>choices</Text>
        <Text> { data[1] } </Text>
      </View>
    )
  };

  return (
    <SafeAreaView>
      <View>
        <Text> inputted values: { username } { currentFlash } { beat }</Text>
      </View>

      <View>
        <View>
          <Text>Question: </Text>
          { questionSwitch() }
        </View>

        <View>
          { beatSwitch(beat) }
        </View>

        <View>
          <Text>Choices: </Text>
          { choiceSwitch() }
        </View>
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
  },
  basicView: {
    margin: 2, 
    borderWidth: 5
  },
  flexHorizontal: {
    flex:1,
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 100 / 2,
    backgroundColor: "turquoise",
  },
});

export default App;
