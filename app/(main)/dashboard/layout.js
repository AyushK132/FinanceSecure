import React, { Suspense } from "react";
import { BarLoader } from "react-spinners";

import DashboardPage from "./page";

function DashboardLayout() {
  return (
    <div className="mt-[-120px]">
      {/* Sidebar */}
      


      {/* Main Content */}
      <div className="main-content">
        
        <Suspense fallback={<BarLoader className="" width={"100%"} color="#9333ea" />}>
          <DashboardPage />
      
        </Suspense>
      </div>
    </div>
  );
}

export default DashboardLayout;
