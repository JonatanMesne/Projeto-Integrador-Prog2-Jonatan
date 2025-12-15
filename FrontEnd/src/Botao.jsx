import { Button } from "@mui/material";

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