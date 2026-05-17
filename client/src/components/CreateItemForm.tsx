import { useState } from 'react';
import type { CollectionTemplate } from '../api/collections/collections.dto';

interface Props {
    template: CollectionTemplate;
    onSubmit: (values: Record<string, unknown>) => Promise<void>;
    onCancel: () => void;
}

function CreateItemForm({ template, onSubmit, onCancel }: Props) {
    // Инициализируем значения: для boolean ставим false
    const getInitialValues = () => {
        const initial: Record<string, unknown> = {};
        for (const field of template.fields) {
            if (field.type === 'boolean') {
                initial[field.name] = false;
            } else {
                initial[field.name] = '';
            }
        }
        return initial;
    };

    const [values, setValues] = useState<Record<string, unknown>>(getInitialValues());
    const [error, setError] = useState('');

    const handleChange = (name: string, value: unknown) => {
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = (): boolean => {
        for (const field of template.fields) {
            const val = values[field.name];
            if (field.type === 'boolean') continue; // всегда валидно
            if (val === undefined || val === null || val === '') {
                setError(`Поле "${field.label || field.name}" обязательно для заполнения`);
                return false;
            }
            if (field.type === 'number' && isNaN(Number(val))) {
                setError(`Поле "${field.label || field.name}" должно быть числом`);
                return false;
            }
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await onSubmit(values);
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError('Ошибка создания');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '15px', background: '#f0f0f0', padding: '15px', borderRadius: '8px' }}>
            <h4>Новый элемент</h4>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {template.fields.map(field => (
                <div key={field.name} style={{ marginBottom: '10px' }}>
                    <label>{field.label || field.name} *</label>
                    {field.type === 'boolean' ? (
                        <input
                            type="checkbox"
                            checked={!!values[field.name]}
                            onChange={e => handleChange(field.name, e.target.checked)}
                        />
                    ) : field.type === 'date' ? (
                        <input
                            type="date"
                            value={(values[field.name] as string) || ''}
                            onChange={e => handleChange(field.name, e.target.value)}
                            required
                        />
                    ) : (
                        <input
                            type={field.type === 'number' ? 'number' : 'text'}
                            value={(values[field.name] as string) || ''}
                            onChange={e => handleChange(field.name, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                            required
                        />
                    )}
                </div>
            ))}
            <div>
                <button type="submit">Добавить</button>
                <button type="button" onClick={onCancel} style={{ marginLeft: '10px' }}>Отмена</button>
            </div>
        </form>
    );
}

export default CreateItemForm;