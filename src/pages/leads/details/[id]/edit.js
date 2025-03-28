import FormComponent from "@/app/components/forms/form";
import { useRouter } from "next/router";



export default function page(){
    const router = useRouter();
    const { id } = router.query;
    return <div className="bg-white p-4 rounded-md">
        <FormComponent formdata={{ formurl: 'leadform' }} />
    </div>
}