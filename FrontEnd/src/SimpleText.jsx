// Importação de bibliotecas externas
import { Typography } from "@mui/material";

// Componente para padronizar os textos exibidos ao usuário
export default function SimpleText({ text, component }) {
    let variant;
    if(component === "h1") {
        variant = "h3";
    } else if(component === "h2") {
        variant = "h4";
    } else if(component === "h3") {
        variant = "h5";
    } else if(component === "p") {
        variant = "h6";
    }

    return (
        <Typography component={component} variant={variant} textAlign={"center"}>
            {text}
        </Typography>
    )
}