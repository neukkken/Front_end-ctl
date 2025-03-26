import DataTableView, { TableColumn } from "../../../components/DataTableView";
import { Field } from "../../../components/ui/Modal";

const contratistas = [
    {
        id: "CON-01",
        nombre: "Forestal Services S.A",
        maquinas: 123456678,
        operadores: 12,
        estado: false
    },
    {
        id: "CON-01",
        nombre: "Forestal Services S.A",
        maquinas: 123456678,
        operadores: 12,
        estado: false
    },
    {
        id: "CON-01",
        nombre: "Forestal Services S.A",
        maquinas: 123456678,
        operadores: 12,
        estado: true
    },
    {
        id: "CON-02",
        nombre: "kiddkeo",
        maquinas: 123456678,
        operadores: 12,
        estado: true
    }
];

const fields: Field[] = [
    {
        label: "Nombre de la Empresa",
        name: "nombre",
        type: "text",
        placeholder: "Introduzca el nombre de la empresa",
    },
    {
        label: "Email",
        name: "email",
        type: "email",
        placeholder: "Introduzca el email de la empresa",
    },
    {
        label: "Estado",
        name: "estado",
        type: "select",
        options: [
            { label: "Activo", value: "activo" },
            { label: "Inactivo", value: "inactivo" },
        ],
    },
];

const columns: TableColumn[] = [
    { header: "ID", accessor: "id" },
    { header: "Nombre de la empresa", accessor: "nombre", type: "text" },
    { header: "N. Maquinas", accessor: "maquinas", type: "number" },
    { header: "N. Operadores", accessor: "operadores", type: "number" },
    { header: "Estado", accessor: "estado", type: "status" },
];

export default function Contratista() {
    return (
        <DataTableView
            title="Gestión de contratistas"
            description="Ver y gestionar todos los contratistas en el sistema"
            data={contratistas}
            columns={columns}
            fields={fields}
            addButtonText="Agregar Contratista"
        />
    );
}