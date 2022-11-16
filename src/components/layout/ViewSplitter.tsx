import React, {ReactElement, useContext, useState} from 'react';
import styles from './ViewSplitter.module.scss';
import cx from 'classnames';
import { ViewSplitterContext } from './ViewSplitter.utils';

interface ViewSplitterProps {
    children: Array<ReactElement<SideProps>>,
    defaultActiveIndex: number,
}
interface SideProps {
    children: React.ReactNode,
    alwaysShow?: boolean,
    index: number,
}

function ViewSplitter({ children, defaultActiveIndex = 0 }: ViewSplitterProps) {
    const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
    return (
        <ViewSplitterContext.Provider
            value={{
                activeIndex: activeIndex,
                openView: (e: MouseEvent, index: number) => {
                    setActiveIndex(index)
                },
            }}
        >
            <div className={styles.ViewSplitter}>
                {children}
            </div>
        </ViewSplitterContext.Provider>
    );
}

const Side : React.FunctionComponent<SideProps> = ({ children, index, alwaysShow = false } : SideProps) => {
    const { activeIndex, openView } = useContext(ViewSplitterContext);
    const isActive = activeIndex === index;
    return (
        <div
            className={cx({
                [styles.Side]: true,
                [styles.Placeholder]: !alwaysShow && !isActive,
                [styles.Active]: isActive,
                [styles.InActive]: !isActive
            })}
            onClick={isActive ? undefined : (e) => openView(e, index)}
        >
            {alwaysShow || isActive
                ? (
                    <div className={styles.InnerSide}>
                        {children}
                    </div>
                )
                : null}
        </div>
    );
}

ViewSplitter.Side = Side;

export default ViewSplitter;
