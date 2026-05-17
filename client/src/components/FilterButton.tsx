interface FilterProps {
    onFilterClick?: () => void;
}

function FilterButton({onFilterClick}: FilterProps) {
    return (
        <>
            <button
                onClick={onFilterClick}
                className="button-like filter-button"
            >
                # Фильтры
            </button>
        </>
    );
}

export default FilterButton;