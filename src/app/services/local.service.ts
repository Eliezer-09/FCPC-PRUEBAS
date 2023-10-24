import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: "root",
})
export class LocalService {
  private storage: any;
  constructor(private storageService: StorageService) {
    this.storage = environment.production
      ? this.storageService.secureStorage
      : localStorage;

  }

  setItem(key: string, value: any): void {
    this.storage.setItem(key, value);
  }

  getItem(key: any): any {
    return this.storage.getItem(key);
  }

  removeItem(key: string): void {
    this.storage.removeItem(key);
    return;
  }

  clear(): void {
    this.storage.clear();
  }
}
