import Link from "next/link";
import { withRouter } from "next/router";
import {border, drawerItem, gray, primaryDark, textItem} from "../constants/colors";

import "./MenuButton.scss";
import {IconApp} from "../react-native";
import React from "react";

const MenuButton = props => (
  <Link href={props.path}>
      <div
          className={`MenuButton  ${
              props.router.pathname === props.path ? "active" : ""
              }`}
          onClick={()=>{
             props.onPress && props.onPress()
          }}
      >
      {/* <div className="Icon">{props.icon}</div> */}
      <IconApp style={{ marginLeft: 10, with: 20, height: 20,tintColor:border }} class={"ap" + props.icon}/>
      <span className="Label" style={{color:drawerItem}}>{props.label}</span>
    </div>
  </Link>
);

export default withRouter(MenuButton);
