import {Injectable} from "@angular/core";
import {StorageDao} from "./dao/StorageDao";
import {ErrorModel} from "../model/ErrorModel";

const COLLECTION_ERRORS = "errors";

@Injectable()
export class ErrorDao {

	constructor(private dao:StorageDao) {
	}

	addError(error:ErrorModel):Promise<void> {
		return this.dao.pushToListGlobal(COLLECTION_ERRORS, error);
	}
}
