// components/Layout.js
import Head from "next/head";

import Header from "../../../pages/components/Header";
import NavBar from "../../../pages/components/NavBar";

import "../../../pages/components/Layout.scss";
import "./index.scss";

import navButtons from "../config/buttons";

const Layout = props => {
  const appTitle = `< تری نت`;

  return (
    <div dir={"rtl"} className="Layout">
      <Head>
        <title>تری نت</title>
      </Head>

      <Header appTitle={appTitle} />
      <div className="Content">{props.children}</div>
      <NavBar navButtons={navButtons} />
    </div>
  );
};

export default Layout;
