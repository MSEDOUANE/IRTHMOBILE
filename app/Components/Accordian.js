import React, { Component } from 'react';
import { View, TouchableOpacity, Text, FlatList, StyleSheet, LayoutAnimation, Platform, UIManager, TextInput, Image } from "react-native";
import { Color } from '../Helpers/Colors';
import Icon from "react-native-vector-icons/MaterialIcons";
import CheckBox from '@react-native-community/checkbox';
import { PieChart } from 'react-native-chart-kit';
import { chartConfig } from '../Helpers/ChartConfig';
import { TextInputPH } from '../Helpers/Helper';
import InputSpinner from "react-native-input-spinner";
import { translate } from '../Ultils/TranslateUtils';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default class Accordian extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            data: props.data,
            expanded: false,
        }
        this.handleChange = this.handleChange.bind(this);

        if (Platform.OS === 'android')
        {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    // handle inputs changes
    handleChange()
    {
        this.props.onChange(this.state.data);
    }

    childFunction = (e) =>
    {
        e.preventDefault();
        const temp = this.state.data.slice();
        this.setState({ data: temp });
        this.props.onCalcul(temp);
    }

    // render accordion
    render()
    {
        switch (this.props.type)
        {// type of accordion
            case 'Heritage':
                return (<View>
                    {this.AccordianHeritage()}
                </View>);
            case 'Result':
                return (<View>
                    {this.AccordianResult()}
                </View>);
        }
    }
    // onClick 
    // index : item index in accordion
    // update value of item in accordion (inheritor exist or no)
    onClick = (index) =>
    {
        const temp = this.state.data.slice();
        var v;
        temp[index].value = !temp[index].value;
        temp[index].value ? v = '1' : v = '';
        this.setState({ data: temp });
        this.onChangeText(v, index)
    }

    //onChangeText
    //t: current typed text
    //i: index of changed item in accordion
    //update value of input number in accordion(number of inheritors )
    onChangeText = (t, i) =>
    {
        const temp = this.state.data.slice();
        temp[i].nbrHeritier = t;
        this.setState({ data: temp });
        this.handleChange();
    }

    //onDecrease
    //t: current typed text
    //i: index of changed item in accordion
    //decrease value of input number in accordion(number of inheritors )   
    onDecrease = (t, i) =>
    {
        const temp = this.state.data.slice();
        t--;
        temp[i].nbrHeritier = t;
        this.setState({ data: temp });
        this.handleChange();
    }

    //onIncrease
    //t: current typed text
    //i: index of changed item in accordion
    //increase value of input number in accordion(number of inheritors )   
    onIncrease = (t, i) =>
    {
        const temp = this.state.data.slice();
        t++;
        temp[i].nbrHeritier = t;
        this.setState({ data: temp });
        this.handleChange();
    }

    //expand or collapse clicked panel
    toggleExpand = () =>
    {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({ expanded: !this.state.expanded })
    }

    AccordianHeritage()
    {
        return (
            <View>
                <TouchableOpacity style={styles.row} onPress={() => this.toggleExpand()/*expand or collapse clicked panel*/}>
                    <Text style={[styles.title]}>{translate(this.props.title)}</Text>
                    <Icon name={this.state.expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} color={Color.DARKGRAY} />
                </TouchableOpacity>
                <View style={styles.parentHr} />
                {
                    this.state.expanded &&
                    <View style={{}} >
                        {/*rendering basic lists (repeater in metax)*/}
                        <FlatList
                            data={this.state.data}
                            numColumns={1}
                            scrollEnabled={false}
                            renderItem={({ item, index }) =>
                                // START item to repeat
                                <View style={[styles.childRow, styles.button, styles.childHrInv, item.value ? styles.btnActive : styles.btnInActive]}>
                                    <TouchableOpacity style={[styles.row, styles.childHrInv]} onPress={() => this.onClick(index)}>
                                        <CheckBox name={'check-circle'} size={24} value={item.value} onValueChange={() => this.onClick(index)} tintColors={{ true: Color.GREEN, false: Color.LIGHTGRAY }} />
                                        <Text style={[styles.font, styles.itemInActive, styles.lien, !item.enable ? styles.evince : styles.noEvince]} >{translate(item.lien)}</Text>
                                    </TouchableOpacity>
                                    {!item.noDisplayNbr ? <InputSpinner max={50} min={0} step={1} colorMax={"#f04048"} colorMin={"#f04048"} value={item.nbrHeritier} style={styles.spinner} buttonStyle={styles.spinnerButton} editable={!item.value} disabled={!item.value} keyboardType="number-pad"
                                        onChange={(num) =>
                                        {
                                            this.onChangeText(num, index)
                                        }}
                                        onDecrease={(num) =>
                                        {
                                            this.onDecrease(num, index)
                                        }}
                                        onIncrease={(num) =>
                                        {
                                            this.onIncrease(num, index)
                                        }}
                                    /> // END item to repeat
                                        : <View />}
                                    {this.state.stripe = !this.state.stripe}


                                </View>
                            } />
                    </View>
                }
            </View>
        );
    }

    AccordianResult()
    {

        return (
            <View>
                <View style={styles.listItem}>
                    <TouchableOpacity style={styles.row} onPress={() => this.toggleExpand()}>
                        {/*PieChart display inheritor quota */}
                        <PieChart
                            data={[this.state.data, { color: 'white', quotaFraction: 100 - this.state.data.quotaFraction }]}
                            height={60}
                            width={60}
                            accessor="quotaFraction"
                            backgroundColor="transparent"
                            paddingLeft="15"
                            chartConfig={chartConfig}
                            absolute
                            hasLegend={false} />
                        <View style={[styles.infoContainer]}>
                            <Text style={{ fontWeight: "bold",color:Color.WHITE }}>{this.state.data.name + "(" + this.state.data.nbh + ")"}</Text>
                        </View>
                        <View>
                            <Icon name={this.state.data.evince ? 'block' : 'done'} size={30} color={this.state.data.evince ? Color.EVINCE : Color.GREEN} />
                        </View>
                        <TouchableOpacity style={styles.quotaDisplay}>
                            <Text style={{ fontWeight: "bold",color:Color.WHITE }}>{this.state.data.quota}</Text>
                        </TouchableOpacity>
                        <Icon name={this.state.expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} color={Color.DARKGRAY} />
                    </TouchableOpacity>
                </View>
                <View style={styles.parentHr} />
                {
                    this.state.expanded &&
                    <Card>
                        <Card.Content>
                            <Paragraph>{translate('menuHeritagePartTotale') + ' : ' + this.state.data.quota}</Paragraph>
                            <Paragraph>{translate('menuHeritageNbHeritiers') + ':' + this.state.data.nbh}</Paragraph>
                            <Paragraph>{translate('menuHeritagePartUnitaire') + ' : ' + this.state.data.quotaUnit}</Paragraph>
                            <Paragraph> {this.props.data.comment} </Paragraph>
                        </Card.Content>
                    </Card>
                }
            </View>
        );
    }

}




