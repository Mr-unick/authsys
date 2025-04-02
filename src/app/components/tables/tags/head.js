



export default function TH({children,type,classname}){
    
    return <td className={`px-4 max-sm:px-2  py-3 text-start bg-indigo-700 first-letter:uppercase text-sm max-sm:text-xs ${classname}`}>
        {children}
    </td>
}

