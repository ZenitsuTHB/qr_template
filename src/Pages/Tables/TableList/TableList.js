// TablesList.js
import React, { useState, useEffect } from 'react';
import './css/tableList.css';
import useApi from '../../../Hooks/useApi';
import useNotification from '../../../Components/Notification';
import TableRow from './TableRow';
import TableGroupRow from './TableGroupRow';

const TablesList = () => {
  const api = useApi();
  const { triggerNotification, NotificationComponent } = useNotification();

  const [tables, setTables] = useState([]);
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [openTooltipTableId, setOpenTooltipTableId] = useState(null);
  const [openTooltipLineId, setOpenTooltipLineId] = useState(null);

  useEffect(() => {
    const fetchTablesAndLines = async () => {
      try {
        console.log("TableList GET");
        const data = await api.get(`${window.baseDomain}api/tables`, { noCache: true });
        if (Array.isArray(data)) {
          const elementsData = data.filter((item) => item.type !== 'line');
          const linesData = data.filter((item) => item.type === 'line');
          setTables(elementsData);
          setLines(linesData);
        } else if (data && Array.isArray(data.tables)) {
          const elementsData = data.tables.filter((item) => item.type !== 'line');
          const linesData = data.tables.filter((item) => item.type === 'line');
          setTables(elementsData);
          setLines(linesData);
        } else {
          setTables([]);
          setLines([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tables:', error);
        setError(true);
        setLoading(false);
      }
    };

    fetchTablesAndLines();
  }, [api]);

  // Handle changes to table fields
  const handleTableInputChange = (id, field, value) => {
    setTables((prevTables) =>
      prevTables.map((table) => (table.id === id ? { ...table, [field]: value } : table))
    );
  };

  // Handle changes to line fields
  const handleLineInputChange = (id, field, value) => {
    setLines((prevLines) =>
      prevLines.map((line) => (line.id === id ? { ...line, [field]: value } : line))
    );
  };

  // Handle deletion of a table and related tafelgroepen
  const handleDeleteTable = async (table) => {
    try {
      if (table._id) {
        // Delete the table
        await api.delete(`${window.baseDomain}api/tables/${table._id}`);
        setTables((prevTables) => prevTables.filter((t) => t.id !== table.id));
        triggerNotification('Tafel succesvol verwijderd', 'success');

        // Find and delete related tafelgroepen
        const relatedLines = lines.filter(
          (line) => line.from === table.id || line.to === table.id
        );

        for (const line of relatedLines) {
          if (line._id) {
            await api.delete(`${window.baseDomain}api/tables/${line._id}`);
            setLines((prevLines) => prevLines.filter((l) => l.id !== line.id));
            triggerNotification('Gerelateerde tafelgroep succesvol verwijderd', 'success');
          }
        }
      }
    } catch (error) {
      console.error('Error deleting table:', error);
      triggerNotification('Fout bij het verwijderen van de tafel', 'error');
    }
  };

  // Handle deletion of a tafelgroep (line)
  const handleDeleteLine = async (line) => {
    try {
      if (line._id) {
        // Existing line, use DELETE
        await api.delete(`${window.baseDomain}api/tables/${line._id}`);
        setLines((prevLines) => prevLines.filter((l) => l.id !== line.id));
        triggerNotification('Tafelgroep succesvol verwijderd', 'success');
      }
    } catch (error) {
      console.error('Error deleting tafelgroep:', error);
      triggerNotification('Fout bij het verwijderen van de tafelgroep', 'error');
    }
  };

  // Save changes to a single table
  const handleSaveTable = async (table) => {
    try {
      if (table._id) {
        // Existing table, use PUT
        await api.put(`${window.baseDomain}api/tables/${table._id}`, table);
        triggerNotification('Tafel succesvol opgeslagen', 'success');
      } else {
        // New table, use POST
        await api.post(`${window.baseDomain}api/tables`, table);
        triggerNotification('Tafel succesvol aangemaakt', 'success');
      }
    } catch (error) {
      console.error('Error saving table:', error);
      triggerNotification('Fout bij het opslaan van de tafel', 'error');
    }
  };

  // Save changes to a single tafelgroep (line)
  const handleSaveLine = async (line) => {
    try {
      if (line._id) {
        // Existing line, use PUT
        await api.put(`${window.baseDomain}api/tables/${line._id}`, line);
        triggerNotification('Tafelgroep succesvol opgeslagen', 'success');
      } else {
        // New line, use POST
        await api.post(`${window.baseDomain}api/tables`, line);
        triggerNotification('Tafelgroep succesvol aangemaakt', 'success');
      }
    } catch (error) {
      console.error('Error saving tafelgroep:', error);
      triggerNotification('Fout bij het opslaan van de tafelgroep', 'error');
    }
  };

  // Toggle tooltip for tables
  const toggleTooltipTable = (tableId) => {
    setOpenTooltipTableId((prevId) => (prevId === tableId ? null : tableId));
  };

  // Toggle tooltip for lines
  const toggleTooltipLine = (lineId) => {
    setOpenTooltipLineId((prevId) => (prevId === lineId ? null : lineId));
  };

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest('.tooltip-container') &&
        !event.target.closest('.ellipsis-icon')
      ) {
        setOpenTooltipTableId(null);
        setOpenTooltipLineId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get table options for selection boxes
  const tableOptions = tables.map((table) => ({
    value: table.id,
    label: table.name || `Tafel ${table.tableNumber}`,
  }));

  if (loading) {
    return <div>Loading tables...</div>;
  }

  if (error) {
    return <div>Error loading tables.</div>;
  }

  return (
    <div className="tables-list-page">
      <h2 className="tables-list-title">Tafeloverzicht</h2>
      <table className="tables-list">
        <thead>
          <tr>
            <th>Tafelnummer</th>
            <th className="hide-on-mobile">Naam</th>
            <th >Min. Capaciteit</th>
            <th >Max. Capaciteit</th>
            <th className="hide-on-mobile">Vorm</th>
            <th className="hide-on-mobile">Prioriteit</th>
            <th className="actions-column">Acties</th>
            <th className="ellipsis-column"></th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table) => (
            <TableRow
              key={table.id}
              table={table}
              openTooltipTableId={openTooltipTableId}
              toggleTooltipTable={toggleTooltipTable}
              handleTableInputChange={handleTableInputChange}
              handleSaveTable={handleSaveTable}
              handleDeleteTable={handleDeleteTable}
            />
          ))}
        </tbody>
      </table>

      <h2 className="tables-list-title">Tafelgroepen</h2>
      <table className="table-groups-list">
        <thead>
          <tr>
            <th>Tafel 1</th>
            <th>Tafel 2</th>
            <th className="actions-column">Acties</th>
            <th className="ellipsis-column"></th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <TableGroupRow
              key={line.id}
              line={line}
              tableOptions={tableOptions}
              openTooltipLineId={openTooltipLineId}
              toggleTooltipLine={toggleTooltipLine}
              handleLineInputChange={handleLineInputChange}
              handleSaveLine={handleSaveLine}
              handleDeleteLine={handleDeleteLine}
            />
          ))}
        </tbody>
      </table>

      {/* Include the NotificationComponent to display notifications */}
      <NotificationComponent />
    </div>
  );
};

export default TablesList;
