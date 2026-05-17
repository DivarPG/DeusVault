import {useState} from 'react';
import type {CollectionTemplate} from '../api/collections/collections.dto';

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

function EditTemplateForm({initialTemplate, onSave, onCancel}: Props) {
    const [fields, setFields] = useState<TemplateField[]>(initialTemplate.fields);
    const [error, setError] = useState('');

    const addField = () => {
        if (fields.length >= 30) {
            setError('Максимум 30 полей');
            return;
        }
        setFields([...fields, {name: '', type: 'text', label: ''}]);
    };

    const updateField = (index: number, key: keyof TemplateField, value: string) => {
        const updated = [...fields];
        (updated[index] as any)[key] = value;
        setFields(updated);
    };

    const removeField = (index: number) => {
        setFields(fields.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
            await onSave({fields});
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError('Ошибка сохранения');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{marginTop: '15px', background: '#f0f0f0', padding: '15px', borderRadius: '8px'}}
        >
            <h4>Редактирование шаблона</h4>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <p>Максимум 30 полей (сейчас {fields.length})</p>
            {fields.map((field, idx) => (
                <div key={idx} style={{display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'center'}}>
                    <input
                        placeholder="Имя поля (на латинице)"
                        value={field.name}
                        onChange={e => updateField(idx, 'name', e.target.value)}
                        required
                    />
                    <select value={field.type} onChange={e => updateField(idx, 'type', e.target.value)}>
                        <option value="text">текст</option>
                        <option value="number">число</option>
                        <option value="boolean">да/нет</option>
                        <option value="date">дата</option>
                        <option value="multiline">многострочный текст</option>
                    </select>
                    <input
                        placeholder="Отображаемое название"
                        value={field.label}
                        onChange={e => updateField(idx, 'label', e.target.value)}
                    />
                    <button type="button" onClick={() => removeField(idx)}>✕</button>
                </div>
            ))}
            <button type="button" onClick={addField} style={{marginBottom: '10px'}}>+ Добавить поле</button>
            <div>
                <button type="submit">Сохранить шаблон</button>
                <button type="button" onClick={onCancel} style={{marginLeft: '10px'}}>Отмена</button>
            </div>
        </form>
    );
}

export default EditTemplateForm;