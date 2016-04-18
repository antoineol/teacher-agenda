import {AgendaDao, Cache} from "./business/AgendaDao";
import {AgendaService} from "./business/AgendaService";
export const injectables:any[] = [
	AgendaDao,
	Cache,
	AgendaService
];
