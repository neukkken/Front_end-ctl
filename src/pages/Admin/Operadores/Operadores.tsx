import DataTableView, { TableColumn } from "../../../components/DataTableView";
import { Field } from "../../../components/ui/Modal";

const operadores = [
    {
        id: "OPE-01",
        nombre: "Forestal Services S.A",
        contratista: "Ambar"
    },
    {
        id: "OPE-01",
        nombre: "Services S.A",
        contratista: "Ambar"
    },
    {
        id: "OPE-01",
        nombre: "Forestal Services S.A",
        contratista: "Ambar"
    },
    {
        id: "OPE-01",
        nombre: "Forestal Services S.A",
        contratista: "Ambar"
    },
    {
        id: "OPE-01",
        nombre: "Forestal Services S.A",
        contratista: "Ambar"
    },
    {
        id: "OPE-02",
        nombre: "kiddkeo",
        contratista: "Ambar"
    },
    
];

const fields: Field[] = [
    {
        label: "Nombre del operador",
        name: "nombre",
        type: "text",
        placeholder: "Introduzca el nombre de la empresa",
    },
    {
        label: "Contratista",
        name: "contratistaId",
        type: "select",
        options: [
            { label: "Ambar", value: "ambar" },
            { label: "Efagram", value: "efagram" },
        ],
    },
];

const columns: TableColumn[] = [
    { header: "ID", accessor: "id" },
    { header: "Nombre del Operador", accessor: "nombre", type: "text"  },
    { header: "Contratista", accessor: "contratista", type: "text", filterable: true },
];

export default function Operadores() {
    return (
        <DataTableView
            title="Gestión de operadores"
            description="Ver y gestionar todos los operadores en el sistema"
            data={operadores}
            columns={columns}
            fields={fields}
            addButtonText="Agregar Operador"
        />
    );
}