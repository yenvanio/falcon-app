interface NumberValue {
    number: string;
    translatedValue: string;
    selected: boolean;
    hidden?: boolean;
}

export const initialNumbersValue = (
    heightValue = 54,
    numbersLength = 24,
    value: number | null = null
): NumberValue[] => {
    const initialValue24hourFormat: NumberValue[] = [
        {
            number: '00',
            translatedValue: (heightValue * 2).toString(),
            selected: false,
        },
        {
            number: '01',
            translatedValue: heightValue.toString(),
            selected: false,
        },
    ];

    const initialValue12hourFormat: NumberValue[] = [
        {
            number: '00',
            translatedValue: heightValue.toString(),
            selected: false,
            hidden: true,
        },
        {
            number: '01',
            translatedValue: heightValue.toString(),
            selected: false,
        },
    ];

    const arrayOfSelectedValue = numbersLength === 13 ? initialValue12hourFormat : initialValue24hourFormat;
    let count = 0;

    for (let index = 0; index < 3; index++) {
        for (let j = 0; j < numbersLength; j++) {
            if ((index === 0 && j < 2) || (numbersLength === 13 && j === 0)) {
                continue;
            }
            if (index === 1 && j === value) {
                if (j.toString().length === 1) {
                    arrayOfSelectedValue.push({
                        number: `0${j.toString()}`,
                        translatedValue: `-${count}`,
                        selected: true,
                    });
                } else {
                    arrayOfSelectedValue.push({
                        number: j.toString(),
                        translatedValue: `-${count}`,
                        selected: true,
                    });
                }
                count += heightValue;
                continue;
            }
            if (j.toString().length === 1) {
                arrayOfSelectedValue.push({
                    number: `0${j.toString()}`,
                    translatedValue: `-${count}`,
                    selected: false,
                });
            } else {
                arrayOfSelectedValue.push({
                    number: j.toString(),
                    translatedValue: `-${count}`,
                    selected: false,
                });
            }

            count += heightValue;
        }
    }

    return arrayOfSelectedValue;
};

interface SelectedValue {
    number: string;
    translatedValue: string;
    arrayNumber: number;
    selected?: boolean;
}

export const returnSelectedValue = (
    heightValue = 54,
    numbersLength = 24
): SelectedValue[] => {
    const arrayOfSelectedValue: SelectedValue[] = [
        {
            number: '00',
            translatedValue: (heightValue * 2).toString(),
            arrayNumber: 0,
        },
        {
            number: '01',
            translatedValue: heightValue.toString(),
            arrayNumber: 1,
        },
    ];
    let count = 0;

    for (let index = 0; index < 3; index++) {
        for (let j = 0; j < numbersLength; j++) {
            if ((index === 0 && j < 2) || (numbersLength === 13 && j === 0)) {
                continue;
            }
            if (j.toString().length === 1) {
                arrayOfSelectedValue.push({
                    number: `0${j.toString()}`,
                    translatedValue: `-${count}`,
                    arrayNumber: arrayOfSelectedValue.length,
                    selected: false,
                });
            } else {
                arrayOfSelectedValue.push({
                    number: j.toString(),
                    translatedValue: `-${count}`,
                    arrayNumber: arrayOfSelectedValue.length,
                    selected: false,
                });
            }

            count += heightValue;
        }
    }

    return arrayOfSelectedValue;
};
