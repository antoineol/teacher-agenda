import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Moment} from "moment";
import moment = require("moment");
import _ = require("underscore");
import {AgendaDao} from "./AgendaDao";
import {AgendaEntry} from "../model/Lesson";
import {Student} from "../model/Student";
import {Parameters} from "../model/Parameters";
import {Conf} from "../config/Config";
import 'rxjs/add/observable/forkJoin';
import {AgendaConfig} from "../config/AgendaConfig";
import {AgendaRange} from "../model/AgendaRange";
import {Slides} from "ionic-angular/index";

@Injectable()
export class AgendaService {

	constructor(private agendaDao:AgendaDao) {}

	getFormattedAgenda(start:Moment, end:Moment):Observable<AgendaEntry[]> {
		return Observable.forkJoin([
			this.agendaDao.findAgenda(),
			this.agendaDao.findStudents(),
			this.agendaDao.findParameters()
		]).map((results:any[]) => {
			let agenda:AgendaEntry[] = results[0];
			let studentsArray:Student[] = results[1];
			let parameters:Parameters = results[2];

			let filteredAgenda = this.extendAndFilterAgenda(agenda, start, end, studentsArray, parameters);
			return this.formatForDisplay(filteredAgenda, parameters);
		});
	}


	// Bug: does not trigger if the animation is interrupted/paused by the user
	//  https://github.com/driftyco/ionic/issues/6676
	// Bug: sliding twice to the left if we don't call slideTo().
	//  https://github.com/driftyco/ionic/issues/6678
	updateSlideRange(ranges:AgendaRange[], slider:Slides, back:boolean, newIndex:number, slideWorkaround?:boolean = true) {
		console.log("newIndex:", newIndex);
		if (!back) { // slide forward
			while (newIndex > AgendaConfig.cachedSlidesOnOneSide) {
				newIndex--;
				let lastRange = ranges[ranges.length - 1];
				ranges.push(AgendaRange.nextDay(lastRange));
				ranges.shift();
			}
		} else {
			while (newIndex < AgendaConfig.cachedSlidesOnOneSide) {
				newIndex++;
				let firstRange = ranges[0];
				ranges.unshift(AgendaRange.prevDay(firstRange));
				ranges.pop();
				// slider.slideTo(i + 1, 0, false);
				// setTimeout(() => {
				// 	slider.slideTo(i, 300, false);
				// });
			}
		}
		if (slideWorkaround) {
			// Workaround to go to the right index; breaks the animation
			slider.slideTo(newIndex, 0, false);
		}
		// Update the date in the title
		let newRange = ranges[newIndex];
		return newRange.start.format('L');
	}

	initRanges():AgendaRange[] {
		let defaultRange:AgendaRange = AgendaConfig.defaultRange;
		let cachedSlidesOnOneSide:number = AgendaConfig.cachedSlidesOnOneSide;
		let length = 2 * cachedSlidesOnOneSide + 1;
		let ranges = new Array(length);
		ranges[cachedSlidesOnOneSide] = defaultRange;
		let pushedRange = defaultRange;
		for (let i = cachedSlidesOnOneSide - 1; i >= 0; i--) {
			pushedRange = AgendaRange.prevDay(pushedRange);
			ranges[i] = pushedRange;
		}
		pushedRange = defaultRange;
		for (let i = cachedSlidesOnOneSide + 1; i < length; i++) {
			pushedRange = AgendaRange.nextDay(pushedRange);
			ranges[i] = pushedRange;
		}
		return ranges;
	}


	// Internal utils

	// Presentation layer
	private formatForDisplay(agenda:AgendaEntry[], parameters:Parameters) {
		for (let entry of agenda) {
			let durationMoment = moment.duration(entry.duration, "minutes");
			entry.durationReadable = Conf.humanizeDuration(durationMoment);
			// Using humanize-duration instead of the embedded .humanize() which is not accurate enough.
			// https://github.com/moment/moment/issues/348
			// entry.durationReadable = moment.duration(entry.duration, "minutes").humanize();
			if (entry.start) {
				entry.startReadable = entry.start.format("LT");
			}
			if (entry.end) {
				entry.endReadable = entry.end.format("LT");
			}

			let marginCoef = 13;
			let marginTopBottom = marginCoef * ((entry.duration / parameters.defaultDuration) - 1);
			if (marginTopBottom < 0) {
				marginTopBottom = 0;
			}
			entry.marginTopBottom = marginTopBottom + 'px';
		}


		let agendaWithSpaces:AgendaEntry[] = [];
		let previous:AgendaEntry;
		for (let entry of agenda) {
			if (previous) {
				if (entry.start.isAfter(previous.end)) {
					var duration = moment.duration(entry.start.diff(previous.end));
					agendaWithSpaces.push(<AgendaEntry>{
						date: null,
						duration: duration.asMinutes(),
						// durationMoment: duration
						durationReadable: Conf.humanizeDuration(duration)
					});
				} else {
					entry.adjacent = true;
				}
			}
			agendaWithSpaces.push(entry);
			previous = entry;
		}

		return agendaWithSpaces;
	}

	private extendAndFilterAgenda(agenda:AgendaEntry[], start:Moment, end:Moment, studentsArray:Student[], parameters:Parameters):AgendaEntry[] {
		let students = _.indexBy(studentsArray, "id");
		// prepare start/end/duration in entries
		for (let entry of agenda) {
			// Convert student foreign key to object
			if (_.isString(entry.studentId)) {
				entry.student = students[<any>entry.studentId];
			}
			// eventually add default duration
			entry.duration = entry.duration || parameters.defaultDuration;
			// add momentjs objects
			entry.start = moment(entry.date);
			entry.end = moment(entry.start).add(entry.duration, "minutes");
			// moment.duration()
			// agendaEntry.mDuration = moment.duration(agendaEntry.duration, 'm');
		}
		// Filter to display only entries in the requested range.
		agenda = agenda.filter((entry: AgendaEntry, index: number, array: AgendaEntry[]):boolean => {
			return entry.end.isAfter(start) && entry.start.isBefore(end);
		});
		// Sort by start date
		agenda.sort(AgendaService.compareAgendaEntriesByStartDate);
		return agenda;
	}

	private static compareAgendaEntriesByStartDate(a:AgendaEntry, b:AgendaEntry) {
		if (a.start.isBefore(b.start))
			return -1;
		if (a.start.isAfter(b.start))
			return 1;
		return 0;
	}
}
