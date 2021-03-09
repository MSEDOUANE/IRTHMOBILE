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
    I18nManager,
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
import { getDeviceLang, getLangugeJson, setI18nConfig, translate } from './app/Ultils/TranslateUtils';

import
{
    Header,
    LearnMoreLinks,
    Colors,
    DebugInstructions,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import CheckBox from '@react-native-community/checkbox';
import Accordion from './app/Components/Accordian';
import { HeritageScreen } from './app/Screens/HeritageScreen';
import { AppFlow } from './app/Navigation/Navigation';
import * as RNLocalize from "react-native-localize";
import i18n from "i18n-js";
import memoize from "lodash.memoize"; // Use for caching/memoize for better performance
import { getData, storeData } from './app/Ultils/StorageUtils';
import
{
    isNetworkAvailable as isNetAvail,
    addNetworkCheckListener,
    removeNetworkCheckListener,
    call
} from './app/Ultils/NetworkUtils';
import { NoInternet } from './app/Screens/NoInternet';
import { Loading } from './app/Components/Loading';
import SplashScreen from 'react-native-splash-screen';
import { getLangTagFromLangCode } from './app/Helpers/Helper';

export default class App extends Component
{

    constructor(props)
    {
        super(props);
        GLOBAL.screen1 = this;
        GLOBAL.screen1.state = {};

        const languageTag = getDeviceLang();

        const translationGetters = {
            // lazy requires (metro bundler does not support symlinks)
            ar: require("./translations/ar.json"),
            fr: require("./translations/fr.json")
        };
        var l = translationGetters[languageTag];
        setI18nConfig(l, getLangTagFromLangCode(languageTag));
        //check network
        this.isNetworkAvailableBinder = this.isNetworkAvailableBinder.bind(this);


    }

    componentDidMount()
    {
        addNetworkCheckListener(this.isNetworkAvailableBinder);
        RNLocalize.addEventListener("change", this.handleLocalizationChange);
    }

    componentWillUnmount()
    {
        RNLocalize.removeEventListener("change", this.handleLocalizationChange);
        this.isNetworkAvailableBinder();
    }

    handleLocalizationChange = () =>
    {

        getLangugeJson("fr-FR").then(r => 
        {
            console.log(r);
            setI18nConfig(r);
            this.forceUpdate();
        });
    };

    isNetworkAvailableBinder(state)
    {
        // Check isConnected for IOS
        if (state && state.isInternetReachable)
        {
            //alert("Connected to internet");
            this.setState({ show: true });
        }
        else
        {
            //alert(" Not connected to internet");
            this.setState({ show: false });
        }
    }

    render()
    {
        // init app
        if (this.state.show)
        {
            SplashScreen.hide();
            return (
                <AppFlow >
                </AppFlow>
            );
        } else if (this.state.show === undefined)
        {
            return (
                <Loading>
                </Loading>
            );
        } else if (this.state.show === false)
        {
            return (
                <NoInternet>
                </NoInternet>
            );
        }

    }


}