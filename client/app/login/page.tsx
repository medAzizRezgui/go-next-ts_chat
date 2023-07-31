"use client";

import { useState, useContext, useEffect } from "react";
import { API_URL } from "@/constants";
import { useRouter } from "next/navigation";
import { AuthContext, UserInfo } from "@/modules/auth_provider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { authenticated } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (authenticated) {
      router.push("/");
      return;
    }
  }, [authenticated]);

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        const user: UserInfo = {
          username: data.username,
          id: data.id,
        };

        localStorage.setItem("user_info", JSON.stringify(user));
        return router.push("/");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className={"flex min-h-screen min-w-full items-center justify-center"}>
      <form className={"flex flex-col"}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={"Email"}
          type={"email"}
          className={
            "mt-8 rounded-md border-2 border-gray-500 p-3 focus:border-blue-500 focus:outline-none"
          }
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={"Password"}
          type={"password"}
          className={
            "mt-8 rounded-md border-2 border-gray-500 p-3 focus:border-blue-500 focus:outline-none"
          }
        />
        <button
          type="submit"
          onClick={submitHandler}
          className={"mt-6 rounded-md bg-blue-500 p-3 font-bold text-white"}
        >
          Login
        </button>
      </form>
    </div>
  );
};
export default Login;
