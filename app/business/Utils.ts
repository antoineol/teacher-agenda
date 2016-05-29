import moment = require("moment");
import {Conf} from "../config/Config";


export class Utils {
	static uuid():string {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

	static browserLang:string = navigator.language.split('-')[0];

	static now = moment();

	// Internationalization API
	// NumberFormat: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/NumberFormat
	static formatCurrency(price:number):string {
		return Intl.NumberFormat(<any>Conf.lang, {
			style: 'currency',
			currency: Conf.currency,
			currencyDisplay: 'symbol'
		}).format(price)
			.replace('CNY', 'RMB') // CNY is the output in fr, but not the most common symbol. RMB is more natural.
			;
	}
}
