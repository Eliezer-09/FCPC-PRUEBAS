import { environment } from "src/environments/environment";

export const ApiServiceUrl = {
  Auth: "/auth",
  catalogos: "/catalogs",
  catalogo: "/catalogo",
  Participe: "/participes",
  creditosUrl: "/creditos",
  tickets: "/tickets",
  cesantes: "/cesantes",
  reportes: "/reportes",
  Inversiones: "/inversiones",
  contabilidad: "/contabilidad",
  nominaUrl: "/talento-humano",
  comprobantes: "/comprobantes/v1",
  reports: "/reports",
  adjuntos: "/adjuntos",
  tthhUrl:"/tthh"
};
export const ApiUrl = {
  Auth: environment.serviceUrl + ApiServiceUrl.Auth,
  catalogos: environment.serviceUrl + ApiServiceUrl.catalogos,
  catalogo: environment.serviceUrl + ApiServiceUrl.catalogo,
  Participe: environment.serviceUrl + ApiServiceUrl.Participe,
  creditos: environment.serviceUrl + ApiServiceUrl.creditosUrl,
  tickets: environment.serviceUrl + ApiServiceUrl.tickets,
  cesantes: environment.serviceUrl + ApiServiceUrl.cesantes,
  reportes: environment.serviceUrl + ApiServiceUrl.reportes,
  Inversiones: environment.serviceUrl + ApiServiceUrl.Inversiones,
  Contabilidad: environment.serviceUrl + ApiServiceUrl.contabilidad,
  nominaUrl: environment.serviceUrl + ApiServiceUrl.nominaUrl,
  tthhUrl:environment.serviceUrl + ApiServiceUrl.tthhUrl,
  comprobantes: environment.serviceUrl + ApiServiceUrl.comprobantes,
  reports: environment.serviceUrl + ApiServiceUrl.reports,
  adjuntos: environment.serviceUrl + ApiServiceUrl.adjuntos,
};
