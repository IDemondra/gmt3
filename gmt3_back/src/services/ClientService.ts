import type { IClientRepository } from '../repositories/interfaces/IClientRepository.js';
import type { Client, NewClient } from '../types/index.js';

export class ClientService {
    constructor(private readonly clientRepo: IClientRepository) {}

    async getAll(): Promise<Client[]> {
        return this.clientRepo.findAll();
    }

    async getById(id: number): Promise<Client | undefined> {
        return this.clientRepo.findById(id);
    }

    async create(data: NewClient): Promise<Client> {
        return this.clientRepo.create(data);
    }

    async update(id: number, data: Partial<Client>): Promise<Client | undefined> {
        return this.clientRepo.update(id, data);
    }

    async delete(id: number): Promise<boolean> {
        return this.clientRepo.delete(id);
    }
}
