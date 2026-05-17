interface SearchProps {
    search: string;
    onSearchChange: (value: string) => void;
    onSearchClick?: () => void;
}

function Search({search, onSearchChange, onSearchClick}: SearchProps) {
    return (
        <>
            <div className="search">
                <input
                className="input search-input"
                type="text"
                placeholder="Введите название..."
                value={search}
                onChange={(e) =>
                    onSearchChange(e.target.value)
                }
            />
                <button
                    onClick={onSearchClick}
                    className="button-like search-button"
                >
                    .
                </button>
            </div>
        </>
    );
}

export default Search;