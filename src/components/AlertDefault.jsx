
import { Alert } from "@material-tailwind/react";

export function AlertDefault({ message }) {
    return (
        <Alert color="red" className="mt-2 text-sm">
            {message}
        </Alert>
    );
}
