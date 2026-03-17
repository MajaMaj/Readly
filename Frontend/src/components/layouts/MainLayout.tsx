import { Outlet } from "react-router-dom";
import { TopBar } from "./TopBar/TopBar";

export const MainLayout = () => {
  return (
    <>
      <TopBar showNav={true} />
      <div className="pt-5 mt-4">
        <Outlet />
      </div>
    </>
  );
};
