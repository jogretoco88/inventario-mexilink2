import { useState, useMemo, useEffect, useRef } from "react";
import {
  Boxes, Search, Download, Upload, RotateCcw, Settings2,
  ChevronDown, ChevronRight, Plus, Minus, PackageOpen, Check, X,
} from "lucide-react";

/* ------------------------------------------------------------------ *
 * DATOS BASE
 * Generados desde "Hoja de calculo para aplicacion movil.xlsx".
 * sec = sección de estante (8..1, tal como venían los divisores
 * "Product Description N" en la hoja original).
 * ------------------------------------------------------------------ */
const RAW_PRODUCTS = [
  { id: "p1", name: "DE LA ROSA MAZAPAN CHICA", sec: 8, cost: 3.07, factorCaja: 24, hasDisplay: false, factorDisplay: 1 },
  { id: "p2", name: "DE LA ROSA PULPARINDOTS", sec: 8, cost: 4.43, factorCaja: 12, hasDisplay: false, factorDisplay: 1 },
  { id: "p3", name: "DE LA ROSA MAZAPAN CHOCOLATE", sec: 8, cost: 5.08, factorCaja: 24, hasDisplay: false, factorDisplay: 1 },
  { id: "p4", name: "RICOLINO DUVALIN TRISABOR", sec: 8, cost: 2.86, factorCaja: 24, hasDisplay: false, factorDisplay: 1 },
  { id: "p5", name: "DUVALIN HAZELNUT VANILLA", sec: 8, cost: 2.86, factorCaja: 24, hasDisplay: false, factorDisplay: 1 },
  { id: "p6", name: "(CHICLES) CANELS CHEWING GUM", sec: 8, cost: 3.25, factorCaja: 40, hasDisplay: false, factorDisplay: 1 },
  { id: "p7", name: "EL AZTECA CUCHARITAS", sec: 8, cost: 2.69, factorCaja: 24, hasDisplay: false, factorDisplay: 1 },
  { id: "p8", name: "EL AZTECA FLECHAZOS MINI", sec: 8, cost: 11.33, factorCaja: 8, hasDisplay: false, factorDisplay: 1 },
  { id: "p9", name: "LORENA PELON PELO RICO", sec: 8, cost: 5.18, factorCaja: 24, hasDisplay: false, factorDisplay: 1 },
  { id: "p10", name: "PELONETA", sec: 8, cost: 5.79, factorCaja: 18, hasDisplay: false, factorDisplay: 1 },
  { id: "p11", name: "JARRITOS SOUR GUMMIES", sec: 7, cost: 2.68, factorCaja: 12, hasDisplay: false, factorDisplay: 1 },
  { id: "p12", name: "DE LA ROSA CACAHUATE 900gr", sec: 7, cost: 6.59, factorCaja: 9, hasDisplay: false, factorDisplay: 1 },
  { id: "p13", name: "DE LA ROSA CACAHUATE JPN NSHYMA", sec: 7, cost: 0.3, factorCaja: 200, hasDisplay: true, factorDisplay: 50 },
  { id: "p14", name: "DE LA ROSA PULPARINDO AMARILLO", sec: 7, cost: 3.36, factorCaja: 16, hasDisplay: false, factorDisplay: 1 },
  { id: "p15", name: "DE LA ROSA PULPARINDO ROJO", sec: 7, cost: 3.32, factorCaja: 32, hasDisplay: false, factorDisplay: 1 },
  { id: "p16", name: "LORENA MINI PELON", sec: 7, cost: 2.79, factorCaja: 24, hasDisplay: false, factorDisplay: 1 },
  { id: "p17", name: "LORENA PELON RICO CHAMOY 12ct", sec: 7, cost: 5.18, factorCaja: 24, hasDisplay: false, factorDisplay: 1 },
  { id: "p18", name: "LORENA MINI PELON SURTIDO", sec: 7, cost: 2.79, factorCaja: 20, hasDisplay: false, factorDisplay: 1 },
  { id: "p19", name: "JARRITOS REGULAR GUMMIES", sec: 6, cost: 2.68, factorCaja: 12, hasDisplay: false, factorDisplay: 1 },
  { id: "p20", name: "RICOLINO PALETA PAYASO", sec: 6, cost: 0.8, factorCaja: 60, hasDisplay: true, factorDisplay: 10 },
  { id: "p21", name: "RICOLINO BUBU LUBU", sec: 6, cost: 0.64, factorCaja: 192, hasDisplay: true, factorDisplay: 24 },
  { id: "p22", name: "PELONAZO", sec: 6, cost: 1.53, factorCaja: 48, hasDisplay: true, factorDisplay: 4 },
  { id: "p23", name: "SKWINKLOTE", sec: 6, cost: 0.89, factorCaja: 144, hasDisplay: true, factorDisplay: 6 },
  { id: "p24", name: "LUCAS GUSANO CHAMOY", sec: 6, cost: 0.61, factorCaja: 300, hasDisplay: true, factorDisplay: 10 },
  { id: "p25", name: "LUCAS GUSANO TAMARIND", sec: 6, cost: 0.61, factorCaja: 300, hasDisplay: true, factorDisplay: 10 },
  { id: "p26", name: "LUCAS BABY CHAMOY", sec: 6, cost: 0.47, factorCaja: 300, hasDisplay: true, factorDisplay: 10 },
  { id: "p27", name: "LUCAS BABY MANGO", sec: 6, cost: 0.41, factorCaja: 300, hasDisplay: true, factorDisplay: 10 },
  { id: "p28", name: "LUCAS SKWNKLES RELLENOS", sec: 5, cost: 0.59, factorCaja: 288, hasDisplay: true, factorDisplay: 12 },
  { id: "p29", name: "LUCAS SKWNKLES CHUNKS", sec: 5, cost: 2.91, factorCaja: 12, hasDisplay: false, factorDisplay: 1 },
  { id: "p30", name: "SALSAGHETI KING SIZE SANDIA", sec: 5, cost: 1.41, factorCaja: 120, hasDisplay: true, factorDisplay: 6 },
  { id: "p31", name: "LUCAS SALSAGHETI MANGO", sec: 5, cost: 7.18, factorCaja: 12, hasDisplay: false, factorDisplay: 1 },
  { id: "p32", name: "TAJIN PALETA BOLSA CHICA", sec: 4, cost: 2.8, factorCaja: 12, hasDisplay: false, factorDisplay: 1 },
  { id: "p33", name: "BONBONUM TROPICAL", sec: 4, cost: 1.53, factorCaja: 12, hasDisplay: false, factorDisplay: 1 },
  { id: "p34", name: "ZUMBA PALETA TAMARINDO", sec: 4, cost: 5.82, factorCaja: 20, hasDisplay: false, factorDisplay: 1 },
  { id: "p35", name: "ZUMBA GOMA SANDIA", sec: 4, cost: 6.55, factorCaja: 20, hasDisplay: false, factorDisplay: 1 },
  { id: "p36", name: "LA VAQUITA PALETA", sec: 4, cost: 3.41, factorCaja: 12, hasDisplay: false, factorDisplay: 1 },
  { id: "p37", name: "LA VAQUITA CHOCOLOSO CARAMELOS", sec: 4, cost: 3.66, factorCaja: 7, hasDisplay: false, factorDisplay: 1 },
  { id: "p38", name: "CANELS PINATERO", sec: 4, cost: 17.93, factorCaja: 6, hasDisplay: false, factorDisplay: 1 },
  { id: "p39", name: "VERO ELOTE PALETA", sec: 3, cost: 4.94, factorCaja: 7, hasDisplay: false, factorDisplay: 1 },
  { id: "p40", name: "VERO MANGO PALETA", sec: 3, cost: 4.94, factorCaja: 7, hasDisplay: false, factorDisplay: 1 },
  { id: "p41", name: "VERO PINTA AZUL PALETA", sec: 3, cost: 4.94, factorCaja: 7, hasDisplay: false, factorDisplay: 1 },
  { id: "p42", name: "VERO BANDA FUEGO MIX", sec: 3, cost: 4.94, factorCaja: 7, hasDisplay: false, factorDisplay: 1 },
  { id: "p43", name: "VERO PICAGOMA FRESA", sec: 3, cost: 4.94, factorCaja: 8, hasDisplay: false, factorDisplay: 1 },
  { id: "p44", name: "VERO RELLERINDOS", sec: 3, cost: 5.14, factorCaja: 8, hasDisplay: false, factorDisplay: 1 },
  { id: "p45", name: "SONRICS ROCKALETA", sec: 2, cost: 7.48, factorCaja: 10, hasDisplay: false, factorDisplay: 1 },
  { id: "p46", name: "DE LA ROSA PINATERO", sec: 1, cost: 16.61, factorCaja: 6, hasDisplay: false, factorDisplay: 1 },
  { id: "p47", name: "RICOLINO RICOFIESTA", sec: 1, cost: 14.58, factorCaja: 4, hasDisplay: false, factorDisplay: 1 },
  { id: "p48", name: "PALETA TAJIN BOLSA GRANDE", sec: 1, cost: 9.44, factorCaja: 10, hasDisplay: false, factorDisplay: 1 },
  { id: "p49", name: "DE LA ROSA BOMBON GIGANTE", sec: 1, cost: 5.93, factorCaja: 10, hasDisplay: false, factorDisplay: 1 },
];

