import { useState, useMemo, useEffect, useRef } from "react";
import {
  Boxes, Search, Download, Upload, RotateCcw, Settings2, Sun, Moon,
  ChevronDown, ChevronRight, Plus, Minus, PackageOpen, Check, X,
} from "lucide-react";

/* ------------------------------------------------------------------ *
 * DATOS BASE
 * Generados desde "Existencia_MexiLink.xlsx" (hoja Existencia).
 * Mismo orden y mismas secciones que el Excel: Sección 1 → 8 y Check Lane.
 * cost = Precio · factorCaja = Unid/Caja · factorDisplay = Unid/Display
 * (hasDisplay solo si el Excel trae Unid/Display).
 * ------------------------------------------------------------------ */
const MEXI_NAMES = {1: "Sección 1", 2: "Sección 2", 3: "Sección 3", 4: "Sección 4", 5: "Sección 5", 6: "Sección 6", 7: "Sección 7", 8: "Sección 8", 9: "Check Lane"};

const MEXI_PRODUCTS = [
  { id: "p1", name: "DELAROSA MAZAPAN DISP/24 CASE/12 CT", sec: 1, cost: 3.07, factorCaja: 24, hasDisplay: false, factorDisplay: 1 },
  { id: "p2", name: "DELAROSA PULPARINDOTS WATERMELON DISPLAY12 CASE/12 EA/1.04OZ", sec: 1, cost: 4.43, factorCaja: 12, hasDisplay: false, factorDisplay: 1 },
  { id: "p3", name: "DELAROSA MAZAPAN W/CHOCOLAT DISP 24 CS/16 CT", sec: 1, cost: 5.08, factorCaja: 24, hasDisplay: false, factorDisplay: 1 },
  { id: "p4", name: "DELAROSA PULPARINDO TAMARIND DISP/16 CASE/20 CT", sec: 1, cost: 3.36, factorCaja: 16, hasDisplay: false, factorDisplay: 1 },
  { id: "p5", name: "DELAROSA PULPARINDO SPICY TAMARIND 32 CASE/DISP/ 20 CT", sec: 1, cost: 3.32, factorCaja: 32, hasDisplay: false, factorDisplay: 1 },
  { id: "p6", name: "RICOLINO DUVALIN TRI SABOR 24 CASE/18 EA/.53 OZ", sec: 1, cost: 2.86, factorCaja: 24, hasDisplay: false, factorDisplay: 1 },
  { id: "p7", name: "RICOLINO DUVALIN HAZELNUT VANILLA 24 CASE/18 EA/.53 OZ", sec: 1, cost: 2.86, factorCaja: 24, hasDisplay: false, factorDisplay: 1 },
  { id: "p8", name: "CANELS 4P GUMPACK ORIG FLVR 40 TRAY/ 60 CT", sec: 1, cost: 3.25, factorCaja: 40, hasDisplay: false, factorDisplay: 1 },
  { id: "p9", name: "AZTECA SPOON CHILI 24 BAG/22 EA/.40 OZ", sec: 1, cost: 2.69, factorCaja: 24, hasDisplay: false, factorDisplay: 1 },
  { id: "p10", name: "DELAROSA NISHIYAMA CACAHUATE JAPONES 9 BAG/ 2 LBS", sec: 2, cost: 6.59, factorCaja: 9, hasDisplay: false, factorDisplay: 1 },
  { id: "p11", name: "DELAROSA NISHIYAMA CACAHUATE BROWN 4 BAG/50 EA/2.11 OZ", sec: 2, cost: 0.3, factorCaja: 200, hasDisplay: true, factorDisplay: 50 },
  { id: "p12", name: "LORENA PELON PELONAZO TAMARINDO 3.52 OZ OB X 12 DISP", sec: 2, cost: 1.53, factorCaja: 48, hasDisplay: true, factorDisplay: 4 },
  { id: "p13", name: "LORENA MINI PELON PELO RICO 24 BAG/12 EA/.45 OZ", sec: 2, cost: 2.79, factorCaja: 24, hasDisplay: false, factorDisplay: 1 },
  { id: "p14", name: "LORENA MINI PELON ASSORTED 20 BAG/18 EA/8.1 OZ", sec: 2, cost: 4.04, factorCaja: 20, hasDisplay: false, factorDisplay: 1 },
  { id: "p15", name: "PELON PELONETA CANDY, 13.28 OZ", sec: 2, cost: 5.79, factorCaja: 18, hasDisplay: false, factorDisplay: 1 },
  { id: "p16", name: "CANELS JARRITOS SOUR GUMMIES 12 BAG/8 OZ", sec: 2, cost: 2.68, factorCaja: 12, hasDisplay: false, factorDisplay: 1 },
  { id: "p17", name: "RICOLINO PALETA PAYASO DISPLAY 6 CASE/10 EA/1.59 OZ", sec: 3, cost: 0.8, factorCaja: 60, hasDisplay: true, factorDisplay: 10 },
  { id: "p18", name: "RICOLINO BUBULUBU DISPLAY 8 CASE/24 EA/1.23 OZ", sec: 3, cost: 0.64, factorCaja: 192, hasDisplay: true, factorDisplay: 24 },
  { id: "p19", name: "LUCAS GUSANO CHAMOY", sec: 3, cost: 6.1, factorCaja: 30, hasDisplay: false, factorDisplay: 1 },
  { id: "p20", name: "LUCAS BABY CHAMOY", sec: 3, cost: 4.7, factorCaja: 300, hasDisplay: true, factorDisplay: 10 },
  { id: "p21", name: "LUCAS BABY MANGO", sec: 3, cost: 0.41, factorCaja: 300, hasDisplay: true, factorDisplay: 10 },
  { id: "p22", name: "LUCAS SKWINKLES RELLENOS PINA TAMARINDO 24 TRAY/12 EA/.92 OZ", sec: 3, cost: 0.59, factorCaja: 288, hasDisplay: true, factorDisplay: 12 },
  { id: "p23", name: "CANELS JARRITOS REGULAR GUMMIES 12 BAG/8 OZ", sec: 3, cost: 2.68, factorCaja: 12, hasDisplay: false, factorDisplay: 1 },
  { id: "p24", name: "LUCAS GUMMIES SPICY WATERMELON", sec: 4, cost: 3.09, factorCaja: 144, hasDisplay: true, factorDisplay: 12 },
  { id: "p25", name: "LUCAS GUMMIES SPICY MANGO", sec: 4, cost: 3.09, factorCaja: 144, hasDisplay: true, factorDisplay: 12 },
  { id: "p26", name: "LUCAS SKWINKLOTE WATERMELON 24 TRAY/6 EA/1.41 OZ", sec: 4, cost: 0.89, factorCaja: 144, hasDisplay: true, factorDisplay: 6 },
  { id: "p27", name: "LUCAS SALSAGHETI KING SIZE WATERMELON 20 CASE/6 EA/2.47 OZ", sec: 4, cost: 1.41, factorCaja: 120, hasDisplay: true, factorDisplay: 6 },
  { id: "p28", name: "LUCAS SKWINKLES CHUNKS MANGO PEG 12 BAG/4.59 OZ", sec: 4, cost: 2.91, factorCaja: 12, hasDisplay: false, factorDisplay: 1 },
  { id: "p29", name: "DE LA ROSA PULPARINDO GUMMY RINGS MANGO 12 BAG /9oz", sec: 4, cost: 2.68, factorCaja: 12, hasDisplay: false, factorDisplay: 1 },
  { id: "p30", name: "DE LA ROSA PULPARINDO GUMMY RINGS WATERMELON 12 BAG /9oz", sec: 4, cost: 2.68, factorCaja: 12, hasDisplay: false, factorDisplay: 1 },
  { id: "p31", name: "SNACK PARADISE TAMASTRAWS WITH TAJÍN 12 DISPLAY /10 EA /", sec: 5, cost: 3.71, factorCaja: 12, hasDisplay: false, factorDisplay: 1 },
  { id: "p32", name: "SNACK PARADISE TAMAPOP WITH TAJÍN 12 DISPLAY /10 EA /", sec: 5, cost: 3.71, factorCaja: 12, hasDisplay: false, factorDisplay: 1 },
  { id: "p33", name: "BONBONBUM TAJIN WATERMELON 12 BAG/4 EA", sec: 5, cost: 2.8, factorCaja: 12, hasDisplay: false, factorDisplay: 1 },
  { id: "p34", name: "BONBONBUM TROP ASSORTED 12 BAG/6 OZ", sec: 5, cost: 1.53, factorCaja: 12, hasDisplay: false, factorDisplay: 1 },
  { id: "p35", name: "BONBONBUM 12 BAG/4 EA", sec: 5, cost: 1.6, factorCaja: 12, hasDisplay: false, factorDisplay: 1 },
  { id: "p36", name: "JUMEX GUMMIES TROPICAL MIX 2 TRAY /10 EA/ 5oz", sec: 5, cost: 3.09, factorCaja: 20, hasDisplay: true, factorDisplay: 10 },
  { id: "p37", name: "JUMEX GUMMIES SPICY TROPICAL MIX 2 TRAY /10 EA/ 5oz", sec: 5, cost: 3.07, factorCaja: 20, hasDisplay: true, factorDisplay: 10 },
  { id: "p38", name: "CNLS VAQUITA CARAMEL POPS, 11.85 OZ", sec: 5, cost: 3.41, factorCaja: 12, hasDisplay: false, factorDisplay: 1 },
  { id: "p39", name: "VERO GUMMY PICA FRESA 8 BAG/100 EA/.21 OZ", sec: 6, cost: 4.94, factorCaja: 8, hasDisplay: false, factorDisplay: 1 },
  { id: "p40", name: "VERO LOLLIPOP ELOTE 7 BAG/40 EA/.49", sec: 6, cost: 4.94, factorCaja: 7, hasDisplay: false, factorDisplay: 1 },
  { id: "p41", name: "VERO LOLLIPOP MANGO 7 BAG/40 EA/.49 OZ", sec: 6, cost: 4.94, factorCaja: 7, hasDisplay: false, factorDisplay: 1 },
  { id: "p42", name: "VERO LOLLIPOP MIX FUEGO 7 BAG/40 EA/.51 OZ", sec: 6, cost: 4.94, factorCaja: 7, hasDisplay: false, factorDisplay: 1 },
  { id: "p43", name: "VERO RELLERINDO 8 BAG/65 EA/.39 OZ", sec: 6, cost: 4.94, factorCaja: 8, hasDisplay: false, factorDisplay: 1 },
  { id: "p44", name: "CANELS PINATERO MIX 6 BAG/4 LBS", sec: 6, cost: 17.93, factorCaja: 6, hasDisplay: false, factorDisplay: 1 },
  { id: "p45", name: "SNRC ROCKALETA BAG, 20/.84 OZ", sec: 7, cost: 7.48, factorCaja: 10, hasDisplay: false, factorDisplay: 1 },
  { id: "p46", name: "CANELS VAQUITA CHICLOSOS CARAMEL 7 BAGS / 12 OZ", sec: 7, cost: 3.66, factorCaja: 7, hasDisplay: false, factorDisplay: 1 },
  { id: "p47", name: "DELAROSA PINATA MIX 6 BAG/4 LB", sec: 8, cost: 16.61, factorCaja: 6, hasDisplay: false, factorDisplay: 1 },
  { id: "p48", name: "RICOLINO RICOFIESTA NEW MIX 4 BAG/3.3 LB/93 EA", sec: 8, cost: 14.58, factorCaja: 4, hasDisplay: false, factorDisplay: 1 },
  { id: "p49", name: "BONBONBUM TAJIN PASSION FRUIT & WATERMELON 10 BAG/20 EA", sec: 8, cost: 9.44, factorCaja: 10, hasDisplay: false, factorDisplay: 1 },
  { id: "p50", name: "DELAROSA SUPER GIANT MARSHMALLOW 10 BAG/25 OZ", sec: 8, cost: 5.93, factorCaja: 10, hasDisplay: false, factorDisplay: 1 },
  { id: "p51", name: "ICEE FRUIT SOURS 4 OZ", sec: 9, cost: 1.86, factorCaja: 12, hasDisplay: false, factorDisplay: 1 },
  { id: "p52", name: "RICOLINO MINI PALETA PAYASO 1.76 OZ", sec: 9, cost: 1.36, factorCaja: 11, hasDisplay: false, factorDisplay: 1 },
  { id: "p53", name: "RICOLINO BUBULUBU MARSHMELLOW 3.69 OZ", sec: 9, cost: 1.36, factorCaja: 10, hasDisplay: false, factorDisplay: 1 },
  { id: "p54", name: "LORENA PELON MINI 1.35 OZ", sec: 9, cost: 1.31, factorCaja: 12, hasDisplay: false, factorDisplay: 1 },
  { id: "p55", name: "LUCAS SKWINKLES CHUNKS 2,47 OZ", sec: 9, cost: 3.1, factorCaja: 12, hasDisplay: false, factorDisplay: 1 },
  { id: "p56", name: "DE LA ROSA MAZAPAN 4 OZ", sec: 9, cost: 1.81, factorCaja: 24, hasDisplay: false, factorDisplay: 1 },
];

