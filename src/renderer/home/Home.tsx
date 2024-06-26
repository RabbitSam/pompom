import PageContainer from "../components/PageContainer/PageContainer";
import styles from "./Home.module.scss";
import { ButtonLink } from "../components/Button/Button";


export default function Home() {
    return (
        <PageContainer className={styles.main}>
            <h1>Welcome to POMPOM!</h1>
            <div className={styles.content}>
                <p>
                    Whether you're looking to work hard or work smart, using the pomodoro method will get you on top.
                </p>
                <p>
                    Created by Francesco Cirillo in the late 1980s, the pomodoro method has become a well known and widely used
                    method of productivity. It primarily consists of <strong>seven</strong> steps:
                </p>
                <ol>
                    <li>
                        Decide on a task
                    </li>
                    <li>
                        Set the Pomodoro timer (typically for 25 minutes).
                    </li>
                    <li>
                        Work on the task.
                    </li>
                    <li>
                        When the timer ends, take a short break (typically 5 - 10 minutes).
                    </li>
                    <li>
                        When the break time ends, get started again from step 2.
                    </li>
                    <li>
                        After four pomodoros are done, take a longer break (typically 20 to 30 minutes).
                    </li>
                    <li>
                        When the long break is over, get started again from step 2.
                    </li>
                </ol>
            </div>
            <div className={styles.buttonContainer}>
                <ButtonLink category="primary" to="/quick-pom">
                    Get Started with a Quick Pom
                </ButtonLink>
                <ButtonLink category="primary" to="/projects">
                    Already Familiar? Create a Project!
                </ButtonLink>
            </div>
        </PageContainer>
    );
}