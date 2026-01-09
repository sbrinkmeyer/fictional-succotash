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