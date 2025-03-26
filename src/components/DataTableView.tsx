import { Edit2Icon, EllipsisIcon, PlusIcon, SearchIcon, Trash2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Componentes UI
import { PrimaryButton } from "./ui/buttons/Button";
import { SecondaryButton } from "./ui/buttons/SecondaryButton";
import { Pagination } from "./ui/Pagination";
import DynamicFormModal, { Field } from "./ui/Modal";

// Tipos
type ColumnType = "number" | "text" | "status";
type ButtonRefs = Array<HTMLButtonElement | null>;
type DropdownRefs = Array<HTMLDivElement | null>;

export interface TableColumn {
    header: string;
    accessor: string;
    type?: ColumnType;
    filterable?: boolean;
}

interface DataTableViewProps {
    title: string;
    description: string;
    data: any[];
    columns: TableColumn[];
    fields: Field[];
    addButtonText: string;
    itemsPerPage?: number;
    searchPlaceholder?: string;
}

export default function DataTableView({
    title,
    description,
    data,
    columns,
    fields,
    addButtonText,
    itemsPerPage = 10,
    searchPlaceholder = "Buscar..."
}: DataTableViewProps) {
    // Estados
    const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
    const [dropdownDirection, setDropdownDirection] = useState<'bottom' | 'top'>('bottom');
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [filterValue, setFilterValue] = useState("");

    // Refs
    const buttonRefs = useRef<ButtonRefs>([]);
    const dropdownRefs = useRef<DropdownRefs>([]);
    const tableContainerRef = useRef<HTMLDivElement>(null);

    // Inicializar arrays de referencias
    useEffect(() => {
        buttonRefs.current = buttonRefs.current.slice(0, data.length);
        dropdownRefs.current = dropdownRefs.current.slice(0, data.length);
    }, [data.length]);

    // Datos filtrados
    const filteredData = data.filter(item => {
        if (searchTerm) {
            const matchesSearch = Object.values(item).some(
                val => String(val).toLowerCase().includes(searchTerm.toLowerCase())
            );
            if (!matchesSearch) return false;
        }

        if (activeFilter && filterValue) {
            return String(item[activeFilter]).toLowerCase().includes(filterValue.toLowerCase());
        }

        return true;
    });

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Efectos
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;

            if (
                openDropdownIndex !== null &&
                dropdownRefs.current[openDropdownIndex] &&
                !dropdownRefs.current[openDropdownIndex]!.contains(target) &&
                !target.closest(".ellipsis-button")
            ) {
                setOpenDropdownIndex(null);
            }
        };

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpenDropdownIndex(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [openDropdownIndex]);

    // Handlers
    const handleFilterChange = (columnAccessor: string) => {
        if (activeFilter === columnAccessor) {
            setActiveFilter(null);
            setFilterValue("");
        } else {
            setActiveFilter(columnAccessor);
            setFilterValue("");
            setCurrentPage(1);
        }
    };

    const toggleDropdown = (index: number) => {
        if (openDropdownIndex === index) {
            setOpenDropdownIndex(null);
            return;
        }

        // Calcular dirección del dropdown
        const button = buttonRefs.current[index];
        const container = tableContainerRef.current;

        if (button && container) {
            const buttonRect = button.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            const spaceBelow = containerRect.bottom - buttonRect.bottom;
            const estimatedDropdownHeight = 150;

            setDropdownDirection(spaceBelow > estimatedDropdownHeight ? 'bottom' : 'top');
        }

        setOpenDropdownIndex(index);
    };

    // Render helpers
    const renderCellContent = (item: any, column: TableColumn) => {
        const value = item[column.accessor];

        switch (column.type) {
            case 'status':
                return (
                    <span className={`px-2 py-1 rounded-full text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {value ? "Activo" : "Inactivo"}
                    </span>
                );
            case 'number':
                return Number(value).toLocaleString();
            default:
                return value;
        }
    };

    return (
        <div className="overflow-y-auto" ref={tableContainerRef}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-2xl font-bold">{title}</h3>
                    <p className="text-[#00000059] text-[13px]">{description}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex border border-gray-300 bg-white placeholder-gray-500 rounded-lg">
                        <div className="inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            className="block w-full pl-10 pr-3 py-2 leading-5 outline-none sm:text-sm"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>

                    <PrimaryButton
                        onClick={() => setIsModalAddOpen(true)}
                        styles="flex rounded-lg px-4 py-2 items-center justify-center text-white"
                        text={addButtonText}
                        icon={<PlusIcon size={20} className="mr-2" />}
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {columns.filter(c => c.filterable).map(column => (
                    <div key={column.accessor} className="flex items-center gap-2">
                        <SecondaryButton
                            onClick={() => handleFilterChange(column.accessor)}
                            active={activeFilter === column.accessor}
                            text={`Filtrar por ${column.header}`}
                            styles="px-3 py-1 text-sm"
                            icon={null}
                        />
                        {activeFilter === column.accessor && (
                            <input
                                type="text"
                                placeholder={`Filtrar ${column.header}...`}
                                className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-1"
                                value={filterValue}
                                onChange={(e) => {
                                    setFilterValue(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column, index) => (
                                <th key={index} className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {column.header}
                                </th>
                            ))}
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.length > 0 ? (
                            currentItems.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    {columns.map((column, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 truncate max-w-xs"
                                            title={String(item[column.accessor])}
                                        >
                                            {renderCellContent(item, column)}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="relative inline-block text-left">
                                            <button
                                                ref={(el) => {
                                                    if (el) buttonRefs.current[index] = el;
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleDropdown(index);
                                                }}
                                                className="p-1 rounded hover:bg-gray-100 ellipsis-button"
                                            >
                                                <EllipsisIcon className="h-4 w-4" />
                                            </button>

                                            {openDropdownIndex === index && (
                                                <div
                                                    ref={(el) => {
                                                        if (el) dropdownRefs.current[index] = el;
                                                    }}
                                                    className={`animate-scaleIn absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg focus:outline-none ${dropdownDirection === 'bottom' ? 'top-full' : 'bottom-full'
                                                        }`}
                                                >
                                                    <div className="py-1">
                                                        <p className="px-4 py-2 text-xs font-bold text-gray-700">Acciones</p>
                                                        <button
                                                            onClick={() => {
                                                                setIsModalEditOpen(true);
                                                                setSelectedItem({
                                                                    ...item,
                                                                    estado: item.estado ? "activo" : "inactivo"
                                                                });
                                                                setOpenDropdownIndex(null);
                                                            }}
                                                            className="flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            <Edit2Icon size={14} className="mr-2" /> Editar
                                                        </button>
                                                        <button
                                                            className="flex w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                        >
                                                            <Trash2Icon size={14} className="mr-2" /> Eliminar
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-sm text-gray-500">
                                    {filteredData.length === 0 ? "No se encontraron resultados" : "No hay datos en esta página"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className="mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalItems={filteredData.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                />
            </div>

            {/* Modales */}
            <DynamicFormModal
                isOpen={isModalAddOpen}
                onClose={() => setIsModalAddOpen(false)}
                title={`Añadir nuevo ${title}`}
                description={`Complete los detalles para añadir un nuevo registro al sistema.`}
                fields={fields}
                onSubmit={(formData) => {
                    const data = Object.fromEntries(formData.entries());
                    console.log("Formulario enviado:", data);
                }}
                buttonText="Agregar"
            />

            <DynamicFormModal
                isOpen={isModalEditOpen}
                onClose={() => setIsModalEditOpen(false)}
                title={`Editar ${title}`}
                description={`Complete los detalles para editar el registro en el sistema.`}
                fields={fields}
                initialValues={selectedItem}
                onSubmit={(formData) => {
                    const data = Object.fromEntries(formData.entries());
                    console.log("Formulario actualizado:", data);
                }}
                buttonText="Guardar cambios"
            />
        </div>
    );
}