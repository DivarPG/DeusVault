import { useNavigate } from 'react-router-dom';
import type { Collection } from '../api/collections/collections.dto';

type ColCardProps = {
    collection: Collection;
    onDelete: (id: string) => void;
};

function CollectionCard({
                            collection,
                            onDelete
                        }: ColCardProps) {

    const navigate = useNavigate();

    return (
        <>
            <div className="collection-card card">

                <h3
                    className="collection-title"
                    onClick={() =>
                        navigate(`/collections/${collection.id}`)
                    }
                >
                    {collection.name}
                </h3>

                {collection.description && (
                    <p className="collection-description">
                        {collection.description}
                    </p>
                )}

                <button
                    onClick={() => onDelete(collection.id)}
                    className="button-like"
                >
                    Удалить
                </button>

            </div>
        </>
    );
}

export default CollectionCard;