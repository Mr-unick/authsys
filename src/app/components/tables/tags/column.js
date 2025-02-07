



export default function TD({children,type ='default'}){

    
    return <td className="px-4 py-3 text-start  border-y-[1px]">
        {
            type == 'default' && <div className="w-[10rem]  ">
            {children}
            </div>
        }

        {
            type == 'badge' && <div className="w-[10rem]">

            <span className={`w-auto  text-white text-xs px-2 py-1 rounded-full
             ${children == 'active'? 'bg-green-500' : 'bg-red-500'}`}>{children}</span>
            </div>
        }

        {
            type == 'colour' && <div className="w-[10rem]">
            {children}
            </div>
        }

        {
            type == 'List' && <div className="w-full">
                {children}
            </div>
        }

    </td>
}