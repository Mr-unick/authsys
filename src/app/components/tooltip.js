import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../components/components/ui/tooltip"




export const ToolTipComponent =({children,msg})=>{
    return <TooltipProvider>
        <Tooltip>
            <TooltipTrigger>{children}</TooltipTrigger>
            <TooltipContent>
                <p>{msg}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>

}