import type {
    CollectionItem,
    CollectionTemplate
} from '../api/collections/collections.dto';

type Props = {
    item: CollectionItem;
    template: CollectionTemplate;

    onOpen: () => void;
    onEdit: () => void;
    onDelete: () => void;
};

function CollectionItemCard({
                                item,
                                template,
                                onOpen,
                                onEdit,
                                onDelete
                            }: Props) {

    const previewFields =
        Object.entries(item.values).slice(0, 2);

    return (
        <div className="item-card card">

            <div className="item-header">

                <h3
                    className="element-title"
                    onClick={onOpen}
                >
                    Элемент
                </h3>

                <button
                    onClick={onEdit}
                    className="button-like edit-button"
                >
                    Ред.
                </button>

            </div>

            <div
                className="item-fields"
                onClick={onOpen}
            >

                {previewFields.map(([key, value]) => {

                    const field =
                        template.fields.find(
                            f => f.name === key
                        );

                    return (
                        <div
                            key={key}
                            className="item-field"
                        >

                            <p>

                                {field?.label || key}:

                                {' '}

                                {String(value)}

                            </p>

                        </div>
                    );
                })}

            </div>

            <div className="item-footer">

                <div />

                <button
                    onClick={onDelete}
                    className="button-like delete-button"
                >
                    ✕
                </button>

            </div>

        </div>
    );
}

export default CollectionItemCard;