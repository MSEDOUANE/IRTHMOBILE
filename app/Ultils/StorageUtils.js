import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionsAndroid } from "react-native";
import { translate } from './TranslateUtils';
export const storeData = async (key, value) =>
{
    try
    {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(key, jsonValue)
    } catch (e)
    {
        console.log(e);
    }
}




export const getData = async (key) =>
{
    try
    {
        const jsonValue = await AsyncStorage.getItem(key)
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e)
    {
        console.log(e);
    }
}

export const requestStoragePermission = async () =>
{

    try
    {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
            title: translate('irthAppTitle'),
            message: translate('mobileWhyIrthNeedsStoragePermission'),
            buttonNegative: translate('menuHeritageCancel'),
            buttonPositive: translate('menuHeritageOk')
        }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED)
        {
            console.log("You can use the camera");
            return true;
        } else
        {
            console.log("Camera permission denied");
            return false;
        }
    } catch (err)
    {
        console.warn(err);
    }
};