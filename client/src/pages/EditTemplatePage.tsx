import { useEffect, useState } from 'react';
import { useParams, useNavigate }
    from 'react-router-dom';

import {
    getCollectionFetch,
    updateTemplateFetch
} from '../api/collections/collections.api';

import type { Collection, CollectionTemplate } from '../api/collections/collections.dto';

import EditTemplateForm
    from '../components/EditTemplateForm';
import AppHeader from "../components/appHeader.tsx";
import Footer from "../components/footer.tsx";
import "../styles/EditTemplatePage.css";

function EditTemplatePage() {

    const { id } =
        useParams<{ id: string }>();

    const navigate = useNavigate();

    const [collection, setCollection] =
        useState<Collection | null>(null);

    useEffect(() => {

        const fetchCollection = async () => {
            if (!id) return;
            const res = await getCollectionFetch(id);
            if (!res.ok) return;
            const col: Collection = await res.json();
            setCollection(col);

        };

        fetchCollection();

    }, [id]);

    const handleSave = async (
        template: CollectionTemplate
    ) => {

        if (!collection) return;

        await updateTemplateFetch(
            collection.id,
            template
        );

        navigate(
            `/collections/${collection.id}`
        );
    };

    if (!collection) {
        return <p>Загрузка...</p>;
    }

    return (
        <section id="center">
            <AppHeader/>
            <EditTemplateForm
                initialTemplate={collection.template}
                onSave={handleSave}
                onCancel={() =>
                    navigate(
                        `/collections/${collection.id}`
                    )
                }
            />
            <Footer/>
        </section>
    );
}

export default EditTemplatePage;
