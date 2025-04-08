import { useEffect, useState } from "react";
import DataTableView, { TableColumn } from "../../../components/DataTableView";
import { Especie } from "../../../types/especies";
import { EspeciesService } from "../../../api/services/especies.service";
import { Field } from "../../../components/ui/Modal";

const fields: Field[] = [
    {
        label: "Nombre de la especie",
        name: "nombreEspecie",
        type: "text",
        placeholder: "Introduzca el nombre",
    }
];

const especiesColumns: TableColumn[] = [
    { header: "ID", accessor: "_id" },
    { header: "Nombre de la especie", accessor: "nombreEspecie" }
];

export default function Especies() {
    const [especies, setEspecies] = useState<Especie[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            EspeciesService.getAll().then(setEspecies);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <DataTableView
            title={`Vista de Especies`}
            description={`Ver y gestionar todos las especies en el sistema`}
            data={especies}
            columns={especiesColumns}
            fields={fields}
            loading={!loading}
            addButtonText="Agregar Especie"
            service={{
                create: async (data: Record<string, any>) => {
                    const nuevaEspecie: Especie = {
                        nombreEspecie: String(data.nombreEspecie)
                    };
                    return await EspeciesService.create(nuevaEspecie);
                },
                update: async (data: Record<string, any>) => {
                    const actualizado: Especie = {
                        _id: data._id,
                        nombreEspecie: String(data.nombreEspecie)
                    };
                    return await EspeciesService.update(actualizado);
                },
                delete: async (_id: string) => {
                    return await EspeciesService.delete(_id);
                }
            }}
            onDataChange={fetchData}
        />
    )
}