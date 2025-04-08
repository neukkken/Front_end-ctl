export type DataService = {
    create: (data: Record<string, unknown>) => Promise<void>;
    update: (id: string, data: Record<string, unknown>) => Promise<void>;
    delete: (id: string) => Promise<void>;
    validate?: (data: unknown) => data is Record<string, unknown>;
};
