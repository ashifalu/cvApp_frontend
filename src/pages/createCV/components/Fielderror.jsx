const FieldError = ({ message }) =>
    message ? (
        <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {message}
        </p>
    ) : null;

export default FieldError;