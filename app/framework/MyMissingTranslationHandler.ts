import {MissingTranslationHandler} from "ng2-translate/ng2-translate";
import {Conf} from "../config/Config";

export class MyMissingTranslationHandler implements MissingTranslationHandler {
	handle(key: string) {
		return 'MISSING TRANSLATION: ' + Conf.lang;
	}
}
