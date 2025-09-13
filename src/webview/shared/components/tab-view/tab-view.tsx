import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { ReactElement, useState } from "react";
import { TabViewContent, TabViewContentProps } from "./tab-view-content";
import { SxProps, Typography } from "@mui/material";
import { uuid } from "../../utils";

type TabViewProps = {
  numTabs: number;
  onTabChange?: (tabIndex: number) => void;
  children: ReactElement<TabViewContentProps>[];
  sx?: SxProps;
};

export default function TabView({ numTabs, children, onTabChange, sx }: TabViewProps) {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    onTabChange(newValue);
  };

  return (
    <Box sx={{ width: "100%", ...sx }}>
      <Tabs value={value} onChange={handleChange}>
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
      {children.map(
        (child, index) =>
          value === index && (
            <TabViewContent key={uuid()} label={child.props.label}>
              {child.props.children}
            </TabViewContent>
          )
      )}
    </Box>
  );
}
