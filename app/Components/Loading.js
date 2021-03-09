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
} from 'react-native';
import { Color } from '../Helpers/Colors';
import { translate } from '../Ultils/TranslateUtils';

export class Loading extends Component
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
                <View>
                    <Text>{translate('IRTHDesc')}</Text>
                    <Text>{translate('internetVerify')}</Text>
                </View>
                <View style={style.loading}>
                    <ActivityIndicator size="large" color={Color.SECONDARY} />
                </View>
            </SafeAreaView>
        );
    }

}

const style = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center'
    }, logo: {
        paddingTop: 30
    }, container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
