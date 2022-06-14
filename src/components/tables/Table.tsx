import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface TableProps<TRow> {
    rows: TRow[];
    columns: GridColDef[];
}

function Table<T>({ rows, columns } : TableProps<T>) {
    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection={false}
            />
        </div>
    );
}

export default Table;
