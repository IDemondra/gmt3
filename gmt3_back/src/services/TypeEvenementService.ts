import type { TypeEvenement } from '../types/index.js';
import { TypeEvenementRepository } from '../repositories/TypeEvenementRepository.js';

function toTypeCode(name: string): string {
	return name
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '_')
		.replace(/^_|_$/g, '')
		.slice(0, 50);
}

function iconForType(name: string): string {
	const normalized = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
	if (/randonnee|trek|marche/.test(normalized)) return 'hiking';
	if (/voyage|circuit|sejour/.test(normalized)) return 'luggage';
	if (/pique.?nique|pic.?nic/.test(normalized)) return 'outdoor_grill';
	if (/culture|musee|patrimoine|visite/.test(normalized)) return 'museum';
	if (/aventure|plein air|exploration/.test(normalized)) return 'explore';
	if (/camping|bivouac/.test(normalized)) return 'camping';
	if (/velo|cycl|vtt/.test(normalized)) return 'pedal_bike';
	if (/plage|mer|plongee|baignade/.test(normalized)) return 'beach_access';
	if (/kayak|canoe|bateau|navigation/.test(normalized)) return 'directions_boat';
	return 'category';
}

export class TypeEvenementService {
	constructor(private readonly typeRepository = new TypeEvenementRepository()) {}

	async getActive(): Promise<TypeEvenement[]> {
		return this.typeRepository.findActive();
	}

	async getById(id: number): Promise<TypeEvenement | undefined> {
		return this.typeRepository.findById(id);
	}

	async getOrCreateByName(name: string): Promise<TypeEvenement | undefined> {
		const nom = name.trim().replace(/\s+/g, ' ');
		if (nom.length < 2 || nom.length > 100) return undefined;

		const code = toTypeCode(nom);
		if (!code) return undefined;
		const existing = await this.typeRepository.findByCode(code);
		if (existing) return existing;

		try {
			return await this.typeRepository.create({
				code,
				nom,
				icone: iconForType(nom),
				libelleRythme: `Rythme de ${nom.toLocaleLowerCase('fr-FR')}`,
				ordre: await this.typeRepository.nextOrder(),
			});
		} catch {
			return this.typeRepository.findByCode(code);
		}
	}

	async resolve(typeId: number | null, name: string | null | undefined): Promise<TypeEvenement | undefined> {
		if (name?.trim()) return this.getOrCreateByName(name);
		if (!typeId || !Number.isInteger(typeId)) return undefined;
		return this.getById(typeId);
	}
}
