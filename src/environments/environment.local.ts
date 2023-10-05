import { NgxLoggerLevel } from "ngx-logger";

export const environment = {
  production: false,  
  // NGX Logger Configuration
  logLevel: NgxLoggerLevel.INFO,
  serverLogLevel: NgxLoggerLevel.ERROR,

  // Service API URLs
  serviceUrl : "https:/devapi.fcpc-cte.local",

  nominaUrl: "https://devapi.fcpc-cte.local/nomina",
};

