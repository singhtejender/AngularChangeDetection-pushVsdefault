import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class DummyService {

    constructor(private http: HttpClient) { }

    makeRequest() {
        return this.http.get("assets/dummydata.json").toPromise();
    }
}