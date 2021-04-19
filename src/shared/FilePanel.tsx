import React from 'react';
import { useCanvas } from '../CanvasContext';
import { saveAs } from 'file-saver';
import { getCanvasImage } from '../utils/canvasUtils';

export const FilePanel = () => {
    const canvasRef = useCanvas();

    const exportToFile = async () => {
        const file = await getCanvasImage(canvasRef.current);
        if (!file) {
            return;
        }
        saveAs(file, 'drawing.png');
    }

    return (
        <div className='file-panel'>
            <button
                className='save-button'
                onClick={exportToFile}
            >Save as...</button>
        </div>
    )
}
