import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {AgendaDao} from "./AgendaDao";
import {AgendaEntry, Freq} from "../model/Lesson";
import {Student} from "../model/Student";
import {Parameters} from "../model/Parameters";
import {Conf} from "../config/Config";
import {AgendaConfig} from "../config/AgendaConfig";
import {AgendaRange} from "../model/AgendaRange";
import {Slides} from "ionic-angular/index";
import {Utils} from "./Utils";
import {MiscService} from "./MiscService";
import moment = require("moment");
import _ = require("underscore");
import Moment = moment.Moment;

@Injectable()
export class AgendaService {

	// yyyy-mm-dd
	currentDate:string = AgendaConfig.defaultDate;


	constructor(private agendaDao:AgendaDao, private miscService:MiscService) {}

	getFormattedAgenda(start:Moment, end:Moment):Observable<AgendaEntry[]> {
		return Observable.combineLatest/*forkJoin*/([
			this.agendaDao.findAgenda(),
			this.agendaDao.findStudents(),
			this.agendaDao.findParameters()
		]).map((results:any[]) => {
			let agenda:AgendaEntry[] = results[0];
			let studentsArray:Student[] = results[1];
			let parameters:Parameters = results[2];
			// console.log("getFormattedAgenda callback", agenda);
			let filteredAgenda = this.extendAndFilterAgenda(agenda, start, end, studentsArray, parameters);
			// console.log("filteredAgenda", filteredAgenda);
			return this.formatForDisplay(filteredAgenda, parameters, studentsArray, true);
		});
	}

	getFormattedEntry(key:string, start:Moment):Observable<AgendaEntry> {
		return this.agendaDao.findAgendaEntry(key).mergeMap((entry:AgendaEntry) => this.formatEntry(entry, start));
	}


	// Bug: does not trigger if the animation is interrupted/paused by the user
	//  https://github.com/driftyco/ionic/issues/6676
	// Bug: sliding twice to the left if we don't call slideTo().
	//  https://github.com/driftyco/ionic/issues/6678
	updateSlideRange(ranges:AgendaRange[], slider:Slides, back:boolean, newIndex:number, slideWorkaround:boolean = true) {
		// console.log("newIndex:", newIndex);
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
		// return newRange.start.format('L');
		// console.log("newRange:", newRange, "toJSON:", newRange.start.toJSON(), "format:", newRange.start.format());
		// return newRange.start.format().substr(0, 10);//2016-05-19T00:00:00+08:00
		// toJSON: 		2016-05-18T16:00:00.000Z
		// toISOString:	2016-05-18T16:00:00.000Z
		this.currentDate = newRange.start.format().substr(0, 10);
	}

	initRanges():AgendaRange[] {
		return this.getRangesForDate(this.currentDate);

		// let defaultRange:AgendaRange = AgendaConfig.defaultRange;
		// let cachedSlidesOnOneSide:number = AgendaConfig.cachedSlidesOnOneSide;
		// let length = 2 * cachedSlidesOnOneSide + 1;
		// let ranges = new Array(length);
		// ranges[cachedSlidesOnOneSide] = defaultRange;
		// let pushedRange = defaultRange;
		// for (let i = cachedSlidesOnOneSide - 1; i >= 0; i--) {
		// 	pushedRange = AgendaRange.prevDay(pushedRange);
		// 	ranges[i] = pushedRange;
		// }
		// pushedRange = defaultRange;
		// for (let i = cachedSlidesOnOneSide + 1; i < length; i++) {
		// 	pushedRange = AgendaRange.nextDay(pushedRange);
		// 	ranges[i] = pushedRange;
		// }
		// return ranges;
	}



	getRangesForDate(date:string):AgendaRange[] {
		let currentRange:AgendaRange = AgendaRange.fromDate(date);
		let cachedSlidesOnOneSide:number = AgendaConfig.cachedSlidesOnOneSide;
		let length = 2 * cachedSlidesOnOneSide + 1;
		let ranges = new Array(length);
		ranges[cachedSlidesOnOneSide] = currentRange;
		let pushedRange = currentRange;
		for (let i = cachedSlidesOnOneSide - 1; i >= 0; i--) {
			pushedRange = AgendaRange.prevDay(pushedRange);
			ranges[i] = pushedRange;
		}
		pushedRange = currentRange;
		for (let i = cachedSlidesOnOneSide + 1; i < length; i++) {
			pushedRange = AgendaRange.nextDay(pushedRange);
			ranges[i] = pushedRange;
		}
		return ranges;
	}


