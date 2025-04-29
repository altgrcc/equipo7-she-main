import { MoreVertical } from "lucide-react";
import { createContext, useContext, useState, type ReactNode, type FC } from "react";
import { 
    HiOutlineHome, HiClipboardList, HiOutlineUserGroup, HiLogout, HiOutlineLogout,
    HiNewspaper, HiPlusCircle, HiDocumentReport, HiPaperAirplane, 
    HiViewGrid, HiUserCircle 
} from "react-icons/hi";
import { HiUser } from "react-icons/hi2";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import sheLogo from '../assets/she-logo.png';
import onlyStar from '../assets/only-star.png';
import onlyText from '../assets/only-text.png';

// Definimos la interfaz del contexto
interface SidebarContextType {
    expanded: boolean;
}

// Creamos el contexto con un valor inicial null tipado correctamente
const SidebarContext = createContext<SidebarContextType | null>(null);

// Props para Sidebar
interface SidebarProps {
    children: ReactNode;
    onLogout?: () => void;
}

// Componente Sidebar
const Sidebar: FC<SidebarProps> = ({ children, onLogout }) => {
    const [expanded, setExpanded] = useState(true);
    const [showMenu, setShowMenu] = useState(false);

    return (
        <aside className="h-screen">
            <nav className="h-full flex flex-col bg-white border-r shadow-sm">
                <div className="p-4 pb-2 flex justify-between items-center">
                    {/* SHE Logo */}
                    <div className="overflow-hidden transition-all flex items-center" style={{ width: expanded ? 180 : 40 }}>
                        <img
                            src={onlyStar}
                            alt="SHE Star"
                            className="h-10 w-10"
                            style={{ objectFit: 'contain', transition: 'all 0.3s' }}
                        />
                        {expanded && (
                            <img
                                src={onlyText}
                                alt="SHE Text"
                                className="h-12 ml-2"
                                style={{ objectFit: 'contain', transition: 'all 0.3s' }}
                            />
                        )}
                    </div>
                    <button
                        onClick={() => setExpanded((curr) => !curr)}
                        className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
                    >
                        {expanded ? <HiChevronLeft /> : <HiChevronRight />}
                    </button>
                </div>

                <SidebarContext.Provider value={{ expanded }}>
                    <ul className="flex-1 px-3">{children}</ul>
                </SidebarContext.Provider>

                <div className="border-t flex p-3 relative">
                    <HiUserCircle className="w-10 h-10 rounded-md" />
                    <div
                        className={`
                        flex justify-between items-center
                        overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
                        `}
                    >
                        <div className="leading-4">
                            <h4 className="font-semibold">John Doe</h4>
                            <span className="text-xs text-gray-600">johndoe@gmail.com</span>
                        </div>
                        <button
                            className="ml-2 p-1 rounded hover:bg-gray-200 relative"
                            onClick={() => setShowMenu((v) => !v)}
                        >
                            <HiOutlineLogout size={22} />
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 bottom-full mb-2 bg-white border rounded shadow-lg z-10 min-w-[120px]">
                                <button
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                                    onClick={() => {
                                        setShowMenu(false);
                                        if (onLogout) onLogout();
                                    }}
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;

// Props para SidebarItem
interface SidebarItemProps {
    icon: ReactNode;
    text: string;
    active?: boolean;
    alert?: boolean;
    onClick?: () => void;
}

// Componente SidebarItem
export const SidebarItem: FC<SidebarItemProps> = ({
    icon,
    text,
    active = false,
    alert = false,
    onClick,
}) => {
    const context = useContext(SidebarContext);

    if (!context) {
        throw new Error("SidebarItem must be used within a Sidebar");
    }

    const { expanded } = context;

    return (
        <li
            className={`
                relative flex items-center py-2 px-3 my-1
                font-medium rounded-md cursor-pointer
                transition-colors group
                ${active
                    ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
                    : "hover:bg-indigo-50 text-gray-600"
                }
            `}
            onClick={onClick}
        >
            {icon}
            <span
                className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}
            >
                {text}
            </span>
            {alert && (
                <div
                    className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`}
                />
            )}
            {!expanded && (
                <div
                    className={`
                        absolute left-full rounded-md px-2 py-1 ml-6
                        bg-indigo-100 text-indigo-800 text-sm
                        invisible opacity-20 -translate-x-3 transition-all
                        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                    `}
                >
                    {text}
                </div>
            )}
        </li>
    );
};
