// Add operators and methods to observables
// import 'rxjs/add/observable/forkJoin';
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/toPromise";
import "rxjs/add/operator/share";
import "rxjs/add/operator/first";
import "rxjs/add/operator/filter";
import "rxjs/add/observable/combineLatest";
import "rxjs/add/observable/of";
import "rxjs/add/observable/from";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/observable/merge";
import * as moment from "moment";
import "moment/locale/fr";
import "moment/locale/zh-cn";
import {Conf} from "../shared/config/Config";

moment.locale(Conf.langMoment);
