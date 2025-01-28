import React from 'react';
import { Tabs, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import DraggableTabList from './DraggableTabList';
import './css/tabStyle.css';

const TabNavigator = ({ tabs, setTabs, selectedIndex, setSelectedIndex, closeTab }) => {
  return (
    <Tabs
      className="tab-style"
      selectedIndex={selectedIndex}
      onSelect={(index) => setSelectedIndex(index)}
    >
      <DraggableTabList
        tabs={tabs}
        setTabs={setTabs}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        closeTab={closeTab}
      />
      {tabs.map((tab) => (
        <TabPanel key={tab.id}>{tab.component}</TabPanel>
      ))}
    </Tabs>
  );
};

export default TabNavigator;
