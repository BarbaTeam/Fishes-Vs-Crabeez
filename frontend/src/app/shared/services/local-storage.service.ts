import { Injectable } from '@angular/core';


/**
 * Service to ease the use of the local storage.
 */
@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    constructor() {}

    public hasData(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }

    public saveData(key: string, value: string) {
        if (value === undefined) {
            return;
        }
        localStorage.setItem(key, value);
    }

    public getData(key: string) {
        return localStorage.getItem(key)
    }
    public removeData(key: string) {
        localStorage.removeItem(key);
    }

    public clearData() {
        localStorage.clear();
    }
}
