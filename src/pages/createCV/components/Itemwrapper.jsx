const EditSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#420093" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
        <path d="M13.5 6.5l4 4" />
    </svg>
);

export const TrashSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 7l16 0" />
        <path d="M10 11l0 6" />
        <path d="M14 11l0 6" />
        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
    </svg>
);

// ─── ItemWrapper ─────────────────────────────────────────────────────────────
// Props:
//   index       – list index
//   isEditing   – whether this item is in edit mode
//   onEdit      – called when Edit / Update button clicked
//   onDelete    – called when Delete button clicked
//   editForm    – JSX rendered inside the expanded edit area
//   children    – summary view (always visible)
const ItemWrapper = ({ index, onEdit, onDelete, children, isEditing, editForm }) => (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-md shadow-primary/5 border border-outline-variant/30 my-4">
        <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">{children}</div>
            <div className="flex items-center gap-2 ml-4 shrink-0">
                {isEditing ? (
                    <button
                        className="px-3 py-[7px] text-xs rounded-xl text-primary border border-primary hover:bg-primary/5 transition-colors"
                        onClick={onEdit}
                    >
                        Update
                    </button>
                ) : (
                    <button
                        className="px-2 py-[7px] rounded-xl border border-primary hover:bg-primary/5 transition-colors"
                        onClick={onEdit}
                    >
                        <EditSvg />
                    </button>
                )}
                <button
                    className="px-[8px] py-[7px] rounded-xl border border-red-500 hover:bg-red-50 transition-colors"
                    onClick={onDelete}
                >
                    <TrashSvg />
                </button>
            </div>
        </div>

        {isEditing && (
            <div className="space-y-6 pt-6 mt-4 border-t border-outline-variant/30">
                {editForm}
            </div>
        )}
    </div>
);

export default ItemWrapper;