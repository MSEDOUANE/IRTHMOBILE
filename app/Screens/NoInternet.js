import React, { Component } from 'react';
import
{
    View,
    Text,
    Image,
} from 'react-native';
import { translate } from '../Ultils/TranslateUtils';

export class NoInternet extends Component
{
    constructor(props)
    {
        super(props)
    }




    render()
    {
        return (<View style={{ flex: 1 ,padding : 40 ,justifyContent:'center',alignItems : 'center'}}>
            <Image
                style={{ width: 300, height: 300 }}
                source={require('../../assets/no-internet.png')}
            />
            <Text style={{justifyContent:'center' ,paddingTop : 10}}>{translate('noInternet') }</Text>
        </View>);
    }

    retry()
    {
    }


}
