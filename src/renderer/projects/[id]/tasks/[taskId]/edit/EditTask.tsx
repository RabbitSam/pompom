import PageContainer from "../../../../../components/PageContainer/PageContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import TaskForm from "../../components/TaskForm";

export default function EditTask() {
    const { projectId, taskId } = useParams();

    return (
        <PageContainer>
            <h1>
                <FontAwesomeIcon icon={faPenToSquare}/> Edit Task
            </h1>

            {
                projectId &&
                <TaskForm isEdit={true} projectId={projectId} taskId={taskId}/>
            }
        </PageContainer>
    );
}