import { Navigate } from "react-router-dom";
import FullSizeLayout from "../components/layout/FullSizeLayout";
import Card404 from "../components/ui/Card404";

export default function () {
    return (
        <FullSizeLayout styles={""}>
            <Card404/>
            <Navigate to={'/admin'}/>
        </FullSizeLayout>
    )
}