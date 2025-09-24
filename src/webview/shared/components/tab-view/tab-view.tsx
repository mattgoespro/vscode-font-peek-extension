import { SxProps, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { ReactElement, useMemo, useState } from "react";
import { uuid } from "../../utils";
import { TabViewContentProps } from "./tab-view-content";

type TabViewProps = {
  numTabs: number;
  onTabChange?: (tabIndex: number) => void;
  children: ReactElement<TabViewContentProps>[];
  sx?: SxProps;
};

export default function TabView({ numTabs, children, onTabChange, sx }: TabViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentIndex(newValue);
    onTabChange(newValue);
  };

  const tabContent = useMemo(() => {
    return children[currentIndex]?.props.children;
  }, [children, currentIndex]);

  return (
    <Box sx={{ width: "100%", ...sx }}>
      <Tabs value={currentIndex} onChange={handleChange} sx={{ marginBottom: 1 }}>
        {Array.from({ length: numTabs }).map((_, index) => (
          <Tab
            key={uuid()}
            wrapped
            label={
              <Typography variant="button" fontWeight="bold" color="primary">
                {children[index].props.label}
              </Typography>
            }
          />
        ))}
      </Tabs>
      {tabContent}
    </Box>
  );
}
