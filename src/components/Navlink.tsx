import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

export default function Navlink() {
    const pathname = usePathname();
    const navlinks =[
        {
            href: "/",
            label: "Facture"
        }
    ];
    const isActiveLink = (href:string)=>
        pathname.replace(/\/$/,"") === href.replace(/\/$/,"");

        const renderLinks = (classNames : string)=>
            navlinks.map(({href, label}) =>{
                return <Link href={href} key={href} className={`btn-sm ${classNames} ${isActiveLink(href) ? 'btn-accent': ''}`}>
                    {label}
                </Link>
            })
        
  return (
    <div className=''>
        <div>
            <div>
                {renderLinks("btn")}
            </div>
        </div>
    </div>
  )
}
