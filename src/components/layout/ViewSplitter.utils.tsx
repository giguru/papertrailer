import React from "react";

interface ContextProps {
    activeIndex: number,
    openView: (newIndex: number) => void,
}

const ViewSplitterContext = React.createContext<ContextProps>({
    activeIndex: 0,
    openView: () => {},
});

export {ViewSplitterContext};
