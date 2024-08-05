import { NavBar, Image } from "antd-mobile";
import { useNavigate, Outlet } from "react-router-dom";
import "./index.less";

const Layout = () => {
  const navigate = useNavigate();
  // const location = useLocation();

  const back = () => {
    navigate(-1);
  };
  return (
    <div className={"layout"}>
      <div className={"top"}>
        <NavBar
          onBack={back}
          style={{ backgroundColor: "white", color: "#333" }}
          backIcon={<Image src='/assets/back-arrow.jpg' width={18} />}
        >
          {/* <FormattedMessage id={'page.path.nav.name:' + location.pathnam>e} /> */}
        </NavBar>
      </div>
      <div className={"body"} style={{ background: "#F5F6F8" }}>
        <div style={{ width: "100%" }}>
          <Outlet />
        </div>
      </div>
      <div className={"bottom"}></div>
    </div>
  );
};

export default Layout;
