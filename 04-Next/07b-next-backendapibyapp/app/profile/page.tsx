"use client";

import axios from "axios";
import { setCookie } from "cookies-next";

type LoginResp = {
  name: string;
  age: number;
  token: string;
};

export default function ProfilePage() {
  function login() {
    axios
      .post<LoginResp>("/api/login?id=100", {
        username: "admin",
        password: 123456,
      })
      .then((res: { data: LoginResp }) => {
        console.log(res.data);
        setCookie("token", res.data.token, {
          maxAge: 60,
        });
      });
  }

  return (
    <div className="profile" style={{ padding: 24 }}>
      <div>Profile</div>
      <button onClick={login}>login</button>
    </div>
  );
}
