const Modal = ({ onClose, children }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Assign Tasks</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
                </div>
                <div className="mt-4">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
