import {Injectable} from "@angular/core";
import {Student, PaymentDetail} from "./student.model";
import {COLLECTION_STUDENTS} from "./agenda.dao";
import {StorageDao} from "../../core/framework/dao/storage.dao";

const COLLECTION_PAYMENT = "paymentHistory";

@Injectable()
export class PaymentDao {

	constructor(private dao:StorageDao) {
	}

	insertPayment(student:Student, payment:PaymentDetail):Promise<void> {
		return this.dao.pushToList(COLLECTION_STUDENTS + '/' + student.$key + '/' + COLLECTION_PAYMENT, payment);
	}

}
