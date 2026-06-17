// src/lib/utils/rankingScraper.ts

export interface PaisRanking {
  posicion: number;
  codigo: string;
  nombre: string;
  puntos: number;
  cambio: number;
}

// ============================================================
// RANKING FIFA COMPLETO (211 EQUIPOS)
// Basado en datos oficiales del 11 de junio de 2026
// ============================================================
const RANKING_FALLBACK: PaisRanking[] = [
  { posicion: 1, codigo: "ARG", nombre: "Argentina", puntos: 1877.27, cambio: 0 },
  { posicion: 2, codigo: "FRA", nombre: "Francia", puntos: 1887.11, cambio: 0 },
  { posicion: 3, codigo: "ESP", nombre: "España", puntos: 1856.03, cambio: 1 },
  { posicion: 4, codigo: "ENG", nombre: "Inglaterra", puntos: 1828.02, cambio: 0 },
  { posicion: 5, codigo: "POR", nombre: "Portugal", puntos: 1767.85, cambio: 0 },
  { posicion: 6, codigo: "BRA", nombre: "Brasil", puntos: 1765.34, cambio: 0 },
  { posicion: 7, codigo: "MAR", nombre: "Marruecos", puntos: 1755.62, cambio: 0 },
  { posicion: 8, codigo: "NED", nombre: "Países Bajos", puntos: 1749.20, cambio: 0 },
  { posicion: 9, codigo: "GER", nombre: "Alemania", puntos: 1743.54, cambio: 1 },
  { posicion: 10, codigo: "BEL", nombre: "Bélgica", puntos: 1733.93, cambio: 1 },
  { posicion: 11, codigo: "CRO", nombre: "Croacia", puntos: 1714.87, cambio: 0 },
  { posicion: 12, codigo: "ITA", nombre: "Italia", puntos: 1704.73, cambio: 0 },
  { posicion: 13, codigo: "MEX", nombre: "México", puntos: 1700.98, cambio: 1 },
  { posicion: 14, codigo: "COL", nombre: "Colombia", puntos: 1698.35, cambio: 1 },
  { posicion: 15, codigo: "USA", nombre: "EE. UU.", puntos: 1688.53, cambio: 2 },
  { posicion: 16, codigo: "SEN", nombre: "Senegal", puntos: 1667.66, cambio: 1 },
  { posicion: 17, codigo: "JPN", nombre: "Japón", puntos: 1665.94, cambio: 1 },
  { posicion: 18, codigo: "URU", nombre: "Uruguay", puntos: 1661.95, cambio: 2 },
  { posicion: 19, codigo: "SUI", nombre: "Suiza", puntos: 1640.92, cambio: 0 },
  { posicion: 20, codigo: "DEN", nombre: "Dinamarca", puntos: 1619.47, cambio: 1 },
  { posicion: 21, codigo: "KOR", nombre: "Corea del Sur", puntos: 1612.55, cambio: 4 },
  { posicion: 22, codigo: "AUS", nombre: "Australia", puntos: 1605.61, cambio: 5 },
  { posicion: 23, codigo: "IRN", nombre: "Irán", puntos: 1605.12, cambio: 3 },
  { posicion: 24, codigo: "AUT", nombre: "Austria", puntos: 1597.40, cambio: 0 },
  { posicion: 25, codigo: "NGA", nombre: "Nigeria", puntos: 1585.02, cambio: 1 },
  { posicion: 26, codigo: "TUR", nombre: "Turquía", puntos: 1579.47, cambio: 4 },
  { posicion: 27, codigo: "ALG", nombre: "Argelia", puntos: 1571.03, cambio: 1 },
  { posicion: 28, codigo: "ECU", nombre: "Ecuador", puntos: 1570.76, cambio: 5 },
  { posicion: 29, codigo: "EGY", nombre: "Egipto", puntos: 1570.67, cambio: 0 },
  { posicion: 30, codigo: "CIV", nombre: "Costa de Marfil", puntos: 1568.62, cambio: 3 },
  { posicion: 31, codigo: "NOR", nombre: "Noruega", puntos: 1557.44, cambio: 0 },
  { posicion: 32, codigo: "CAN", nombre: "Canadá", puntos: 1551.50, cambio: 2 },
  { posicion: 33, codigo: "UKR", nombre: "Ucrania", puntos: 1549.29, cambio: 1 },
  { posicion: 34, codigo: "PAN", nombre: "Panamá", puntos: 1539.16, cambio: 0 },
  { posicion: 35, codigo: "SWE", nombre: "Suecia", puntos: 1533.19, cambio: 3 },
  { posicion: 36, codigo: "RUS", nombre: "Rusia", puntos: 1529.60, cambio: 1 },
  { posicion: 37, codigo: "POL", nombre: "Polonia", puntos: 1526.18, cambio: 1 },
  { posicion: 38, codigo: "SCO", nombre: "Escocia", puntos: 1518.77, cambio: 4 },
  { posicion: 39, codigo: "WAL", nombre: "Gales", puntos: 1516.95, cambio: 2 },
  { posicion: 40, codigo: "HUN", nombre: "Hungría", puntos: 1506.39, cambio: 1 },
  { posicion: 41, codigo: "SRB", nombre: "Serbia", puntos: 1502.13, cambio: 2 },
  { posicion: 42, codigo: "PAR", nombre: "Paraguay", puntos: 1488.05, cambio: 1 },
  { posicion: 43, codigo: "CZE", nombre: "República Checa", puntos: 1484.82, cambio: 3 },
  { posicion: 44, codigo: "CMR", nombre: "Camerún", puntos: 1481.24, cambio: 0 },
  { posicion: 45, codigo: "COD", nombre: "RD Congo", puntos: 1474.43, cambio: 1 },
  { posicion: 46, codigo: "SVK", nombre: "Eslovaquia", puntos: 1473.66, cambio: 1 },
  { posicion: 47, codigo: "GRE", nombre: "Grecia", puntos: 1473.19, cambio: 1 },
  { posicion: 48, codigo: "VEN", nombre: "Venezuela", puntos: 1469.18, cambio: 1 },
  { posicion: 49, codigo: "QAT", nombre: "Catar", puntos: 1459.45, cambio: 7 },
  { posicion: 50, codigo: "UZB", nombre: "Uzbekistán", puntos: 1458.73, cambio: 0 },
  { posicion: 51, codigo: "CHI", nombre: "Chile", puntos: 1458.20, cambio: 0 },
  { posicion: 52, codigo: "PER", nombre: "Perú", puntos: 1457.69, cambio: 0 },
  { posicion: 53, codigo: "CRC", nombre: "Costa Rica", puntos: 1456.03, cambio: 0 },
  { posicion: 54, codigo: "ROU", nombre: "Rumanía", puntos: 1455.89, cambio: 0 },
  { posicion: 55, codigo: "MLI", nombre: "Mali", puntos: 1455.59, cambio: 0 },
  { posicion: 56, codigo: "TUN", nombre: "Túnez", puntos: 1453.00, cambio: 11 },
  { posicion: 57, codigo: "IRQ", nombre: "Irak", puntos: 1446.28, cambio: 0 },
  { posicion: 58, codigo: "IRL", nombre: "República de Irlanda", puntos: 1441.10, cambio: 0 },
  { posicion: 59, codigo: "SVN", nombre: "Eslovenia", puntos: 1441.09, cambio: 0 },
  { posicion: 60, codigo: "KSA", nombre: "Arabia Saudita", puntos: 1435.00, cambio: 1 },
  { posicion: 61, codigo: "RSA", nombre: "Sudáfrica", puntos: 1414.88, cambio: 1 },
  { posicion: 62, codigo: "BFA", nombre: "Burkina Faso", puntos: 1406.99, cambio: 0 },
  { posicion: 63, codigo: "BIH", nombre: "Bosnia y Herzegovina", puntos: 1395.19, cambio: 1 },
  { posicion: 64, codigo: "CPV", nombre: "Cabo Verde", puntos: 1389.79, cambio: 3 },
  { posicion: 65, codigo: "JOR", nombre: "Jordania", puntos: 1387.74, cambio: 2 },
  { posicion: 66, codigo: "HON", nombre: "Honduras", puntos: 1378.97, cambio: 1 },
  { posicion: 67, codigo: "ALB", nombre: "Albania", puntos: 1376.03, cambio: 1 },
  { posicion: 68, codigo: "UAE", nombre: "Emiratos Árabes Unidos", puntos: 1370.47, cambio: 0 },
  { posicion: 69, codigo: "MKD", nombre: "Macedonia del Norte", puntos: 1369.16, cambio: 0 },
  { posicion: 70, codigo: "NIR", nombre: "Irlanda del Norte", puntos: 1365.30, cambio: 0 },
  { posicion: 71, codigo: "JAM", nombre: "Jamaica", puntos: 1357.84, cambio: 0 },
  { posicion: 72, codigo: "GEO", nombre: "Georgia", puntos: 1355.26, cambio: 0 },
  { posicion: 73, codigo: "GHA", nombre: "Ghana", puntos: 1346.88, cambio: 0 },
  { posicion: 74, codigo: "ISL", nombre: "Islandia", puntos: 1342.77, cambio: 0 },
  { posicion: 75, codigo: "FIN", nombre: "Finlandia", puntos: 1341.92, cambio: 0 },
  { posicion: 76, codigo: "ISR", nombre: "Israel", puntos: 1333.90, cambio: 0 },
  { posicion: 77, codigo: "BOL", nombre: "Bolivia", puntos: 1326.00, cambio: 0 },
  { posicion: 78, codigo: "KOS", nombre: "Kosovo", puntos: 1319.12, cambio: 0 },
  { posicion: 79, codigo: "OMA", nombre: "Omán", puntos: 1306.90, cambio: 0 },
  { posicion: 80, codigo: "MNE", nombre: "Montenegro", puntos: 1301.98, cambio: 0 },
  { posicion: 81, codigo: "GUI", nombre: "Guinea", puntos: 1295.60, cambio: 0 },
  { posicion: 82, codigo: "NZL", nombre: "Nueva Zelanda", puntos: 1290.04, cambio: 3 },
  { posicion: 83, codigo: "CUW", nombre: "Curazao", puntos: 1287.00, cambio: 1 },
  { posicion: 84, codigo: "SYR", nombre: "Siria", puntos: 1283.05, cambio: 0 },
  { posicion: 85, codigo: "HAI", nombre: "Haití", puntos: 1277.67, cambio: 2 },
  { posicion: 86, codigo: "GAB", nombre: "Gabón", puntos: 1272.51, cambio: 0 },
  { posicion: 87, codigo: "BUL", nombre: "Bulgaria", puntos: 1271.68, cambio: 0 },
  { posicion: 88, codigo: "ANG", nombre: "Angola", puntos: 1265.58, cambio: 0 },
  { posicion: 89, codigo: "UGA", nombre: "Uganda", puntos: 1264.09, cambio: 0 },
  { posicion: 90, codigo: "ZAM", nombre: "Zambia", puntos: 1255.82, cambio: 0 },
  { posicion: 91, codigo: "CHN", nombre: "RP China", puntos: 1254.81, cambio: 0 },
  { posicion: 92, codigo: "BHR", nombre: "Baréin", puntos: 1254.41, cambio: 0 },
  { posicion: 93, codigo: "BEN", nombre: "Benín", puntos: 1252.17, cambio: 0 },
  { posicion: 94, codigo: "THA", nombre: "Tailandia", puntos: 1250.80, cambio: 0 },
  { posicion: 95, codigo: "PLE", nombre: "Palestina", puntos: 1243.71, cambio: 0 },
  { posicion: 96, codigo: "BLR", nombre: "Bielorrusia", puntos: 1242.88, cambio: 0 },
  { posicion: 97, codigo: "GUA", nombre: "Guatemala", puntos: 1238.74, cambio: 0 },
  { posicion: 98, codigo: "LUX", nombre: "Luxemburgo", puntos: 1232.82, cambio: 0 },
  { posicion: 99, codigo: "VIE", nombre: "Vietnam", puntos: 1225.68, cambio: 0 },
  { posicion: 100, codigo: "SLV", nombre: "El Salvador", puntos: 1225.34, cambio: 0 },
  { posicion: 101, codigo: "TJK", nombre: "Tayikistán", puntos: 1224.19, cambio: 0 },
  { posicion: 102, codigo: "TRI", nombre: "Trinidad y Tobago", puntos: 1219.59, cambio: 0 },
  { posicion: 103, codigo: "MOZ", nombre: "Mozambique", puntos: 1218.62, cambio: 0 },
  { posicion: 104, codigo: "MAD", nombre: "Madagascar", puntos: 1202.69, cambio: 0 },
  { posicion: 105, codigo: "EQG", nombre: "Guinea Ecuatorial", puntos: 1195.20, cambio: 0 },
  { posicion: 106, codigo: "KGZ", nombre: "Kirguizistán", puntos: 1192.16, cambio: 0 },
  { posicion: 107, codigo: "ARM", nombre: "Armenia", puntos: 1189.63, cambio: 0 },
  { posicion: 108, codigo: "COM", nombre: "Comoras", puntos: 1187.91, cambio: 0 },
  { posicion: 109, codigo: "KEN", nombre: "Kenia", puntos: 1185.08, cambio: 0 },
  { posicion: 110, codigo: "LBY", nombre: "Libia", puntos: 1182.08, cambio: 0 },
  { posicion: 111, codigo: "KAZ", nombre: "Kazajistán", puntos: 1180.78, cambio: 0 },
  { posicion: 112, codigo: "TAN", nombre: "Tanzania", puntos: 1180.27, cambio: 0 },
  { posicion: 113, codigo: "MTN", nombre: "Mauritania", puntos: 1176.68, cambio: 0 },
  { posicion: 114, codigo: "NIG", nombre: "Níger", puntos: 1175.33, cambio: 0 },
  { posicion: 115, codigo: "LBN", nombre: "Líbano", puntos: 1172.22, cambio: 0 },
  { posicion: 116, codigo: "GAM", nombre: "Gambia", puntos: 1159.64, cambio: 0 },
  { posicion: 117, codigo: "SDN", nombre: "Sudán", puntos: 1157.22, cambio: 0 },
  { posicion: 118, codigo: "IDN", nombre: "Indonesia", puntos: 1157.14, cambio: 0 },
  { posicion: 119, codigo: "TOG", nombre: "Togo", puntos: 1152.76, cambio: 0 },
  { posicion: 120, codigo: "PRK", nombre: "RPD de Corea", puntos: 1151.05, cambio: 0 },
  { posicion: 121, codigo: "NAM", nombre: "Namibia", puntos: 1148.84, cambio: 0 },
  { posicion: 122, codigo: "SLE", nombre: "Sierra Leona", puntos: 1147.56, cambio: 0 },
  { posicion: 123, codigo: "FRO", nombre: "Islas Feroe", puntos: 1136.59, cambio: 0 },
  { posicion: 124, codigo: "CYP", nombre: "Chipre", puntos: 1133.25, cambio: 0 },
  { posicion: 125, codigo: "SUR", nombre: "Surinam", puntos: 1132.43, cambio: 0 },
  { posicion: 126, codigo: "AZE", nombre: "Azerbaiyán", puntos: 1132.00, cambio: 0 },
  { posicion: 127, codigo: "EST", nombre: "Estonia", puntos: 1130.64, cambio: 0 },
  { posicion: 128, codigo: "RWA", nombre: "Ruanda", puntos: 1126.62, cambio: 0 },
  { posicion: 129, codigo: "MWI", nombre: "Malaui", puntos: 1122.05, cambio: 0 },
  { posicion: 130, codigo: "ZIM", nombre: "Zimbabue", puntos: 1119.78, cambio: 0 },
  { posicion: 131, codigo: "NCA", nombre: "Nicaragua", puntos: 1114.63, cambio: 0 },
  { posicion: 132, codigo: "GNB", nombre: "Guinea-Bisáu", puntos: 1108.38, cambio: 0 },
  { posicion: 133, codigo: "KUW", nombre: "Kuwait", puntos: 1106.47, cambio: 0 },
  { posicion: 134, codigo: "CGO", nombre: "Congo", puntos: 1105.96, cambio: 0 },
  { posicion: 135, codigo: "PHI", nombre: "Filipinas", puntos: 1100.95, cambio: 0 },
  { posicion: 136, codigo: "MAS", nombre: "Malasia", puntos: 1086.22, cambio: 0 },
  { posicion: 137, codigo: "LVA", nombre: "Letonia", puntos: 1085.66, cambio: 0 },
  { posicion: 138, codigo: "IND", nombre: "India", puntos: 1084.93, cambio: 0 },
  { posicion: 139, codigo: "CTA", nombre: "República Centroafricana", puntos: 1080.82, cambio: 0 },
  { posicion: 140, codigo: "LBR", nombre: "Liberia", puntos: 1080.44, cambio: 0 },
  { posicion: 141, codigo: "TKM", nombre: "Turkmenistán", puntos: 1078.65, cambio: 0 },
  { posicion: 142, codigo: "BDI", nombre: "Burundi", puntos: 1078.01, cambio: 0 },
  { posicion: 143, codigo: "ETH", nombre: "Etiopía", puntos: 1077.52, cambio: 0 },
  { posicion: 144, codigo: "DOM", nombre: "República Dominicana", puntos: 1076.50, cambio: 0 },
  { posicion: 145, codigo: "YEM", nombre: "Yemen", puntos: 1065.24, cambio: 0 },
  { posicion: 146, codigo: "LES", nombre: "Lesoto", puntos: 1064.29, cambio: 0 },
  { posicion: 147, codigo: "BOT", nombre: "Botsuana", puntos: 1063.63, cambio: 0 },
  { posicion: 148, codigo: "SGP", nombre: "Singapur", puntos: 1057.95, cambio: 0 },
  { posicion: 149, codigo: "LTU", nombre: "Lituania", puntos: 1056.85, cambio: 0 },
  { posicion: 150, codigo: "GUY", nombre: "Guyana", puntos: 1049.32, cambio: 0 },
  { posicion: 151, codigo: "NCL", nombre: "Nueva Caledonia", puntos: 1036.95, cambio: 0 },
  { posicion: 152, codigo: "SKN", nombre: "San Cristóbal y Nieves", puntos: 1036.33, cambio: 0 },
  { posicion: 153, codigo: "SOL", nombre: "Islas Salomón", puntos: 1031.89, cambio: 0 },
  { posicion: 154, codigo: "PUR", nombre: "Puerto Rico", puntos: 1024.30, cambio: 0 },
  { posicion: 155, codigo: "FIJ", nombre: "Fiyi", puntos: 1024.17, cambio: 0 },
  { posicion: 156, codigo: "HKG", nombre: "Hong Kong", puntos: 1024.16, cambio: 0 },
  { posicion: 157, codigo: "TAH", nombre: "Tahití", puntos: 1019.04, cambio: 0 },
  { posicion: 158, codigo: "MYA", nombre: "Myanmar", puntos: 1010.91, cambio: 0 },
  { posicion: 159, codigo: "MDA", nombre: "Moldavia", puntos: 1008.24, cambio: 0 },
  { posicion: 160, codigo: "VAN", nombre: "Vanuatu", puntos: 1002.53, cambio: 0 },
  { posicion: 161, codigo: "MLT", nombre: "Malta", puntos: 992.79, cambio: 0 },
  { posicion: 162, codigo: "ATG", nombre: "Antigua y Barbuda", puntos: 986.58, cambio: 0 },
  { posicion: 163, codigo: "GRN", nombre: "Granada", puntos: 981.82, cambio: 0 },
  { posicion: 164, codigo: "CUB", nombre: "Cuba", puntos: 981.42, cambio: 0 },
  { posicion: 165, codigo: "SWZ", nombre: "Suazilandia", puntos: 979.01, cambio: 0 },
  { posicion: 166, codigo: "LCA", nombre: "Santa Lucía", puntos: 976.71, cambio: 0 },
  { posicion: 167, codigo: "BER", nombre: "Bermuda", puntos: 975.05, cambio: 0 },
  { posicion: 168, codigo: "PNG", nombre: "Papúa Nueva Guinea", puntos: 974.90, cambio: 0 },
  { posicion: 169, codigo: "SSD", nombre: "Sudán del Sur", puntos: 970.94, cambio: 0 },
  { posicion: 170, codigo: "VIN", nombre: "San Vicente y las Granadinas", puntos: 968.27, cambio: 0 },
  { posicion: 171, codigo: "AFG", nombre: "Afganistán", puntos: 968.07, cambio: 0 },
  { posicion: 172, codigo: "AND", nombre: "Andorra", puntos: 946.43, cambio: 0 },
  { posicion: 173, codigo: "MDV", nombre: "Maldivas", puntos: 943.92, cambio: 0 },
  { posicion: 174, codigo: "TPE", nombre: "China Taipéi", puntos: 923.78, cambio: 0 },
  { posicion: 175, codigo: "CAM", nombre: "Camboya", puntos: 922.32, cambio: 0 },
  { posicion: 176, codigo: "MSR", nombre: "Montserrat", puntos: 916.75, cambio: 0 },
  { posicion: 177, codigo: "NEP", nombre: "Nepal", puntos: 914.54, cambio: 0 },
  { posicion: 178, codigo: "MRI", nombre: "Mauricio", puntos: 911.49, cambio: 0 },
  { posicion: 179, codigo: "BRB", nombre: "Barbados", puntos: 909.89, cambio: 0 },
  { posicion: 180, codigo: "BLZ", nombre: "Belice", puntos: 907.00, cambio: 0 },
  { posicion: 181, codigo: "BAN", nombre: "Bangladés", puntos: 902.93, cambio: 0 },
  { posicion: 182, codigo: "DMA", nombre: "Dominica", puntos: 897.69, cambio: 0 },
  { posicion: 183, codigo: "CHA", nombre: "Chad", puntos: 896.85, cambio: 0 },
  { posicion: 184, codigo: "ERI", nombre: "Eritrea", puntos: 887.06, cambio: 0 },
  { posicion: 185, codigo: "LAO", nombre: "Laos", puntos: 885.03, cambio: 0 },
  { posicion: 186, codigo: "COK", nombre: "Islas Cook", puntos: 877.53, cambio: 0 },
  { posicion: 187, codigo: "SRI", nombre: "Sri Lanka", puntos: 876.86, cambio: 0 },
  { posicion: 188, codigo: "SAM", nombre: "Samoa", puntos: 876.41, cambio: 0 },
  { posicion: 189, codigo: "ARU", nombre: "Aruba", puntos: 875.61, cambio: 0 },
  { posicion: 190, codigo: "MNG", nombre: "Mongolia", puntos: 874.47, cambio: 0 },
  { posicion: 191, codigo: "ASA", nombre: "Samoa Estadounidense", puntos: 871.61, cambio: 0 },
  { posicion: 192, codigo: "BHU", nombre: "Bután", puntos: 870.81, cambio: 0 },
  { posicion: 193, codigo: "MAC", nombre: "Macao", puntos: 858.03, cambio: 0 },
  { posicion: 194, codigo: "BRU", nombre: "Brunéi Darusalam", puntos: 857.73, cambio: 0 },
  { posicion: 195, codigo: "STP", nombre: "Santo Tomé y Príncipe", puntos: 855.44, cambio: 0 },
  { posicion: 196, codigo: "DJI", nombre: "Yibuti", puntos: 853.58, cambio: 0 },
  { posicion: 197, codigo: "CAY", nombre: "Islas Caimán", puntos: 850.06, cambio: 0 },
  { posicion: 198, codigo: "PAK", nombre: "Pakistán", puntos: 840.28, cambio: 0 },
  { posicion: 199, codigo: "SOM", nombre: "Somalia", puntos: 839.17, cambio: 0 },
  { posicion: 200, codigo: "TGA", nombre: "Tonga", puntos: 835.64, cambio: 0 },
  { posicion: 201, codigo: "TLS", nombre: "Timor Oriental", puntos: 831.00, cambio: 0 },
  { posicion: 202, codigo: "GIB", nombre: "Gibraltar", puntos: 820.26, cambio: 0 },
  { posicion: 203, codigo: "GUM", nombre: "Guam", puntos: 819.54, cambio: 0 },
  { posicion: 204, codigo: "SEY", nombre: "Seychelles", puntos: 804.16, cambio: 0 },
  { posicion: 205, codigo: "TCA", nombre: "Islas Turcas y Caicos", puntos: 803.98, cambio: 0 },
  { posicion: 206, codigo: "LIE", nombre: "Liechtenstein", puntos: 797.70, cambio: 0 },
  { posicion: 207, codigo: "BAH", nombre: "Bahamas", puntos: 786.82, cambio: 0 },
  { posicion: 208, codigo: "VIR", nombre: "Islas Vírgenes Estadounidenses", puntos: 779.76, cambio: 0 },
  { posicion: 209, codigo: "VGB", nombre: "Islas Vírgenes Británicas", puntos: 777.41, cambio: 0 },
  { posicion: 210, codigo: "AIA", nombre: "Anguilla", puntos: 760.25, cambio: 0 },
  { posicion: 211, codigo: "SMR", nombre: "San Marino", puntos: 721.20, cambio: 0 }
];