const MEXI_KEY = "mexilink_inventario_v3";
const JJLG_KEY = "jjlg_inventario_v1";

/* ------------------------------------------------------------------ *
 * PERSISTENCIA SEGURA
 * Usa localStorage cuando está disponible; si no (vista previa en
 * sandbox, modo privado, etc.) cae a memoria sin romper la app.
 * ------------------------------------------------------------------ */
const storage = {
  load(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },
  save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* sin persistencia disponible: la app sigue funcionando en memoria */
    }
  },
};

/* ------------------------------------------------------------------ *
 * LIMPIEZA DE DATOS (requisito 4)
 * Pre-procesa filas crudas de un CSV/Excel reexportado e ignora:
 *  - encabezados repetidos (CAJAS, DISPLAY, UNIDADES, TOTAL, ...)
 *  - divisores de sección ("Product Description 8", etc.)
 *  - filas sin nombre o sin un costo numérico válido
 * Devuelve solo productos reales con su costo.
 * ------------------------------------------------------------------ */
const HEADER_TOKENS = new Set([
  "product description", "cajas", "display", "unidades",
  "total", "cost$", "cost", "total dinero",
]);

function cleanRows(rows) {
  const out = [];
  for (const row of rows) {
    if (!Array.isArray(row) || row.length === 0) continue;
    const name = String(row[0] == null ? "" : row[0]).trim();
    if (!name) continue;
    const low = name.toLowerCase();
    if (HEADER_TOKENS.has(low)) continue;            // encabezado repetido
    if (/^product description\s*\d*/.test(low)) continue; // divisor de sección
    const cost = parseFloat(row[5]);                 // columna COST$
    if (!Number.isFinite(cost)) continue;            // sin dato numérico válido
    out.push({
      name,
      cost,
      cajas: toNum(row[1]),
      display: toNum(row[2]),
      unidades: toNum(row[3]),
    });
  }
  return out;
}

