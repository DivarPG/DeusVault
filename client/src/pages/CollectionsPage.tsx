import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/appHeader';
import Footer from '../components/footer';
import { getCollectionsFetch, createCollectionFetch, deleteCollectionFetch } from '../api/collections/collections.api';
import type { Collection, CollectionTemplate } from '../api/collections/collections.dto';
import CreateCollectionForm from "../components/CreateCollectionForm.tsx";

function CollectionsPage() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const navigate = useNavigate();

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
            <AppHeader />
            <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
                <h2>Мои коллекции</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {loading ? (
                    <p>Загрузка...</p>
                ) : collections.length === 0 ? (
                    <p>У вас пока нет коллекций.</p>
                ) : (
                    <ul>
                        {collections.map(c => (
                            <li key={c.id} style={{ marginBottom: '10px' }}>
                                <strong
                                    style={{ cursor: 'pointer', marginRight: '15px' }}
                                    onClick={() => navigate(`/collections/${c.id}`)}
                                >
                                    {c.name}
                                </strong>
                                {c.description && <span>– {c.description}</span>}
                                <button
                                    onClick={() => handleDelete(c.id)}
                                    style={{ marginLeft: '15px', color: 'red', cursor: 'pointer' }}
                                >
                                    Удалить
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                <button onClick={() => setShowCreateForm(!showCreateForm)} style={{ marginTop: '20px' }}>
                    {showCreateForm ? 'Отмена' : 'Создать новую коллекцию'}
                </button>
                {showCreateForm && <CreateCollectionForm onSubmit={handleCreate} />}
            </div>
            <Footer />
        </section>
    );
}

export default CollectionsPage;