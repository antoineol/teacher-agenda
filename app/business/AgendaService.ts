import {Injectable} from "@angular/core";
import {AgendaDao} from "./AgendaDao";
import {Observable} from "rxjs/Observable";
import {AgendaEntry} from "../model/Lesson";
import * as _ from "underscore";
import {Student} from "../model/Student";
import {Parameters} from "../model/Parameters";
import {Moment} from "moment";
import moment = require("moment");
import 'rxjs/add/observable/forkJoin';
import {Conf} from "../config/Config";

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
			entry.marginTopBottom = marginCoef * ((entry.duration / parameters.defaultDuration) - 1);
		}

		// return agenda;


		let agendaWithSpaces:AgendaEntry[] = [];
		let previous:AgendaEntry;
		for (let entry of agenda) {
			if (previous) {
				if (entry.start.isAfter(previous.end)) {
					var duration = moment.duration(entry.start.diff(previous.end));
					agendaWithSpaces.push(<AgendaEntry>{
						date: previous.end,
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
		moment.update
		let students = _.indexBy(studentsArray, "id");
		// let formattedAgenda:AgendaEntry[] = [];
		// Prepare the agenda entries
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
		return agenda;
	}
}