const toNum = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

/* Parser CSV mínimo con soporte de comillas */
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else q = false;
      } else field += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

/* ------------------------------------------------------------------ *
 * ESTADO POR PRODUCTO
 * cajas / display / unidades = conteo del día
 * factorCaja / factorDisplay = unidades por caja / por display
 * hasDisplay = si el producto se maneja en display
 * ------------------------------------------------------------------ */
// Los factores y la presencia de Display vienen de la fórmula matriz del
// Excel: =(B*factorCaja)+(C*factorDisplay)+D  ó  =(B*factorCaja)+D
const blankEntry = (p) => ({
  cajas: 0, display: 0, unidades: 0,
  factorCaja: p.factorCaja,
  factorDisplay: p.factorDisplay,
  hasDisplay: p.hasDisplay,
});

const money = new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD",
});
const num = new Intl.NumberFormat("en-US");


/* ------------------------------------------------------------------ *
 * DATOS JJLG IMPORTERS
 * Generados desde "Existencia_Semana52_final.xlsx" (hoja Existencia).
 * cost = Precio · factorCaja = Unid/Caja · factorDisplay = Unid/Display
 * ------------------------------------------------------------------ */
const JJLG_NAMES = { 1: "Sección 1", 2: "Sección 2", 3: "Sección 3", 4: "Sección 4", 5: "Sección 5", 6: "Sección 6", 7: "Sección Especial" };

