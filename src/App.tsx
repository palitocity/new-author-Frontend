// import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes";
// import { getUserIp } from "./utils/getip";

const App = () => {
  // const [ip, setIp] = useState("");

  // useEffect(() => {
  //   const fetchIp = async () => {
  //     const userIp = await getUserIp();

  //     setIp(userIp || "Unable to fetch IP");
  //   };

  //   fetchIp();
  // }, []);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
