const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}   // 👈 CLOSE when clicking outside
    >
      <div
        className="bg-white rounded-lg p-6 w-[400px] relative"
        onClick={(e) => e.stopPropagation()} // 👈 PREVENT close when clicking inside
      >
        {children}
      </div>
    </div>
  )
}

export default Modal
