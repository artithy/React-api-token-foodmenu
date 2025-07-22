import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function Drawer({ isOpen, onClose, children, cartItemsCount }) {
    const drawerClasses = `
        h-full bg-white shadow-xl flex flex-col rounded-lg overflow-hidden
    `;

    return (
        <div className={`${drawerClasses}`}>
            <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200 flex-shrink-0">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    Your Cart
                    {cartItemsCount !== undefined && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                            {cartItemsCount} items
                        </span>
                    )}
                </h2>
                <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>
            </div>
            <div className="flex-grow overflow-hidden">
                {children}
            </div>
        </div>
    );
}