import React from "react";

interface ContextProps {
    activeIndex: number,
    openView: Function,
}
const ViewSplitterContext = React.createContext<ContextProps>({
    activeIndex: 0,
    openView: () => {},
});

export { ViewSplitterContext };
