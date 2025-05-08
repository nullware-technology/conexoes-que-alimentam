# Conexões que Alimentam

## Configuração do CI para Expo

Este repositório inclui um workflow de GitHub Actions para compilar automaticamente a aplicação React Native usando o Expo EAS (Expo Application Services) para iOS e Android.

### Pré-requisitos

1. Uma conta no [Expo](https://expo.dev/)
2. Projeto configurado com EAS (`eas init` no seu projeto)
3. Token de acesso do Expo

### Configuração do Secrets

Para que o CI funcione corretamente, você precisa adicionar um secret no GitHub:

1. Vá para "Settings" > "Secrets and variables" > "Actions" no seu repositório GitHub
2. Adicione um novo secret:
   - Nome: `EXPO_TOKEN`
   - Valor: Seu token de acesso do Expo (pode ser gerado em https://expo.dev/accounts/[username]/settings/access-tokens)

### Configuração do EAS

Certifique-se de que o arquivo `eas.json` está configurado corretamente no seu projeto. Exemplo básico:

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "buildType": "archive"
      }
    },
    "preview": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### Execução Manual

Você pode iniciar manualmente o processo de build no GitHub:
1. Vá para a aba "Actions"
2. Selecione o workflow "Expo Build"
3. Clique em "Run workflow"

O CI irá compilar sua aplicação para iOS e Android e enviar para o dashboard do Expo.