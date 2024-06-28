//  @argument ErrorType : if you need to assert your error type, just pass it as a generics via asserting with the as keyword
import {ZodError} from "zod";

const handleOneLevelZodError = ({ issues }: ZodError<unknown>) => {
    const formData: Record<string, string> = {};

// - line of code should be true if the schema is not an object
// - This line is completely optional
    if (issues.length === 1 && issues[0].path.length < 1)
        return issues[0].message;

    issues.forEach(({ path, message }) => {
        formData[path.join('-')] = message;
    });

    return formData;
};

export default handleOneLevelZodError