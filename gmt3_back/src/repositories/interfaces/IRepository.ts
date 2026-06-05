export interface IRepository<T, C> {
    findAll(): Promise<T[]>;
    findById(id: number): Promise<T | undefined>;
    create(data: C): Promise<T>;
    update(id: number, data: Partial<T>): Promise<T | undefined>;
    delete(id: number): Promise<boolean>;
}
