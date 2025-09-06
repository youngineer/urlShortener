import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import type {GridColDef} from '@mui/x-data-grid';
import type { IUrl } from '../utils/types';
import { getUrlList } from '../services/urlServices';

const columns: GridColDef<IUrl>[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'name',
    headerName: 'Name',
    type: 'string',
    width: 150,
    editable: true,
  },
  {
    field: 'shortUrl',
    headerName: 'Short Url',
    type: 'string',
    width: 150,
    editable: false,
  },
  {
    field: 'longUrl',
    headerName: 'Long Url',
    type: 'string',
    width: 110,
    editable: false,
  },
  {
    field: 'customUrl',
    headerName: 'Custom Url',
    type: 'string',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
  },
];


export default function Table() {
    const [urlList, setUrlList] = React.useState<IUrl[] | null>(null);
    
      React.useEffect(() => {
        async function getUserUrlList(): Promise<void> {
          try {
            const response = await getUrlList();
            setUrlList(response);
          } catch (error) {
            setUrlList(null);
          }
        }
        getUserUrlList();
      }, []);
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={urlList ?? []}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
