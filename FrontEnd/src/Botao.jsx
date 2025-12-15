// Importação de hooks e bibliotecas externas
import { Button } from "@mui/material";

// Componente para padronizar um botão
export default function BotaoBusca({ texto, funcao, disabled=false }) {
    return (
        <Button
            variant="outlined"
            onClick={funcao}
            style={{ minWidth: "100px" }}
            disabled={disabled}
        >
            {texto}
        </Button>
    )
}