import { Injectable } from '@angular/core';


/**
 * Service to ease the use of the local storage.
 */
@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    private readonly TOKEN_KEY = 'app_client_token';

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

    public saveToken(token: string): void {
        this.saveData(this.TOKEN_KEY, token);
        console.log(`[DEBUG :: LocalStorageService] Token saved: ${token}`);
    }

    public getToken(): string | null {
        const token = this.getData(this.TOKEN_KEY);
        console.log(`[DEBUG :: LocalStorageService] Token retrieved: ${token}`);
        return token;
    }

    public hasToken(): boolean {
        return this.hasData(this.TOKEN_KEY);
    }

    public removeToken(): void {
        this.removeData(this.TOKEN_KEY);
        console.log(`[DEBUG :: LocalStorageService] Token removed`);
    }

    public clearSession(): void {
        this.removeToken();
    }
}
