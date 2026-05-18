import {useState} from 'react';
import type {CollectionTemplate} from '../api/collections/collections.dto';
import FormInput from "./formInput.tsx";

interface Field {
    name: string;
    type: 'text' | 'number' | 'boolean' | 'date';
}

interface Props {
    onSubmit: (
        data: {
            name: string;
            description?: string;
            template: CollectionTemplate;
        }
    ) => Promise<void>;

    onCancel: () => void;
}

function CreateCollectionForm({
                                  onSubmit,
                                  onCancel
                              }: Props) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [fields, setFields] = useState<Field[]>([]);
    const [error, setError] = useState('');

    const addField = () => {
        setFields([...fields, {name: '', type: 'text'}]);
    };

    const updateField = (index: number, key: keyof Field, value: string) => {
        setFields(prev =>
            prev.map((f, i) => (i === index ? {...f, [key]: value} : f))
        );
    };

    const removeField = (index: number) => {
        setFields(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Название обязательно');
            return;
        }

        const template: CollectionTemplate = {
            fields: fields.map(f => ({
                name: f.name,
                type: f.type,
                label: f.name,
            })),
        };

        try {
            await onSubmit({name, description, template});

            resetForm();

        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError('Ошибка создания');
        }
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setFields([]);
        setError('');
    };

    const handleCancel = () => {
        resetForm();
        onCancel();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="collection-form card"
        >

            <h3 className="form-title">
                Новая коллекция
            </h3>
            <hr className="modal-divider"/>
            {error && (
                <p className="form-error">
                    {error}
                </p>
            )}

            <div className="form-section">

                <FormInput
                    label="Название"
                    id="collection-name"
                    desc=""
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required={true}
                />

                <FormInput
                    label="Описание"
                    id="collection-description"
                    desc="необязательно"
                    type="text"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required={false}
                />

            </div>

            <div className="template-section">

                <div className="template-header">

                    <h4>Поля шаблона</h4>

                    <button
                        type="button"
                        className="button-like add-template-button"
                        onClick={addField}
                    >
                        + Поле
                    </button>

                </div>

                {fields.length === 0 && (
                    <p className="subText">
                        Добавьте поля для структуры коллекции
                    </p>
                )}

                <div className="template-fields">

                    {fields.map((field, idx) => (

                        <div
                            key={idx}
                            className="template-field-row"
                        >

                            <input
                                className="input template-input"
                                placeholder="Имя поля"
                                value={field.name}
                                onChange={e =>
                                    updateField(
                                        idx,
                                        'name',
                                        e.target.value
                                    )
                                }
                                required
                            />

                            <select
                                className="input template-select"
                                value={field.type}
                                onChange={e =>
                                    updateField(
                                        idx,
                                        'type',
                                        e.target.value
                                    )
                                }
                            >
                                <option value="text">текст</option>
                                <option value="number">число</option>
                                <option value="boolean">да/нет</option>
                                <option value="date">дата</option>
                            </select>

                            <button
                                type="button"
                                className="button-like delete-button"
                                onClick={() => removeField(idx)}
                            >
                                ✕
                            </button>

                        </div>

                    ))}

                </div>

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
                    onClick={handleCancel}
                >
                    Отмена
                </button>

            </div>

        </form>
    );
}

export default CreateCollectionForm;