import { useState } from 'react';
import type { CollectionTemplate } from '../api/collections/collections.dto';

interface Props {
    template: CollectionTemplate;
    initialValues: Record<string, unknown>;
    initialStatus: 'owned' | 'wanted';
    onSave: (status: string, values: Record<string, unknown>) => Promise<void>;
    onCancel: () => void;
}

function EditItemForm({ template, initialValues, initialStatus, onSave, onCancel }: Props) {
    // Нормализуем стартовые значения один раз
    const normalizeValues = (vals: Record<string, unknown>) => {
        const result: Record<string, unknown> = {};
        for (const field of template.fields) {
            const val = vals[field.name];
            if (field.type === 'boolean') {
                result[field.name] = val === true || val === false ? val : false;
            } else {
                result[field.name] = val ?? '';
            }
        }
        return result;
    };

    const [values, setValues] = useState<Record<string, unknown>>(normalizeValues(initialValues));
    const [status, setStatus] = useState<'owned' | 'wanted'>(initialStatus);
    const [error, setError] = useState('');

    // useEffect больше нет — компонент пересоздаётся при смене key

    const handleChange = (name: string, value: unknown) => {
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = (): boolean => {
        for (const field of template.fields) {
            const val = values[field.name];
            if (field.type === 'boolean') continue;
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
            await onSave(status, values);
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError('Ошибка сохранения');
        }
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value as 'owned' | 'wanted');
    };

    return (
        <form onSubmit={handleSubmit}
              style={{ marginTop: '10px', background: '#f9f9f9', padding: '10px', borderRadius: '6px' }}>
            <h4>Редактирование</h4>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <label>Статус:</label>
                <select value={status} onChange={handleStatusChange}>
                    <option value="owned">Владею</option>
                    <option value="wanted">Хочу приобрести</option>
                </select>
            </div>
            {template.fields.map(field => (
                <div key={field.name} style={{ marginBottom: '8px' }}>
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
                <button type="submit">Сохранить</button>
                <button type="button" onClick={onCancel} style={{ marginLeft: '10px' }}>Отмена</button>
            </div>
        </form>
    );
}

export default EditItemForm;