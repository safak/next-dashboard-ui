"use client"

import { FaSignOutAlt, FaTimes } from "react-icons/fa"

interface LogoutConfirmationProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
}

const LogoutConfirmation: React.FC<LogoutConfirmationProps> =({
    isOpen,
    onClose, 
    onConfirm
}) => {
    if(!isOpen) return null


    return(
        <div>
            <div>
                <div>
                    <h3>Confirm Logout</h3>
                    <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                    >
                        <FaTimes/>
                    </button>
                </div>

                <div>
                    <div>
                        <div>
                            <FaSignOutAlt/>
                        </div>
                    </div>

                    <p>Are you sure you want to logout from your admin account?</p>
                    
                </div>
            </div>
        </div>

    )
}
export default LogoutConfirmation