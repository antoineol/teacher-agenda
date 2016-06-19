import humanizeDuration = require('humanize-duration');
import {Utils} from "../business/Utils";
import {Freq} from "../model/Lesson";

export class Conf {
	static defaultLang = 'en';
	static defaultLessonFrequency = Freq.WEEKLY;

	static lang = /(fr|en|zh)/gi.test(Utils.browserLang) ? Utils.browserLang : 'en';
	static langMoment = Conf.lang.replace('zh', 'zh-CN');
	static langHumanize = Conf.lang.replace('zh', 'zh-CN');

	static currency = 'CNY';

	static stub = false;

	static humanizeDuration = humanizeDuration.humanizer({
		language: Conf.langHumanize
	});
}
