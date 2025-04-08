import { useEffect, useState } from "react";
import { OperadorService } from "../../../api/services/operadores.service";
import DataTableView, { TableColumn } from "../../../components/DataTableView";
import { Field } from "../../../components/ui/Modal";
import { Operador } from "../../../types/operador";
import { EquipoService } from "../../../api/services/equipo.service";
import { Equipo } from "../../../types/equipo";

const columns: TableColumn[] = [
    { header: "ID", accessor: "_id" },
    { header: "Nombre del Operador", accessor: "nameOperador", type: "text" },
    { header: "N. Cedula", accessor: "numCedula", type: "text" },
    { header: "Equipo Asignado", accessor: "equipoId.nombreEquipo", type: "text", filterable: false },
    { header: "Contratista", accessor: "equipoId.contratistaId.nombre", type: "text", filterable: false },
];

export default function Operadores() {
    const [operadores, setOperadores] = useState<Operador[]>([]);
    const [equipos, setEquipos] = useState<Equipo[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            OperadorService.getAll().then(setOperadores);
            EquipoService.getAll().then(setEquipos);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    console.log(equipos)

    const equiposOptions = equipos.map(equipo => ({
        label: equipo.nombreEquipo,
        value: equipo._id!
    }));

    const fields: Field[] = [
        {
            label: "Nombre del operador",
            name: "nameOperador",
            type: "text",
            placeholder: "Introduzca el nombre del operador",
            required: true
        },
        {
            label: "Cedula",
            name: "numCedula",
            type: "text",
            placeholder: "Introduzca la cedula del operador",
            required: true
        },
        {
            label: "Equipo",
            name: "equipoId",
            type: "select",
            options: equiposOptions,
            required: true
        },
    ];

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <DataTableView
            title="Gestión de operadores"
            description="Ver y gestionar todos los operadores en el sistema"
            data={operadores}
            columns={columns}
            fields={fields}
            addButtonText="Agregar Operador"
            loading={!loading}
            onDataChange={fetchData}
            service={{
                create: async (data: Record<string, any>) => {
                    const nuevoOperador: Operador = {
                        numCedula: String(data.numCedula),
                        nameOperador: data.nameOperador,
                        equipoId: data.equipoId
                    };
                    return await OperadorService.create(nuevoOperador);
                },
                update: async (data: Record<string, any>) => {
                    const actualizado: Operador = {
                        _id: String(data._id),
                        numCedula: String(data.numCedula),
                        nameOperador: String(data.nameOperador),
                        equipoId: String(data.equipoId)
                    };
                    return await OperadorService.update(actualizado);
                },
                delete: async (_id: string) => {
                    return await OperadorService.delete(_id);
                }
            }}
        />
    );
}