import DataTable from "../../app/components/tables/dataTable";



export default function tableleads(){
    return <div>
        <h1 className="mb-5">Leads</h1>
        <DataTable url = {'getLeadProps'} />
        </div>
}