import React, { useState, useEffect, Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HeritageScreen } from '../Screens/HeritageScreen.js';
import { ResultScreen } from '../Screens/ResultScreen.js';

import { Settings } from '../Screens/Settings.js'
import { NoInternet } from '../Screens/NoInternet.js'

import NetInfo from "@react-native-community/netinfo";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getData, storeData } from '../Ultils/StorageUtils.js';
import { getLangugeJson, setI18nConfig, translate } from '../Ultils/TranslateUtils.js';
import { StatusBar } from 'react-native';
import { Color } from '../Helpers/Colors.js';
import { Loading } from '../Components/Loading.js';
import { MentionsLegales } from '../Screens/MentionsLegales.js';
import { ReportScreen } from '../Screens/ReportScreen.js';

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

const screenOptions = (title) =>
{
  const o = {
    title: translate(title),
    headerStyle: {
      backgroundColor: Color.SECONDARY,
    },
    headerTintColor: Color.WHITE,
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };
  return o;
}

export class AppFlow extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {};
    this.intiConfig();
  }

  componentDidMount()
  {
    StatusBar.setBarStyle('light-content', true)
    StatusBar.setBackgroundColor(Color.SECONDARY);
  }




  render()
  {
    // similaire to the flow in metaX
    // application flow
    return (
      this.state.langLoading ?
        <NavigationContainer>
          {
            <Stack.Navigator >
              {!this.state.ml && <Stack.Screen options={{
                headerShown: false
              }} name='mentionLegal' component={MentionsLegales} />}
              <Stack.Screen options={{
                headerShown: false
              }} name='mainStack' component={this.mainStack} />
            </Stack.Navigator>

          }
        </NavigationContainer>
        : <Loading />
    );
  }

  mainStack()
  {

    return (<Tab.Navigator>
      <Tab.Screen name="Home" component={HomeStack} options={{
        tabBarLabel: translate('backToHome'),
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home" color={color} size={size} />
        ),
      }} />
      <Tab.Screen name="Settings" component={SettingsStack}
        options={{
          tabBarLabel: translate('settings'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" color={color} size={size} />
          ),
        }} />
        
    </Tab.Navigator>);
  }





  NoInternetStack()
  {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Retry"
          component={NoInternet}
        />
      </Stack.Navigator>
    );
  }

  // screenOptions = (title) =>
  // {
  //     const o = {
  //         title: translate(title),
  //         headerStyle: {
  //             backgroundColor: Color.SECONDARY,
  //         },
  //         headerTintColor: Color.WHITE,
  //         headerTitleStyle: {
  //             fontWeight: 'bold',
  //         },
  //     };
  //     return o;
  // }

  intiConfig()
  {
    getData('globalConfig').then(r =>
    {
      if (!r)
      {
        var c = {
          lang: 'ar-AR',
          rite: 'MK',
          pays: 'MA',
          ml: false
        }
        storeData('globalConfig', c);
        return c;
      }
      return r;
    }).then(r =>
    {
      getLangugeJson(r.lang).then(l =>
      {
        console.log(r.lang);
        setI18nConfig(l, r.lang);
        this.setState({ langLoading: true, ml: r.ml });
      });
    });
  }
}

const HomeStack = () =>
{
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Heritage"
        component={HeritageScreen}
        options={{
          title: translate('irthAppTitle'),
          headerStyle: {
            backgroundColor: Color.SECONDARY,
          },
          headerTintColor: Color.WHITE,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{
          title: translate('menuHeritageResult'),
          headerStyle: {
            backgroundColor: Color.SECONDARY,
          },
          headerTintColor: Color.WHITE,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
            <Stack.Screen
        name="Report"
        component={ReportScreen}
        options={{
          title: translate('menuHeritageResult'),
          headerStyle: {
            backgroundColor: Color.SECONDARY,
          },
          headerTintColor: Color.WHITE,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      
    </Stack.Navigator>
  );
}

const SettingsStack = () =>
{
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          title: translate('settings'),
          headerStyle: {
            backgroundColor: Color.SECONDARY,
          },
          headerTintColor: Color.WHITE,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
}
