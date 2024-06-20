import PageContainer from "../components/PageContainer/PageContainer";
import styles from "./Projects.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLaptop, faArrowUp, faArrowDown, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, MouseEventHandler, Fragment } from "react";
import { Projects } from "../../main/events/projectEvents/projectEvents";
import Button, { ButtonLink } from "../components/Button/Button";
import { useNavigate } from "react-router-dom";


type SortingHeader = "title" | "createdAt" | "lastModified" | "lastAccessed";

const HEADERS : {name : SortingHeader, displayName: string}[]= [
    {
        name: "title",
        displayName: "Project Name"
    },
    {
        name: "createdAt",
        displayName: "Created"
    },
    {
        name: "lastModified",
        displayName: "Last Modified"
    },
    {
        name: "lastAccessed",
        displayName: "Last Accessed"
    },
];


function formatDate(dateString: Date | string): string {
    const date : Date = new Date(dateString);

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour12: true,
        hour: "2-digit",
        minute: "2-digit"
    });
}

export default function Projects() {
    const [projects, setProjects] = useState<Projects>({});
    const [isAscending, setIsAscending] = useState(false);
    const [sortingHeader, setSortingHeader] = useState<SortingHeader>("lastAccessed");
    const navigation = useNavigate();

    useEffect(() => {
        const getProjects = window.electron.ipcRenderer.on("get-projects", (response: ElectronResponse, ...args) => {
            if (response.success) {
                setProjects(response.data);
            }
        });

        return () => {
            getProjects();
        };
    }, []);

    const sortProjects = (header: SortingHeader) => {
        if (header === sortingHeader) {
            setIsAscending(!isAscending);
        } else {
            setSortingHeader(header);
            setIsAscending(false);
        }
    };

    const projectIds : string[] = Object.keys(projects);
    projectIds.sort((a, b) => {
        const aTime : number = new Date(projects[a][sortingHeader]).getTime();
        const bTime : number = new Date(projects[b][sortingHeader]).getTime();
        if (isAscending) {
            return aTime - bTime;
        } else {
            return bTime - aTime;
        }
    });

    return (
        <PageContainer className={styles.main}>
            <h1>
                <FontAwesomeIcon icon={faLaptop}/>&nbsp;
                Projects
            </h1>
            <div className={styles.actions}>
                <ButtonLink category="primary" to={"/projects/create"}>
                    <FontAwesomeIcon icon={faPlus}/>&nbsp;
                    New Project
                </ButtonLink>
            </div>
            <div className={styles.projects}>
                {
                    HEADERS.map(header => (
                        <HeaderButton
                            name={header.name}
                            displayName={header.displayName}
                            currentSortingHeader={sortingHeader}
                            isAscending={isAscending}
                            onClick={_ => sortProjects(header.name)}
                        />
                    ))
                }
                <div className={styles.separator}></div>
                {
                    projectIds.map((id) => (
                        <Fragment key={id}>
                            <div className={styles.projectItem}>
                                {projects[id].title}
                            </div>
                            <div className={`${styles.projectItem} ${styles.projectItemTime}`}>
                                {formatDate(projects[id].createdAt)}
                            </div>
                            <div className={`${styles.projectItem} ${styles.projectItemTime}`}>
                                {formatDate(projects[id].lastModified)}
                            </div>
                            <div className={`${styles.projectItem} ${styles.projectItemTime}`}>
                                {formatDate(projects[id].lastAccessed)}
                            </div>
                        </Fragment>
                    ))
                }
                {
                    !projectIds.length && 
                    <div className={styles.projectItem}>
                        No projects yet.
                    </div>
                }
                <div className={styles.separator}></div>
            </div>
        </PageContainer>
    );
}

interface HeaderButtonProps {
    name: SortingHeader,
    currentSortingHeader: SortingHeader,
    isAscending: boolean,
    displayName: string,
    onClick: MouseEventHandler<HTMLButtonElement>
}

function HeaderButton({name, displayName, onClick, currentSortingHeader, isAscending} : HeaderButtonProps) {
    return (
        <button className={styles.headerButton} onClick={onClick}>
            <div>
                {displayName}
            </div>
            {
                name === currentSortingHeader &&
                <div>
                    <FontAwesomeIcon icon={isAscending ? faArrowUp : faArrowDown}/>
                </div>
            }
        </button>
    );
}