const JJLG_PRODUCTS = [
  { id: "j1", name: "Burrito Tamarindo 3oz", sec: 1, cost: 1.5, factorCaja: 96, hasDisplay: true, factorDisplay: 24 },
  { id: "j2", name: "Burrito Mango 2.5oz", sec: 1, cost: 1.5, factorCaja: 96, hasDisplay: true, factorDisplay: 24 },
  { id: "j3", name: "Martillo Tamarindo 3oz", sec: 1, cost: 1.5, factorCaja: 96, hasDisplay: true, factorDisplay: 24 },
  { id: "j4", name: "Martillo Mango 2.5oz", sec: 1, cost: 1.5, factorCaja: 96, hasDisplay: true, factorDisplay: 24 },
  { id: "j5", name: "Cocadas Mix 3.5oz", sec: 1, cost: 1.5, factorCaja: 96, hasDisplay: true, factorDisplay: 24 },
  { id: "j6", name: "Cocada Bandera 3.5oz", sec: 1, cost: 1.5, factorCaja: 96, hasDisplay: true, factorDisplay: 24 },
  { id: "j7", name: "Garapiñado 3.5oz", sec: 1, cost: 1.5, factorCaja: 96, hasDisplay: true, factorDisplay: 24 },
  { id: "j8", name: "Cacahuate Chile & Limon 3.5oz", sec: 1, cost: 1.5, factorCaja: 96, hasDisplay: true, factorDisplay: 24 },
  { id: "j9", name: "Cacahuate Japones 3.5oz", sec: 1, cost: 1.5, factorCaja: 96, hasDisplay: true, factorDisplay: 24 },
  { id: "j10", name: "Palanquetas 3.5oz", sec: 1, cost: 1.5, factorCaja: 96, hasDisplay: true, factorDisplay: 24 },
  { id: "j11", name: "Alegrias Amarantos 2.1oz", sec: 1, cost: 1.5, factorCaja: 80, hasDisplay: true, factorDisplay: 20 },
  { id: "j12", name: "Semilla Tostada 2oz", sec: 1, cost: 1.5, factorCaja: 96, hasDisplay: true, factorDisplay: 24 },
  { id: "j13", name: "Relle Rollo Tamarindo. 2.5oz", sec: 2, cost: 1.5, factorCaja: 144, hasDisplay: true, factorDisplay: 12 },
  { id: "j14", name: "Relle Rollo Mango 2.5oz", sec: 2, cost: 1.5, factorCaja: 144, hasDisplay: true, factorDisplay: 12 },
  { id: "j15", name: "Relle Rollo Guayaba 2.5oz", sec: 2, cost: 1.5, factorCaja: 144, hasDisplay: true, factorDisplay: 12 },
  { id: "j16", name: "Relle Rollo Ciruela 2.5oz", sec: 2, cost: 1.5, factorCaja: 144, hasDisplay: true, factorDisplay: 12 },
  { id: "j17", name: "Relle Rollo Piña Colada 2.5oz", sec: 3, cost: 1.5, factorCaja: 144, hasDisplay: true, factorDisplay: 12 },
  { id: "j18", name: "Greñas Tamarindo 2.5oz", sec: 3, cost: 1.5, factorCaja: 144, hasDisplay: true, factorDisplay: 12 },
  { id: "j19", name: "Tamarindo Bars 2.5oz", sec: 3, cost: 1.5, factorCaja: 144, hasDisplay: true, factorDisplay: 12 },
  { id: "j20", name: "Spiced Serpentina 2.5oz", sec: 3, cost: 1.5, factorCaja: 144, hasDisplay: true, factorDisplay: 12 },
  { id: "j21", name: "Frutakitos Tamarindo 2.5oz", sec: 4, cost: 1.5, factorCaja: 144, hasDisplay: true, factorDisplay: 12 },
  { id: "j22", name: "Rielitos 2.5oz", sec: 4, cost: 1.5, factorCaja: 144, hasDisplay: true, factorDisplay: 12 },
  { id: "j23", name: "Mango Chile 2.5oz", sec: 4, cost: 1.5, factorCaja: 144, hasDisplay: true, factorDisplay: 12 },
  { id: "j24", name: "Hostias el Leoncito 2.5oz", sec: 4, cost: 1.5, factorCaja: 144, hasDisplay: true, factorDisplay: 12 },
  { id: "j25", name: "Mango Pop 2.5oz", sec: 5, cost: 1.5, factorCaja: 144, hasDisplay: true, factorDisplay: 12 },
  { id: "j26", name: "Rebanaditas de sandia 2.5oz", sec: 5, cost: 1.5, factorCaja: 144, hasDisplay: true, factorDisplay: 12 },
  { id: "j27", name: "Gummy Worms 2.5oz", sec: 5, cost: 1.5, factorCaja: 144, hasDisplay: true, factorDisplay: 12 },
  { id: "j28", name: "Obleas con Cajeta de Leche 2.5oz", sec: 5, cost: 1.5, factorCaja: 144, hasDisplay: true, factorDisplay: 12 },
  { id: "j29", name: "Churritos Mexicanos Sal & Limon 4.2oz", sec: 6, cost: 1.5, factorCaja: 35, hasDisplay: false, factorDisplay: 1 },
  { id: "j30", name: "Churritos Mexicanos Chile & Limon 4.2oz", sec: 6, cost: 1.5, factorCaja: 35, hasDisplay: false, factorDisplay: 1 },
  { id: "j31", name: "Churros Locos Naturales 5oz", sec: 6, cost: 1.5, factorCaja: 24, hasDisplay: false, factorDisplay: 1 },
  { id: "j32", name: "Churros Locos Chile & Limon 5oz", sec: 6, cost: 1.5, factorCaja: 24, hasDisplay: false, factorDisplay: 1 },
  { id: "j33", name: "Saladitas Chile 2.5oz", sec: 7, cost: 1.5, factorCaja: 144, hasDisplay: true, factorDisplay: 12 },
  { id: "j34", name: "Saladitas naturales 2.5oz", sec: 7, cost: 1.5, factorCaja: 144, hasDisplay: true, factorDisplay: 12 },
  { id: "j35", name: "El súper León picositas 2.5oz", sec: 7, cost: 1.5, factorCaja: 144, hasDisplay: true, factorDisplay: 12 },
  { id: "j36", name: "Tama Bola 3.5oz", sec: 7, cost: 1.5, factorCaja: 96, hasDisplay: true, factorDisplay: 24 },
  { id: "j37", name: "Contenedor Sandías", sec: 7, cost: 2.93, factorCaja: 24, hasDisplay: false, factorDisplay: 1 },
  { id: "j38", name: "Contenedor mango", sec: 7, cost: 2.93, factorCaja: 24, hasDisplay: false, factorDisplay: 1 },
];

