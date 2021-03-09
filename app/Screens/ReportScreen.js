import React, { Component } from 'react';
import
{
    View,
    Text,
    Image,
} from 'react-native';
import { translate } from '../Ultils/TranslateUtils';
import { WebView } from 'react-native-webview';

export class ReportScreen extends Component
{
    constructor(props)
    {
        super(props)
    }




    render()
    {
        return (<View style={{ flex: 1, flexDirection: 'row' }}>
            <WebView
                source={{ html: this.props.route.params.htmlReport }}
            />
        </View>);
    }

    retry()
    {
    }


}
