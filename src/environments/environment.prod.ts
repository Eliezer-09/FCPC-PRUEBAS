import { NgxLoggerLevel } from "ngx-logger";

export const environment = {
  production: true,  
  // NGX Logger Configuration
  logLevel: NgxLoggerLevel.OFF,
  serverLogLevel: NgxLoggerLevel.ERROR,

  // Service API URLs
  serviceUrl : "https://api.fcpc-cte.com",
 
  reportesUrl: "https://api.fcpc-cte.com/reportes",
};