/* ------------------------------------------------------------------ *
 * APP: dos pestañas, cada una con su propio inventario
 * ------------------------------------------------------------------ */
function InventarioView({ RAW_PRODUCTS, SECTION_NAMES, STORAGE_KEY, TITLE, FILE }) {
  const SECTIONS = [...new Set(RAW_PRODUCTS.map((p) => p.sec))];
  const [entries, setEntries] = useState(() => {
    const saved = storage.load(STORAGE_KEY);
    const base = {};
    for (const p of RAW_PRODUCTS) {
      const sv = saved && saved[p.id];
      base[p.id] = Object.assign({}, blankEntry(p), sv ? { cajas: toNum(sv.cajas), display: toNum(sv.display), unidades: toNum(sv.unidades) } : {});
    }
    return base;
  });
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(() => new Set(SECTIONS));
  const [cfgId, setCfgId] = useState(null);
  const [toast, setToast] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    const counts = {};
    for (const id in entries) {
      const e = entries[id];
      counts[id] = { cajas: e.cajas, display: e.display, unidades: e.unidades };
    }
    storage.save(STORAGE_KEY, counts);
  }, [entries]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  /* ---------------- CÁLCULO CENTRAL (requisito 2) ---------------- */
  const calc = useMemo(() => {
    const perItem = {};
    const perSection = {};
    let totalUnits = 0, totalMoney = 0, counted = 0;

    for (const p of RAW_PRODUCTS) {
      const e = entries[p.id];
      const displayUnits = e.hasDisplay ? e.display * e.factorDisplay : 0;
      const total = e.cajas * e.factorCaja + displayUnits + e.unidades;
      const totalDinero = total * p.cost;
      perItem[p.id] = { total, totalDinero };

      if (!perSection[p.sec]) perSection[p.sec] = { units: 0, money: 0, items: 0 };
      perSection[p.sec].units += total;
      perSection[p.sec].money += totalDinero;
      if (total > 0) { perSection[p.sec].items += 1; counted += 1; }

      totalUnits += total;
      totalMoney += totalDinero;
    }
    return { perItem, perSection, totalUnits, totalMoney, counted };
  }, [entries]);

  /* ---------------- ACCIONES ---------------- */
  const update = (id, patch) =>
    setEntries((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  const step = (id, field, delta) =>
    setEntries((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: Math.max(0, (prev[id][field] || 0) + delta) },
    }));

  const setField = (id, field, raw) => {
    const n = parseFloat(raw);
    update(id, { [field]: raw === "" ? 0 : Math.max(0, Number.isFinite(n) ? n : 0) });
  };

  const toggleSection = (sec) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(sec) ? next.delete(sec) : next.add(sec);
      return next;
    });

  const resetAll = () => {
    if (!confirm("¿Reiniciar todos los conteos a cero? Los factores y displays configurados se conservan.")) return;
    setEntries((prev) => {
      const next = {};
      for (const p of RAW_PRODUCTS)
        next[p.id] = { ...prev[p.id], cajas: 0, display: 0, unidades: 0 };
      return next;
    });
    setToast("Conteos reiniciados");
  };

  /* ---------------- EXPORTAR CSV (requisito 5) ---------------- */
  const exportCSV = () => {
    const header = ["Product Description", "CAJAS", "DISPLAY", "UNIDADES", "TOTAL", "COST$", "TOTAL DINERO"];
    const esc = (v) => {
      const s = String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [header.join(",")];
    let curSec = null;
    for (const p of RAW_PRODUCTS) {
      if (p.sec !== curSec) { curSec = p.sec; lines.push(esc(SECTION_NAMES[p.sec])); }
      const e = entries[p.id];
      const it = calc.perItem[p.id];
      lines.push([
        esc(p.name),
        e.cajas, e.hasDisplay ? e.display : "", e.unidades,
        it.total, p.cost.toFixed(2), it.totalDinero.toFixed(2),
      ].join(","));
    }
    lines.push(["TOTALES", "", "", "", calc.totalUnits, "", calc.totalMoney.toFixed(2)].join(","));

    // BOM \uFEFF para que Excel respete acentos y UTF-8
    const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `${FILE}-${stamp}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setToast("CSV exportado");
  };

  /* ---------------- IMPORTAR CSV (usa cleanRows) ---------------- */
  const importCSV = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const cleaned = cleanRows(parseCSV(String(reader.result)));
        const byName = new Map(cleaned.map((r) => [r.name.toUpperCase(), r]));
        let matched = 0;
        setEntries((prev) => {
          const next = { ...prev };
          for (const p of RAW_PRODUCTS) {
            const r = byName.get(p.name.toUpperCase());
            if (r) {
              matched++;
              next[p.id] = {
                ...prev[p.id],
                cajas: r.cajas, unidades: r.unidades,
                display: r.display,
                hasDisplay: prev[p.id].hasDisplay || r.display > 0,
              };
            }
          }
          return next;
        });
        setToast(`Importados ${matched} productos`);
      } catch (e) {
        setToast("No se pudo leer el archivo");
      }
    };
    reader.readAsText(file);
  };

  /* ---------------- FILTRO ---------------- */
  const filtered = useMemo(() => {
    const q = query.trim().toUpperCase();
    if (!q) return RAW_PRODUCTS;
    return RAW_PRODUCTS.filter((p) => p.name.toUpperCase().includes(q));
  }, [query]);

  const visibleSections = SECTIONS.filter((s) => filtered.some((p) => p.sec === s));

  /* ================================================================ */
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-48">
      {/* ENCABEZADO FIJO */}
      <header className="sticky top-0 z-20 bg-slate-950 backdrop-blur border-b border-slate-800">
        <div className="mx-auto max-w-2xl px-4 pt-4 pb-3">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-amber-500 text-slate-950">
              <Boxes className="h-5 w-5" strokeWidth={2.4} />
            </div>
            <div className="leading-tight">
              <h1 className="text-base font-semibold tracking-tight">{TITLE}</h1>
              <p className="text-xs text-slate-400">Conteo semanal · Ruta King Soopers</p>
            </div>
          </div>

          {/* TOTALES GLOBALES */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Stat label="Unidades" value={num.format(calc.totalUnits)} tone="amber" />
            <Stat label="Valor total" value={money.format(calc.totalMoney)} tone="emerald" />
            <Stat label="Productos" value={`${calc.counted}/${RAW_PRODUCTS.length}`} tone="slate" />
          </div>

          {/* BÚSQUEDA */}
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar producto…"
              className="w-full rounded-lg border border-slate-800 bg-slate-900 py-2.5 pl-9 pr-9 text-sm placeholder:text-slate-500 outline-none focus:border-amber-500"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-200"
                aria-label="Limpiar búsqueda"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* SECCIONES */}
      <main className="mx-auto max-w-2xl px-4 py-4 space-y-3">
        {visibleSections.length === 0 && (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
            <PackageOpen className="mx-auto h-8 w-8 text-slate-600" />
            <p className="mt-2 text-sm text-slate-400">
              Sin resultados para “{query}”. Probá con otro nombre.
            </p>
          </div>
        )}

        {visibleSections.map((sec) => {
          const items = filtered.filter((p) => p.sec === sec);
          const s = calc.perSection[sec];
          const isOpen = open.has(sec) || !!query;
          return (
            <section key={sec} className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
              <button
                onClick={() => toggleSection(sec)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <div className="flex items-center gap-2">
                  {isOpen ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
                  <span className="text-sm font-semibold">{SECTION_NAMES[sec]}</span>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                    {items.length}
                  </span>
                </div>
                <span className="text-sm font-semibold tabular-nums text-emerald-400">
                  {money.format(s.money)}
                </span>
              </button>

              {isOpen && (
                <ul className="divide-y divide-slate-800 border-t border-slate-800">
                  {items.map((p) => (
                    <ProductRow
                      key={p.id}
                      product={p}
                      entry={entries[p.id]}
                      result={calc.perItem[p.id]}
                      onStep={step}
                      onSet={setField}
                      onUpdate={update}
                      configOpen={cfgId === p.id}
                      onToggleConfig={() => setCfgId(cfgId === p.id ? null : p.id)}
                    />
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </main>

      {/* BARRA DE ACCIONES FIJA */}
      <footer className="fixed inset-x-0 z-20 border-t border-slate-800 bg-slate-950 backdrop-blur" style={{ bottom: "calc(72px + env(safe-area-inset-bottom, 0px))" }}>
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-3">
          <button
            onClick={exportCSV}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-500 py-3 text-sm font-semibold text-slate-950 active:bg-amber-600"
          >
            <Download className="h-4 w-4" /> Exportar CSV
          </button>
          <button
            onClick={() => fileRef.current && fileRef.current.click()}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-200 active:bg-slate-800"
          >
            <Upload className="h-4 w-4" /> Importar
          </button>
          <button
            onClick={resetAll}
            className="grid place-items-center rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 text-slate-300 active:bg-slate-800"
            aria-label="Reiniciar conteos"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files && e.target.files[0];
              if (f) importCSV(f);
              e.target.value = "";
            }}
          />
        </div>
      </footer>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 z-30 -translate-x-1/2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 shadow-lg">
          <span className="flex items-center gap-1.5"><Check className="h-4 w-4" /> {toast}</span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
function Stat({ label, value, tone }) {
  const toneClass = {
    amber: "text-amber-400",
    emerald: "text-emerald-400",
    slate: "text-slate-200",
  }[tone];
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-2">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`text-sm font-bold tabular-nums ${toneClass}`}>{value}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function ProductRow({ product, entry, result, onStep, onSet, onUpdate, configOpen, onToggleConfig }) {
  const p = product, e = entry;
  return (
    <li className="px-4 py-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium leading-snug">{p.name}</p>
          <p className="mt-0.5 text-xs text-slate-500 tabular-nums">
            {money.format(p.cost)} c/u · factor caja ×{e.factorCaja}
            {e.hasDisplay && ` · display ×${e.factorDisplay}`}
          </p>
        </div>
        <button
          onClick={onToggleConfig}
          className={`shrink-0 rounded-md p-1.5 ${configOpen ? "bg-amber-500 text-slate-950" : "text-slate-500 hover:text-slate-300"}`}
          aria-label="Configurar factor y display"
        >
          <Settings2 className="h-4 w-4" />
        </button>
      </div>

      {/* ENTRADAS */}
      <div className={`mt-2.5 grid gap-2 ${e.hasDisplay ? "grid-cols-3" : "grid-cols-2"}`}>
        <Stepper label="Cajas" value={e.cajas}
          onMinus={() => onStep(p.id, "cajas", -1)}
          onPlus={() => onStep(p.id, "cajas", 1)}
          onChange={(v) => onSet(p.id, "cajas", v)} />
        {/* Renderizado condicional: el campo Display solo existe si el
            producto se maneja en display (requisito 3). */}
        {e.hasDisplay && (
          <Stepper label="Display" value={e.display}
            onMinus={() => onStep(p.id, "display", -1)}
            onPlus={() => onStep(p.id, "display", 1)}
            onChange={(v) => onSet(p.id, "display", v)} />
        )}
        <Stepper label="Unidades" value={e.unidades}
          onMinus={() => onStep(p.id, "unidades", -1)}
          onPlus={() => onStep(p.id, "unidades", 1)}
          onChange={(v) => onSet(p.id, "unidades", v)} />
      </div>

      {/* LECTURAS (solo lectura) */}
      <div className="mt-2 grid grid-cols-2 gap-2">
        <ReadOut label="Total (u)" value={num.format(result.total)} tone="amber" />
        <ReadOut label="Total dinero" value={money.format(result.totalDinero)} tone="emerald" />
      </div>

      {/* CONFIGURACIÓN */}
      {configOpen && (
        <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-3">
          <FactorField label="Unidades por caja" value={e.factorCaja}
            onChange={(v) => onUpdate(p.id, { factorCaja: Math.max(1, toNum(v) || 1) })} />
          <label className="flex items-center justify-between">
            <span className="text-sm text-slate-300">¿Se maneja en display?</span>
            <button
              onClick={() => onUpdate(p.id, { hasDisplay: !e.hasDisplay, display: e.hasDisplay ? 0 : e.display })}
              className={`relative h-6 w-11 rounded-full transition-colors ${e.hasDisplay ? "bg-amber-500" : "bg-slate-700"}`}
              role="switch" aria-checked={e.hasDisplay}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${e.hasDisplay ? "left-5" : "left-0.5"}`} />
            </button>
          </label>
          {e.hasDisplay && (
            <FactorField label="Unidades por display" value={e.factorDisplay}
              onChange={(v) => onUpdate(p.id, { factorDisplay: Math.max(1, toNum(v) || 1) })} />
          )}
        </div>
      )}
    </li>
  );
}

