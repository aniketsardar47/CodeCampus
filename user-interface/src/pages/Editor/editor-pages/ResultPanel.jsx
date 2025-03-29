import { Tabs } from "@chakra-ui/react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from "react";

const ResultPanel = (props) => {
    const { output, status } = props; // Receive the status prop
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const tabValue = searchParams.get("tab");

    useEffect(() => {
        if (status && (status === "run" || status === "submit")) {
            navigate(`?tab=${status}`);
        }
        else if(tabValue && (tabValue === "run" || tabValue === "submit")){
            navigate(`?tab=${tabValue}`);
        }
        else {
            navigate(`?tab=run`); // Default to 'run' if no valid tab is provided
        }
    }, [status, tabValue, navigate]);

    return (
        <Tabs.Root value={status || tabValue || "run"} navigate>
            <Tabs.List>
                <Tabs.Trigger value="run">Run</Tabs.Trigger>
                <Tabs.Trigger value="submit">Submit</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="run">{output}</Tabs.Content>
            <Tabs.Content value="submit">{output}</Tabs.Content>
        </Tabs.Root>
    );
};

export default ResultPanel;