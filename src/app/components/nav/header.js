

export default function HeaderBar({title,isDash}){
    return <div className=" px-2 flex flex-col  max-md:hidden">
    <p className=" text-lg">{title}</p>
    {
     isDash  &&  <p>Good Morning Mr. Nikhil !</p>
    }
  </div>
}