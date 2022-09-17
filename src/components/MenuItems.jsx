import { useLocation } from "react-router";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";

function MenuItems() {
  const { pathname } = useLocation();

  return (
    <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={[pathname]}
    >
      <Menu.Item key="/glasselelction">
        <NavLink to="/glasselection" style={{color: "white"}}>Glasselection</NavLink>
      </Menu.Item>
      <Menu.Item key="/literature">
        <NavLink to="/literature" style={{color: "white"}}>Literature</NavLink>
      </Menu.Item>
    </Menu>
  )
}

export default MenuItems;
