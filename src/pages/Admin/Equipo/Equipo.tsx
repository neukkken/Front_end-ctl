import { useEffect, useState } from "react"
import { Equipo } from "../../../types/equipo"
import { EquipoService } from "../../../api/services/equipo.service";
import DataTableView, { TableColumn } from "../../../components/DataTableView";
import { Field } from "../../../components/ui/Modal";
import { Contratista } from "../../../types/contratista";
import { ContratistaService } from "../../../api/services/contratistas.service";

const equiposColumns: TableColumn[] = [
    { header: "Nombre", accessor: "nombreEquipo" },
    { header: "Serie de equipo", accessor: "serieEquipo" },
    { header: "Tipo de equipo", accessor: "tipoEquipo" },
    { header: "Contratista", accessor: "contratistaNombre" }, 
];

export default function Equipos() {
    const [contratista, setContratistas] = useState<Contratista[]>([]);
    const [equiposConNombreContratista, setEquiposConNombreContratista] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [equiposData, contratistasData] = await Promise.all([
                EquipoService.getAll(),
                ContratistaService.getAll()
            ]);
            setContratistas(contratistasData);

            // Crea un mapa de ID a nombre de contratista
            const contratistaMap = new Map(contratistasData.map(c => [c._id, c.nombre]));

            // Transforma los equipos para incluir el nombre del contratista
            const equiposTransformados = equiposData.map(equipo => ({
                ...equipo,
                contratistaNombre: contratistaMap.get(equipo.contratistaId) || "Desconocido"
            }));

            setEquiposConNombreContratista(equiposTransformados);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const contratistaOptions = contratista.map(equipo => ({
        label: equipo.nombre,
        value: equipo._id!
    }));

    const tipoEquipoOptions = [
        {
            label: "Harvester",
            value: "Harvester"
        },
        {
            label: "Forwarder",
            value: "Forwarder"
        }
    ]

    const fields: Field[] = [
        {
            label: "Nombre del equipo",
            name: "nombreEquipo",
            type: "text",
            placeholder: "Introduzca el nombre",
        },
        {
            label: "Serie",
            name: "serieEquipo",
            type: "text",
            placeholder: "Código identificador",
        },
        {
            label: "Contratista",
            name: "contratistaId",
            type: "select",
            options: contratistaOptions
        },
        {
            label: "Tipo de equipo",
            name: "tipoEquipo",
            type: "select",
            options: tipoEquipoOptions
        },
    ];

    return (
        <DataTableView
            title={`Gestión de Equipos`}
            description={`Ver y gestionar todos los equipos en el sistema`}
            data={equiposConNombreContratista}
            columns={equiposColumns}
            fields={fields}
            loading={!loading}
            addButtonText="Agregar Equipo"
            service={{
                create: async (data: Record<string, any>) => {
                    const nuevoEquipo: Equipo = {
                        nombreEquipo: String(data.nombreEquipo),
                        serieEquipo: data.serieEquipo,
                        contratistaId: data.contratistaId,
                        tipoEquipo: data.tipoEquipo
                    };
                    return await EquipoService.create(nuevoEquipo);
                },
                update: async (data: Record<string, any>) => {
                    const actualizado: Equipo = {
                        _id: String(data._id),
                        nombreEquipo: String(data.nombreEquipo),
                        serieEquipo: String(data.serieEquipo),
                        contratistaId: String(data.contratistaId),
                        tipoEquipo: String(data.tipoEquipo)
                    };
                    return await EquipoService.update(actualizado);
                },
                delete: async (_id: string) => {
                    return await EquipoService.delete(_id);
                }
            }}
            onDataChange={fetchData}
        />
    )
}