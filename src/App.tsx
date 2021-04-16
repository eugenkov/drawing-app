import React, {useEffect, useRef} from 'react';
import './App.css';
import {useSelector, useDispatch} from 'react-redux';
import {beginStroke, updateStroke, endStroke} from './modules/currentStroke/actions';
import {clearCanvas, drawStroke, setCanvasSize } from './canvasUtils';
import {ColorPanel} from './ColorPanel';
import {EditPanel} from './EditPanel';
import {RootState} from './types';
import {historyIndexSelector} from './modules/historyIndex/selectors';
import {strokesSelector} from './modules/strokes/selectors';
import {currentStrokeSelector} from './modules/currentStroke/selectors';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const App = () => {
    const dispatch = useDispatch();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useSelector<RootState>((state) =>
        !!state.currentStroke.points.length
    );

    const historyIndex = useSelector<RootState, RootState['historyIndex']>(historyIndexSelector)
    const strokes = useSelector<RootState, RootState['strokes']>(strokesSelector)
    const currentStroke = useSelector<RootState, RootState['currentStroke']>(currentStrokeSelector)

    const getCanvasWithContext = (canvas = canvasRef.current) => {
        return {canvas, context: canvas?.getContext('2d')}
    }


    const startDrawing = ({nativeEvent}: React.MouseEvent<HTMLCanvasElement>) => {
        const {offsetX, offsetY} = nativeEvent;
        dispatch(beginStroke(offsetX, offsetY))
    }

    const draw = ({nativeEvent}: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) {
            return
        }
        const {offsetX, offsetY} = nativeEvent;
        dispatch(updateStroke(offsetX, offsetY));
    }

    const endDrawing = () => {
        if (isDrawing) {
            dispatch(endStroke(historyIndex, currentStroke))
        }
    }

    useEffect(() => {
        const { context } = getCanvasWithContext()
        if (!context) {
            return
        }
        requestAnimationFrame(() => {
            drawStroke(context, currentStroke.points, currentStroke.color);
        })
    }, [currentStroke]);

    useEffect(() => {
        const { canvas, context } = getCanvasWithContext()
        if (!canvas || !context) {
            return
        }
        requestAnimationFrame(() => {
            clearCanvas(canvas);
            strokes.slice(0, strokes.length - historyIndex).forEach((stroke) => {
                drawStroke(context, stroke.points, stroke.color);
            })
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
    }, [])

    return (
        <div className='app-container'>
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
