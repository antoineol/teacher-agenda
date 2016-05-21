import humanizeDuration = require('humanize-duration');
import {Utils} from "../business/Utils";

export class Conf {
	static defaultLang = 'en';

	static lang = /(fr|en|zh)/gi.test(Utils.browserLang) ? Utils.browserLang : 'en';

	static humanizeDuration = humanizeDuration.humanizer({
		language: Conf.lang.replace('zh', 'zh_CN')
	});
}
