import moment = require("moment");
import Moment = moment.Moment;


export class AgendaRange {
	start:Moment;
	end:Moment;
	static prevDay(range:AgendaRange) {
		return {start: range.start.clone().subtract(1, 'd').startOf('day'), end: range.end.clone().subtract(1, 'd').endOf('day')};
	}
	static nextDay(range:AgendaRange) {
		return {start: range.start.clone().add(1, 'd').startOf('day'), end: range.end.clone().add(1, 'd').endOf('day')};
	}
	static fromDate(date:string) {
		let m = moment(date);
		return {start: m.clone().startOf('day'), end: m.clone().endOf('day')};
	}
}
