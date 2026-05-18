import { useState } from 'react';
import type { FormEvent } from 'react';
import type { CollectionTemplate } from '../api/collections/collections.dto';

interface TemplateField {
    name: string;
    type: 'text' | 'number' | 'boolean' | 'date' | 'multiline';
    label: string;
}

interface Props {
    initialTemplate: CollectionTemplate;
    onSave: (template: CollectionTemplate) => Promise<void>;
    onCancel: () => void;
}

function EditTemplateForm({ initialTemplate, onSave, onCancel }: Props) {
    const [fields, setFields] = useState<TemplateField[]>(initialTemplate.fields);
    const [error, setError] = useState('');

    const addField = () => {
        if (fields.length >= 30) {
            setError('Максимум 30 полей');
            return;
        }
        setFields([...fields, { name: '', type: 'text', label: '' }]);
    };

    const updateField = (index: number, key: keyof TemplateField, value: string) => {
        setFields(prev =>
            prev.map((f, i) => (i === index ? { ...f, [key]: value } : f))
        );
    };

    const removeField = (index: number) => {
        setFields(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        for (const field of fields) {
            if (!field.name.trim()) {
                setError('Имя поля не может быть пустым');
                return;
            }
        }

        const names = fields.map(f => f.name.trim().toLowerCase());
        if (new Set(names).size !== names.length) {
            setError('Имена полей должны быть уникальны');
            return;
        }

        try {
            await onSave({ fields });
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError('Ошибка сохранения');
        }
    };

    return (

        <form
            onSubmit={handleSubmit}
            className="collection-form card template-form"
        >

            <h3 className="form-title">
                Редактирование шаблона
            </h3>

            <hr className="modal-divider"/>

            {error && (
                <p className="form-error">
                    {error}
                </p>
            )}

            <p className="subText">
                Максимум 30 полей
                ({fields.length}/30)
            </p>

            <div className="template-fields">

                {fields.map((field, idx) => (

                    <div
                        key={idx}
                        className="template-field-card"
                    >

                        <div className="field-delete-row">

                            <button
                                type="button"
                                className="button-like delete-button"
                                onClick={() => removeField(idx)}
                            >
                                ✕
                            </button>

                        </div>

                        <label className="field-label-temp">
                            Название поля (латиница)
                        </label>

                        <input
                            className="input"
                            placeholder="e.g. name, stored_amount, is_working"
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


                        <div className="template-field-bottom">

                            <input
                                className="input template-input"
                                placeholder="Название поля"
                                value={field.label}
                                onChange={e =>
                                    updateField(
                                        idx,
                                        'label',
                                        e.target.value
                                    )
                                }
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
                                <option value="text">
                                    текст
                                </option>

                                <option value="number">
                                    число
                                </option>

                                <option value="boolean">
                                    да / нет
                                </option>

                                <option value="date">
                                    дата
                                </option>

                                <option value="multiline">
                                    многострочный текст
                                </option>

                            </select>

                        </div>
                        <hr className="modal-divider-2"/>
                    </div>

                ))}

            </div>

            <button
                type="button"
                className="button-like add-template-button"
                onClick={addField}
            >
                + Поле
            </button>

            <div className="form-buttons">

                <button
                    type="submit"
                    className="button-like regButton"
                >
                    Сохранить
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

export default EditTemplateForm;