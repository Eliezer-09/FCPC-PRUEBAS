import { Injectable } from "@angular/core";
import * as CryptoJS from "crypto-js";

declare var require: any;

const SecureStorage = require("secure-web-storage");

@Injectable({
  providedIn: "root",
})
export class StorageService {
  constructor() {}

  generateSecretKey = () => {
    if (!localStorage.getItem("id")) {
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      const hexString = Array.from(array)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");

      localStorage.setItem("id", hexString);
    }
  };

  public secureStorage = new SecureStorage(localStorage, {
    hash: (key: any) => {
      key = CryptoJS.SHA256(key, localStorage.getItem("id"));
      return key.toString();
    },
    encrypt: (data: any) => {
      data = CryptoJS.AES.encrypt(data, localStorage.getItem("id"));
      data = data.toString();
      return data;
    },
    decrypt: (data: any) => {
      data = CryptoJS.AES.decrypt(data, localStorage.getItem("id"));
      data = data.toString(CryptoJS.enc.Utf8);
      return data;
    },
  });
}
