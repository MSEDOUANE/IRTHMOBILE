/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect, Component } from 'react';
import { View, TouchableHighlight, Text, Modal, StyleSheet, ActivityIndicator, FlatList, TextInput, ScrollView } from "react-native";
import { PieChart } from 'react-native-chart-kit';
import Icon from "react-native-vector-icons/MaterialIcons";
import
{

    Colors
} from 'react-native/Libraries/NewAppScreen';
import { Color } from '../Helpers/Colors';
import { Dimensions } from "react-native";
import { chartConfig } from '../Helpers/ChartConfig';
import Accordion from '../Components/Accordian';
import { GenerateTraitementReport, getCalculResult, getLangTagFromLangCode, getRandomColor, GetTexts, renderContent, sendRenview } from '../Helpers/Helper'
import { color } from 'react-native-reanimated';
import { call, downloadFile, getFileContent } from '../Ultils/NetworkUtils';

import GLOBAL from '../global'
import { FAB, Portal, Provider } from 'react-native-paper';
import BottomSheet from 'reanimated-bottom-sheet';
import i18n from "i18n-js";
import { translate } from '../Ultils/TranslateUtils';
import RNFetchBlob from 'rn-fetch-blob'
import { requestStoragePermission } from '../Ultils/StorageUtils';
import { WebView } from 'react-native-webview';

const screenWidth = Dimensions.get("window").width;


export class ResultScreen extends Component
{
    // ref = useRef(null);

