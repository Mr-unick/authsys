
export default function HeaderBar({ title, isDash, name }) {
  return <div className=" px-2 flex flex-col  max-md:hidden">
    <p className=" text-lg font-bold text-foreground">{title}</p>
    {
      isDash && <p className="text-sm text-gray-500">Good Morning Mr. {name} !</p>
    }
  </div>
}