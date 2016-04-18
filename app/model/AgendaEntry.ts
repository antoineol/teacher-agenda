import {Student} from "./Student";
import {Moment} from "~moment/moment";

export interface AgendaEntry {
    date:Moment;
    duration?:number; // in minutes
	durationReadable?:string;
	start?:Moment;
	startReadable?:string;
	end?:Moment;
	endReadable?:string;
	marginTopBottom?:number;
    repetition?: string[];
    student?:Student;
	adjacent?:boolean;
}

// export interface AgendaEntryOrdered {
//     agendaEntry:AgendaEntry;
//     duration:number; // in minutes
// }