    constructor(props)
    {
        super(props);
        this.state = {
            data: props.route.params.data,
            modalVisible: false,
            modalReportVisible: false
        };
        this.state.isLoading = true;

    }
    getRandomColor()
    {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++)
        {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    componentDidMount()
    {
        var d = this.state.data;
        this.getCalculResult(d);
    }

    getCalculResult = (data) =>
    {
        if (data)
        {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var array = new Array(25);
            for (var i = 0; i < 25; i++)
            {
                if (data[i])
                {
                    array[i] = data[i];
                } else
                {
                    array[i] = 0;
                }
            }

            var l = getLangTagFromLangCode(i18n.locale);
            call(getCalculResult, { "t": array, "Langue": l }).
                then(json =>
                {
                    // save orginal result
                    this.result = JSON.parse(json.d);

                    // save & adapt result for the chart
                    this.setState({
                        chartResults: this.result.calcResult.map(e => ({
                            name: e.lien,
                            clien: e.codelien,
                            color: this.getRandomColor(),
                            quota: e.quotaTotalLien.n + '/' + e.quotaTotalLien.d,
                            quotaFraction: parseFloat((parseFloat(e.quotaTotalLien.n / e.quotaTotalLien.d) * 100).toFixed(2)),
                            quotaUnit: e.quotaUnitaire.n + '/' + e.quotaUnitaire.d,
                            nbh: e.nombreHeritiers,
                            evince: e.lienEvince,
                            comment: e.commentaire,
                            legendFontColor: Color.BLACK,
                            legendFontSize: 15,
                            legend: e.codelien + "(" + e.quotaTotalLien.n + '/' + e.quotaTotalLien.d + ")"
                        }))
                    });
                    // progress bar hide
                    this.setState({ isLoading: false });
                });
        }

    }

    render()
    {
        return (
            <View style={[styles.container]}>
                <ScrollView>
                    <View style={[styles.container]}>
                        {
                            this.renderChart()
                        }
                        {this.state.isLoading &&
                            <View style={[styles.loading]}><ActivityIndicator size="large" color={Color.SECONDARY} /></View>}
                        <View >
                            {this.renderAccordians()}
                        </View>
                    </View>
                </ScrollView>
                { this.renderModel()}
                {/*{ this.state.htmlReport ? this.renderModelReport() : <View/>}*/}

                {/* <FAB
                    style={styles.fab}
                    icon="message-alert"
                    onPress={() => this.setModalVisible(true)}
                /> */}

                <Provider>
                    <Portal>
                        <FAB.Group
                            open={this.state.open}
                            icon={'plus'}
                            actions={[
                                {
                                    icon: 'file-download',
                                    label: translate('menuHeritageDownloadReportTraitement'),
                                    onPress: () => this.setModalReportVisible(true),
                                },
                                {
                                    icon: 'comment-multiple-outline',
                                    label: translate('menuHeritageTypeYourReview'),
                                    onPress: () => this.setModalVisible(true),
                                    small: false,
                                },
                            ]}
                            onStateChange={() => { }}
                            onPress={() =>
                            {
                                this.onStateChange(!this.state.open)
                            }}
                        />
                    </Portal>
                </Provider>
            </View>

        );
    }

    //renderModelReport()
    //{
    //    const PolicyHTML = require('../../assets/Report.html');

    //    return (
    //        <Modal
    //            animationType="slide"
    //            transparent={true}
    //            visible={this.state.modalReportVisible}
    //            onRequestClose={() =>
    //            {
    //                this.setModalReportVisible(!this.state.modalReportVisible);
    //            }}
    //        >
    //            <View style={styles.centeredView}>
    //                <View style={styles.modalView}>
    //                    <TouchableHighlight
    //                        style={styles.closeButton}
    //                        onPress={() =>
    //                        {
    //                            this.setModalReportVisible(false);
    //                        }}
    //                    >
    //                        <View style={[styles.horizontal]}>
    //                            <Icon name='close' size={30} color={Color.RED} />
    //                        </View>
    //                    </TouchableHighlight>
    //                    <View style={{flex: 1, flexDirection: 'row'}}>
    //                    <WebView
    //                        source={{ html: this.state.htmlReport }}
    //                        />
    //                    </View>

    //                </View>
    //            </View>
    //        </Modal>
    //    )
    //}

    renderModel()
    {

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() =>
                {
                    this.setModalVisible(!this.state.modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableHighlight
                            style={styles.closeButton}
                            onPress={() =>
                            {
                                this.setModalVisible(!this.state.modalVisible);
                            }}
                        >
                            <View style={[styles.horizontal]}>
                                <Icon name='close' size={30} color={Color.RED} />
                            </View>
                        </TouchableHighlight>
                        <Text style={styles.modalText}>{translate('email')}</Text>
                        <TextInput
                            style={{ width: "100%", borderColor: 'gray', borderWidth: 2, borderRadius: 20 }}
                            onChangeText={text => this.onChangeTextEmail(text)}
                            value={this.state.email}
                        />
                        <Text style={styles.modalText}>{translate('menuHeritageTypeYourReview')}</Text>
                        <TextInput
                            style={{ width: "100%", borderColor: 'gray', borderWidth: 2, borderRadius: 20 }}
                            multiline={true}
                            numberOfLines={4}
                            onChangeText={text => this.onChangeTextComment(text)}
                            value={this.state.comment}
                        />
                        <View style={[styles.horizontal]}>
                            <TouchableHighlight
                                style={{ ...styles.openButton, backgroundColor: Color.SECONDARY }}
                                onPress={() =>
                                {
                                    this.sendReview(!this.state.modalVisible);
                                }}
                            >
                                <Text style={styles.textStyle}>{translate('mobileSendReview')} </Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    setModalVisible = (visible) =>
    {
        this.setState({ modalVisible: visible });
    }

    setModalReportVisible = (visible) =>
    {
        //this.setState({ modalReportVisible: visible });

        if (this.result && !this.state.htmlReport)
        {
            var l = getLangTagFromLangCode(i18n.locale);

            this.result.codeLanguage = l;
            this.result.l = JSON.stringify(this.result.loggs);
            console.log(JSON.stringify(this.result));
            getFileContent(GenerateTraitementReport, this.result).then(r =>
            {
                console.log(r);
                this.setState({ htmlReport: r });
                this.props.navigation.push('Report', { htmlReport: r });
            });
        }

    }

    onStateChange = (open) =>
    {
        this.setState({ open: open });
    }


    sendReview(visible)
    {
        var model, cas = this.result.map((x) => ({
            clien: x.codelien,
            effectif: x.nombreHeritiers,
            nquota: x.quotaTotalLien.n,
            dquota: x.quotaTotalLien.d
        }));
        model = {
            email: this.state.email,
            avis: this.state.comment,
            DetailCas: cas
        };

        call(sendRenview, model).then(r =>
        {
            if (r.succ)
            {
                this.setModalVisible(visible);
            }
        });
    }

    onChangeTextEmail = (e) =>
    {
        this.setState({ email: e });
    }

    onChangeTextComment = (c) =>
    {
        this.setState({ comment: c });
    }

    downloadReport()
    {
        requestStoragePermission().then(r =>
        {
            if (r)
            {
                downloadFile("https://www.studyrama.com/IMG/pdf/exercice_maths_S_10.pdf", this.result);
            }
        })
    }


    renderAccordians = () =>
    {
        if (this.state.chartResults)
        {
            const items = [];

            this.state.chartResults.forEach(el =>
            {
                items.push(
                    <Accordion
                        type='Result'
                        data={el}
                        onChange={this.handleFieldsChange}
                        onCalcul={() => this.getCalculResult.bind(this)}
                    />
                );
            });
            return items;
        } else
        {
            return (<View />);
        }
    }

    renderChart = () =>
    {
        if (this.state.chartResults && !this.state.isLoading && !this.state.isExecuted)
        {
            this.state.isExecuted = true;
            let d = this.state.chartResults;

            return <View style={{ flex: 1,alignItems : 'center' }}>
                <PieChart
                    data={d}
                    height={220}
                    width={screenWidth}
                    accessor="quotaFraction"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    chartConfig={chartConfig}
                    absolute
                    hasLegend={false}
                />
            </View>
        } else
        {
            return (<View />);
        }

    }
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    container: {
        flex: 1,
        justifyContent: "center",
        width: "100%",
        height: "100%"
    },
    horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    },
    listItem: {
        margin: 10,
        padding: 10,
        backgroundColor: "#FFF",
        width: "80%",
        flex: 1,
        alignSelf: "center",
        flexDirection: "row",
        borderRadius: 5
    }
    ,
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
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    }, centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        width: 300,
        height: 300,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        margin: 20,
        padding: 20,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }, closeButton: {
        position: 'absolute',
        margin: 16,
        left: 0,
        top: 0,
    }, loading: {
        flex: 1,
        justifyContent: 'center'
    }, circle: {
        height: 30,
        width: 30,
        borderRadius: 1000,
    }
});
