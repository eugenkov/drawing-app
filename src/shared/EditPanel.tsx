import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {undo, redo} from '../modules/historyIndex/slice';
import {strokesLengthSelector} from '../modules/strokes/selectors';

export const EditPanel = () => {
    const dispatch = useDispatch();
    const undoLimit = useSelector(strokesLengthSelector);
    return (
        <div className='edit-panel'>
            <button
                className='button undo'
                onClick={() => dispatch(undo(undoLimit))}
            >
                Undo
            </button>
            <button
                className='button redo'
                onClick={() => dispatch(redo())}
            >
                Redo
            </button>
        </div>
    )
}
