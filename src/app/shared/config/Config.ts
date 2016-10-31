import humanizeDuration from "humanize-duration";
import {Freq} from "../lesson.model";

class ConfClass {
	defaultLang = 'en';
	defaultLessonFrequency = Freq.WEEKLY;

	browserLang:string = navigator.language.split('-')[0];

	lang = /(fr|en|zh)/gi.test(this.browserLang) ? this.browserLang : 'en';
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
