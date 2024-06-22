import PageContainer from "../../../../components/PageContainer/PageContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import TaskForm from "../components/TaskForm";


export default function CreateTask() {
    const { projectId } = useParams();

    return (
        <PageContainer>
            <h1>
                <FontAwesomeIcon icon={faPlus}/> Create Task
            </h1>

            {
                projectId &&
                <TaskForm isEdit={false} projectId={projectId} />
            }
        </PageContainer>
    );
}