// ============================================================
// FUNCIÓN DE SCRAPING CON FALLBACK COMPLETO
// ============================================================
export const obtenerRankingDesdeWikipedia = async (): Promise<PaisRanking[]> => {
  // Intentamos primero con Wikipedia en español
  const fuentes = [
    'https://es.wikipedia.org/wiki/Anexo:Clasificación_mundial_de_la_FIFA',
    'https://en.wikipedia.org/wiki/FIFA_World_Rankings'
  ];

  for (const url of fuentes) {
    try {
      console.log(`Intentando obtener ranking desde: ${url}`);
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) continue;
      
      const html = await response.text();
      
      try {
        const cheerio = await import('cheerio');
        const $ = cheerio.load(html);
        const ranking: PaisRanking[] = [];
        
        // Buscar tabla de ranking
        $('table.wikitable tbody tr').each((i, row) => {
          const celdas = $(row).find('td');
          if (celdas.length >= 4) {
            const posicion = parseInt($(celdas[0]).text().trim());
            const nombre = $(celdas[1]).text().trim() || $(celdas[2]).text().trim() || '';
            const codigo = $(celdas[1]).text().trim().slice(0, 3) || '';
            const puntos = parseFloat($(celdas[celdas.length - 2]).text().trim().replace(',', '')) || 0;
            const cambio = parseInt($(celdas[celdas.length - 1]).text().trim()) || 0;
            
            if (posicion > 0 && nombre && puntos > 0) {
              ranking.push({ posicion, codigo, nombre, puntos, cambio });
            }
          }
        });
        
        if (ranking.length > 10) {
          console.log(`✅ Ranking obtenido desde ${url}: ${ranking.length} equipos`);
          return ranking;
        }
      } catch (e) {
        console.warn(`Error al parsear ${url}:`, e);
      }
    } catch (error) {
      console.warn(`Error al obtener ${url}:`, error);
    }
  }

  // Si todo falla, usar datos de respaldo (211 equipos)
  console.warn(`⚠️ Usando datos de respaldo (${RANKING_FALLBACK.length} equipos)`);
  return RANKING_FALLBACK;
};