/* ------------------------------------------------------------------ */
function Stepper({ label, value, onMinus, onPlus, onChange }) {
  return (
    <div>
      <div className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className="flex items-stretch overflow-hidden rounded-lg border border-slate-700 bg-slate-950">
        <button onClick={onMinus} className="grid w-9 place-items-center text-slate-400 active:bg-slate-800" aria-label={`Restar ${label}`}>
          <Minus className="h-4 w-4" />
        </button>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={(e) => e.target.select()}
          inputMode="numeric"
          className="w-full min-w-0 bg-transparent py-2 text-center text-base font-semibold tabular-nums outline-none"
        />
        <button onClick={onPlus} className="grid w-9 place-items-center text-amber-400 active:bg-slate-800" aria-label={`Sumar ${label}`}>
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ReadOut({ label, value, tone }) {
  const toneClass = tone === "emerald" ? "text-emerald-400" : "text-amber-400";
  return (
    <div className="rounded-lg bg-slate-950 px-3 py-2">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`text-base font-bold tabular-nums ${toneClass}`}>{value}</div>
    </div>
  );
}

function FactorField({ label, value, onChange }) {
  return (
    <label className="flex items-center justify-between">
      <span className="text-sm text-slate-300">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => e.target.select()}
        inputMode="numeric"
        className="w-20 rounded-md border border-slate-700 bg-slate-900 py-1.5 text-center text-sm font-semibold tabular-nums outline-none focus:border-amber-500"
      />
    </label>
  );
}

