import type {
    CollectionItem,
    CollectionTemplate
} from '../api/collections/collections.dto';

type Props = {
    item: CollectionItem;
    template: CollectionTemplate;
    onClose: () => void;
};

function ItemDetailsModal({
                              item,
                              template,
                              onClose
                          }: Props) {

    return (
        <div className="modal-overlay">

            <div className="card modal-content">
                <div className="exit-item-details">
                    <button
                        onClick={onClose}
                        className="button-like delete-button"
                    >
                        ✕
                    </button>
                </div>
                <h2>Элемент</h2>

                {Object.entries(item.values).map(
                    ([key, value]) => {

                        const field =
                            template.fields.find(
                                f => f.name === key
                            );

                        return (
                            <div key={key}>
                                {field?.label || key}:
                                {" "}
                                {String(value)}
                            </div>
                        );
                    }
                )}

            </div>

        </div>
    );
}

export default ItemDetailsModal;