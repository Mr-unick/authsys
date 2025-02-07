

export default function HeaderBar({title,isDash}){
    return <div className="flex flex-col  max-md:hidden">
    <p className="font-semibold text-lg">{title}</p>
    {
     isDash  &&   <p>Good Morning Mr. Nikhil !</p>
    }
  </div>
}