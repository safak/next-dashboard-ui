import { menuItems } from "@/utils/Menu"
import Link from "next/link"
import Image from "next/image"

const Menu = () => {
  return (
    <div className="mt-4 text-sm">
        {menuItems.map((Menuitem)=>(
            <div key={Menuitem.title} className="flex flex-col gap-2" >
                <span className="hidden lg:block text-gray-400 font-light my-4">{Menuitem.title}</span>
                {Menuitem.items.map((item)=>(
                    <Link key={item.label} href={item.href} className="flex md:px-2 items-center justify-center lg:justify-start gap-4 text-gray-500 py-2">
                        <Image src={item.icon} alt={item.label} width={20} height={20}/>
                        <span className="hidden lg:block">{item.label}</span>
                    </Link>
                ))}
            </div>
        )
    )}
    </div>
  )
}

export default Menu