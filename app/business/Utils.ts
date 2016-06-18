import moment = require("moment");
import {Conf} from "../config/Config";


const possibleChars = ['abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?_-'];

export class Utils {
	// static uuid():string {
	// 	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	// 		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	// 		return v.toString(16);
	// 	});
	// }

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

	// http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
	// n is mainly intended to be a string, but it should work with any type.
	static isNumeric(n:any) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	static randomPassword():string {
		let password = '';
		for (let i = 0; i < 16; i += 1) {
			password += possibleChars[Math.floor(Math.random() * possibleChars.length)];
		}
		return password;
	}
}
