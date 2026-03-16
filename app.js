const dens = [2, 4, 8, 16, 32];

function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b !== 0) [a, b] = [b, a % b];
    return a || 1;
}

function fmtMixed(whole, num, den) {
    if (num === 0) return String(whole);

    const g = gcd(num, den);
    num = num / g;
    den = den / g;

    if (whole === 0) return `${num}/${den}`;
    return `${whole} ${num}/${den}`;
}

function cutLongStopShort(value) {
    if (!Number.isFinite(value)) return { cut: "—", stop: "—" };

    const sign = value < 0 ? -1 : 1;
    let v = Math.abs(value);

    let whole = Math.floor(v);
    let dec = v - whole;

    let cut = "—";
    let stop = "—";

    for (const den of dens) {
        const x = dec * den;

        // cut long (ceil)
        let up = Math.ceil(x);
        let wUp = whole;
        if (up === den) { wUp += 1; up = 0; }
        cut = fmtMixed(wUp, up, den);

        // stop short (floor)
        let dn = Math.floor(x);
        let wDn = whole;
        if (dn === den) { wDn += 1; dn = 0; }
        stop = fmtMixed(wDn, dn, den);
    }

    if (sign < 0) {
        cut = "-" + cut;
        stop = "-" + stop;
    }
    return { cut, stop };
}

const inEl = document.getElementById("decimalIn");
const mmEl = document.getElementById("metricMm");
const cutEl = document.getElementById("cutLong");
const stopEl = document.getElementById("stopShort");

let suppress = false;

function parseLooseNumber(s) {
    const raw = (s ?? "").trim();
    if (!raw) return NaN;
    const normalized = raw.startsWith(".") ? ("0" + raw) : raw;
    return Number(normalized);
}

function renderFromInches(inches, updateOtherField) {
    if (!Number.isFinite(inches)) {
        cutEl.textContent = "—";
        stopEl.textContent = "—";
        if (updateOtherField) mmEl.value = "";
        return;
    }

    const { cut, stop } = cutLongStopShort(inches);
    cutEl.textContent = cut;
    stopEl.textContent = stop;

    if (updateOtherField) {
        mmEl.value = (inches * 25.4).toFixed(3);
    }
}

function renderFromMm(mm, updateOtherField) {
    if (!Number.isFinite(mm)) {
        cutEl.textContent = "—";
        stopEl.textContent = "—";
        if (updateOtherField) inEl.value = "";
        return;
    }

    const inches = mm / 25.4;
    if (updateOtherField) {
        // show inches reasonably; user can refine
        inEl.value = inches.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
    }
    renderFromInches(inches, false);
}

inEl.addEventListener("input", () => {
    if (suppress) return;
    suppress = true;
    const inches = parseLooseNumber(inEl.value);
    renderFromInches(inches, true);
    suppress = false;
});

mmEl.addEventListener("input", () => {
    if (suppress) return;
    suppress = true;
    const mm = parseLooseNumber(mmEl.value);
    renderFromMm(mm, true);
    suppress = false;
});

// Fraction → Decimal
const fracWholeEl = document.getElementById("fracWhole");
const fracNumEl = document.getElementById("fracNum");
const fracDenEl = document.getElementById("fracDen");

function renderFromFraction() {
    const whole = parseLooseNumber(fracWholeEl.value) || 0;
    const num = parseLooseNumber(fracNumEl.value);
    const den = parseLooseNumber(fracDenEl.value);
    if (!fracWholeEl.value.trim() && !fracNumEl.value.trim() && !fracDenEl.value.trim()) {
        inEl.value = "";
        renderFromInches(NaN, true);
        return;
    }
    if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) return;
    const inches = whole + num / den;
    inEl.value = inches.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
    renderFromInches(inches, true);
}

[fracWholeEl, fracNumEl, fracDenEl].forEach(el => {
    el.addEventListener("input", renderFromFraction);
});

// Board Foot Calculator
const bfDescEl  = document.getElementById("bfDesc");
const bfThickEl = document.getElementById("bfThick");
const bfWidthEl = document.getElementById("bfWidth");
const bfLengthEl = document.getElementById("bfLength");
const bfQtyEl   = document.getElementById("bfQty");
const bfPriceEl = document.getElementById("bfPrice");
const bfResultEl = document.getElementById("bfResult");
const bfCostEl  = document.getElementById("bfCost");
const bfCostRow = document.getElementById("bfCostRow");

let currentBfPerPiece = NaN;

