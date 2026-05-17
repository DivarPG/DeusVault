import Search from "./Search.tsx";
import FilterButton from "./FilterButton.tsx";
import AddButton from "./AddButton.tsx";

interface CollectionToolsProps {
    onAddClick?: () => void;
    onFilterClick?: () => void;
    search: string;
    onSearchChange: (value: string) => void;
    onSearchClick?: () => void;
}

function CollectionTools({search, onSearchChange, onSearchClick, onFilterClick, onAddClick}: CollectionToolsProps) {
    return (
        <>
            <div className="tools">
                <Search search={search} onSearchChange={onSearchChange} onSearchClick={onSearchClick} />
                <div className="tools2">
                    <FilterButton onFilterClick={onFilterClick}/>
                    <AddButton onAddClick={onAddClick}/>
                </div>
            </div>
        </>
    );
}

export default CollectionTools;