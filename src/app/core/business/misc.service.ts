import {Injectable} from "@angular/core";
import {TranslateService} from "ng2-translate/ng2-translate";
import {FreqChoice, Freq} from "../../shared/lesson.model";
import {Observable} from "rxjs/Observable";
import {Conf} from "../../shared/config/Config";

@Injectable()
export class MiscService {

	private freqObs:Observable<FreqChoice[]>;
	private freqObjObs:Observable<Map<number, string>>;

	constructor(private translate:TranslateService) {
		this.freqObs = Observable.from(this.translate.getTranslation(Conf.lang).map(() => {
			return [
				{id: Freq.NONE, label: this.translate.instant('frequency.none')},
				{id: Freq.DAILY, label: this.translate.instant('frequency.daily')},
				{id: Freq.WEEKLY, label: this.translate.instant('frequency.weekly')},
				// {id: Freq.BIWEEKLY, label: this.translate.instant('frequency.biweekly')},
				{id: Freq.MONTHLY, label: this.translate.instant('frequency.monthly')},
				// {id: Freq.BIMONTHLY, label: this.translate.instant('frequency.bimonthly')}
			];
		}).toPromise());
		this.freqObjObs = Observable.from(this.translate.getTranslation(Conf.lang).map(() => {
			let m = new Map<number, string>();
			m.set(Freq.NONE, this.translate.instant('frequency.none'));
			m.set(Freq.DAILY, this.translate.instant('frequency.daily'));
			m.set(Freq.WEEKLY, this.translate.instant('frequency.weekly'));
			// m.set(Freq.BIWEEKLY, this.translate.instant('frequency.biweekly'));
			m.set(Freq.MONTHLY, this.translate.instant('frequency.monthly'));
			// m.set(Freq.BIMONTHLY, this.translate.instant('frequency.bimonthly'));
			return m;
		}).toPromise());
	}

	getFrequencies():Observable<FreqChoice[]> {
		return this.freqObs;
	}

	getFrequenciesObj():Observable<Map<number, string>> {
		return this.freqObjObs;
	}

}
