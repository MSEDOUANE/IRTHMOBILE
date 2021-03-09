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
    Alert,
    Modal,
    Button,
    Platform,
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
import
{
    call
} from '../Ultils/NetworkUtils';
import CheckBox from '@react-native-community/checkbox';
import Accordion from '../Components/Accordian';
import { GetResultatEviction } from '../Helpers/Helper';
import NetInfo from "@react-native-community/netinfo";
import { translate } from '../Ultils/TranslateUtils';

export class HeritageScreen extends Component
{

    updateMenu(d)
    {
        var i, m;
        m = this.state.menu.slice();
        m.forEach(el =>
        {

            if ((i = el.data.findIndex(e => e.clien == d.codelien)) >= 0)
            {
                el.data[i].enable = !d.lienEvince;
            }
        });
        this.menu = m;
    }

    constructor(props)
    {
        super(props);
        console.log(JSON.stringify(props));
        // construct accordion list
        this.state = {
            menu: [
                {
                    title: 'menuHeritageConjoints',
                    data: [
                        { clien: 1, lien: 'menuHeritageEpoux', value: false, nbrHeritier: 0, enable: true, noDisplayNbr: true },
                        { clien: 2, lien: 'menuHeritageEpouse', value: false, nbrHeritier: 0, enable: true },
                    ]
                },
                {
                    title: 'menuHeritageDescendants',
                    data: [
                        { clien: 3, lien: 'menuHeritageFils', value: false, nbrHeritier: 0, enable: true },
                        { clien: 4, lien: 'menuHeritageFille', value: false, nbrHeritier: 0, enable: true },
                        { clien: 5, lien: 'menuHeritageFilsFils', value: false, nbrHeritier: 0, enable: true },
                        { clien: 6, lien: 'menuHeritageFilleFils', value: false, nbrHeritier: 0, enable: true },
                        { clien: 24, lien: 'menuHeritageFilsFilsFils', value: false, nbrHeritier: 0, enable: true },
                        { clien: 25, lien: 'menuHeritageFilleFilsFils', value: false, nbrHeritier: 0, enable: true },
                    ]
                },
                {
                    title: 'menuHeritageAscendants',
                    data: [
                        { clien: 7, lien: 'menuHeritagePere', value: false, nbrHeritier: 0, enable: true, noDisplayNbr: true },
                        { clien: 8, lien: 'menuHeritageGpere', value: false, nbrHeritier: 0, enable: true, noDisplayNbr: true },
                        { clien: 9, lien: 'menuHeritageMere', value: false, nbrHeritier: 0, enable: true, noDisplayNbr: true },
                        { clien: 10, lien: 'menuHeritageGmeremat', value: false, nbrHeritier: 0, enable: true, noDisplayNbr: true },
                        { clien: 11, lien: 'menuHeritageGperepat', value: false, nbrHeritier: 0, enable: true, noDisplayNbr: true },
                    ]
                },
                {
                    title: 'menuHeritageFreresSoeurs',
                    data: [
                        { clien: 12, lien: 'menuHeritageFrere', value: false, nbrHeritier: 0, enable: true },
                        { clien: 13, lien: 'menuHeritageSoeur', value: false, nbrHeritier: 0, enable: true },
                        { clien: 14, lien: 'menuHeritageFilsFrere', value: false, nbrHeritier: 0, enable: true },
                        { clien: 15, lien: 'menuHeritageFrereCons', value: false, nbrHeritier: 0, enable: true },
                        { clien: 16, lien: 'menuHeritageSoeurCons', value: false, nbrHeritier: 0, enable: true },
                        { clien: 17, lien: 'menuHeritageFilsFrereCons', value: false, nbrHeritier: 0, enable: true },
                        { clien: 18, lien: 'menuHeritageFrereUterin', value: false, nbrHeritier: 0, enable: true },
                        { clien: 19, lien: 'menuHeritageSoeurUterin', value: false, nbrHeritier: 0, enable: true }
                    ]
                },
                {
                    title: 'menuHeritageOncles',
                    data: [
                        { clien: 20, lien: 'menuHeritageOncle', value: false, nbrHeritier: 0, enable: true },
                        { clien: 21, lien: 'menuHeritageFilsOncle', value: false, nbrHeritier: 0, enable: true },
                        { clien: 22, lien: 'menuHeritageOncleCons', value: false, nbrHeritier: 0, enable: true },
                        { clien: 23, lien: 'menuHeritageFilsOncleCons', value: false, nbrHeritier: 0, enable: true },
                    ]
                },
            ]
        };

        this.handleFieldsChange = this.handleFieldsChange.bind(this);
    }

    render()
    {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View >{/* check if there is connection display accordion or display no onternet screen */}
                        {this.renderAccordians()}
                    </View>
                </ScrollView>
                {
                    <View style={styles.calculButon}>
                        <Button
                            title={translate('mobileCalculate')}
                            onPress={() => //onpress = onclick
                                this.props.navigation.push('Result', { data: this.caseTable }) /* navigate to screen called 'result' *see navigation.js*/}
                        />
                    </View>
                }
            </View>
        );

    }

    // consrtuct array size 25
    handleFieldsChange(d)
    {
        this.t = this.t ? this.t : [];
        d.forEach(el =>
        {
            this.t[el.clien] = parseInt(el.nbrHeritier);

        });

        this.evinceCtrl();
    }

    // not working
    evinceCtrl()
    {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");


        var array = new Array(25), j = 1;
        for (var i = 0; i < 25; i++)
        {
            if (this.t[j])
            {
                array[i] = this.t[j];
            } else
            {
                array[i] = 0;
            }
            j++;
        }

        this.caseTable = array;
        call(GetResultatEviction, { "t": array, "Langue": "fr-FR" }).then(json =>
        {
            let rslt = JSON.parse(json.d);
            var m = this.state.menu.slice();
            console.log(rslt);
            rslt.forEach((el, i) =>
            {
                this.updateMenu(el);
            });
            this.setState({ menu: this.menu });
            console.log('done');
        })

    }

    // render accordion part
    renderAccordians = () =>
    {
        const items = [];
        for (var item of this.state.menu)
        {
            items.push(
                <Accordion
                    type='Heritage'
                    title={item.title}
                    data={item.data}
                    onChange={this.handleFieldsChange}
                    onCalcul={() => this.getCalculResult.bind(this)}
                />
            );
        }
        return items;
    }


}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    container: {
        flex: 1,
        paddingTop: 20,
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
    calculButon: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'

    },

});

