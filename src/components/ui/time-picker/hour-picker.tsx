import React, { useEffect, useState, useRef } from 'react';

interface HourFormatProps {
    height: number;
    value: string;
    setValue: (value: string) => void;
    onAmPmChange?: (value: string) => void;
    setHourFormat: (hourFormat: { mount: boolean; hourFormat: string }) => void;
    hourFormat: { hourFormat: string };
}

interface Hour {
    number: string;
    translatedValue: string;
    selected: boolean;
}

const HourFormat: React.FC<HourFormatProps> = ({ height, value, setValue, onAmPmChange, setHourFormat, hourFormat }) => {
    const Hours: Hour[] = [
        {
            number: 'AM',
            translatedValue: (height * 2).toString(),
            selected: false,
        },
        {
            number: 'PM',
            translatedValue: height.toString(),
            selected: false,
        },
    ];

    const [hours, setHours] = useState<Hour[]>([
        {
            number: 'AM',
            translatedValue: (height * 2).toString(),
            selected: hourFormat.hourFormat === 'AM',
        },
        {
            number: 'PM',
            translatedValue: height.toString(),
            selected: hourFormat.hourFormat === 'PM',
        },
    ]);

    const mainListRef = useRef<HTMLDivElement | null>(null);
    const [cursorPosition, setCursorPosition] = useState<number | null>(null);
    const [firstCursorPosition, setFirstCursorPosition] = useState<number | null>(null);
    const [currentTranslatedValue, setCurrentTranslatedValue] = useState<number>(
        parseInt(hours.filter((item) => item.selected)[0].translatedValue)
    );
    const [startCapture, setStartCapture] = useState(false);
    const [showFinalTranslate, setShowFinalTranslate] = useState(false);
    const [dragStartTime, setDragStartTime] = useState<number | null>(null);
    const [dragEndTime, setDragEndTime] = useState<number | null>(null);
    const [dragDuration, setDragDuration] = useState<number | null>(null);
    const [dragType, setDragType] = useState<string | null>(null);
    const [dragDirection, setDragDirection] = useState<string | null>(null);
    const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        setShowFinalTranslate(false);
        setFirstCursorPosition(e.clientY);
        setStartCapture(true);
        setDragStartTime(performance.now());
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setShowFinalTranslate(false);
        setFirstCursorPosition(e.targetTouches[0].clientY);
        setStartCapture(true);
        setDragStartTime(performance.now());
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        setStartCapture(false);
        setCurrentTranslatedValue((prev) => (prev ?? 0) + (cursorPosition ?? 0));
        setShowFinalTranslate(true);
        setDragEndTime(performance.now());
        if (performance.now() - (dragStartTime ?? 0) <= 100) {
            setDragType('fast');
        } else {
            setDragType('slow');
        }
        if ((cursorPosition ?? 0) < 0) {
            setDragDirection('down');
        } else {
            setDragDirection('up');
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        setStartCapture(false);
        setCurrentTranslatedValue((prev) => (prev ?? 0) + (cursorPosition ?? 0));
        setShowFinalTranslate(true);
        setDragEndTime(performance.now());
        if (performance.now() - (dragStartTime ?? 0) <= 100) {
            setDragType('fast');
        } else {
            setDragType('slow');
        }
        if ((cursorPosition ?? 0) < 0) {
            setDragDirection('down');
        } else {
            setDragDirection('up');
        }
    };

    const handleMouseLeave = (e: React.MouseEvent) => {
        setStartCapture(false);
        setCurrentTranslatedValue((prev) => (prev ?? 0) + (cursorPosition ?? 0));
        setShowFinalTranslate(true);
        setDragEndTime(performance.now());

        if ((cursorPosition ?? 0) < 0) {
            setDragDirection('down');
        } else {
            setDragDirection('up');
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (startCapture) {
            setCursorPosition(e.clientY - (firstCursorPosition ?? 0));
        } else {
            setCursorPosition(0);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (startCapture) {
            setCursorPosition(e.targetTouches[0].clientY - (firstCursorPosition ?? 0));
        } else {
            setCursorPosition(0);
        }
    };

    useEffect(() => {
        if (startCapture && mainListRef.current) {
            mainListRef.current.style.transform = `translateY(${(currentTranslatedValue ?? 0) + (cursorPosition ?? 0)}px)`;
        }
    }, [cursorPosition]);

    useEffect(() => {
        if (showFinalTranslate && mainListRef.current) {
            setDragDuration((dragEndTime ?? 0) - (dragStartTime ?? 0));

            let finalValue = Math.round((currentTranslatedValue ?? 0) / height) * height;
            if (finalValue < height) finalValue = height;
            if (finalValue > height * 2) finalValue = height * 2;
            mainListRef.current.style.transform = `translateY(${finalValue}px)`;
            setCurrentTranslatedValue(finalValue);
            setCursorPosition(0);
        }
    }, [showFinalTranslate]);

    const handleTransitionEnd = (e: React.TransitionEvent) => {
        if (e.propertyName === 'transform') {
            const selectedValueArray = [
                {
                    number: 'AM',
                    translatedValue: (height * 2).toString(),
                    arrayNumber: 0,
                },
                {
                    number: 'PM',
                    translatedValue: height.toString(),
                    arrayNumber: 1,
                },
            ];
            selectedValueArray.forEach((item) => {
                if (parseInt(item.translatedValue) === currentTranslatedValue) {
                    setSelectedNumber(item.arrayNumber);
                    setHourFormat({ mount: true, hourFormat: item.number });
                    setHours(() => {
                        const newValue = Hours.map((hour) => {
                            if (hour.number === item.number && hour.translatedValue === currentTranslatedValue?.toString()) {
                                return {
                                    ...hour,
                                    selected: true,
                                };
                            }
                            return hour;
                        });
                        return newValue;
                    });
                }
            });
        }
    };

    const handleClickToSelect = (e: React.MouseEvent<HTMLDivElement>) => {
        if (cursorPosition === 0) {
            setCurrentTranslatedValue(parseInt(e.currentTarget.dataset.translatedValue ?? '0'));
        }
    };

    const handleWheelScroll = (e: React.WheelEvent) => {
        if (e.deltaY > 0) {
            if (currentTranslatedValue <= height) {
                setCurrentTranslatedValue((prev) => (prev ?? 0) + height);
            }
        } else if (currentTranslatedValue >= height * 2) {
            setCurrentTranslatedValue((prev) => (prev ?? 0) - height);
        }
    };

    return (
        <div
            className="react-ios-time-picker-hour-format"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ height: height * 5 }}
            onWheel={handleWheelScroll}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div
                ref={mainListRef}
                className={`${showFinalTranslate && 'react-ios-time-picker-hour-format-transition'}`}
                onTransitionEnd={handleTransitionEnd}
                style={{ transform: `translateY(${currentTranslatedValue}px)` }}
            >
                {hours.map((hourObj, index) => (
                    <div key={index} className="react-ios-time-picker-cell-hour" style={{ height: `${height}px` }}>
                        <div
                            className={`react-ios-time-picker-cell-inner-hour-format${
                                hourObj.selected ? ' react-ios-time-picker-cell-inner-hour-format-selected' : ''
                            }`}
                            onClick={handleClickToSelect}
                            data-translated-value={hourObj.translatedValue}
                        >
                            {hourObj.number}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HourFormat;
