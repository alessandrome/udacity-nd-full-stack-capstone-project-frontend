import Vue from "vue";
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const defaultLocale = process.env.VUE_APP_DEFAULT_LOCALE || 'en';
const locales = ['en'];
let messages = [];
for (let locale of locales) {
    let localeMessages = require(`./locales/${locale}`).default;
    messages[locale] = localeMessages;
    console.log({localeMessages, messages, locale})
}
let locale = process.env.VUE_APP_LOCALE && locales.indexOf(process.env.VUE_APP_LOCALE) !== -1 ? process.env.VUE_APP_LOCALE : 'en';

let i18n = new VueI18n({
  locale: defaultLocale,
  fallbackLocale: locale,
  messages
});

export default i18n;