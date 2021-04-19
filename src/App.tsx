import React, { useEffect } from 'react';
import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import { beginStroke, updateStroke } from './modules/currentStroke/slice';
import { clearCanvas, drawStroke, setCanvasSize } from './utils/canvasUtils';
import { ColorPanel } from './shared/ColorPanel';
import { EditPanel } from './shared/EditPanel';
import { RootState } from './utils/types';
import { historyIndexSelector } from './modules/historyIndex/selectors';
import { strokesSelector } from './modules/strokes/selectors';
import { currentStrokeSelector } from './modules/currentStroke/selectors';
import { useCanvas } from './CanvasContext';
import { FilePanel } from './shared/FilePanel';
import { endStroke } from './modules/sharedActions';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const App = () => {
    const dispatch = useDispatch();
    const canvasRef = useCanvas();
    const isDrawing = useSelector<RootState>((state) =>
        !!state.currentStroke.points.length
    );

    const historyIndex = useSelector(historyIndexSelector);
    const strokes = useSelector(strokesSelector);
    const currentStroke = useSelector(currentStrokeSelector);

    const getCanvasWithContext = (canvas = canvasRef.current) => {
        return {canvas, context: canvas?.getContext('2d')}
    }


    const startDrawing = ({nativeEvent}: React.MouseEvent<HTMLCanvasElement>) => {
        const {offsetX, offsetY} = nativeEvent;
        dispatch(beginStroke({ x: offsetX, y: offsetY }));
    }

    const draw = ({nativeEvent}: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) {
            return
        }
        const {offsetX, offsetY} = nativeEvent;
        dispatch(updateStroke({ x: offsetX, y: offsetY }));
    }

    const endDrawing = () => {
        if (isDrawing) {
            dispatch(endStroke({ stroke: currentStroke, historyIndex }));
        }
    }

    useEffect(() => {
        const { context } = getCanvasWithContext();
        if (!context) {
            return
        }
        requestAnimationFrame(() => {
            drawStroke(context, currentStroke.points, currentStroke.color);
        })
    }, [currentStroke]);

    useEffect(() => {
        const { canvas, context } = getCanvasWithContext();
        if (!canvas || !context) {
            return
        }
        requestAnimationFrame(() => {
            clearCanvas(canvas);
            strokes
                .slice(0, strokes.length - historyIndex)
                .forEach(stroke => {
                    drawStroke(context, stroke.points, stroke.color);
                });
        })

    }, [strokes, historyIndex])

    useEffect(() => {
        const { canvas, context } = getCanvasWithContext();
        if (!canvas || !context) {
            return
        }

        setCanvasSize(canvas, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.lineWidth = 5;
        context.strokeStyle = '#000000';

        clearCanvas(canvas);
    }, []);

    return (
        <div className='app-container'>
            <FilePanel/>
            <EditPanel />
            <ColorPanel />
            <div className='canvas-wrapper'>
                <canvas
                    onMouseDown={startDrawing}
                    onMouseUp={endDrawing}
                    onMouseOut={endDrawing}
                    onMouseMove={draw}
                    ref={canvasRef}
                />
            </div>
        </div>
    )
}

export default App;
