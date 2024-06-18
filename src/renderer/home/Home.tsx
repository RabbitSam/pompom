import PageContainer from "../components/PageContainer/PageContainer";
import styles from "./Home.module.scss";
import { ButtonLink } from "../components/Button/Button";


export default function Home() {
    return (
        <PageContainer className={styles.main}>
            <h1>Welcome to POMPOM!</h1>
            <p>
                Whether you're looking to work hard or work smart, using the pomodoro method will get you on top.
                <br />
                Insert other bs here
            </p>
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