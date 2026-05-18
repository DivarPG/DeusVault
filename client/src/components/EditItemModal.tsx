import type {
    CollectionItem,
    CollectionTemplate
} from '../api/collections/collections.dto';

import EditItemForm
    from './EditItemForm';

type Props = {
    item: CollectionItem;

    template: CollectionTemplate;

    onSave: (
        values: Record<string, unknown>
    ) => Promise<void>;

    onClose: () => void;
};

function EditItemModal({
                           item,
                           template,
                           onSave,
                           onClose
                       }: Props) {

    return (
        <div className="modal-overlay">

            <div className="modal card">

                <EditItemForm
                    template={template}
                    initialValues={item.values}
                    onSave={onSave}
                    onCancel={onClose}
                />

            </div>

        </div>
    );
}

export default EditItemModal;