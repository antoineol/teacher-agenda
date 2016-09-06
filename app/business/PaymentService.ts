import {Injectable} from "@angular/core";
import {PaymentDetail, Student} from "../model/Student";
import {PaymentDao} from "./PaymentDao";
import {AgendaDao} from "./AgendaDao";
import {AgendaEntry} from "../model/Lesson";


export interface PaymentFormInfo extends PaymentDetail {
	studentChoice:Student;
}

@Injectable()
export class PaymentService {

	constructor(private paymentDao:PaymentDao, private agendaDao:AgendaDao) {
	}

	addPayment(formInfo:PaymentFormInfo):Promise<void> {
		let student:Student = formInfo.studentChoice;
		delete formInfo.studentChoice;
		let payment:PaymentDetail = formInfo;

		if (typeof payment.amount === 'string') {
			payment.amount = +payment.amount; // convert to number
		}
		return this.paymentDao.insertPayment(student, payment);
	}

	checkPayment(student:Student):Promise<void> {
		// - Get lessons (potentially multiple series) for this student
		//  + Get sum of payment history amounts
		// - Merge, sort by start date /// build an array of lessons (not series) with date (timestamp?) + amount, sort by date
		//    use moment().unix() to return the unix timestamp, moment.unix(ts) to create a moment from a unix timestamp
		// - Loop: stop when it consumed all paid amount, deduce the 'paid until' date

		// let q:Query = {
		// 	orderByChild: 'studentId',
		// 	equalTo: student.$key // TODO KO
		// };
		console.log("checkPayment"/*, student*/);
		this.agendaDao.findAgenda(/*q*/).subscribe((entries:AgendaEntry[]) => {
			// TODO KO:
			// Does not filter + trigger many times
			console.log("Entries:", entries);
		}, (err:any) => {
			console.error(err.code);
			console.error(err.stack || err);
		});

		return Promise.resolve();
	}
}
