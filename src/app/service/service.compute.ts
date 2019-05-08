
import { Injectable} from '@angular/core';
import { HttpClient , HttpResponse , HttpHeaders } from 'node_modules/@angular/common/http';

import 'rxjs/add/operator/toPromise';
// import 'rxjs/add/operator/map'

@Injectable()
export class ComputeService {

    private computeURL = '/compute/';
    private headers = new Headers({ 'Content-Type': 'application/json' });

    constructor(private http: HttpClient) { }

    launchCompute(state) {
        return this.http.put(this.computeURL, state)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }
    // convert response -> json file 
    private extractData(res: Response) {
        return res.json();
    }
    // check error 
    private handleError(err: Response | any) {
        console.log(err)
    }
}