const STORAGE_KEY = "mexilink_inventario_v2";

/* ------------------------------------------------------------------ *
 * PERSISTENCIA SEGURA
 * Usa localStorage cuando está disponible; si no (vista previa en
 * sandbox, modo privado, etc.) cae a memoria sin romper la app.
 * ------------------------------------------------------------------ */
const storage = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  save(value) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
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
    const name = String(row[0] ?? "").trim();
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

const SECTIONS = [...new Set(RAW_PRODUCTS.map((p) => p.sec))].sort((a, b) => b - a);

export default function App() {
  const [entries, setEntries] = useState(() => {
    const saved = storage.load();
    const base = {};
    for (const p of RAW_PRODUCTS) base[p.id] = { ...blankEntry(p), ...(saved?.[p.id] || {}) };
    return base;
  });
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(() => new Set(SECTIONS));
  const [cfgId, setCfgId] = useState(null);
  const [toast, setToast] = useState("");
  const fileRef = useRef(null);

  useEffect(() => { storage.save(entries); }, [entries]);
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
      if (p.sec !== curSec) { curSec = p.sec; lines.push(esc(`Sección ${p.sec}`)); }
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
    a.download = `inventario-mexilink-${stamp}.csv`;
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
      } catch {
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
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28">
      {/* ENCABEZADO FIJO */}
      <header className="sticky top-0 z-20 bg-slate-950 backdrop-blur border-b border-slate-800">
        <div className="mx-auto max-w-2xl px-4 pt-4 pb-3">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-amber-500 text-slate-950">
              <Boxes className="h-5 w-5" strokeWidth={2.4} />
            </div>
            <div className="leading-tight">
              <h1 className="text-base font-semibold tracking-tight">Inventario MexiLink</h1>
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
                  <span className="text-sm font-semibold">Sección {sec}</span>
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
      <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-800 bg-slate-950 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-3">
          <button
            onClick={exportCSV}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-500 py-3 text-sm font-semibold text-slate-950 active:bg-amber-600"
          >
            <Download className="h-4 w-4" /> Exportar CSV
          </button>
          <button
            onClick={() => fileRef.current?.click()}
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
              const f = e.target.files?.[0];
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
          <p className="truncate text-sm font-medium leading-tight">{p.name}</p>
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
