export interface Repository<T> {
    create(data: unknown): Promise<T>;
    find(id: string): Promise<T>;
    all(): Promise<T[]>;
    // update(id: number, data: unknown): Promise<T[]>;
    delete(id: number): boolean;
}
