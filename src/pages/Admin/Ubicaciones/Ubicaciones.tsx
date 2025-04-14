import { useEffect, useState } from "react";
import DataTableView, { TableColumn } from "../../../components/DataTableView";
import { Field } from "../../../components/ui/Modal";
import { Zona } from "../../../types/zonas";
import { Finca } from "../../../types/fincas";
import { Nucleo } from "../../../types/nucleo";
import { FincasService, NucleosService, ZonasService } from "../../../api/services/ubicaciones.service";

// Columnas específicas
const zonasColumns: TableColumn[] = [
    { header: "Nombre de Zona", accessor: "nombreZona" },
    { header: "Código de Zona", accessor: "codeZona" }
];

const nucleosColumns: TableColumn[] = [
    { header: "Nombre del Núcleo", accessor: "nombreNucleo" },
    { header: "Código del Núcleo", accessor: "codeNucleo" },
    { header: "Zona Asociada", accessor: "zonaId" }
];

const fincasColumns: TableColumn[] = [
    { header: "Nombre de la Finca", accessor: "nombreFinca" },
    { header: "Código de la Finca", accessor: "codeFinca" },
    { header: "Núcleo Asociado", accessor: "nucleoId" }
];

export default function Ubicaciones() {
    const [zonas, setZonas] = useState<Zona[]>([]);
    const [fincas, setFincas] = useState<Finca[]>([]);
    const [nucleos, setNucleos] = useState<Nucleo[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedView, setSelectedView] = useState<"zonas" | "nucleos" | "fincas">("zonas");

    const fetchData = async () => {
        try {
            const [zonasRes, fincasRes, nucleosRes] = await Promise.all([
                ZonasService.getAll(),
                FincasService.getAll(),
                NucleosService.getAll()
            ]);
            setZonas(zonasRes);
            setFincas(fincasRes);
            setNucleos(nucleosRes);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getData = () => {
        switch (selectedView) {
            case "zonas":
                return zonas.map(z => ({
                    _id: z._id,
                    nombreZona: z.nombreZona,
                    codeZona: z.codeZona
                }));
            case "nucleos":
                return nucleos.map(n => ({
                    _id: n._id,
                    nombreNucleo: n.nombreNucleo,
                    codeNucleo: n.codeNucleo,
                    zonaId: n.zonaId
                }));
            case "fincas":
                return fincas.map(f => ({
                    id: f._id,
                    nombreFinca: f.nombreFinca,
                    codeFinca: f.codeFinca,
                    nucleoId: f.nucleoId
                }));
            default:
                return [];
        }
    };

    const getColumns = () => {
        switch (selectedView) {
            case "zonas": return zonasColumns;
            case "nucleos": return nucleosColumns;
            case "fincas": return fincasColumns;
            default: return [];
        }
    };

    const zonaFields: Field[] = [
        {
            label: "Nombre de Zona",
            name: "nombreZona",
            type: "text",
            placeholder: "Introduzca el nombre de la zona",
        },
        {
            label: "Código de Zona",
            name: "codeZona",
            type: "text",
            placeholder: "Código identificador de la zona",
        }
    ];

    const nucleoFields: Field[] = [
        {
            label: "Nombre del Núcleo",
            name: "nombreNucleo",
            type: "text",
            placeholder: "Introduzca el nombre del núcleo",
        },
        {
            label: "Código del Núcleo",
            name: "codeNucleo",
            type: "text",
            placeholder: "Código del núcleo",
        },
        {
            label: "Zona Asociada",
            name: "zonaId",
            type: "select",
            options: zonas
                .filter(z => z._id !== undefined)
                .map(z => ({ label: z.nombreZona, value: z._id as string }))
        }
    ];

    const fincaFields: Field[] = [
        {
            label: "Nombre de la Finca",
            name: "nombreFinca",
            type: "text",
            placeholder: "Nombre de la finca",
        },
        {
            label: "Código de la Finca",
            name: "codeFinca",
            type: "text",
            placeholder: "Código de la finca",
        },
        {
            label: "Núcleo Asociado",
            name: "nucleoId",
            type: "select",
            options: nucleos
                .filter(n => n._id !== undefined)
                .map(n => ({ label: n.nombreNucleo, value: n._id as string }))
        }
    ];

    const getFields = (): Field[] => {
        switch (selectedView) {
            case "zonas": return zonaFields;
            case "nucleos": return nucleoFields;
            case "fincas": return fincaFields;
            default: return [];
        }
    };

    const getService = () => {
        switch (selectedView) {
            case "zonas":
                return {
                    create: async (data: Record<string, any>) => {
                        return await ZonasService.create({
                            nombreZona: String(data.nombreZona),
                            codeZona: String(data.codeZona)
                        });
                    },
                    update: async (data: Record<string, any>) => {
                        return await ZonasService.update({
                            _id: data._id,
                            nombreZona: String(data.nombreZona),
                            codeZona: String(data.codeZona)
                        });
                    },
                    delete: async (_id: string) => {
                        return await ZonasService.delete(_id);
                    }
                };
            case "nucleos":
                return {
                    create: async (data: Record<string, any>) => {
                        return await NucleosService.create({
                            nombreNucleo: String(data.nombreNucleo),
                            codeNucleo: String(data.codeNucleo),
                            zonaId: String(data.zonaId)
                        });
                    },
                    update: async (data: Record<string, any>) => {
                        return await NucleosService.update({
                            _id: data._id,
                            nombreNucleo: String(data.nombreNucleo),
                            codeNucleo: String(data.codeNucleo),
                            zonaId: String(data.zonaId)
                        });
                    },
                    delete: async (_id: string) => {
                        return await NucleosService.delete(_id);
                    }
                };
            case "fincas":
                return {
                    create: async (data: Record<string, any>) => {
                        return await FincasService.create({
                            nombreFinca: String(data.nombreFinca),
                            codeFinca: String(data.codeFinca),
                            nucleoId: String(data.nucleoId)
                        });
                    },
                    update: async (data: Record<string, any>) => {
                        return await FincasService.update({
                            _id: data.id,
                            nombreFinca: String(data.nombreFinca),
                            codeFinca: String(data.codeFinca),
                            nucleoId: String(data.nucleoId)
                        });
                    },
                    delete: async (_id: string) => {
                        return await FincasService.delete(_id);
                    }
                };
            default:
                return {
                    create: async () => { },
                    update: async () => { },
                    delete: async () => { }
                };
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Ubicaciones</h1>

            {/* Botones para seleccionar vista */}
            <div className="flex gap-3 mb-6">
                {["zonas", "nucleos", "fincas"].map((view) => (
                    <button
                        key={view}
                        onClick={() => setSelectedView(view as typeof selectedView)}
                        className={`px-4 py-2 rounded-md font-medium transition-all cursor-pointer
        ${selectedView === view
                                ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                                : "bg-black/40 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/10"}`}
                    >
                        {view.charAt(0).toUpperCase() + view.slice(1)}
                    </button>
                ))}
            </div>


            {/* Tabla de datos */}
            <DataTableView
                title={`Gestión de ${selectedView.charAt(0).toUpperCase() + selectedView.slice(1)}`}
                description={`Ver y gestionar, ${selectedView} en el sistema`}
                data={getData()}
                columns={getColumns()}
                fields={getFields()}
                loading={loading}
                addButtonText="Agregar Ubicación"
                service={getService()}
                onDataChange={fetchData}
            />

        </div>
    );
}
