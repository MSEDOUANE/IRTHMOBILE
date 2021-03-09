/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

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
    ToastAndroid,
    Button,
} from 'react-native';
import { Color } from '../Helpers/Colors';
import
{
    Header,
    LearnMoreLinks,
    Colors,
    DebugInstructions,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { Picker } from '@react-native-picker/picker';
import { getData, storeData } from '../Ultils/StorageUtils';
import { getLangugeJson, setI18nConfig, translate } from '../Ultils/TranslateUtils';
import DropDownPicker from 'react-native-dropdown-picker';


export class Settings extends Component
{


    constructor(props)
    {
        super(props);
        getData('globalConfig').then(r =>
        {
            this.setState({ lang: r.lang });
            this.setState({ country: r.pay });

            console.log(r);

        });

    }

    render()
    {

        return (
            <View style={{ flex: 1, paddingTop: 50 }}>
                <View style={{ backgroundColor: Color.PRIMARY, paddingTop: 10, minHeight: 100,zIndex:1000 }}>
                    <Text style={styles.sectionTitle}> {translate('lang')}</Text>
                    <DropDownPicker
                        items={[
                            { label: translate('mobileArabic'), value: 'ar-AR' },
                            { label: translate('mobileFrench'), value: 'fr-FR' },
                        ]}
                        defaultValue={this.state && this.state.lang}
                        containerStyle={{ height: 40 }}
                        style={{ backgroundColor: '#fafafa' }}
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{ backgroundColor: '#fafafa' }}
                        onChangeItem={item => this.onlanguageChange(item.value)}
                    />
                </View>
                <View style={{ backgroundColor: Color.PRIMARY, paddingTop: 10,minHeight: 300 }}>
                    <Text style={styles.sectionTitle}> {translate('country')}</Text>
                    <DropDownPicker
                        items={[
                            { label: translate('mobileMaroc'), value: 'MA' },
                        ]}
                        defaultValue='MA'
                        containerStyle={{ height: 40 }}
                        style={{ backgroundColor: '#fafafa', paddingTop: 10 }}
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{ backgroundColor: '#fafafa' }}
                        onChangeItem={item => this.onCountryChange(item.value)}
                    />
                </View>
            </View>

        );
    }

    onlanguageChange = (itemValue) =>
    {
        this.setState({ lang: itemValue });
        var c = {
            lang: itemValue,
            rite: 'MK',
            pays: 'MA'
        }
        storeData("globalConfig", c).then(() =>
        {
            getLangugeJson(itemValue).then(r => 
            {
                console.log(r);
                setI18nConfig(r, c.lang, true);
            });
        });

    }
    onCountryChange = (itemValue) =>
    {
        this.setState({ country: itemValue });
        var c = {
            lang: this.state.lang,
            rite: 'MK',
            pays: itemValue
        }
        storeData("globalConfig", c)

    }
}




const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    container: {
        flex: 1,
        paddingTop: 5,
        backgroundColor: Color.PRIMARY,

    },
    horizontalText: {
        flex: 1,
        flexDirection: 'row',
    },
    engine: {
        position: 'absolute',
        right: 0,
    },
    body: {
        backgroundColor: Colors.white,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
        marginRight: 20
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: Colors.dark,
    },
    highlight: {
        fontWeight: '700',
    },
    footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
    },
});

