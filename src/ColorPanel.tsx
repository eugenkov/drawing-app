import React from 'react';
import {useDispatch} from 'react-redux';
import {setStrokeColor} from './modules/currentStroke/actions';

const COLORS = [
    '#000000',
    '#7f7f7f',
    '#880015',
    '#ed1c24',
    '#ff7f27',
    '#fff200',
    '#22b14c',
    '#00a2e8',
    '#3f48cc',
    '#a349a4',
    '#ffffff',
    '#c3c3c3',
    '#b97a57',
    '#ffaec9',
    '#ffc90e',
    '#efe4b0',
    '#b5e61d',
    '#99d9ea',
    '#7092be',
    '#c8bfe7',
]

export const ColorPanel = () => {
    const dispatch = useDispatch();

    const onColorChange = (color: string) => {
        dispatch(setStrokeColor(color))
    }

    return (
        <div className='color-panel'>
            {
                COLORS.map(( color: string ) => (
                   <div
                       key={color}
                       onClick={() => { onColorChange(color) }}
                       className='color'
                       style={{ backgroundColor: color }}
                   />
                ))
            }
        </div>
    )
}

