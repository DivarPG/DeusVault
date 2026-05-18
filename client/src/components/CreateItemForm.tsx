import { useState } from 'react';
import type {
    CollectionTemplate
} from '../api/collections/collections.dto';

type Props = {
    template: CollectionTemplate;

    onSubmit: (
        values: Record<string, unknown>
    ) => Promise<void>;

    onCancel: () => void;
};

function CreateItemForm({
                            template,
                            onSubmit,
                            onCancel
                        }: Props) {

    const createInitialValues = () => {

        const initial: Record<string, unknown> = {};

        template.fields.forEach(field => {

            if (field.type === 'boolean') {
                initial[field.name] = false;
            } else {
                initial[field.name] = '';
            }

        });

        return initial;
    };

    const [values, setValues] =
        useState<Record<string, unknown>>(
            createInitialValues()
        );

    const [error, setError] = useState('');

    const handleChange = (
        name: string,
        value: unknown
    ) => {

        setValues(prev => ({
            ...prev,
            [name]: value
        }));

    };

    const validate = () => {

        for (const field of template.fields) {

            const value = values[field.name];

            if (field.type === 'boolean') {
                continue;
            }

            if (
                value === '' ||
                value === undefined ||
                value === null
            ) {

                setError(
                    `Поле "${field.label}" обязательно`
                );

                return false;
            }

            if (
                field.type === 'number' &&
                isNaN(Number(value))
            ) {

                setError(
                    `Поле "${field.label}" должно быть числом`
                );

                return false;
            }
        }

        setError('');

        return true;
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {

            await onSubmit(values);

        } catch (err: unknown) {

            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ошибка создания');
            }

        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="collection-form card"
        >

            <h3 className="form-title">
                Новый элемент
            </h3>
            <hr className="modal-divider"/>
            {error && (
                <p className="form-error">
                    {error}
                </p>
            )}

            <div className="form-section">

                {template.fields.map(field => (

                    <div
                        key={field.name}
                        className="item-field"
                    >

                        <label>
                            {field.label}
                        </label>

                        {field.type === 'boolean' ? (

                            <div className="checkbox-row">

                                <input
                                    type="checkbox"
                                    checked={
                                        Boolean(
                                            values[field.name]
                                        )
                                    }
                                    onChange={e =>
                                        handleChange(
                                            field.name,
                                            e.target.checked
                                        )
                                    }
                                />

                                <span>
                                    Да / Нет
                                </span>

                            </div>

                        ) : (

                            <input
                                className="input"
                                type={
                                    field.type === 'number'
                                        ? 'number'
                                        : field.type === 'date'
                                            ? 'date'
                                            : 'text'
                                }
                                value={
                                    String(
                                        values[field.name] ?? ''
                                    )
                                }
                                onChange={e =>
                                    handleChange(
                                        field.name,
                                        field.type === 'number'
                                            ? Number(e.target.value)
                                            : e.target.value
                                    )
                                }
                            />

                        )}

                    </div>

                ))}

            </div>

            <div className="form-buttons">

                <button
                    type="submit"
                    className="button-like regButton"
                >
                    Создать
                </button>

                <button
                    type="button"
                    className="button-like cancel-button"
                    onClick={onCancel}
                >
                    Отмена
                </button>

            </div>

        </form>
    );
}

export default CreateItemForm;