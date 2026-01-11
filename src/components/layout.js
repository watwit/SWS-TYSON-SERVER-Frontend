import React,{useState} from "react";
import Navbar from "./nav";
import Sidebar from "./sidebar";
import PropTypes from "prop-types";
import Head from "next/head";
import AutoLogout from "./autologout";

export default function Layout({ children }) {
  const [nav, setNav] = useState(true);

  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <>
      <Head>
        <title>SWS Center</title>
        {/* <meta
          name="description"
          content="I'm a software developer to produce scalable software solutions. I
            am a part of a cross-functional team that’s responsible for the full
            software development life cycle, from conception to deployment."
        /> */}
        {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}
        {/* <link rel="icon" href="/code.ico" /> */}
      </Head>
      <AutoLogout/>
      <div className="nav-grid" >      
        <Navbar handleNav={handleNav}/>
        <Sidebar nav={nav}/>
        <main className="main-content">{children}</main>
      </div>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
