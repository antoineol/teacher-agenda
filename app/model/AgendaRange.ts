import {Moment} from "moment";
import moment = require("moment");


export class AgendaRange {
	start:Moment;
	end:Moment;
	static prevDay(range:AgendaRange) {
		return {start: range.start.clone().subtract(1, 'd'), end: range.end.clone().subtract(1, 'd')};
	}
	static nextDay(range:AgendaRange) {
		return {start: range.start.clone().add(1, 'd'), end: range.end.clone().add(1, 'd')};
	}
}