	// Internal utils

	// Presentation layer
	// Only call if you need to manually apply for formatting transformation. It is already included
	// in the utils like getFormattedAgenda().
	formatEntry(entry:AgendaEntry, start:Moment):Observable<AgendaEntry> {

		return Observable.combineLatest([
			this.agendaDao.findStudents(),
			this.agendaDao.findParameters()
		]).map((results:any[]) => {
			let studentsArray:Student[] = results[0];
			let parameters:Parameters = results[1];

			return this.formatForDisplay([entry], parameters, studentsArray, false, start)[0];
		});

		// return this.agendaDao.findParameters().map((parameters:Parameters) => {
		// 	return this.formatForDisplay([entry], parameters);
		// })
	}
	private formatForDisplay(agenda:AgendaEntry[], parameters:Parameters, studentsArray:Student[], alreadyExtended:boolean, start?:Moment):AgendaEntry[] {

		// Ensure the variable normally set in extendAndFilterAgenda() are also set if the
		// format method was called without the other method.
		if (!alreadyExtended) {
			agenda = this.extendEntries(agenda, studentsArray, parameters, start);
			agenda.forEach((entry:AgendaEntry) => {
				this.extendEntryAfterFiltering(entry, start);
			})
		}

		for (let entry of agenda) {

			let durationMoment = moment.duration(entry.duration, "minutes");
			entry.durationReadable = Conf.humanizeDuration(durationMoment);
			// console.log("Set durationReadable:", entry.durationReadable, "from", durationMoment, "from", entry.duration);
			// Using humanize-duration instead of the embedded .humanize() which is not accurate enough.
			// https://github.com/moment/moment/issues/348
			// entry.durationReadable = moment.duration(entry.duration, "minutes").humanize();
			if (entry.start) {
				entry.startReadable = entry.start.format("LT");
			}
			if (entry.end) {
				entry.endReadable = entry.end.format("LT");
			}
			if (entry.date) {
				entry.dateReadable = moment(entry.date).format('L');
			}
			if (entry.price || entry.student) {
				entry.priceReadable = Utils.formatCurrency(entry.price ? entry.price : entry.student.price);
			}

			if (entry.repetition) {
				this.miscService.getFrequenciesObj().subscribe((freq:Map<number, string>) => {
					entry.repetitionReadable = freq.get(entry.repetition);
				});

				if (entry.repetEnd) {
					entry.repetEndReadable = entry.repetEnd.format('L');
				}
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
		start = start.startOf('day');
		end = end.endOf('day');

		agenda = this.extendEntries(agenda, studentsArray, parameters, start);

		// Prepare the array of weekdays displayed in the range
		let tmpDate = start.clone();
		let weekDays:number[] = [tmpDate.day()];
		let endDay = end.clone().day();
		for (let i = tmpDate.add(1, 'd').day(); i != endDay && tmpDate.isBefore(end); i = tmpDate.add(1, 'd').day()) {
			weekDays.push(i);
		}
		// console.log("weekDays:", weekDays);
		// Boolean to help to determinate if a biweekly entry is included in the range
		let moreThan2weeks = end.diff(start, 'weeks') > 2;
		// Prepare the array of month dates displayed in the range
		tmpDate = start.clone();
		let monthDates:number[] = [tmpDate.date()];
		let endDate = end.clone().date();
		for (let i = tmpDate.add(1, 'd').date(); i != endDate && tmpDate.isBefore(end); i = tmpDate.add(1, 'd').date()) {
			monthDates.push(i);
		}
		// console.log("monthDates:", monthDates);

		// Filter to display only entries in the requested range.
		agenda = agenda.filter((entry: AgendaEntry, index: number, array: AgendaEntry[]):boolean => {
			if (!entry.repetition) {
				return entry.end.isAfter(start) && entry.start.isBefore(end);
			}
			if (entry.start.isAfter(end) || (entry.repetEnd && entry.repetEnd.isBefore(start))) {
				return false;
			}
			switch (entry.repetition) {
				case Freq.DAILY:
					return true;
				case Freq.WEEKLY:
					return weekDays.indexOf(entry.start.day()) !== -1;
				// case Freq.BIWEEKLY:
				// 	return weekDays.indexOf(entry.start.day()) !== -1
				// 		&& (moreThan2weeks
				// 		|| entry.start.diff(start, 'w') % 2 === 0
				// 		|| entry.start.diff(end, 'w') % 2 === 0);
				case Freq.MONTHLY:
					return monthDates.indexOf(entry.start.date()) !== -1;

				// TODO implement other frequencies
				default:
					return false;
			}


			// if (entry.end.isBefore(start)) {
			// 	return false;
			// }
			// // entry.end.isAfter(start) true
			// if (/*entry.end.isAfter(start) && */entry.start.isBefore(end)) {
			// 	return true;
			// }
			// if (!entry.repetition) {
			// 	return false;
			// }

			//(entry.repetEnd && entry.repetEnd.isBefore(start))

			// return false;
			// return entry.end.isAfter(start) && entry.start.isBefore(end);
		});
		// Update start dates to match the displayed day
		agenda.forEach((entry: AgendaEntry) => {
			this.extendEntryAfterFiltering(entry, start);
		});
		// Sort by start date
		agenda.sort(AgendaService.compareAgendaEntriesByStartDate);
		return agenda;
	}

	private extendEntryAfterFiltering(entry:AgendaEntry, rangeStart:Moment):AgendaEntry {
		entry.start.date(rangeStart.date());
		entry.start.month(rangeStart.month());
		entry.start.year(rangeStart.year());
		entry.end.date(rangeStart.date());
		entry.end.month(rangeStart.month());
		entry.end.year(rangeStart.year());
		entry.cancelled = Utils.entryCancelled(entry);
		// console.log("entry cancelled:", entry);
		return entry;
	}

	private extendEntries(agenda:AgendaEntry[], studentsArray:Student[], parameters:Parameters, rangeStart:Moment):AgendaEntry[] {
		let students = _.indexBy(studentsArray, "$key");
		// prepare start/end/duration in entries
		// return agenda.map((_entry:AgendaEntry) => {
		// 	let entry = Object.assign({}, _entry);
		// 	// Convert student foreign key to object
		// 	if (_.isString(entry.studentId)) {
		// 		entry.student = students[<any>entry.studentId];
		// 	}
		// 	// eventually add default duration
		// 	entry.duration = entry.duration || parameters.defaultDuration;
		// 	// add momentjs objects
		// 	entry.start = moment(entry.date);
		// 	entry.end = moment(entry.start).add(entry.duration, "minutes");
		// 	if (entry.repetitionEnd) {
		// 		entry.repetEnd = moment(entry.repetitionEnd).endOf('day');
		// 	}
		// 	// moment.duration()
		// 	// agendaEntry.mDuration = moment.duration(agendaEntry.duration, 'm');
		// });

		// let agendaPerStudentId:{[studentId:string]:AgendaEntry} = {};
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
			if (entry.repetitionEnd) {
				entry.repetEnd = moment(entry.repetitionEnd).endOf('day');
			}
			// moment.duration()
			// agendaEntry.mDuration = moment.duration(agendaEntry.duration, 'm');


			// agendaPerStudentId[entry.studentId] = entry;
            //
			// let nbLessons:number;
			// switch (entry.repetition) {
			// 	case Freq.DAILY:
			// 		nbLessons = entry.start.diff(rangeStart, 'days') + 1;
			// 		break;
			// 	case Freq.WEEKLY:
			// 		nbLessons = entry.start.diff(rangeStart, 'weeks') + 1;
			// 		break;
			// 	case Freq.MONTHLY:
			// 		nbLessons = entry.start.diff(rangeStart, 'months') + 1;
			// 		break;
			// 	default:
			// 		nbLessons = 1;
			// 		break;
			// }
			// entry.toPay = entry.student.paid - nbLessons * entry.price;
		}
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
