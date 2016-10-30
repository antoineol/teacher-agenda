import * as moment from "moment";
import {IntlPolyfill} from "../core/framework/polyfills/intl.polyfill";
import {AgendaEntry, Lesson} from "./lesson.model";
import {Conf} from "./config/Config";


const possibleChars = ['abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?_-'];

// Apply polyfills
const Intl = window.Intl = window.Intl || IntlPolyfill;

class UtilsClass {
	// uuid():string {
	// 	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	// 		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	// 		return v.toString(16);
	// 	});
	// }

	browserLang:string = navigator.language.split('-')[0];

	now = moment();

	// Internationalization API
	// NumberFormat: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/NumberFormat
	formatCurrency(price:number):string {
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
	isNumeric(n:any) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	randomPassword():string {
		let password = '';
		for (let i = 0; i < 16; i += 1) {
			password += possibleChars[Math.floor(Math.random() * possibleChars.length)];
		}
		return password;
	}

	toLesson(entry:AgendaEntry):Lesson {
		return {
			$key: entry.$key,
			studentId: entry.studentId,
			price: entry.price,
			date: entry.date,
			duration: entry.duration,
			repetition: entry.repetition,
			repetitionEnd: entry.repetitionEnd,
			cancellations: entry.cancellations,
		};
	}

	truncateDatetime(datetime:string):string {
		return datetime.substr(0, 16);
	}
	truncateDate(date:string):string {
		return date.substr(0, 10);
	}

	entryCancelled(entry:AgendaEntry):boolean {
		return Array.isArray(entry.cancellations) && !!entry.cancellations.find((cancellation:string) => {
			return moment(cancellation).isSame(entry.start);
		});
	}
}
export const Utils = new UtilsClass();
