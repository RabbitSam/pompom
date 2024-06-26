import PageContainer from "../components/PageContainer/PageContainer";
import styles from "./Projects.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLaptop, faArrowUp, faArrowDown, faPlus, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, MouseEventHandler, Fragment } from "react";
import { Projects } from "../../main/events/projectEvents/projectEvents";
import { ButtonLink } from "../components/Button/Button";
import natsort from "natsort";
import { Link } from "react-router-dom";
import formatDate from "./utils/formatDate";
import showGenericErrorPopup from "./utils/showGenericErrorPopup";
import Loading from "../components/Loading/Loading";
import GenericError from "../components/GenericError/GenericError";


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

export default function Projects() {
    const [projects, setProjects] = useState<Projects>({});
    const [isAscending, setIsAscending] = useState(false);
    const [sortingHeader, setSortingHeader] = useState<SortingHeader>("lastAccessed");
    const [isLoading, setIsLoading] = useState(true);
    const [unexpectedError, setUnexpectedError] = useState(false);


    useEffect(() => {
        const getProjects = window.electron.ipcRenderer.on("get-projects", (response: ElectronResponse, ...args) => {
            if (response.success) {
                setProjects(response.data);
            } else {
                showGenericErrorPopup();
                setUnexpectedError(true);
            }

            setIsLoading(false);
        });

        return () => {
            getProjects();
        };
    }, []);

    useEffect(() => {
        window.electron.ipcRenderer.sendMessage("get-projects");
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
        const sorter = natsort({insensitive: true, desc: !isAscending});
        if (sortingHeader === "title") {
            return sorter(projects[a][sortingHeader], projects[b][sortingHeader]);
        }

        const aTime : number = new Date(projects[a][sortingHeader]).getTime();
        const bTime : number = new Date(projects[b][sortingHeader]).getTime();
        return sorter(aTime, bTime);
    });

    return (
        <PageContainer className={styles.main}>
            <GenericError isError={unexpectedError}/>
            <Loading isLoading={isLoading}/>
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
            <section className={styles.projects}>
                {
                    HEADERS.map(header => (
                        <HeaderButton
                            key={header.name}
                            name={header.name}
                            displayName={header.displayName}
                            currentSortingHeader={sortingHeader}
                            isAscending={isAscending}
                            onClick={_ => sortProjects(header.name)}
                        />
                    ))
                }
                <div className={styles.headerTitle}>
                    Actions
                </div>
                {
                    projectIds.map((id) => (
                        <Fragment key={id}>
                            <article className={styles.gridRowWrapper}>
                                <Link to={`/projects/${id}`} className={styles.projectItem}>
                                    {projects[id].title}
                                </Link>
                                <Link to={`/projects/${id}`} className={styles.projectItem}>
                                    {formatDate(projects[id].createdAt)}
                                </Link>
                                <Link to={`/projects/${id}`} className={styles.projectItem}>
                                    {formatDate(projects[id].lastModified)}
                                </Link>
                                <Link to={`/projects/${id}`} className={styles.projectItem}>
                                    {formatDate(projects[id].lastAccessed)}
                                </Link>
                                <div className={styles.projectActions}>
                                <ButtonLink to={`/projects/${id}/edit`} category="tertiary" tooltip="Edit Project">
                                    <FontAwesomeIcon icon={faPenToSquare} width={20} height={20}/>
                                    <div className="visuallyHidden">Edit Project</div>
                                </ButtonLink>
                                <ButtonLink to={`/projects/${id}/delete`} category="tertiary" tooltip="Delete Project">
                                    <FontAwesomeIcon icon={faTrash} width={20} height={20}/>
                                    <div className="visuallyHidden">Delete Project</div>
                                </ButtonLink>
                                </div>
                            </article>
                        </Fragment>
                    ))
                }
                {
                    !projectIds.length && 
                    <div className={styles.projectItem}>
                        No projects yet.
                    </div>
                }
            </section>
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
                <div className="visuallyHidden">
                    {name === currentSortingHeader ?
                        `Click to sort in ${isAscending ? "descending" : "ascending"} order.`
                        :
                        `Click to sort by ${displayName}.`
                    }
                </div>
            </div>
            {
                name === currentSortingHeader &&
                <div>
                    <FontAwesomeIcon icon={isAscending ? faArrowUp : faArrowDown}/>
                    <div className="visuallyHidden">
                        Sorted by {displayName} in {isAscending ? "ascending" : "descending"} order.
                    </div>
                </div>
            }
        </button>
    );
}