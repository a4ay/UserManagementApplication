import React from 'react';

import './Loading.css';

export default function Loading(){
    return (
        <div className='spin-container'>
            <svg className="spinner" 
            width="35px" 
            height="35px" 
            viewBox="0 0 66 66" 
            xmlns="http://www.w3.org/2000/svg">

            <circle className="path" 
                fill="none" 
                strokeWidth="6" 
                strokeLinecap="round" 
                cx="33" 
                cy="33" 
                r="30">
            </circle>
            </svg>
        </div>
    )
}