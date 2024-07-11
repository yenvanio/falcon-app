import React, {useState} from 'react';
import TimePickerSelection from '@/components/ui/time-picker/time-picker-selection';
import './time-picker.css';
import {Portal} from "@radix-ui/react-portal";

interface TimePickerProps {
    value?: string | null;
    cellHeight?: number;
    placeHolder?: string;
    pickerDefaultValue?: string;
    onChange?: (value: string) => void;
    onFocus?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
    disabled?: boolean;
    isOpen?: boolean;
    required?: boolean;
    cancelButtonText?: string;
    saveButtonText?: string;
    controllers?: boolean;
    separator?: boolean;
    id?: string | null;
    use12Hours?: boolean;
    onAmPmChange?: (value: string) => void;
    name?: string | null;
    onOpen?: () => void;
    popupClassName?: string | null;
    inputClassName?: string | null;
}

const TimePicker: React.FC<TimePickerProps> = ({
                                                   value: initialValue = null,
                                                   cellHeight = 28,
                                                   placeHolder = 'Select Time',
                                                   pickerDefaultValue = '10:00',
                                                   onChange = () => {
                                                   },
                                                   onFocus = () => {
                                                   },
                                                   onSave = () => {
                                                   },
                                                   onCancel = () => {
                                                   },
                                                   disabled = false,
                                                   isOpen: initialIsOpenValue = false,
                                                   required = false,
                                                   cancelButtonText = 'Cancel',
                                                   saveButtonText = 'Save',
                                                   controllers = true,
                                                   separator = true,
                                                   id = null,
                                                   use12Hours = false,
                                                   onAmPmChange = () => {
                                                   },
                                                   name = null,
                                                   onOpen = () => {
                                                   },
                                                   popupClassName = null,
                                                   inputClassName = null,
                                               }) => {
    const [isOpen, setIsOpen] = useState(initialIsOpenValue);
    const [height, setHeight] = useState(cellHeight);
    const [inputValue, setInputValue] = useState<string | null>(initialValue);

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const handleFocus = () => {
        onFocus();
        onOpen();
    };

    let finalValue = inputValue;

    if (initialValue === null && use12Hours) {
        finalValue = `${pickerDefaultValue} AM`;
    } else if (initialValue === null && !use12Hours) {
        finalValue = pickerDefaultValue;
    }

    const params = {
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
        initialValue: finalValue,
        pickerDefaultValue,
    };

    return (
        <>
            <div className="react-ios-time-picker-main" onClick={handleClick}>
                <input
                    id={id ?? undefined}
                    name={name ?? undefined}
                    className={`react-ios-time-picker-input ${inputClassName || ''}`}
                    value={inputValue === null ? '' : inputValue}
                    type="text"
                    placeholder={placeHolder}
                    readOnly
                    disabled={disabled}
                    required={required}
                    onFocus={handleFocus}
                />
            </div>
            {isOpen && !disabled && (
                <Portal>
                    <div className="react-ios-time-picker-popup">
                        <div
                            className={`react-ios-time-picker-popup-overlay ${popupClassName || ''}`}
                            onClick={() => setIsOpen(!isOpen)}
                        />
                        <TimePickerSelection {...params} />
                    </div>
                </Portal>
            )}
        </>
    );
}

export default TimePicker;
