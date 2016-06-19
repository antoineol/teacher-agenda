export class IntlPolyfillOptions {
	style:string;
	currency:string;
	currencyDisplay:string;
}

export class IntlPolyfill {

	constructor(private lang:string, private options:IntlPolyfillOptions) {}

	// Only style: 'currency' (RMB) is supported, and fr/en/zh as language
	static NumberFormat(lang:string, options:IntlPolyfillOptions):any {
		return new IntlPolyfill(lang, options);

		// return Intl.NumberFormat(<any>Conf.lang, {
		// 	style: 'currency',
		// 	currency: Conf.currency,
		// 	currencyDisplay: 'symbol'
		// }).format(price)
		// 	.replace('CNY', 'RMB') // CNY is the output in fr, but not the most common symbol. RMB is more natural.
		// 	;
	}

	format(amount:number):string {
		if (typeof amount === 'string') {
			amount = +amount; // convert to number
		}
		if (this.lang === 'fr') {
			return formatAmount(amount, 2, 3, ' ', ',') + ' RMB';
		} else if (this.lang === 'zh') {
			return '￥' + formatAmount(amount, 2, 3, ',', '.');
		} else {
			return 'CN¥' + formatAmount(amount, 2, 3, ',', '.');
		}
		// TODO continue from here
	}
}

/**
 * formatAmount(12345.678, 2, 3, ',', '.') // -> "12,345.68"
 * @param amount the amount to format
 * @param decimalLen The number of decimals kept
 * @param sectionLen How many figures between each sectionDelimiter (US: 3)
 * @param sectionDelimiter Which string is used as section delimiter (US: comma)
 * @param decimalDelimiter Which string is used as decimal delimiter (US: dot)
 * @returns {string}
 */
function formatAmount(amount:number, decimalLen:number, sectionLen:number, sectionDelimiter:string, decimalDelimiter:string) {
	var expr = '\\d(?=(\\d{' + (sectionLen || 3) + '})+' + (decimalLen > 0 ? '\\D' : '$') + ')',
		num = amount.toFixed(Math.max(0, ~~decimalLen));

	return (decimalDelimiter ? num.replace('.', decimalDelimiter) : num).replace(new RegExp(expr, 'g'), '$&' + (sectionDelimiter || ','));
}
