import React, { useState, useEffect, Component } from 'react';
import
{
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Alert,
  Modal,
  Button,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Color } from '../Helpers/Colors';
import { mentionLegal } from '../Helpers/Helper';
import { getData, storeData } from '../Ultils/StorageUtils';
import { translate } from '../Ultils/TranslateUtils';

export class MentionsLegales extends Component
{
  constructor(props)
  {
    super(props)
  }

  render()
  {
    return (
      <SafeAreaView style={style.container}>
        <View>
          <Image
            style={style.logo}
            source={require('../../assets/ic_launcher.png')}>
          </Image>
        </View>
        <View style={style.center}>
          <View style={style.center}>
            <Text >{translate('irthDesc')}</Text>
          </View>
          <View style={style.center} >
            <Text style={style.center}>{translate('IrthMentionLegal')}</Text>
          </View>
        </View>
        <View style={style.row}>
          <View style={style.childRow}>
            <Button title={translate('OK')} onPress={() => { this.toHeritage() }} ></Button>
          </View>
          <View style={style.childRow}>
            <Button title={translate('readMentionLegale')} onPress={() => { this.toMentions() }} ></Button>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  toHeritage()
  {
    getData('globalConfig').then((r) =>
    {
      r.ml = true;
      storeData('globalConfig', r).then(() =>
      {
        this.props.navigation.push('mainStack');
      });
    })
  }

  async toMentions()
  {
    const supported = await Linking.canOpenURL(mentionLegal);
    if (supported)
    {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(mentionLegal);
    } else
    {
      Alert.alert(`Don't know how to open this URL: ${mentionLegal}`);
    }
  }
}



const style = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  childRow: {
    flexDirection: 'row',
    backgroundColor: Color.GRAY,
    padding: 10
  }, logo: {
    paddingTop: 30
  }, container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  }
})
