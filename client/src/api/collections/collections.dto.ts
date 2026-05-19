export interface CollectionTemplate {
    fields: {
        name: string;
        type: 'text' | 'number' | 'boolean' | 'date' | 'multiline';
        label: string;
    }[];
}

export interface Collection {
    id: string;
    name: string;
    description?: string;
    template: CollectionTemplate;
    userId: string;
    createdAt: string;
    updatedAt: string;
    items: CollectionItem[];
}

export interface CollectionItem {
    id: string;
    status: 'owned' | 'wanted';
    values: Record<string, unknown>;
    image?: string;
    collectionId: string;
    createdAt: string;
    updatedAt: string;
}