import {useNavigate} from "react-router-dom";

type NavItem = {
    label: string;
    to?: string;
};

type Props = {
    items: NavItem[];
};

function ContextNavigation({ items }: Props) {
    const navigate = useNavigate();

    return (
        <div className="context-nav">
            {items.map((item, idx) => (
                <span key={idx}>
                    {item.to ? (
                        <span
                            onClick={() => navigate(item.to!)}
                            style={{ cursor: 'pointer' }}
                        >
                            {item.label}
                        </span>
                    ) : (
                        <span>{item.label}</span>
                    )}

                    {idx < items.length - 1 && ' > '}
                </span>
            ))}
        </div>
    );
}

export default ContextNavigation;