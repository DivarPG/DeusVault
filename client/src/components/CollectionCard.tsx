import {useNavigate} from 'react-router-dom';
import type {Collection} from '../api/collections/collections.dto';

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
        <div className="collection-card card">

            <div
                className="collection-content"
                onClick={() =>
                    navigate(`/collections/${collection.id}`)
                }
            >
                <h3 className="collection-title">
                    {collection.name}
                </h3>

                {collection.description && (
                    <p className="collection-description">
                        {collection.description}
                    </p>
                )}
            </div>

            <button
                onClick={() => onDelete(collection.id)}
                className="button-like delete-button"
            >
                ✕
            </button>

        </div>
    );
}

export default CollectionCard;