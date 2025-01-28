// TableRow.js
import React from 'react';
import { FaEllipsisV } from 'react-icons/fa';

const TableRow = ({
  table,
  openTooltipTableId,
  toggleTooltipTable,
  handleTableInputChange,
  handleSaveTable,
  handleDeleteTable,
}) => {
  return (
    <tr>
      <td>
        <input
          type="text"
          value={table.tableNumber || ''}
          onChange={(e) =>
            handleTableInputChange(table.id, 'tableNumber', e.target.value)
          }
        />
      </td>
      <td>
        <input
          type="text"
          value={table.name || ''}
          onChange={(e) => handleTableInputChange(table.id, 'name', e.target.value)}
        />
      </td>
      <td className="hide-on-mobile">
        <input
          type="number"
          value={table.minCapacity || ''}
          onChange={(e) =>
            handleTableInputChange(table.id, 'minCapacity', parseInt(e.target.value, 10))
          }
        />
      </td>
      <td className="hide-on-mobile">
        <input
          type="number"
          value={table.maxCapacity || ''}
          onChange={(e) =>
            handleTableInputChange(table.id, 'maxCapacity', parseInt(e.target.value, 10))
          }
        />
      </td>
      <td className="hide-on-mobile">
        <select
          value={table.shape || ''}
          onChange={(e) => handleTableInputChange(table.id, 'shape', e.target.value)}
        >
          <option value="">Selecteer Vorm</option>
          <option value="rond">Rond</option>
          <option value="vierkant">Vierkant</option>
          <option value="metStoelen">Met Stoelen</option>
        </select>
      </td>
      <td className="hide-on-mobile">
        <select
          value={table.priority || ''}
          onChange={(e) =>
            handleTableInputChange(table.id, 'priority', e.target.value)
          }
        >
          <option value="">Selecteer Prioriteit</option>
          <option value="metVoorangInvullen">Met Voorrang Invullen</option>
          <option value="snellerInvullen">Sneller Invullen</option>
          <option value="tragerInvullen">Trager Invullen</option>
          <option value="alsLaatsteIndelen">Als Laatste Indelen</option>
        </select>
      </td>
      <td className="actions-column">
        <button
          className="standard-button blue"
          onClick={() => handleSaveTable(table)}
        >
          Opslaan
        </button>
      </td>
      <td className="ellipsis-column">
        <div className="ellipsis-container">
          <FaEllipsisV
            className="ellipsis-icon"
            onClick={() => toggleTooltipTable(table.id)}
          />
          {openTooltipTableId === table.id && (
            <div className="tooltip-container">
              <div
                className="tooltip-item delete-item"
                onClick={() => handleDeleteTable(table)}
              >
                Verwijderen
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default TableRow;
