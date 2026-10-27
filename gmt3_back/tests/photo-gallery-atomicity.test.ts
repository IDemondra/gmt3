import { afterEach, describe, expect, test } from 'bun:test';
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import * as schema from '../src/models/schema.js';
import { PhotoEvenementRepository } from '../src/repositories/PhotoEvenementRepository.js';

let sqlite: Database | undefined;

function createRepository() {
	sqlite = new Database(':memory:');
	sqlite.run(`
		CREATE TABLE photos_evenement (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			evenement_id INTEGER NOT NULL,
			url TEXT NOT NULL,
			ordre INTEGER DEFAULT 0,
			legende TEXT
		);
	`);
	return new PhotoEvenementRepository(drizzle(sqlite, { schema }));
}

afterEach(() => {
	sqlite?.close();
	sqlite = undefined;
});

describe('PhotoEvenementRepository.replaceByEvenementId', () => {
	test('restaure l’ancienne galerie si l’insertion échoue', async () => {
		const repository = createRepository();
		sqlite!.run("INSERT INTO photos_evenement (evenement_id, url, ordre) VALUES (42, '/old.jpg', 1)");
		sqlite!.run(`
			CREATE TRIGGER fail_gallery_insert
			BEFORE INSERT ON photos_evenement
			BEGIN
				SELECT RAISE(ABORT, 'forced insert failure');
			END;
		`);

		await expect(repository.replaceByEvenementId(42, [
			{ evenementId: 42, url: '/new.jpg', ordre: 1, legende: null },
		])).rejects.toThrow('forced insert failure');

		const rows = sqlite!.query('SELECT evenement_id, url, ordre FROM photos_evenement').all();
		expect(rows).toEqual([{ evenement_id: 42, url: '/old.jpg', ordre: 1 }]);
	});

	test('remplace toutes les lignes en une seule opération', async () => {
		const repository = createRepository();
		sqlite!.run("INSERT INTO photos_evenement (evenement_id, url, ordre) VALUES (42, '/old.jpg', 1)");

		const photos = await repository.replaceByEvenementId(42, [
			{ evenementId: 42, url: '/new-1.jpg', ordre: 1, legende: null },
			{ evenementId: 42, url: '/new-2.jpg', ordre: 2, legende: null },
		]);

		expect(photos.map((photo) => photo.url)).toEqual(['/new-1.jpg', '/new-2.jpg']);
		const rows = sqlite!.query('SELECT url FROM photos_evenement ORDER BY ordre').all();
		expect(rows).toEqual([{ url: '/new-1.jpg' }, { url: '/new-2.jpg' }]);
	});
});
