import { Injectable } from "@angular/core";
import { action, observable } from "mobx";

@Injectable({ providedIn: "root" })
export class UserDataStore {
    seedId = 0;

}