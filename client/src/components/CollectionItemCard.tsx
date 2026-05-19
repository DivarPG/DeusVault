import type {
    CollectionItem,
    CollectionTemplate
} from '../api/collections/collections.dto';
import {useRef} from "react";

type Props = {
    item: CollectionItem;

    template: CollectionTemplate;

    onOpen: () => void;

    onEdit: () => void;

    onDelete: () => void;

    onUploadImage: (
        file: File
    ) => Promise<void>;
};

function CollectionItemCard({
                                item,
                                template,
                                onOpen,
                                onEdit,
                                onDelete,
                                onUploadImage
                            }: Props) {

    const fileInputRef =
        useRef<HTMLInputElement>(null);

    const previewFields =
        Object.entries(item.values).slice(0, 2);

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const file =
            e.target.files?.[0];

        if (!file) {
            return;
        }

        await onUploadImage(file);
    };

    return (

        <div className="item-card card">

            {item.image && (

                <div className="item-image-wrapper">

                    <img
                        src={item.image}
                        alt="Изображение"
                        className="item-image"
                    />

                </div>

            )}

            <div className="item-main">

                <div className="item-header">

                    <h3
                        className="element-title"
                        onClick={onOpen}
                    >
                        Элемент
                    </h3>

                    <div className="item-actions-top">

                        <button
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                            className="
                            button-like
                            image-button
                        "
                        >
                            Фото
                        </button>

                        <button
                            onClick={onEdit}
                            className="
                            button-like
                            edit-button
                        "
                        >
                            Ред.
                        </button>

                    </div>

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

                                    {field?.label || key}

                                    {': '}

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
                        className="
                        button-like
                        delete-button
                    "
                    >
                        ✕
                    </button>

                </div>

                <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={fileInputRef}
                    onChange={handleImageChange}
                />

            </div>

        </div>
    );
}

export default CollectionItemCard;