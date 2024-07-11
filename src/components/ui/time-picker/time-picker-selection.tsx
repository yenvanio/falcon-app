import React, { useEffect, useState } from 'react';
import HourFormat from '@/components/ui/time-picker/hour-picker';
import HourWheel from '@/components/ui/time-picker/hour-wheel';
import MinuteWheel from '@/components/ui/time-picker/minute-wheel';

interface TimePickerSelectionProps {
    pickerDefaultValue: string;
    initialValue: string | null;
    onChange: (value: string) => void;
    height: number;
    onSave: (value: string) => void;
    onCancel: () => void;
    cancelButtonText: string;
    saveButtonText: string;
    controllers: boolean;
    setInputValue: (value: string) => void;
    setIsOpen: (isOpen: boolean) => void;
    separator: boolean;
    use12Hours: boolean;
    onAmPmChange: (value: string) => void;
}

const TimePickerSelection: React.FC<TimePickerSelectionProps> = ({
                                                                     pickerDefaultValue,
                                                                     initialValue,
                                                                     onChange,
                                                                     height,
                                                                     onSave,
                                                                     onCancel,
                                                                     cancelButtonText,
                                                                     saveButtonText,
                                                                     controllers,
                                                                     setInputValue,
                                                                     setIsOpen,
                                                                     separator,
                                                                     use12Hours,
                                                                     onAmPmChange,
                                                                 }) => {
    const initialTimeValue = use12Hours ? initialValue?.slice(0, 5) : initialValue;
    const [value, setValue] = useState<string>(
        initialValue ?? pickerDefaultValue
    );
    const [hourFormat, setHourFormat] = useState<{ mount: boolean; hourFormat: string }>({
        mount: false,
        hourFormat: initialValue?.slice(6, 8) ?? '',
    });

    useEffect(() => {
        if (!controllers) {
            const finalSelectedValue = use12Hours ? `${value} ${hourFormat.hourFormat}` : value;
            setInputValue(finalSelectedValue);
            onChange(finalSelectedValue);
        }
    }, [value]);

    useEffect(() => {
        if (hourFormat.mount) {
            onAmPmChange(hourFormat.hourFormat);
        }
    }, [hourFormat]);

    const params = {
        height,
        value,
        setValue,
        controllers,
        use12Hours,
        onAmPmChange,
        setHourFormat,
        hourFormat,
    };

    const handleSave = () => {
        const finalSelectedValue = use12Hours ? `${value} ${hourFormat.hourFormat}` : value;
        setInputValue(finalSelectedValue);
        onChange(finalSelectedValue);
        onSave(finalSelectedValue);
        setIsOpen(false);
    };

    const handleCancel = () => {
        onCancel();
        setIsOpen(false);
    };

    return (
        <div className="react-ios-time-picker  react-ios-time-picker-transition">
            {controllers && (
                <div className="react-ios-time-picker-btn-container">
                    <button
                        className="react-ios-time-picker-btn react-ios-time-picker-btn-cancel"
                        onClick={handleCancel}
                    >
                        {cancelButtonText}
                    </button>
                    <button className="react-ios-time-picker-btn" onClick={handleSave}>
                        {saveButtonText}
                    </button>
                </div>
            )}
            <div
                className="react-ios-time-picker-container"
                style={{ height: `${height * 5 + 40}px` }}
            >
                <div
                    className="react-ios-time-picker-selected-overlay"
                    style={{
                        top: `${height * 2 + 20}px`,
                        height: `${height}px`,
                    }}
                />
                <HourWheel {...params} />
                {separator && <div className="react-ios-time-picker-colon">:</div>}
                <MinuteWheel {...params} />
                {use12Hours && <HourFormat {...params} />}
            </div>
        </div>
    );
}

export default TimePickerSelection;
