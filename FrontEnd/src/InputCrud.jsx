// Importação de componentes e bibliotecas externas
import { TextField } from "@mui/material";
import StringMask from "string-mask";

// Componente de input customizado para formulários CRUD
export default function InputCrud({ nomeCampo, value, setValue, maxLength = 50, disabled = false, numero=false, 
    cpfCnpj=false, telefone=false, dinheiro=false, data=false}) {
    // Função para remover qualquer máscara de um texto (deixa só números)
    function removeMask(text) {
        return text.replace(/\D/g, '');
    }

    // Máscaras para diferentes tipos de campos
    const maskCpf = new StringMask('000.000.000-00');
    const maskCnpj = new StringMask('00.000.000/0000-00');
    const maskTelefoneSmall = new StringMask('(00) 0000-0000');
    const maskTelefoneBig = new StringMask('(00) 00000-0000');
    const maskDinheiro = new StringMask('R$ #.##0,00', {reverse: true});
    const maskData = new StringMask('00/00/0000')

    // Renderização do campo de texto com tratamento de máscara e validação
    return (
        <TextField
            disabled={disabled}
            id={`${nomeCampo}`}
            label={`${nomeCampo}`}
            size="normal"
            sx={{ minWidth: '100px' }}
            value={value}
            onChange={(event) => {
                // Se está apagando caracteres
                if(value.length > event.target.value.length) {
                    setValue(event.target.value);
                } else { // Se está adicionando caracteres
                    if(cpfCnpj) {
                        // Aplica máscara de CPF ou CNPJ
                        const unmaskedValue = removeMask(event.target.value);
                        if(unmaskedValue.length <= 11) {
                            setValue(maskCpf.apply(unmaskedValue));
                        } else {
                            setValue(maskCnpj.apply(unmaskedValue));
                        }
                    } else if(telefone) {
                        // Aplica máscara de telefone
                        const unmaskedValue = removeMask(event.target.value);
                        if(unmaskedValue.length <= 10) {
                            setValue(maskTelefoneSmall.apply(unmaskedValue));
                        } else {
                            setValue(maskTelefoneBig.apply(unmaskedValue));
                        }
                    } else if(dinheiro) {
                        // Aplica máscara de dinheiro
                        const unmaskedValue = removeMask(event.target.value);
                        setValue(maskDinheiro.apply(unmaskedValue));
                    } else if(data) {
                        // Aplica máscara de data
                        const unmaskedValue = removeMask(event.target.value);
                        setValue(maskData.apply(unmaskedValue));
                    } else if (value.length <= maxLength) {
                        // Se dentro do limite, atualiza normalmente
                        if(numero) {
                            // Permite apenas números
                            const isNumber = /^[0-9]*$/.test(event.target.value);
                            if(isNumber) {
                                setValue(event.target.value);
                            }
                        } else {
                            setValue(event.target.value);
                        }
                    } else {
                        // Se exceder o limite (ex: colar), trunca a string
                        setValue(event.target.value.slice(0, maxLength));
                    }
                }
            }}
        />
    )
}

