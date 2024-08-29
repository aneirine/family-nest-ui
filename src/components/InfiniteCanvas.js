import React, { useRef } from "react";
import { ReactInfiniteCanvas } from "react-infinite-canvas";
import { COMPONENT_POSITIONS } from "./helpers/constants";
import TreeComponent from "./TreeComponent";

const InfiniteCanvas = () => {
    const canvasRef = useRef(null);

    return (
        <>
            <div style={{ width: "100vw", height: "100vh"}}>
                <ReactInfiniteCanvas
                    ref={canvasRef}
                    onCanvasMount={(mountFunc) => {
                        mountFunc.fitContentToView({scale: 1});
                    }}
                    customComponents={[
                        {
                            component: (
                                <button
                                    onClick={() => {
                                        canvasRef.current?.fitContentToView({scale: 1});
                                    }}
                                >
                                    fitToView
                                </button>
                            ),
                            position: COMPONENT_POSITIONS.TOP_LEFT,
                            offset: {x: 120, y: 10},
                        },
                    ]}
                >

                    <div style={{width: "100vw", height: "100vh"}}>
                        <TreeComponent/>
                    </div>

                </ReactInfiniteCanvas>
            </div>
        </>
    );
};

export default InfiniteCanvas;