function calcBoardFeet() {
    const t = parseLooseNumber(bfThickEl.value);
    const w = parseLooseNumber(bfWidthEl.value);
    const l = parseLooseNumber(bfLengthEl.value);
    const qty = Math.max(1, parseLooseNumber(bfQtyEl.value) || 1);
    if (!Number.isFinite(t) || !Number.isFinite(w) || !Number.isFinite(l)) {
        bfResultEl.textContent = "—";
        bfCostRow.style.display = "none";
        currentBfPerPiece = NaN;
        return;
    }
    currentBfPerPiece = (t * w * l) / 12;
    const totalBf = currentBfPerPiece * qty;
    bfResultEl.textContent = parseFloat(totalBf.toFixed(3)) + " bf" + (qty > 1 ? ` (${qty} pcs)` : "");
    updateCostDisplay();
}

function updateCostDisplay() {
    const qty = Math.max(1, parseLooseNumber(bfQtyEl.value) || 1);
    const price = parseLooseNumber(bfPriceEl.value);
    if (!Number.isFinite(currentBfPerPiece) || !Number.isFinite(price)) {
        bfCostRow.style.display = "none";
        return;
    }
    bfCostEl.textContent = "$" + (currentBfPerPiece * qty * price).toFixed(2);
    bfCostRow.style.display = "";
}

[bfThickEl, bfWidthEl, bfLengthEl, bfQtyEl].forEach(el => el.addEventListener("input", calcBoardFeet));
bfPriceEl.addEventListener("input", updateCostDisplay);

// Cut List
let cutListCounter = 0;
const cutItems = [];

function escHtml(s) {
    return String(s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function addToCutList() {
    const t = parseLooseNumber(bfThickEl.value);
    const w = parseLooseNumber(bfWidthEl.value);
    const l = parseLooseNumber(bfLengthEl.value);
    if (!Number.isFinite(t) || !Number.isFinite(w) || !Number.isFinite(l)) return;
    const qty = Math.max(1, parseLooseNumber(bfQtyEl.value) || 1);
    const price = parseLooseNumber(bfPriceEl.value);
    const desc = bfDescEl.value.trim() || `Board ${++cutListCounter}`;
    cutItems.push({
        id: Date.now(), desc, t, w, l, qty,
        bf: currentBfPerPiece,
        price: Number.isFinite(price) ? price : null,
    });
    renderCutList();
}

function removeFromCutList(id) {
    const idx = cutItems.findIndex(x => x.id === id);
    if (idx !== -1) cutItems.splice(idx, 1);
    renderCutList();
}

function renderCutList() {
    const emptyEl  = document.getElementById("cutListEmpty");
    const itemsEl  = document.getElementById("cutListItems");
    const totalRow = document.getElementById("cutListTotalRow");
    itemsEl.innerHTML = "";
    if (cutItems.length === 0) {
        emptyEl.style.display = "";
        totalRow.style.display = "none";
        return;
    }
    emptyEl.style.display = "none";
    let totalBf = 0, totalCost = 0, hasCost = false;
    for (const item of cutItems) {
        const lineBf   = item.bf * item.qty;
        const lineCost = item.price !== null ? item.price * lineBf : null;
        totalBf += lineBf;
        if (lineCost !== null) { totalCost += lineCost; hasCost = true; }
        const row = document.createElement("div");
        row.className = "cut-item";
        row.innerHTML =
            `<div class="cut-item-info">` +
                `<div class="cut-item-name">${escHtml(item.desc)}${item.qty > 1 ? " ×" + item.qty : ""}</div>` +
                `<div class="cut-item-dims">${item.t}" × ${item.w}" × ${item.l}ft</div>` +
            `</div>` +
            `<div class="cut-item-vals">` +
                `<div class="cut-item-bf">${parseFloat(lineBf.toFixed(3))} bf</div>` +
                (lineCost !== null ? `<div class="cut-item-cost">$${lineCost.toFixed(2)}</div>` : "") +
            `</div>` +
            `<button class="del-btn" aria-label="Remove">✕</button>`;
        row.querySelector(".del-btn").addEventListener("click", () => removeFromCutList(item.id));
        itemsEl.appendChild(row);
    }
    document.getElementById("cutListTotalBf").textContent = parseFloat(totalBf.toFixed(3)) + " bf";
    document.getElementById("cutListTotalCost").textContent = hasCost ? "$" + totalCost.toFixed(2) : "";
    totalRow.style.display = "";
}

document.getElementById("addToListBtn").addEventListener("click", addToCutList);
document.getElementById("clearListBtn").addEventListener("click", () => {
    cutItems.length = 0;
    cutListCounter = 0;
    renderCutList();
});
