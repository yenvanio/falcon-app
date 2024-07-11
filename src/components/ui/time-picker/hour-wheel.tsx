import React, { useEffect, useState, useRef } from 'react';
import { initialNumbersValue, returnSelectedValue } from './helpers';

interface Hour {
    number: string;
    translatedValue: string;
    selected: boolean;
    hidden?: boolean;
}

interface HourWheelProps {
    height: number;
    value: string;
    setValue: (value: (prev: any) => string) => void;
    use12Hours: boolean;
}

const HourWheel: React.FC<HourWheelProps> = ({ height, value, setValue, use12Hours }) => {
    const hourLength = use12Hours ? 13 : 24;
    const [hours, setHours] = useState<Hour[]>(
        initialNumbersValue(height, hourLength, parseInt(value.slice(0, 2)))
    );
    const mainListRef = useRef<HTMLDivElement | null>(null);
    const [cursorPosition, setCursorPosition] = useState<number | null>(null);
    const [firstCursorPosition, setFirstCursorPosition] = useState<number | null>(null);
    const [currentTranslatedValue, setCurrentTranslatedValue] = useState<number>(
        parseInt(
            initialNumbersValue(height, hourLength, parseInt(value.slice(0, 2))).filter(
                (item) => item.number === value.slice(0, 2) && item.selected
            )[0].translatedValue
        )
    );
    const [startCapture, setStartCapture] = useState(false);
    const [showFinalTranslate, setShowFinalTranslate] = useState(false);
    const [dragStartTime, setDragStartTime] = useState<number | null>(null);
    const [dragEndTime, setDragEndTime] = useState<number | null>(null);
    const [dragDuration, setDragDuration] = useState<number | null>(null);
    const [dragType, setDragType] = useState<string | null>(null);
    const [dragDirection, setDragDirection] = useState<string | null>(null);
    const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setShowFinalTranslate(false);
        setFirstCursorPosition(e.clientY);
        setStartCapture(true);
        setDragStartTime(performance.now());
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setShowFinalTranslate(false);
        setFirstCursorPosition(e.targetTouches[0].clientY);
        setStartCapture(true);
        setDragStartTime(performance.now());
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
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

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
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

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (startCapture) {
            setCursorPosition(e.clientY - (firstCursorPosition ?? 0));
        } else {
            setCursorPosition(0);
        }
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (startCapture) {
            setCursorPosition(e.targetTouches[0].clientY - (firstCursorPosition ?? 0));
        } else {
            setCursorPosition(0);
        }
    };

    useEffect(() => {
        if (startCapture && mainListRef.current) {
            mainListRef.current.style.transform = `translateY(${
                (currentTranslatedValue ?? 0) + (cursorPosition ?? 0)
            }px)`;
        }
    }, [cursorPosition]);

    useEffect(() => {
        if (showFinalTranslate && mainListRef.current) {
            setDragDuration((dragEndTime ?? 0) - (dragStartTime ?? 0));
            if ((dragEndTime ?? 0) - (dragStartTime ?? 0) <= 100 && cursorPosition !== 0) {
                let currentValue: number = 0;
                if (dragDirection === 'down') {
                    currentValue =
                        (currentTranslatedValue ?? 0) -
                        (120 / ((dragEndTime ?? 0) - (dragStartTime ?? 0))) * 100;
                } else if (dragDirection === 'up') {
                    currentValue =
                        (currentTranslatedValue ?? 0) +
                        (120 / ((dragEndTime ?? 0) - (dragStartTime ?? 0))) * 100;
                }
                let finalValue = Math.round(currentValue / height) * height;
                if (use12Hours) {
                    if (finalValue < height * -34) finalValue = height * -34;
                    if (finalValue > height) finalValue = height;
                } else {
                    if (finalValue < height * -69) finalValue = height * -69;
                    if (finalValue > height * 2) finalValue = height * 2;
                }
                mainListRef.current.style.transform = `translateY(${finalValue}px)`;
                setCurrentTranslatedValue(finalValue);
            }
            if ((dragEndTime ?? 0) - (dragStartTime ?? 0) > 100 && cursorPosition !== 0) {
                let finalValue = Math.round((currentTranslatedValue ?? 0) / height) * height;
                if (use12Hours) {
                    if (finalValue < height * -34) finalValue = height * -34;
                    if (finalValue > height) finalValue = height;
                } else {
                    if (finalValue < height * -69) finalValue = height * -69;
                    if (finalValue > height * 2) finalValue = height * 2;
                }
                mainListRef.current.style.transform = `translateY(${finalValue}px)`;
                setCurrentTranslatedValue(finalValue);
            }
            setCursorPosition(0);
        }
    }, [showFinalTranslate]);

    const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
        returnSelectedValue(height, hourLength).forEach((item) => {
            if (parseInt(item.translatedValue) === currentTranslatedValue) {
                setSelectedNumber(item.arrayNumber);
                setValue((prev) => `${item.number}:${prev.slice(3, 6)}`);
                setHours(() => {
                    const newValue = initialNumbersValue(height, hourLength).map((hour) => {
                        if (
                            hour.number === item.number &&
                            hour.translatedValue === currentTranslatedValue.toString()
                        ) {
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
    };

    const handleClickToSelect = (e: React.MouseEvent<HTMLDivElement>) => {
        if (cursorPosition === 0) {
            setCurrentTranslatedValue(parseInt(e.currentTarget.dataset.translatedValue ?? '0'));
        }
    };

    const handleWheelScroll = (e: React.WheelEvent<HTMLDivElement>) => {
        if (use12Hours) {
            if (e.deltaY > 0) {
                if (currentTranslatedValue < height) {
                    setCurrentTranslatedValue((prev) => (prev ?? 0) + height);
                }
            } else if (currentTranslatedValue > height * -34) {
                setCurrentTranslatedValue((prev) => (prev ?? 0) - height);
            }
        } else if (e.deltaY > 0) {
            if (currentTranslatedValue < height * 2) {
                setCurrentTranslatedValue((prev) => (prev ?? 0) + height);
            }
        } else if (currentTranslatedValue > height * -69) {
            setCurrentTranslatedValue((prev) => (prev ?? 0) - height);
        }
    };

    const isFastCondition = showFinalTranslate && dragType === 'fast';
    const isSlowCondition = showFinalTranslate && dragType === 'slow';

    return (
        <div
            className={`react-ios-time-picker-hour ${
                use12Hours && 'react-ios-time-picker-hour-12hour-format'
            }`}
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
            {/* <PickerEffects height={height} /> */}
            <div
                ref={mainListRef}
                className={`${isFastCondition && 'react-ios-time-picker-fast'} ${
                    isSlowCondition && 'react-ios-time-picker-slow'
                }`}
                onTransitionEnd={handleTransitionEnd}
                style={{ transform: `translateY(${currentTranslatedValue}px)` }}
            >
                {hours.map((hourObj, index) => (
                    <div
                        key={index}
                        className="react-ios-time-picker-cell-hour"
                        style={{ height: `${height}px` }}
                    >
                        <div
                            className={`react-ios-time-picker-cell-inner-hour${
                                hourObj.selected ? ' react-ios-time-picker-cell-inner-selected' : ''
                            }${hourObj?.hidden ? ' react-ios-time-picker-cell-inner-hidden' : ''}`}
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

export default HourWheel;
