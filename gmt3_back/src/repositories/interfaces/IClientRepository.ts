import type { Client, NewClient } from '../../types/index.js';

export interface IClientRepository {
	findAll(): Promise<Client[]>;
	findById(id: number): Promise<Client | undefined>;
	create(data: NewClient): Promise<Client>;
	update(id: number, data: Partial<Client>): Promise<Client | undefined>;
	delete(id: number): Promise<boolean>;
}
