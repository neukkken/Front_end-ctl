import { Edit2Icon, EllipsisIcon, PlusIcon, SearchIcon, Trash2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "sonner";

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
    viewOptions?: {
        label: string;
        value: string;
        columns: TableColumn[];
    }[];
    loading: boolean;
    service: {
        create: (data: Record<string, any>) => Promise<any>;
        update: (data: Record<string, any>) => Promise<any>;
        delete: (_id: string) => Promise<any>;
    };
    onDataChange?: () => void;
}

export default function DataTableView({
    title,
    description,
    data,
    columns,
    fields,
    addButtonText,
    itemsPerPage = 10,
    searchPlaceholder = "Buscar...",
    viewOptions = [],
    loading,
    service,
    onDataChange
}: DataTableViewProps) {
    // Estados
    const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
    const [dropdownDirection, setDropdownDirection] = useState<'bottom' | 'top'>('bottom');
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [filterValue, setFilterValue] = useState("");
    const [currentView, setCurrentView] = useState<string>("default");
    const [currentColumns, setCurrentColumns] = useState<TableColumn[]>(columns);

    // Refs
    const buttonRefs = useRef<ButtonRefs>([]);
    const dropdownRefs = useRef<DropdownRefs>([]);
    const tableContainerRef = useRef<HTMLDivElement>(null);

    // Inicializar arrays de referencias
    useEffect(() => {
        buttonRefs.current = buttonRefs.current.slice(0, data.length);
        dropdownRefs.current = dropdownRefs.current.slice(0, data.length);
    }, [data.length]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    // Efecto para cambiar las columnas cuando cambia la vista
    useEffect(() => {
        if (viewOptions.length > 0) {
            if (currentView === "default") {
                setCurrentColumns(columns);
            } else {
                const selectedView = viewOptions.find(view => view.value === currentView);
                if (selectedView) {
                    setCurrentColumns(selectedView.columns);
                }
            }
        }
    }, [currentView, columns, viewOptions]);

    useEffect(() => {
        if (currentView === "default") {
            setCurrentColumns(columns);
        }
    }, [columns]);

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

    const getNestedValue = (obj: any, path: string): any => {
        return path.split('.').reduce((acc, key) => acc?.[key], obj);
    };

    const renderCellContent = (item: any, column: TableColumn) => {
        const value = getNestedValue(item, column.accessor);

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
                <Toaster position="top-center" richColors />
                <div>
                    <h3 className="text-2xl font-bold text-[#22D3EE]">{title}</h3>
                    <p className="text-[#ffffff88] text-[13px]">{description}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative group w-auto">
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/30 to-purple-500/30 blur-sm"></div>

                        <div className="relative flex h-12 items-center rounded-lg border border-cyan-500/20 bg-black/60 px-3 text-sm backdrop-blur-xl focus-within:border-cyan-400/50 focus-within:ring-1 focus-within:ring-cyan-400/50">
                            <div className="inset-y-0 left-0 flex items-center pointer-events-none">
                                <SearchIcon className="h-4 w-4 text-cyan-400 mr-2" />
                            </div>

                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />

                            {/* Línea inferior animada */}
                            <div className="absolute -bottom-px left-0 h-px w-full bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-transparent scale-x-0 transition-transform duration-300 group-focus-within:scale-x-100"></div>

                            {/* Pulso decorativo */}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <div className="h-1 w-1 rounded-full bg-cyan-400 animate-pulse"></div>
                                <div className="h-1 w-1 rounded-full bg-purple-400 animate-pulse delay-150"></div>
                            </div>
                        </div>
                    </div>


                    {viewOptions.length > 0 && (
                        <select
                            className="border border-gray-300 bg-black rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={currentView}
                            onChange={(e) => setCurrentView(e.target.value)}
                        >
                            <option value="default">Vista predeterminada</option>
                            {viewOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    )}

                    <PrimaryButton
                        onClick={() => setIsModalAddOpen(true)}
                        styles="flex rounded-lg px-4 py-2 items-center justify-center text-black bg-white"
                        text={addButtonText}
                        icon={<PlusIcon size={20} className="mr-2" />}
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {currentColumns.filter(c => c.filterable).map(column => (
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

            <div className="relative rounded-lg overflow-hidden group">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/30 to-purple-500/30 blur-sm z-0"></div>

                <div className="relative z-10 rounded-lg border border-cyan-800/20 bg-black/60 backdrop-blur-3xl">
                    {/* Desktop Table */}
                    <div className="hidden md:block">
                        <table className="w-full text-left">
                            <thead className="bg-black">
                                <tr>
                                    {currentColumns.map((column, index) => (
                                        <th key={index} className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {column.header}
                                        </th>
                                    ))}
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-black divide-y divide-gray-200">
                                {currentItems.length > 0 ? (
                                    currentItems.map((item, index) => (
                                        <tr key={index} className="hover:bg-[#ffffff10]">
                                            {currentColumns.map((column, colIndex) => (
                                                <td
                                                    key={colIndex}
                                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 truncate max-w-xs"
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
                                                            setSelectedItem(item);
                                                        }}
                                                        className="p-1 rounded hover:bg-gray-700 ellipsis-button"
                                                    >
                                                        <EllipsisIcon className="h-4 w-4" />
                                                    </button>

                                                    {openDropdownIndex === index && (
                                                        <div
                                                            ref={(el) => {
                                                                if (el) dropdownRefs.current[index] = el;
                                                            }}
                                                            className={`animate-scaleIn absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-black shadow-lg focus:outline-none ${dropdownDirection === 'bottom' ? 'top-full' : 'bottom-full'}`}
                                                        >
                                                            <div className="py-1">
                                                                <p className="px-4 py-2 text-xs font-bold text-gray-500">Acciones</p>
                                                                <button
                                                                    onClick={() => {
                                                                        setIsModalEditOpen(true);
                                                                        setSelectedItem({
                                                                            ...item,
                                                                            estado: item.estado ? "activo" : "inactivo"
                                                                        });
                                                                        setOpenDropdownIndex(null);
                                                                    }}
                                                                    className="flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-900"
                                                                >
                                                                    <Edit2Icon size={14} className="mr-2" /> Editar
                                                                </button>
                                                                <button
                                                                    onClick={() => { setIsDeleteModalOpen(true); setSelectedItem(item); }}
                                                                    className="flex w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-900"
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
                                        <td colSpan={currentColumns.length + 1} className="px-6 py-4 text-center text-sm text-gray-500">
                                            {loading
                                                ? "Cargando..."
                                                : filteredData.length === 0
                                                    ? "No se encontraron resultados"
                                                    : null}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden space-y-4">
                        {currentItems.length > 0 ? currentItems.map((item, index) => (
                            <div key={index} className="border border-cyan-700/30 bg-black/60 backdrop-blur-xl rounded-lg p-4 text-sm text-gray-300">
                                {currentColumns.map((column, colIndex) => (
                                    <div key={colIndex} className="flex justify-between py-1 border-b border-white/5 last:border-none">
                                        <span className="text-gray-500 font-medium">{column.header}</span>
                                        <span className="text-right text-gray-300">{renderCellContent(item, column)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        onClick={() => {
                                            setIsModalEditOpen(true);
                                            setSelectedItem({
                                                ...item,
                                                estado: item.estado ? "activo" : "inactivo"
                                            });
                                        }}
                                        className="px-3 py-1 rounded-md bg-white text-black text-xs font-medium hover:bg-gray-200 transition"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsDeleteModalOpen(true);
                                            setSelectedItem(item);
                                        }}
                                        className="px-3 py-1 rounded-md bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center text-sm text-gray-500">No se encontraron resultados</div>
                        )}
                    </div>

                </div>
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
                onSubmit={async (formData) => {
                    const raw = Object.fromEntries(formData.entries());
                    console.log(raw)
                    try {
                        await service.create(raw);
                        onDataChange?.();
                        toast.success(`Agregado correctamente`);
                        setIsModalAddOpen(false);
                    } catch (error) {
                        toast.error(`Error al agregar`);
                        console.error("Error al crear:", error);
                    }
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
                onSubmit={async (formData) => {
                    const raw = Object.fromEntries(formData.entries());

                    const updatedItem = {
                        ...selectedItem,
                        ...raw
                    };

                    try {
                        await service.update(updatedItem);
                        toast.success(`Editado correctamente`);
                        onDataChange?.();
                        setIsModalEditOpen(false);
                    } catch (error) {
                        toast.error(`Error al Editar`);
                        console.error("Error al actualizar:", error);
                    }
                }}
                buttonText="Guardar cambios"
            />

            {
                isDeleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000ab] bg-opacity-70 animate-fadeIn">
                        <div className="bg-black p-6 rounded-lg max-w-[70%] max-h-[90%] overflow-auto animate-scaleIn">
                            <div>
                                <h3 className="text-2xl font-bold">¿Está seguro de eliminar esta actividad?</h3>
                                <p className="text-gray-500 text-[13px]">Esta acción no se puede deshacer. Esto eliminará permanentemente el registro del sistema.</p>
                            </div>
                            <div className="flex items-center justify-end w-full gap-5">
                                <button
                                    onClick={() => { setIsDeleteModalOpen(false) }}
                                    className="gap-2 inline-flex items-center px-4 border-[1px] py-2 mt-4 bg-white transition ease-in-out delay-75 hover:bg-gray-300 text-black text-sm font-medium rounded-md"
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="gap-2 inline-flex items-center px-4 py-2 mt-4 bg-red-600 transition ease-in-out delay-75 hover:bg-red-700 text-white text-sm font-medium rounded-md"
                                    onClick={async () => {
                                        try {
                                            await service.delete(selectedItem._id);
                                            onDataChange?.();
                                            toast.success(`Eliminado correctamente`);
                                            setIsDeleteModalOpen(false);
                                        } catch (error) {
                                            toast.error(`Error al eliminar`);
                                            console.error("Error al eliminar:", error);
                                        }
                                    }}
                                >
                                    <Trash2Icon />
                                    Eliminar
                                </button>
                            </div>
                        </div>


                    </div>
                )
            }

        </div>
    );
}