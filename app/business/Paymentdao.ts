import {Injectable} from "@angular/core";
import {StorageDao} from "../framework/dao/StorageDao";
import {Student, PaymentDetail} from "../model/Student";
import {COLLECTION_STUDENTS} from "./AgendaDao";

const COLLECTION_PAYMENT = "paymentHistory";

@Injectable()
export class PaymentDao {

	constructor(private dao:StorageDao) {
	}

	insertPayment(student:Student, payment:PaymentDetail):Promise<void> {
		return this.dao.pushToList(COLLECTION_STUDENTS + '/' + student.$key + '/' + COLLECTION_PAYMENT, payment);
	}

}
