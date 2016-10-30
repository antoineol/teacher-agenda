import {Injectable} from "@angular/core";
import {StorageDao} from "./dao/storage.dao";
import {ErrorModel} from "../../shared/error.model";

const COLLECTION_ERRORS = "errors";

@Injectable()
export class ErrorDao {

	constructor(private dao:StorageDao) {
	}

	addError(error:any, friendlyErrorMessageKey:string):Promise<void> {
		// Can send the error to a tool like Crittercism here
		if (error && typeof error === 'object') {
			console.error(error.stack || error);
		} else {
			console.error(error);
		}

		let errModel:ErrorModel = {
			errorMessage: error.message || error.toString(),
			errorStack: error.stack,
			errorKey: friendlyErrorMessageKey,
			date: new Date().toJSON()
		};
		return this.dao.pushToListGlobal(COLLECTION_ERRORS, errModel);
	}
}