const TABS = [
  { id: "mexi", label: "MexiLink" },
  { id: "jjlg", label: "JJLG IMPORTERS" },
];

const THEME_KEY = "inventario_tema_v1";

/* Modo claro: cambia los colores oscuros de la app por claros */
const LIGHT_CSS = `
.theme-light.bg-slate-950, .theme-light .bg-slate-950 { background-color: #f1f5f9 !important; }
.theme-light .bg-slate-900 { background-color: #ffffff !important; }
.theme-light .bg-slate-800 { background-color: #e2e8f0 !important; }
.theme-light .bg-slate-700 { background-color: #cbd5e1 !important; }
.theme-light .border-slate-800 { border-color: #cbd5e1 !important; }
.theme-light .border-slate-700 { border-color: #94a3b8 !important; }
.theme-light .text-slate-100, .theme-light .text-slate-200 { color: #0f172a !important; }
.theme-light .text-slate-300 { color: #334155 !important; }
.theme-light .text-slate-400, .theme-light .text-slate-500 { color: #64748b !important; }
.theme-light .text-slate-600 { color: #94a3b8 !important; }
.theme-light .text-emerald-400 { color: #047857 !important; }
.theme-light .text-emerald-300 { color: #065f46 !important; }
.theme-light .text-amber-400 { color: #b45309 !important; }
.theme-light .text-amber-300 { color: #92400e !important; }
.theme-light .bg-emerald-900 { background-color: #d1fae5 !important; }
.theme-light .bg-amber-900 { background-color: #fef3c7 !important; }
.theme-light input, .theme-light select { color: #0f172a !important; }
`;

