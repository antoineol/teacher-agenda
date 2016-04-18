import {Injectable} from "angular2/core";
import {AgendaDao} from "./AgendaDao";
import {Observable} from "rxjs/Observable";
import {AgendaEntry} from "../model/AgendaEntry";
import * as _ from "underscore";
import {Student} from "../model/Student";
import {Parameters} from "../model/Parameters";
import {Moment} from "moment";
import moment = require("moment");
import humanizeDuration = require('humanize-duration')

@Injectable()
export class AgendaService {

	constructor(private agendaDao:AgendaDao) {}

	getFormattedAgenda(start:Moment, end:Moment):Observable<AgendaEntry[]> {
		console.log(moment.duration(2, "minutes").humanize());
		console.log(moment.duration(44, "minutes").humanize());
		console.log(moment.duration(45, "minutes").humanize());
		return Observable.forkJoin([
			this.agendaDao.findAgenda(),
			this.agendaDao.findStudents(),
			this.agendaDao.findParameters()
		]).map((results:any[]) => {
			let agenda:AgendaEntry[] = results[0];
			let studentsArray:Student[] = results[1];
			let parameters:Parameters = results[2];
			let students = _.indexBy(studentsArray, "id");
			// console.log("agenda:", agenda);
			// console.log("students:", students);
			// console.log("parameters:", parameters);
			let marginCoef = parameters.defaultDuration / 13;
			// let formattedAgenda:AgendaEntry[] = [];
			// Prepare the agenda entries
			for (let entry of agenda) {
				// Convert student foreign key to object
				if (_.isString(entry.student)) {
					entry.student = students[<any>entry.student];
				}
				// eventually add default duration
				entry.duration = entry.duration || parameters.defaultDuration;
				entry.durationReadable = humanizeDuration(moment.duration(entry.duration, "minutes"));
				// entry.durationReadable = moment.duration(entry.duration, "minutes").humanize();
				// add momentjs objects
				entry.start = moment(entry.date);
				entry.end = moment(entry.start).add(entry.duration, "minutes");
				entry.startReadable = entry.start.format("LT");
				entry.endReadable = entry.end.format("LT");
				// entry.marginCoef = marginCoef;
				entry.marginTopBottom = (entry.duration / marginCoef) - 13;
				// moment.duration()
				// agendaEntry.mDuration = moment.duration(agendaEntry.duration, 'm');
			}
			// Filter to display only entries in the requested range.
			agenda = agenda.filter((entry: AgendaEntry, index: number, array: AgendaEntry[]):boolean => {
				return entry.end.isAfter(start) && entry.start.isBefore(end);
			});

			let agendaWithSpaces:AgendaEntry[] = [];
			let previous:AgendaEntry;
			for (let entry of agenda) {
				if (previous) {
					if (entry.start.isAfter(previous.end)) {
						var duration = moment.duration(entry.start.diff(previous.end));
						agendaWithSpaces.push(<AgendaEntry>{
							date: previous.end,
							duration: duration.asMinutes(),
							durationReadable: humanizeDuration(duration)
						});
					} else {
						entry.adjacent = true;
					}
				}
				agendaWithSpaces.push(entry);
				previous = entry;
			}

			return agendaWithSpaces;
		});
	}
}
