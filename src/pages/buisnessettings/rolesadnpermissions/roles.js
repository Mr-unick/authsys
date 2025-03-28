import DataTable from "../../../app/components/tables/dataTable";

export default function roles() {
    return (
        <div>
            <h1 className="mb-5">Roles</h1>
            <DataTable url="getRoleProps" />
        </div>
    );
}