import {Injectable} from "@angular/core";
import {StorageDao} from "./dao/StorageDao";
import {ErrorModel} from "../model/ErrorModel";

const COLLECTION_ERRORS = "errors";

@Injectable()
export class ErrorDao {

	constructor(private dao:StorageDao) {
	}

	addError(error:any, friendlyErrorMessageKey:string):Promise<void> {

		let errModel:ErrorModel = {
			errorMessage: error.message || error.toString(),
			errorStack: error.stack,
			errorKey: friendlyErrorMessageKey,
			date: new Date().toJSON()
		};
		return this.dao.pushToListGlobal(COLLECTION_ERRORS, errModel);
	}
}