export default function App() {
  const [tab, setTab] = useState("mexi");
  const [theme, setTheme] = useState(() => {
    const saved = storage.load(THEME_KEY);
    return saved === "light" ? "light" : "dark";
  });
  useEffect(() => { storage.save(THEME_KEY, theme); }, [theme]);
  const light = theme === "light";
  return (
    <div
      className={(light ? "theme-light " : "") + "min-h-screen bg-slate-950"}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <style>{LIGHT_CSS}</style>

      {tab === "mexi" ? (
        <InventarioView
          key="mexi"
          RAW_PRODUCTS={MEXI_PRODUCTS}
          SECTION_NAMES={MEXI_NAMES}
          STORAGE_KEY={MEXI_KEY}
          TITLE="Inventario MexiLink"
          FILE="inventario-mexilink"
        />
      ) : (
        <InventarioView
          key="jjlg"
          RAW_PRODUCTS={JJLG_PRODUCTS}
          SECTION_NAMES={JJLG_NAMES}
          STORAGE_KEY={JJLG_KEY}
          TITLE="Inventario JJLG IMPORTERS"
          FILE="inventario-jjlg"
        />
      )}

      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-800 bg-slate-950"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="mx-auto flex max-w-2xl items-stretch gap-2 px-3 py-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={
                "flex-1 rounded-lg py-3 text-sm font-semibold " +
                (tab === t.id ? "bg-amber-500 text-slate-950" : "bg-slate-900 text-slate-400")
              }
            >
              {t.label}
            </button>
          ))}
          <button
            onClick={() => setTheme(light ? "dark" : "light")}
            aria-label={light ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
            className="grid w-12 place-items-center rounded-lg bg-slate-900 text-slate-300"
          >
            {light ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
        </div>
      </nav>
    </div>
  );
}
