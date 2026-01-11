import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaRegUser } from "react-icons/fa";
import { motion } from "framer-motion";
import { LuDatabase, LuHistory  } from "react-icons/lu";
import { AiOutlineFileSync } from "react-icons/ai";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const INITIAL_MENU_DATA = [
    { id: 1, href: "/order", name: "Production Order", icon: <AiOutlineFileSync size={20} /> },
    { id: 2, href: "/masterdata", name: "Master Data", icon: <LuDatabase size={20} /> },
    { id: 3, href: "/history", name: "History", icon: <LuHistory  size={20} /> },
    { id: 4, href: "/usermanagement", name: "User Management", icon: <FaRegUser size={20} /> },
];

export default function Sidebar({ nav }) {
    const [selectMenu, setSelectMenu] = useState("/qcreport");
    const router = useRouter();
    const { data: session } = useSession();
    const [navMenuData,setNavMenuData] = useState([])


    useEffect(() => {
        setSelectMenu(router.asPath);
    }, [router]);

    useEffect(() => {
        const role = session?.user.role;
        if(role){
            if(role==="Operator"){
                let navData = INITIAL_MENU_DATA.filter(data=>(data.name != "Setting" && data.name != "User Management" && data.name != "Master Data"))
                setNavMenuData(navData);
            }else if(role==="Supervisor"){
                let navData = INITIAL_MENU_DATA.filter(data=>data.name != "User Management")
                setNavMenuData(navData);
            }else{
                setNavMenuData(INITIAL_MENU_DATA);
            }
        }

    }, [session?.user.role]);

    return (
        <div className={nav ? "sidebar-black-drop" : ""}>
            <div
                className={nav? "nav-sidebar-open": "nav-sidebar-close"}
            >
                <div className="flex flex-col justify-between">
                    <div className="flex flex-col">
                        {navMenuData.map((data) => {
                            return (
                                <Link
                                    key={data.id}
                                    href={data.href}
                                    className="py-2 flex flex-col relative z-10"
                                >
                                    {selectMenu == data.href || (selectMenu == '/report' && data.href == '/qcreport') ? (
                                        <motion.div
                                            layoutId="nav-manu-mobile-active"
                                            className="nav-manu-mobile-active"
                                            animate
                                        >
                                            <div className="w-[60px] flex justify-center">{data.icon}</div>
                                            <div className={nav ? "block" : "hidden"}>{data.name}</div>
                                        </motion.div>
                                    ) : (
                                        <div className="nav-manu-mobile">
                                            <div className="w-[60px] flex justify-center">{data.icon}</div>
                                            <div className={nav ? "block" : "hidden"}>{data.name}</div>
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>

    );
}
