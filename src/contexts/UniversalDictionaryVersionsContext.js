import {
    useState,
    createContext,
    useEffect,
} from "react";
import {useGetDataDictionarySyncAlert} from "../store/alerts/queries";


const defaultValue = {
    activeAlert: {
        show: false,
        message: "",
        color: "success",
    },
    setActiveAlert: () => {},
};

const AlertDictionaryVersionsContext = createContext(defaultValue);

const AlertDictionaryVersionsProvider = ({ children }) => {
    const [activeAlert, setActiveAlert] = useState({
        show: false,
        message: "",
        color: "success",
    });
    const {data, isLoading} = useGetDataDictionarySyncAlert()

    useEffect(() => {
        if (data && !isLoading) {
            setActiveAlert({
                show: data.to_update,
                message: data.message || "You have updates available",
                color: "warning"
            })
        }
    }, [data, isLoading]);

    useEffect(() => {
        const timer = setTimeout(
            () => setActiveAlert((prev) => ({ ...prev, show: false })),
            2 * 60 * 60
        );
        return () => clearTimeout(timer);

    }, [activeAlert.show]);

    const alertValue = { activeAlert, setActiveAlert };

    return (
        <AlertDictionaryVersionsContext.Provider value={alertValue}>{children}</AlertDictionaryVersionsContext.Provider>
    );
};

export {AlertDictionaryVersionsProvider, AlertDictionaryVersionsContext}
