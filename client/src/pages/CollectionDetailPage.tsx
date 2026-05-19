import {useCallback, useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import '../styles/collectionDetailPage.css';
import {
    getCollectionsFetch,
    addItemFetch,
    updateItemFetch,
    deleteItemFetch,
} from '../api/collections/collections.api';
import type {Collection, CollectionItem} from '../api/collections/collections.dto';
import CreateItemForm from '../components/CreateItemForm';
import ItemDetailsModal
    from '../components/ItemDetailsModal';

import EditItemModal
    from '../components/EditItemModal';

import CollectionItemCard
    from '../components/CollectionItemCard';
import AppHeader from "../components/appHeader.tsx";
import CollectionTools from "../components/CollectionTools.tsx";
import ContextNavigation from "../components/ContextNavigation.tsx";
import Footer from "../components/footer.tsx";
import Modal from "../components/CreateCollectionModal.tsx";
import { uploadItemImageFetch }
    from '../api/collections/collections.api';

function CollectionDetailPage() {
    const [selectedItem, setSelectedItem] =
        useState<CollectionItem | null>(null);

    const [editingItem, setEditingItem] =
        useState<CollectionItem | null>(null);
    const [search, setSearch] = useState('');
    const [showCreateForm, setShowCreateForm] =
        useState(false);
    const {id} = useParams<{ id: string }>();
    const [collection, setCollection] = useState<Collection | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchCollection = useCallback(async () => {
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
    }, [id]);

    useEffect(() => {
        fetchCollection();
    }, [fetchCollection]);

    const handleUploadImage = async (
        itemId: string,
        file: File
    ) => {

        if (!collection) {
            return;
        }

        const res =
            await uploadItemImageFetch(
                collection.id,
                itemId,
                file
            );

        if (!res.ok) {

            const err =
                await res.json().catch(() => ({}));

            alert(
                err.message ||
                'Ошибка загрузки изображения'
            );

            return;
        }

        await fetchCollection();
    };

    const handleCreateItem = async (values: Record<string, unknown>) => {
        if (!collection) return;
        const res = await addItemFetch(collection.id, {status: 'owned', values});
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Ошибка создания элемента');
        }
        await fetchCollection();
        setShowCreateForm(false);
    };

    const handleUpdateItem = async (
        itemId: string,
        data: {values?: Record<string, unknown> }
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


    if (loading) return <p>Загрузка...</p>;
    if (error || !collection) return <p style={{color: 'red'}}>{error || 'Коллекция не найдена'}</p>;

    return (
        <section id="center">
            <AppHeader/>
            <ContextNavigation
                items={[
                    {label: collection.name, to: `/collections`},
                    {label: 'Элементы'}
                ]}
            />
            <CollectionTools search={search} onSearchChange={setSearch}
                             onAddClick={() => setShowCreateForm(!showCreateForm)}/>
            {collection.description && (
                <p className="collection-description-full">
                    {collection.description}
                </p>
            )}

            <div className="collection-meta">

                <span>
                    Элементов: {collection.items.length}
                </span>
                <button
                    className="button-like filter-button"
                    onClick={() =>
                        navigate(
                            `/collections/${collection.id}/template`
                        )
                    }
                >
                    Редактировать шаблон
                </button>

            </div>

            <br/>

            <div className="items-container">

                {collection.items.map(item => (
                    <CollectionItemCard
                        key={item.id}
                        item={item}
                        template={collection.template}

                        onOpen={() => setSelectedItem(item)}

                        onEdit={() => setEditingItem(item)}

                        onDelete={() =>
                            handleDeleteItem(item.id)
                        }

                        onUploadImage={(file) =>
                            handleUploadImage(item.id, file)
                        }
                    />
                ))}

            </div>
            {showCreateForm && (
                <Modal
                    onClose={() => setShowCreateForm(false)}
                >
                    <CreateItemForm
                        template={collection.template}
                        onSubmit={handleCreateItem}
                        onCancel={() => setShowCreateForm(false)}
                    />
                </Modal>
            )}
            {selectedItem && (
                <ItemDetailsModal
                    item={selectedItem}
                    template={collection.template}
                    onClose={() => setSelectedItem(null)}
                />
            )}
            {editingItem && (
                <EditItemModal
                    item={editingItem}
                    template={collection.template}
                    onSave={(values) =>
                        handleUpdateItem(
                            editingItem.id,
                            {values}
                        )
                    }
                    onClose={() => setEditingItem(null)}
                />
            )}
            <button className="button-like back"
                    onClick={() => navigate('/collections')}
            >
                ←
            </button>
            <Footer/>
        </section>
    );
}

export default CollectionDetailPage;