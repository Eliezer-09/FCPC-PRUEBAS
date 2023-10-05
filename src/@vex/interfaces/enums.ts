export enum estadoAsientoContable {
  Borrador = 0,
  Validado = 10,
  Conciliado = 50,
  Cerrado = 100,
}

export enum TiposTituloInversiones {
  CertificadoDeposito = 1,
  Bonos = 3,
  AccionesCotizadas = 4,
  CerificadoInversion = 7,
  PapelComercial = 8,
  Obligacion = 9,
  TitularizacionMobiliaria = 10,
  FacturaComercial = 11,
  AccionesNoCotizadas = 12,
}


export enum Sectores {
  Norte = "Norte",
  Sur = "Sur",
  Este = "Este",
  Oeste = "Oeste",
  Centro = "Centro",
  Noreste = "Noreste",
  Noroeste = "Noroeste",
  Sureste = "Sureste",
  Suroeste = "Suroeste",
}


export enum TiposAdjunto {
  cedulaFrontal = 1,
  cedulaPosterior = 2,
  Autorizacion = 5,
  AporteAdicional = 6,
  CedulaConyugeFrontal = 11,
  CedulaConyugePosterior = 12,
  LiquidacionBIESS = 19,
  RolPagos = 21,
  rolGarante = 22,
  OtrosIngresos = 31,
  Proforma = 33,
  RegistroPropiedad = 38,
  croquis = 39,
  CertificadoPredio = 42,
  Solicitud = 45,
  Firma = 3,
  Foto = 0,
  Video = 4,
  Pagare = 30,
  DebitoPrestamo = 29,
  TablaInformativa = 44,
  ResumenCredito = 14,
  DeclaracionSeguro = 28,
  PagoProveedorExpress = 109,
  SolicitudCredito = 107,
  SolicitudCreditoNovacion = 108,
  Documento = 13,
}


export enum EstadoParticipe {
  Aprobado = "Aprobado",
  Rechazado = "Rechazado",
  Pendiente = "Pendiente",
  Cesado = "Cesado",
  esPasivo = "esPasivo",
}