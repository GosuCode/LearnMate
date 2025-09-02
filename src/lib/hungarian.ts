export type Matrix = number[][];
export type Step = {
    title: string;
    description: string;
    matrix: Matrix;
    coveredRows?: boolean[];
    coveredCols?: boolean[];
    starred?: boolean[][];
    primed?: boolean[][];
};

const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x));

function padToSquare(costs: Matrix) {
    const m = costs.length, n = costs[0].length;
    const size = Math.max(m, n);
    const padded = costs.map(r => r.slice());
    for (let i = 0; i < m; i++) while (padded[i].length < size) padded[i].push(0);
    for (let i = m; i < size; i++) padded.push(Array(size).fill(0));
    return { padded, size, addedRows: Math.max(0, size - m), addedCols: Math.max(0, size - n) };
}

export function solveAssignmentWithSteps(costs: Matrix) {
    const original = clone(costs);
    const { padded, size, addedRows, addedCols } = padToSquare(costs);
    let a = padded;
    const steps: Step[] = [];

    const push = (title: string, description: string, extras: Partial<Step> = {}) =>
        steps.push({ title, description, matrix: clone(a), ...extras });

    push("Pad to square", `Padded to ${size}×${size} by adding ${addedRows} row(s) and ${addedCols} column(s) of zeros.`);

    // Row reduction
    for (let i = 0; i < size; i++) {
        const rmin = Math.min(...a[i]);
        for (let j = 0; j < size; j++) a[i][j] -= rmin;
    }
    push("Row reduction", "Subtract the minimum of each row.");

    // Column reduction
    for (let j = 0; j < size; j++) {
        let cmin = Infinity;
        for (let i = 0; i < size; i++) cmin = Math.min(cmin, a[i][j]);
        for (let i = 0; i < size; i++) a[i][j] -= cmin;
    }
    push("Column reduction", "Subtract the minimum of each column.");

    // Hungarian star/prime machinery
    const starred: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
    const primed: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
    const coveredRows: boolean[] = Array(size).fill(false);
    const coveredCols: boolean[] = Array(size).fill(false);

    // Star independent zeros
    const rowHasStar = Array(size).fill(false);
    const colHasStar = Array(size).fill(false);
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (a[i][j] === 0 && !rowHasStar[i] && !colHasStar[j]) {
                starred[i][j] = true;
                rowHasStar[i] = colHasStar[j] = true;
            }
        }
    }
    push("Initial starring", "Star a set of independent zeros.", { starred: clone(starred) });

    // Cover columns having a star
    for (let j = 0; j < size; j++) coveredCols[j] = starred.some(row => row[j]);
    push("Cover starred columns", "Cover every column containing a starred zero.", {
        coveredCols: clone(coveredCols), starred: clone(starred),
    });

    const findZero = () => {
        for (let i = 0; i < size; i++) if (!coveredRows[i])
            for (let j = 0; j < size; j++) if (!coveredCols[j] && a[i][j] === 0) return [i, j] as const;
        return null;
    };

    const starInRow = (r: number) => starred[r].findIndex(v => v);
    const starInCol = (c: number) => starred.findIndex(row => row[c]);
    const primeInRow = (r: number) => primed[r].findIndex(v => v);

    while (coveredCols.filter(Boolean).length < size) {
        // Step: find an uncovered zero; if none, adjust matrix
        let z = findZero();
        while (!z) {
            let minUncovered = Infinity;
            for (let i = 0; i < size; i++) if (!coveredRows[i])
                for (let j = 0; j < size; j++) if (!coveredCols[j])
                    minUncovered = Math.min(minUncovered, a[i][j]);

            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    if (!coveredRows[i] && !coveredCols[j]) a[i][j] -= minUncovered;
                    else if (coveredRows[i] && coveredCols[j]) a[i][j] += minUncovered;
                }
            }
            push("Adjust matrix", "No uncovered zeros. Subtract min uncovered; add at intersections.",
                { coveredRows: clone(coveredRows), coveredCols: clone(coveredCols) });
            z = findZero();
        }

        const [r, c] = z;
        primed[r][c] = true;
        push("Prime zero", `Prime uncovered zero at (r${r + 1}, c${c + 1}).`,
            { primed: clone(primed), coveredRows: clone(coveredRows), coveredCols: clone(coveredCols) });

        const jStar = starInRow(r);
        if (jStar === -1) {
            // Augmenting path: start with this primed zero
            let path: [number, number][] = [[r, c]];
            // Build alternating sequence: col of last, find starred; then row of that, find primed; repeat
            while (true) {
                const iStar = starInCol(path[path.length - 1][1]);
                if (iStar === -1) break;
                path.push([iStar, path[path.length - 1][1]]);
                const jPrime = primed[iStar].findIndex(v => v);
                path.push([iStar, jPrime]);
            }
            // Flip stars along path; clear primes; uncover all
            for (const [ri, ci] of path) starred[ri][ci] = !starred[ri][ci];
            for (let i = 0; i < size; i++) primed[i].fill(false);
            coveredRows.fill(false); coveredCols.fill(false);

            // Re-cover columns with stars
            for (let j = 0; j < size; j++) coveredCols[j] = starred.some(row => row[j]);
            push("Augment stars", "Flip along augmenting path; clear primes; re-cover starred columns.",
                { starred: clone(starred), coveredCols: clone(coveredCols) });
        } else {
            // Cover the row, uncover the column of its star; continue searching zeros
            coveredRows[r] = true;
            coveredCols[jStar] = false;
            push("Update covers", "Row with primed zero covered; column of its star uncovered.",
                { primed: clone(primed), coveredRows: clone(coveredRows), coveredCols: clone(coveredCols) });
        }
    }

    // Extract assignments from stars
    const assignments: [number, number][] = [];
    for (let i = 0; i < size; i++) {
        const j = starred[i].findIndex(v => v);
        if (j !== -1) assignments.push([i, j]);
    }

    // Map back to original (drop dummy rows/cols)
    const effective = assignments.filter(([i, j]) => i < original.length && j < original[0].length);
    let totalCost = 0;
    for (const [i, j] of effective) totalCost += original[i][j];

    push("Final assignments", "Starred zeros give the optimal assignment.", { starred: clone(starred) });

    return {
        assignments: effective, // [contractorIndex, taskIndex]
        totalCost,
        steps,
    };
}
