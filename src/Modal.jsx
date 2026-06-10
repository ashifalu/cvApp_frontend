const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm"

      onClick={onClose}   // 👈 CLOSE when clicking outside
    >
      <div
        className="bg-surface-container-lowest w-full max-w-[480px] rounded-[24px] shadow-[0_40px_100px_-15px_rgba(107,56,212,0.15)] overflow-hidden border border-outline-variant/20 animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()} // 👈 PREVENT close when clicking inside
      >
        {children}
      </div>
    </div>
  )
}

export default Modal
