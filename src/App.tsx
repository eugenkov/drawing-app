import React, {useEffect, useRef} from 'react';
import './App.css';
import {useSelector, useDispatch} from 'react-redux';
import {currentStrokeSelector} from './selectors';
import {beginStroke, updateStroke, endStroke} from './actions';
import {drawStroke} from './canvasUtils';
import {ColorPanel} from './ColorPanel';

const App = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const currentStroke = useSelector(currentStrokeSelector);
    const isDrawing = !!currentStroke.points.length;
    const dispatch = useDispatch();

    const getCanvasWithContext = (canvas = canvasRef.current) => {
        return {canvas, context: canvas?.getContext('2d')}
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
            dispatch(endStroke())
        }
    }

    return (
        <div className='app-container'>
            <ColorPanel />
            <canvas
                onMouseDown={startDrawing}
                onMouseUp={endDrawing}
                onMouseOut={endDrawing}
                onMouseMove={draw}
                ref={canvasRef}
            />
        </div>
    )
}

export default App;
