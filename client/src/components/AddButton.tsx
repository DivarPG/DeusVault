interface AddButtonProps {
    onAddClick?: () => void;
}

function AddButton({onAddClick}: AddButtonProps) {
    return (
        <>
            <button
                onClick={onAddClick}
                className="button-like  add-button"
            >
                +
            </button>
        </>
    );
}

export default AddButton;