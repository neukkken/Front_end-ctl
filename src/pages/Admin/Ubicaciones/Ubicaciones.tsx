import { useEffect, useState } from "react";
import DataTableView, { TableColumn } from "../../../components/DataTableView";
import { Field } from "../../../components/ui/Modal";
import { Zona } from "../../../types/zonas";
import { Finca } from "../../../types/fincas";
import { Nucleo } from "../../../types/nucleo";
import { FincasService, NucleosService, ZonasService } from "../../../api/services/ubicaciones.service";

// Definición de campos para el formulario
const fields: Field[] = [
    {
        label: "Nombre",
        name: "nombre",
        type: "text",
        placeholder: "Introduzca el nombre",
    },
    {
        label: "Tipo",
        name: "tipo",
        type: "select",
        options: [
            { label: "Zona", value: "zona" },
            { label: "Núcleo", value: "nucleo" },
            { label: "Finca", value: "finca" },
        ],
    },
    {
        label: "Código",
        name: "codigo",
        type: "text",
        placeholder: "Código identificador",
    }
];

// Columnas específicas
const zonasColumns: TableColumn[] = [
    { header: "ID", accessor: "_id" },
    { header: "Nombre de Zona", accessor: "nombreZona" },
    { header: "Código de Zona", accessor: "codeZona" }
];

const nucleosColumns: TableColumn[] = [
    { header: "ID", accessor: "_id" },
    { header: "Nombre del Núcleo", accessor: "nombreNucleo" },
    { header: "Código del Núcleo", accessor: "codeNucleo" },
    { header: "Zona Asociada", accessor: "zonaId" }
];

const fincasColumns: TableColumn[] = [
    { header: "ID", accessor: "id" },
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
                title={`Vista de ${selectedView.charAt(0).toUpperCase() + selectedView.slice(1)}`}
                description={`Ver y gestionar, ${selectedView} en el sistema`}
                data={getData()}
                columns={getColumns()}
                fields={fields}
                loading={loading}
                addButtonText="Agregar Ubicación"
            />
        </div>
    );
}
