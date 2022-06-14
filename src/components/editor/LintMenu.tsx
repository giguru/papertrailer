import React, {useContext} from 'react';
import EditorContext from "./EditorContext";
import styles from './LintMenu.module.scss';

function LintMenu() {
    const { scaler, setScalar } = useContext(EditorContext);
    return (
        <div className={styles.LintMenu}>
            <button onClick={() => setScalar(Math.min(scaler + 0.05, 2.0))}>Bigger</button>
            {Math.round(scaler * 100) / 100}
            <button onClick={() => setScalar(Math.max(scaler - 0.05, 0.1))}>Smaller</button>
        </div>
    );
}

export default LintMenu;
