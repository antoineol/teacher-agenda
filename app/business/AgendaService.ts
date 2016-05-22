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

@Injectable()
export class AgendaService {

	private static defaultStart = moment("2016-05-18T07:00:00.000Z").startOf('day');
	private static defaultEnd = moment("2016-05-18T07:00:00.000Z").endOf('day');

	private start = AgendaService.defaultStart;
	private end = AgendaService.defaultEnd;

	constructor(private agendaDao:AgendaDao) {}

	getFormattedAgenda():Observable<AgendaEntry[]> {
		return Observable.forkJoin([
			this.agendaDao.findAgenda(),
			this.agendaDao.findStudents(),
			this.agendaDao.findParameters()
		]).map((results:any[]) => {
			let agenda:AgendaEntry[] = results[0];
			let studentsArray:Student[] = results[1];
			let parameters:Parameters = results[2];

			let filteredAgenda = this.extendAndFilterAgenda(agenda, this.start, this.end, studentsArray, parameters);
			return this.formatForDisplay(filteredAgenda, parameters);
		});
	}

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
