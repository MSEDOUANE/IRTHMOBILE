import { AppFlow } from '../../translations/ar.json';
import { GetTexts } from '../Helpers/Helper';

import { call } from './NetworkUtils';
import memoize from "lodash.memoize"; // Use for caching/memoize for better performance
import * as RNLocalize from "react-native-localize";
import { I18nManager } from 'react-native';
import i18n from "i18n-js";
import GLOBAL from '../global'
import { getData } from './StorageUtils';
import RNRestart from "react-native-restart";



export const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
);

export const setI18nConfig = (l, r, t = null) =>
{
  const translationGetters = {
    // lazy requires (metro bundler does not support symlinks)    
    lang: () => l
  };
  // fallback if no available language fits
  var languageTag, isRTL;
  console.log(translationGetters['lang']());

  languageTag = r.split("-")[0] ?? 'ar';
  isRTL = languageTag == 'ar';

  // clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);
  // set i18n-js config
  i18n.translations = {
    [languageTag]: translationGetters['lang']()
  };
  i18n.locale = languageTag;

  console.log(i18n.locales.get());
  t && RNRestart.Restart();

};

export const getDeviceLang = () =>
{
  const fallback = { languageTag: "ar", isRTL: true };
  const translationGetters = ['ar', 'fr'];
  const { languageTag, isRTL } =
    RNLocalize.findBestAvailableLanguage(translationGetters) ||
    fallback;

  return languageTag;
}
export const getLangugeJson = async (m = null) =>
{

  var t;

  await call(GetTexts, { "code": m ?? "ar-AR", "area": "Main" }).then(json =>
  {
    var texts = {};
    json.forEach(t =>
    {
      texts[t.key] = t.text;
    });
    t = texts;
  });
  return t;
  // await call(GetTexts, { code: 'fr-FR', area: 'Main' }).then(json =>
  // {
  //     var texts;
  //     json.forEach(t =>
  //     {
  //         texts[t.key] = t.text;
  //     });
  //     GLOBAL.screen1.setState({
  //         textsFR: texts
  //     });
  // });
}