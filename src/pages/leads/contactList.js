import DataTable from "../../app/components/tables/dataTable";



export default function tableleads(){
    return <div className="pb-10">
        <DataTable url = {'getContactList'} />
        </div>
}