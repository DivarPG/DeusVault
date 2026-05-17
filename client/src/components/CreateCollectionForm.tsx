import { useState } from 'react';
import type { CollectionTemplate } from '../api/collections/collections.dto';

interface Props {
    onSubmit: (data: { name: string; description?: string; template: CollectionTemplate }) => Promise<void>;
}

function CreateCollectionForm({ onSubmit }: Props) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [fields, setFields] = useState<{ name: string; type: 'text' | 'number' | 'boolean' | 'date' }[]>([]);
    const [error, setError] = useState('');

    const addField = () => {
        setFields([...fields, { name: '', type: 'text' }]);
    };

    const updateField = (index: number, key: string, value: string) => {
        const newFields = [...fields];
        (newFields[index] as any)[key] = value;
        setFields(newFields);
    };

    const removeField = (index: number) => {
        setFields(fields.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!name.trim()) {
            setError('Название обязательно');
            return;
        }
        const template: CollectionTemplate = {
            fields: fields.map(f => ({ name: f.name, type: f.type, label: f.name })),
        };
        try {
            await onSubmit({ name, description, template });
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError('Ошибка создания');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px', background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
            <h3>Новая коллекция</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <label>Название</label>
                <input value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
                <label>Описание (необязательно)</label>
                <input value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div style={{ margin: '10px 0' }}>
                <strong>Поля шаблона:</strong>
                {fields.map((field, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                        <input
                            placeholder="Имя поля"
                            value={field.name}
                            onChange={e => updateField(idx, 'name', e.target.value)}
                            required
                        />
                        <select value={field.type} onChange={e => updateField(idx, 'type', e.target.value)}>
                            <option value="text">текст</option>
                            <option value="number">число</option>
                            <option value="boolean">да/нет</option>
                            <option value="date">дата</option>
                        </select>
                        <button type="button" onClick={() => removeField(idx)}>✕</button>
                    </div>
                ))}
                <button type="button" onClick={addField}>+ Добавить поле</button>
            </div>
            <button type="submit" style={{ marginTop: '10px' }}>Создать</button>
        </form>
    );
}

export default CreateCollectionForm;