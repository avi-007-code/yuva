import React from 'react';

const DataTable = ({ columns, data, keyField = 'id' }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-[#E7E5E4] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] font-sans">
      <table className="w-full text-left text-sm text-[#1C1B1F] border-collapse">
        <thead className="bg-[#FAF9F7] text-xs font-medium text-[#6B6966] border-b border-[#E7E5E4]">
          <tr>
            {columns.map((col, index) => {
              const alignClass = col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : '';
              return (
                <th
                  key={col.key || col.accessor || index}
                  className={`px-6 py-3.5 font-medium ${alignClass} ${col.className || col.headerClassName || ''}`}
                >
                  {col.header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F0EFEF]">
          {data.map((row, rowIndex) => (
            <tr
              key={row[keyField] || rowIndex}
              className="hover:bg-[#FAF9F7]/70 transition-colors"
            >
              {columns.map((col, colIndex) => {
                const alignClass = col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : '';
                const cellValue = col.accessor
                  ? typeof col.accessor === 'function'
                    ? col.accessor(row)
                    : row[col.accessor]
                  : null;

                return (
                  <td
                    key={col.key || col.accessor || colIndex}
                    className={`px-6 py-4 whitespace-nowrap text-[#1C1B1F] ${alignClass} ${col.cellClassName || ''}`}
                  >
                    {col.render ? col.render(row, rowIndex) : cellValue}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

