import * as humanizeDuration from 'humanize-duration';
import {Freq} from "../lesson.model";
import {Utils} from "../utils";

class ConfClass {
	defaultLang = 'en';
	defaultLessonFrequency = Freq.WEEKLY;

	lang = /(fr|en|zh)/gi.test(Utils.browserLang) ? Utils.browserLang : 'en';
	langMoment = this.lang.replace('zh', 'zh-CN');
	langHumanize = this.lang.replace('zh', 'zh-CN');

	currency = 'CNY';

	stub = false;

	humanizeDuration = humanizeDuration.humanizer({
		language: this.langHumanize
	});
}
// We can create an instance here and export to avoid the static keyword everywhere
export const Conf = new ConfClass();
