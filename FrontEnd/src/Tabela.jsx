import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SimpleText from "./simpleText";

export default function Tabela({ entidade, linhas, colunas, idFunc, onRowSelect = () => {} }) {

    return (
        <Box sx={{ height: '100%', width: { xs: 400, md: 1000 } }}>
            <SimpleText text={entidade} component={"h2"}/>
            <DataGrid
                rows={linhas}
                columns={colunas}
                getRowId={(row) => idFunc(row)}
                initialState={{
                    pagination: {
                        paginationModel: {
                        pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5, 10, 20]}

                disableMultipleRowSelection
                checkboxSelection
                onRowSelectionModelChange={(newSelection) => {
                    if(newSelection.ids.size > 0) {
                        let placeHolderArray = Array.from(newSelection.ids);
                        onRowSelect(placeHolderArray[0]); // Pass the first selected ID to the callback
                    }
                }}
            />
        </Box>
    )
}   