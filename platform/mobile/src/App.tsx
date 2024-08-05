import { routerData } from "./routers";
import { useRoutes, BrowserRouter } from "react-router-dom";
const Routers = () => {
  const Router = useRoutes(routerData);
  return Router;
};
const App = () => {
  return (
    <BrowserRouter>
      <Routers />
    </BrowserRouter>
  );
};

export default App;
