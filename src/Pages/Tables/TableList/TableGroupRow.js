// TableGroupRow.js
import React from 'react';
import { FaEllipsisV } from 'react-icons/fa';

const TableGroupRow = ({
  line,
  tableOptions,
  openTooltipLineId,
  toggleTooltipLine,
  handleLineInputChange,
  handleSaveLine,
  handleDeleteLine,
}) => {
  return (
    <tr>
      <td>
        <select
          value={line.from || ''}
          onChange={(e) =>
            handleLineInputChange(line.id, 'from', e.target.value)
          }
        >
          <option value="">Selecteer Tafel</option>
          {tableOptions.map((table) => (
            <option key={table.value} value={table.value}>
              {table.label}
            </option>
          ))}
        </select>
      </td>
      <td>
        <select
          value={line.to || ''}
          onChange={(e) =>
            handleLineInputChange(line.id, 'to', e.target.value)
          }
        >
          <option value="">Selecteer Tafel</option>
          {tableOptions.map((table) => (
            <option key={table.value} value={table.value}>
              {table.label}
            </option>
          ))}
        </select>
      </td>
      <td className="actions-column">
        <button
          className="standard-button blue"
          onClick={() => handleSaveLine(line)}
        >
          Opslaan
        </button>
      </td>
      <td className="ellipsis-column">
        <div className="ellipsis-container">
          <FaEllipsisV
            className="ellipsis-icon"
            onClick={() => toggleTooltipLine(line.id)}
          />
          {openTooltipLineId === line.id && (
            <div className="tooltip-container">
              <div
                className="tooltip-item delete-item"
                onClick={() => handleDeleteLine(line)}
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

export default TableGroupRow;
