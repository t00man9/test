import React, { useState, useEffect } from "react";
import useTigetStore from "../store/tiget.store";
import { currenUser } from "../api/auth";
import LoadingToRedirect from "./LoadingToRedirect";

const ProtectRooteUser = ({ element }) => {
  const [ok, setOk] = useState(false);
  const user = useTigetStore((s) => s.numberCall);
  const token = useTigetStore((s) => s.token);
  console.log("User", user, "token", token);

  useEffect(() => {
    if (user && token) {
      currenUser(token)
        .then((res) => setOk(true))
        .catch((err) => setOk(false)); //ถ้าสำเร็จจะเข้า Then
    }
  }, []);

  return ok ? element : <LoadingToRedirect />;
};

export default ProtectRooteUser;
