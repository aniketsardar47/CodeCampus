import { Outlet, Navigate } from "react-router-dom";
import AuthContext from "@/context/AuthContext";
import { useContext } from "react";
import { Center } from "@chakra-ui/react";

const ProtectedRoute = ({allowedRole})=> {

    const {user} = useContext(AuthContext);

    if(!user){
        return <Navigate to='/login' replace/>;
    }

    if(allowedRole[0] != user.role){
        return <Center color={'red'}>Unauthorized!</Center>
    }
    return user ? <Outlet/> : <Navigate to='/login' replace></Navigate>
}

export default ProtectedRoute;