const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        width: '100%',
        height: 54,
        alignItems: 'center',
        paddingLeft: 35,
        paddingRight: 35,
        fontSize: 12,
    },
    spinner: {
        width: '100%',
        height: 54,
        alignItems: 'center',
        paddingLeft: 35,
        paddingRight: 35,
        fontSize: 60,
    },
    spinnerButton: {
        height: 35,
        width: 35,
        backgroundColor:Color.HALFDARKGRAY
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Color.WHITE,
    },
    itemActive: {
        fontSize: 12,
        color: Color.GREEN,
    },
    itemInActive: {
        fontSize: 12,
        color: Color.DARKGRAY,
    },
    btnActive: {
        borderColor: Color.GREEN,
    },
    btnInActive: {
        borderColor: Color.DARKGRAY,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 60,
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'center',
        backgroundColor: Color.SECONDARY,
    },
    childRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Color.GRAY,
    },
    parentHr: {
        height: 1,
        color: Color.WHITE,
        width: '100%'
    },
    childHr: {
        backgroundColor: Color.LIGHTGRAY,
        width: '100%',
    },
    childHrInv: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Color.WHITE,
    },
    colorActive: {
        borderColor: Color.GREEN,
    },
    colorInActive: {
        borderColor: Color.DARKGRAY,
    },
    evince: {
        color: Color.EVINCE
    },
    noEvince: {
        color: Color.BLACK
    }, icon: {
        width: 50,
        height: 50,
    }, infoContainer: {
        alignItems: "center",
        flex: 1
    }, quotaDisplay: {
        height: 50,
        width: 50,
        justifyContent: "center",
        alignItems: "center"
    }, comment: {
        paddingTop: 20,
    }, lien: {
        width: 80,
        color: Color.BLACK
    }
});
