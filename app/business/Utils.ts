import moment = require("moment");


export class Utils {
	static uuid():string {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

	static browserLang:string = navigator.language.split('-')[0];

	static now = moment();
}
