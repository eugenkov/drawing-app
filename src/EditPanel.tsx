import React from 'react';
import {useDispatch} from 'react-redux';
import {undo, redo} from './actions';

export const EditPanel = () => {
    const dispatch = useDispatch()
    return (
        <div className='edit-panel'>
            <button
                className='button undo'
                onClick={() => dispatch(undo())}
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