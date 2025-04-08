import { useEffect, useState } from "react";
import DataTableView, { TableColumn } from "../../../components/DataTableView";
import { Turno } from "../../../types/turno";
import { TurnosService } from "../../../api/services/turnos.service";
import { Field } from "../../../components/ui/Modal";
import { Contratista } from "../../../types/contratista";
import { ContratistaService } from "../../../api/services/contratistas.service";

const turnosColumns: TableColumn[] = [
    { header: "ID", accessor: "_id" },
    { header: "Nombre del turno", accessor: "nombreTurno" },
    { header: "Hora de inicio", accessor: "horaInicio" },
    { header: "Hora de fin", accessor: "horaFin" },
    { header: "Contratista", accessor: "contratistaId.nombre" },
];

export default function Turnos() {
    const [turnos, setTurnos] = useState<Turno[]>([]);
    const [loading, setLoading] = useState(true);
    const [contratistas, setContratistas] = useState<Contratista[]>([]);

    const fetchData = async () => {
        try {
            TurnosService.getAll().then(setTurnos);
            ContratistaService.getAll().then(setContratistas);
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    }

    const contratistaOptions = contratistas.map(turno => ({
        label: turno.nombre,
        value: turno._id!
    }));

    const fields: Field[] = [
        {
            label: "Nombre del turno",
            name: "nombreTurno",
            type: "text",
            placeholder: "Ej: TURNO 1",
            required: true
        },
        {
            label: "Hora de inicio (formato 24h)",
            name: "horaInicio",
            type: "time",
            required: true
        },
        {
            label: "Hora de fin (formato 24h)",
            name: "horaFin",
            type: "time",
            required: true
        },
        {
            label: "Contratista",
            name: "contratistaId._id",
            type: "select",
            options: contratistaOptions,
            required: true
        }
    ];

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <DataTableView
            title={`Vista de Turnos`}
            description={`Ver y gestionar todos los turnos en el sistema, (las horas están en formato 24 horas)`}
            data={turnos}
            columns={turnosColumns}
            fields={fields}
            loading={!loading}
            addButtonText="Agregar Equipo"
            service={{
                create: async (data: Record<string, any>) => {
                    const nuevoTurno: Turno = {
                        nombreTurno: String(data.nombreTurno),
                        horaInicio: data.horaInicio,
                        horaFin: data.horaFin,
                        contratistaId: data.contratistaId
                    };
                    return await TurnosService.create(nuevoTurno);
                },
                update: async (data: Record<string, any>) => {
                    const actualizado: Turno = {
                        _id: String(data._id),
                        nombreTurno: String(data.nombreTurno),
                        horaInicio: data.horaInicio,
                        horaFin: data.horaFin,
                        contratistaId: data.contratistaId
                    };
                    return await TurnosService.update(actualizado);
                },
                delete: async (_id: string) => {
                    return await TurnosService.delete(_id);
                }
            }}
            onDataChange={fetchData}
        />
    )
}