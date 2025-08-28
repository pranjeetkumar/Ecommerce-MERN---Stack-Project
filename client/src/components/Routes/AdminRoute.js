import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";


export default function AdminRoute(){
    const [ok, setOk] = useState(false);
    const [auth] = useAuth();

    useEffect(() => {
        const authCheck = async () => {



            // const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/admin-auth`);
            // console.log("admin auth response", res);
            //     if (res.data) {
            //         setOk(true);
            //     } else {
            //         setOk(false);
            //     }


            try {
                const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/admin-auth`);
                if (res.data.ok) {
                    setOk(true);
                } else {
                    setOk(false);
                }
            } catch (error) {
                console.log("Error in admin route", error.response.data.message);
            }
        };
        if (auth?.token) authCheck();
    },[auth.token]);

    return ok ? <Outlet/> : <Spinner path="/" />;
}