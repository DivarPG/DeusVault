import {useEffect, useState} from 'react';
import '../styles/collectionsPage.css';
import AppHeader from '../components/appHeader';
import Footer from '../components/footer';
import {getCollectionsFetch, createCollectionFetch, deleteCollectionFetch} from '../api/collections/collections.api';
import type {Collection, CollectionTemplate} from '../api/collections/collections.dto';
import CreateCollectionForm from "../components/CreateCollectionForm.tsx";
import CollectionTools from "../components/CollectionTools.tsx";
import CollectionCard from "../components/CollectionCard.tsx";
import Modal from "../components/CreateCollectionModal.tsx";

function CollectionsPage() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    //const navigate = useNavigate();
    const [search, setSearch] = useState('');
    // Загрузка коллекций
    const fetchCollections = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getCollectionsFetch();
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || 'Ошибка загрузки');
            }
            const data: Collection[] = await res.json();
            setCollections(data);
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCollections();
    }, []);

    // Удаление коллекции
    const handleDelete = async (id: string) => {
        if (!window.confirm('Удалить коллекцию?')) return;
        const res = await deleteCollectionFetch(id);
        if (res.ok) {
            setCollections(collections.filter(c => c.id !== id));
        } else {
            const err = await res.json().catch(() => ({}));
            alert(err.message || 'Ошибка удаления');
        }
    };

    // Создание коллекции
    const handleCreate = async (data: { name: string; description?: string; template: CollectionTemplate }) => {
        const res = await createCollectionFetch(data);
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Ошибка создания');
        }
        await fetchCollections();
        setShowCreateForm(false);
    };

    return (
        <section id="center">
            <AppHeader/>

            <CollectionTools search={search} onSearchChange={setSearch}
                             onAddClick={() => setShowCreateForm(!showCreateForm)}/>
            {error && <p style={{color: 'red'}}>{error}</p>}
            {loading ? (
                <p>Загрузка...</p>
            ) : collections.length === 0 ? (
                <p>У вас пока нет коллекций.</p>
            ) : (
                <div className="col-card-container">
                    {collections.map(c => (
                        <CollectionCard
                            key={c.id}
                            collection={c}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
            {showCreateForm && (
                <Modal
                    onClose={() => setShowCreateForm(false)}
                >
                    <CreateCollectionForm
                        onSubmit={handleCreate}
                        onCancel={() =>
                            setShowCreateForm(false)
                        }
                    />
                </Modal>
            )}

            <Footer/>
        </section>
    );
}

export default CollectionsPage;