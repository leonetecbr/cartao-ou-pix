# Cartão ou PIX?

## Introdução

Para os momentos de dúvidas se é mais vantajoso pagar no cartão ou por PIX, se é melhor parcelar ou pagar à vista e
afins.

As lojas costumam dá desconto para pagamento à vista, mas será vantajoso mesmo pagar à vista?

Esse pequeno aplicativo calcula se realmente vale a pena, ele considera os pontos/milhas ganhos, cashback e
que o dinheiro ficaria investido até o dia do vencimento da fatura.

## Instalação

Para instalação basta clonar esse repositório, possuir o composer e o PHP instalado na versão 7.4 ou superior e executar
o comando:

`composer install`

Para o correto funcionamento é necessário o preenchimento de uma chave de API da HG Brasil a chave pode ser conseguida
[clicando aqui](https://console.hgbrasil.com/keys). Seu arquivo .env deve ficar assim:

```shell
HGBRASIL_KEY=SUA-CHAVE # Com sua chave no lugar de "SUA-CHAVE"
```

## Isenção de responsabilidade

**O resultado é calculado usando dados de CDI, Selic e Dólar que podem estar desatualizados e/ou sofrer alterações no
período do parcelamento, portanto siga com cautela e por sua conta em risco.**

## Visualização

### Desktop

<p align="center">
   <img src="https://raw.githubusercontent.com/leonetecbr/cartao-ou-pix/main/result/site-desktop.png" alt="Site visto do computador"/>
</p>

### Mobile

<p align="center">
   <img src="https://raw.githubusercontent.com/leonetecbr/cartao-ou-pix/main/result/site-mobile.png" alt="Site visto do celular"/>
</p>