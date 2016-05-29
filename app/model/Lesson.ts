import {Student} from "./Student";
import {Moment} from "~moment/moment";

// Extension of Lesson to manipulate and display - built in AgendaService
export interface AgendaEntry extends Lesson {
	durationReadable?:string;
	start?:Moment; // date, converted to moment
	startReadable?:string; // start, formatted to display
	end?:Moment; // start + duration, converted to moment
	endReadable?:string; // end, formatted to display
	dateReadable?:string;
	priceReadable?:string;
	repetitionReadable?:string;
	repetEndReadable?:string;
	repetEnd?:Moment;
	marginTopBottom?:string; // display info
    student?:Student; // ref to the student having the lesson
	adjacent?:boolean; // true if this lesson is immediately following another lesson.
}

export const Freq = {
	NONE: 0, // or falsy (undefined, null, false...)
	DAILY: 1,
	WEEKLY: 2,
	BIWEEKLY: 3,
	MONTHLY: 4,
	// BIMONTHLY: 5
};

// Stored in DB
export interface Lesson {
	studentId?:string;
	date:string; // Date.toJSON(), cf http://stackoverflow.com/questions/10286204/the-right-json-date-format
	duration?:number; // in minutes
	repetition?:number; // Freq.*
	repetitionEnd?:string; // Date.toJSON()
	// discount for this lesson = variation of price to take into account in the total
}

export interface FreqChoice {
	id:number;
	label:string;
}

// export interface AgendaEntryOrdered {
//     agendaEntry:AgendaEntry;
//     duration:number; // in minutes
// }
