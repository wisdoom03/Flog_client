import LoginUI from "./Login.presenter";
import { useForm } from "react-hook-form";
import { useMoveToPage } from "../../commons/hooks/useMoveToPage";

import { LOGIN } from "./Login.queries";
import { useMutation } from "@apollo/client";
import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { GlobalContext } from "../../../../pages/_app";
interface FormValues {
  email?: string;
  password?: string;
}

export default function Login() {
  const { setAccessToken } = useContext(GlobalContext);
  const [errorMsg, setErrorMsg] = useState({
    email: "",
    password: "",
  });
  const [modalContents, setModalContents] = useState("");
  const { moveToPage } = useMoveToPage();
  const router = useRouter();
  const [login] = useMutation(LOGIN);
  const { register, handleSubmit, watch } = useForm({
    mode: "onChange",
  });
  const onclickSubmit = async (data: FormValues) => {
    console.log(data);
    try {
      const result = await login({
        variables: {
          email: data.email,
          password: data.password,
        },
      });
      console.log(result.data?.login);
      const token = result.data?.login;
      if (token) {
        setAccessToken(token);
        // localStorage.setItem("accessToken", token);
      }
      setModalShow(true)
      router.push("/myTrips");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("이메일")) {
          setErrorMsg({ ...errorMsg, email: error.message });
          resetError(data.email, "email");
        }
        if (error.message.includes("비밀번호")) {
          setErrorMsg({ ...errorMsg, password: error.message });
          resetError(data.email, "password");
        } 
      }
    }
  };
  const resetError = (data: string | undefined, section: string) => {
    console.log('d')
    watch((value) => {
      console.log('v')
      console.log(value)
      if (section === "email" && data !== value.email)
        setErrorMsg({ ...errorMsg, email: "" });
      if (section === "password" && data !== value.password)
        setErrorMsg({ ...errorMsg, password: "" });
    });
  };
  const onModal = () => {
    setModalShow(prev => !prev)
  }
  return (
    <LoginUI
      register={register}
      handleSubmit={handleSubmit}
      onclickSubmit={onclickSubmit}
      errorMsg={errorMsg}
      moveToPage={moveToPage}
      onModal={onModal}
      modalContents={modalContents}
    />
  );
}
