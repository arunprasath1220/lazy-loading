import { Suspense, lazy } from "react";
import styles from "./App.module.css";

const DataComponent = lazy(() => import("./DataComponent"));

export default function App() {
  return (
    <div className={styles.appContainer}>
      <h1 className={styles.heading}>📚 Discover Books & Authors</h1>
      <Suspense fallback={<h2 className={styles.loading}>⏳ Loading component...</h2>}>
        <DataComponent />
      </Suspense>
    </div>
  );
}
