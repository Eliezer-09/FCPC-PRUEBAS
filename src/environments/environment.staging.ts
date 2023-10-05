import { NgxLoggerLevel } from "ngx-logger";

export const environment = {
  production: false,
  
  // NGX Logger Configuration
  logLevel: NgxLoggerLevel.INFO,
  serverLogLevel: NgxLoggerLevel.ERROR,

  // Service API URLs
  serviceUrl : "https://devapi.fcpc-cte.com",
/*
  inversionesUrl: "https://devapi.fcpc-cte.com/inversiones",
  cesantesUrl: "https://devapi.fcpc-cte.com/cesantes",
  catalogosUrl: "https://devapi.fcpc-cte.com/catalogs",
  creditosUrl: "https://devapi.fcpc-cte.com/creditos",
  reportesUrl: "https://devapi.fcpc-cte.com/reportes",
  */
  nominaUrl: "https://devapi.fcpc-cte.com/nomina",

};
