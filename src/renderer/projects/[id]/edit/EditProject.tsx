import PageContainer from "../../../components/PageContainer/PageContainer";
import ProjectForm from "../../components/ProjectForm";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom";


export default function EditProject() {
    const { projectId } = useParams();

    return (
        <PageContainer>
            <h1>
                <FontAwesomeIcon icon={faPenToSquare}/> Edit Project
            </h1>
            <ProjectForm isEdit={true} projectId={projectId} />
        </PageContainer>
    );
}