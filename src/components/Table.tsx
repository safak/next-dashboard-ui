const Table = <T,>({
  columns,
  data,
  renderRow,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: T) => React.ReactNode;
  data: T[];
}) => {
  return (
    <div className='my-9 overflow-scroll lg:overflow-auto text-lightTextColor dark:text-darkTextColor shadow-lg rounded-2xl bg-clip-border'>
      <table className='w-full text-left table-auto min-w-max bg-card text-card-foreground'>
        <thead>
          <tr className=''>
            {columns.map((column) => (
              <th
                key={column.accessor}
                className={`px-4 pt-3 border-b bg-popover ${column.className}`}
              >
                <p className='text-sm font-bold'>{column.header}</p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{data.map((item: T) => renderRow(item))}</tbody>
      </table>
    </div>
  );
};
export default Table;
