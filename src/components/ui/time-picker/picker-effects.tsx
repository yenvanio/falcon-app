import React from 'react';

interface PickerEffectsProps {
    height: number;
}

const PickerEffects: React.FC<PickerEffectsProps> = ({ height }) => {
    return (
        <>
            <div className="react-ios-time-picker-top-shadow" style={{ height: `${height * 2}px` }} />
            <div
                className="react-ios-time-picker-bottom-shadow"
                style={{ height: `${height * 2}px` }}
            />
        </>
    );
};

export default PickerEffects;
