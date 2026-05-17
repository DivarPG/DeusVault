import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getCollectionsFetch,
    addItemFetch,
    updateItemFetch,
    deleteItemFetch,
    updateTemplateFetch,
} from '../api/collections/collections.api';
import type { Collection, CollectionItem, CollectionTemplate } from '../api/collections/collections.dto';
import CreateItemForm from '../components/CreateItemForm';
import EditItemForm from '../components/EditItemForm';
import EditTemplateForm from '../components/EditTemplateForm';

function CollectionDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [collection, setCollection] = useState<Collection | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditTemplate, setShowEditTemplate] = useState(false);
    const [editingItem, setEditingItem] = useState<CollectionItem | null>(null);
    const navigate = useNavigate();

    const fetchCollection = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getCollectionsFetch();
            if (!res.ok) throw new Error('Ошибка загрузки');
            const cols: Collection[] = await res.json();
            const col = cols.find(c => c.id === id);
            if (!col) throw new Error('Коллекция не найдена');
            setCollection(col);
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCollection();
    }, [id]);

    const handleCreateItem = async (values: Record<string, unknown>) => {
        if (!collection) return;
        const res = await addItemFetch(collection.id, { status: 'owned', values });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Ошибка создания элемента');
        }
        await fetchCollection();
        setShowCreateForm(false);
    };

    const handleUpdateItem = async (
        itemId: string,
        data: { status?: string; values?: Record<string, unknown> }
    ) => {
        if (!collection) return;
        const res = await updateItemFetch(collection.id, itemId, data);
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Ошибка обновления');
        }
        await fetchCollection();
        setEditingItem(null);
    };

    const handleDeleteItem = async (itemId: string) => {
        if (!collection || !window.confirm('Удалить этот элемент?')) return;
        const res = await deleteItemFetch(collection.id, itemId);
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            alert(err.message || 'Ошибка удаления');
            return;
        }
        await fetchCollection();
    };

    const handleUpdateTemplate = async (template: CollectionTemplate) => {
        if (!collection) return;
        const res = await updateTemplateFetch(collection.id, template);
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Ошибка обновления шаблона');
        }
        await fetchCollection();
        setShowEditTemplate(false);
    };

    if (loading) return <p>Загрузка...</p>;
    if (error || !collection) return <p style={{ color: 'red' }}>{error || 'Коллекция не найдена'}</p>;

    return (
        <section id="center">
            <h2>{collection.name}</h2>
            {collection.description && <p>{collection.description}</p>}
            <button onClick={() => setShowEditTemplate(!showEditTemplate)} style={{ marginTop: '10px' }}>
                {showEditTemplate ? 'Закрыть' : 'Изменить шаблон'}
            </button>
            {showEditTemplate && (
                <EditTemplateForm
                    initialTemplate={collection.template as CollectionTemplate}
                    onSave={handleUpdateTemplate}
                    onCancel={() => setShowEditTemplate(false)}
                />
            )}
            <h3>Элементы ({collection.items.length})</h3>

            {collection.items.length === 0 && <p>Нет элементов</p>}
            <ul>
                {collection.items.map(item => (
                    <li key={item.id} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong>{item.status === 'owned' ? '✅' : '⭐'} Элемент</strong>
                            <div>
                                <button onClick={() => setEditingItem(item)}>✏️</button>
                                <button onClick={() => handleDeleteItem(item.id)} style={{ color: 'red' }}>🗑️</button>
                            </div>
                        </div>
                        <pre>{JSON.stringify(item.values, null, 2)}</pre>
                        {editingItem?.id === item.id && (
                            <EditItemForm
                                key={item.id}
                                template={collection.template}
                                initialValues={item.values}
                                initialStatus={item.status}
                                onSave={(status, values) => handleUpdateItem(item.id, { status, values })}
                                onCancel={() => setEditingItem(null)}
                            />
                        )}
                    </li>
                ))}
            </ul>

            <button onClick={() => setShowCreateForm(!showCreateForm)} style={{ marginTop: '20px' }}>
                {showCreateForm ? 'Отмена' : '+ Добавить элемент'}
            </button>

            {showCreateForm && (
                <CreateItemForm
                    template={collection.template}
                    onSubmit={handleCreateItem}
                    onCancel={() => setShowCreateForm(false)}
                />
            )}

            <button onClick={() => navigate('/collections')} style={{ marginTop: '20px' }}>← Назад к списку</button>
        </section>
    );
}

export default CollectionDetailPage;