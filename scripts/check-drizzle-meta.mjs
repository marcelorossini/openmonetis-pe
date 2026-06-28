import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const drizzleDir = new URL("../drizzle/", import.meta.url);
const metaDir = new URL("../drizzle/meta/", import.meta.url);
const zeroId = "00000000-0000-0000-0000-000000000000";

function fail(message) {
	console.error(`Erro de metadata do Drizzle: ${message}`);
	process.exit(1);
}

function listIndexes(files, regex) {
	return files
		.map((file) => {
			const match = file.match(regex);
			return match ? Number(match[1]) : null;
		})
		.filter((value) => value !== null)
		.sort((a, b) => a - b);
}

const sqlFiles = readdirSync(drizzleDir).filter((file) => file.endsWith(".sql"));
const metaFiles = readdirSync(metaDir);
const snapshotFiles = metaFiles.filter((file) => /^\d{4}_snapshot\.json$/.test(file)).sort();

if (sqlFiles.length === 0) {
	fail("nenhuma migration SQL foi encontrada em drizzle/.");
}

if (snapshotFiles.length === 0) {
	fail("nenhum snapshot foi encontrado em drizzle/meta/.");
}

const journal = JSON.parse(readFileSync(join(metaDir.pathname, "_journal.json"), "utf8"));
const sqlIndexes = listIndexes(sqlFiles, /^(\d{4})_.*\.sql$/);
const snapshotIndexes = listIndexes(snapshotFiles, /^(\d{4})_snapshot\.json$/);
const highestSqlIndex = sqlIndexes.at(-1);
const highestSnapshotIndex = snapshotIndexes.at(-1);
const highestJournalIndex = journal.entries.at(-1)?.idx;

if (highestJournalIndex === undefined) {
	fail("o journal do Drizzle nao possui entries.");
}

if (highestJournalIndex !== highestSqlIndex) {
	fail(
		`o journal termina em ${String(highestJournalIndex).padStart(4, "0")}, mas a ultima migration SQL e ${String(highestSqlIndex).padStart(4, "0")}.`,
	);
}

if (highestSnapshotIndex !== highestJournalIndex) {
	fail(
		`o ultimo snapshot e ${String(highestSnapshotIndex).padStart(4, "0")}, mas o journal termina em ${String(highestJournalIndex).padStart(4, "0")}.`,
	);
}

const parentMap = new Map();

for (const snapshotFile of snapshotFiles) {
	const snapshot = JSON.parse(readFileSync(join(metaDir.pathname, snapshotFile), "utf8"));
	const bucket = parentMap.get(snapshot.prevId) ?? [];
	bucket.push(snapshotFile);
	parentMap.set(snapshot.prevId, bucket);
}

for (const [prevId, files] of parentMap.entries()) {
	if (files.length > 1) {
		const parentLabel = prevId === zeroId ? "ROOT" : prevId;
		fail(`os snapshots [${files.join(", ")}] apontam para o mesmo parent ${parentLabel}.`);
	}
}

console.log("Metadata do Drizzle consistente.");
