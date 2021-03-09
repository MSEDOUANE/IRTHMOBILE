import { View, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export function getLangTagFromLangCode(code) {
    var up = code.toUpperCase();
    return code + "-" + up;
}

export const Delay = 1000;

const SERVERURL = "http://51.195.150.170";
const APIPORT = "8080";
const APIURL = SERVERURL + ":" + APIPORT + "/api/";

export const getCalculResult = APIURL + "GuestCalc/GetResultatCalcul";

export const GetResultatEviction = APIURL + "GuestCalc/GetResultatEviction";

export const GetTexts = APIURL + "Config/GetTexts";

export const GenerateTraitementReport = APIURL + "GuestCalc/GenerateTraitementReportPDF";

export const sendRenview = APIURL + "Review/SaveReview";

export const mentionLegal = SERVERURL + "/IRTH/?page_id=21"

export const TextInputPH = "Enter Number of ";