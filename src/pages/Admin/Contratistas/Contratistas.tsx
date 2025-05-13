import { useEffect, useState } from "react";
import DataTableView, { TableColumn } from "../../../components/DataTableView";
import { Field } from "../../../components/ui/Modal";
import { ContratistaService } from "../../../api/services/contratistas.service";
import type { Contratista } from "../../../types/contratista";

const fields: Field[] = [
    {
        label: "Nombre de la Empresa",
        name: "nombre",
        type: "text",
        placeholder: "Introduzca el nombre de la empresa",
        required: true
    },
    {
        label: "Estado",
        name: "estado",
        type: "select",
        options: [
            { label: "Activo", value: "activo" },
            { label: "Inactivo", value: "inactivo" },
        ],
        required: true
    },
];

const columns: TableColumn[] = [
    { header: "Nombre de la empresa", accessor: "nombre", type: "text" },
    { header: "N. Maquinas", accessor: "totalEquipos", type: "number" },
    { header: "N. Operadores", accessor: "totalOperadores", type: "number" },
    { header: "Estado", accessor: "estado", type: "status" },
];

export default function Contratista() {
    const [contratistas, setContratistas] = useState<Contratista[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            ContratistaService.getAll().then(setContratistas);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <DataTableView
            title={`Gestión de Contratistas (${contratistas.length})`}
            description="Ver y gestionar todos los contratistas en el sistema"
            data={contratistas}
            columns={columns}
            fields={fields}
            addButtonText="Agregar Contratista"
            loading={!loading}
            service={{
                create: async (data: Record<string, any>) => {
                    const nuevoContratista: Contratista = {
                        nombre: String(data.nombre),
                        estado: data.estado === 'activo',
                    };
                    return await ContratistaService.create(nuevoContratista);
                },
                update: async (data: Record<string, any>) => {
                    const actualizado: Contratista = {
                        _id: String(data._id),
                        nombre: String(data.nombre),
                        estado: data.estado === 'activo',
                    };
                    return await ContratistaService.update(actualizado);
                },
                delete: async (_id: string) => {
                    return await ContratistaService.delete(_id);
                }
            }}
            onDataChange={fetchData}
        />
    );
}