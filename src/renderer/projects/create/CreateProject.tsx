import PageContainer from "../../components/PageContainer/PageContainer";
import ProjectForm from "../components/ProjectForm";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function CreateProject() {
    return (
        <PageContainer>
            <h1>
                <FontAwesomeIcon icon={faPlus}/> Create Project
            </h1>
            <ProjectForm isEdit={false} />
        </PageContainer>
    );
}