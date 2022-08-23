const installmentsDiv = $('#installments-div'), installments = $('#installments'), value = $('#installments-value')
const quantity = $('#installments-quantity'), valueInCredit = $('#value-in-credit'), valueInCash = $('#value-in-cash')
const inCardDiv = $('#in-card-div'), inCard = $('#in-card'), textInCard = $('#text-in-card')
const incomeAdditionalDiv = $('#percent-income-additional-div'), incomeAdditional = $('#percent-income-additional')
const benefitsCashback = $('#benefits-credit-cashback'), benefitsPoints = $('#benefits-credit-points')
const benefitsCashbackDiv = $('#benefits-credit-cashback-div'), benefitsPointsDiv = $('#benefits-credit-points-div')
const benefits = $('input[name="benefits-credit"]'), cashbackValue= $('percent-cashback'), pointsQuantity = $('#points')
const pointsValue = $('#value-per-points'), plusPercent = $('#plus-percent')
let dollar, cdi, selic

const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})

$('#calculator').on('submit', function (e) { // Realiza o calculo se vale a pena
    e.preventDefault()
    if (!this.checkValidity()) {
        e.stopPropagation()
    } else {
        let credit = parseInt(valueInCredit.val()), cash = parseInt(valueInCash.val())
        let result = $('#result'), text = 'É mais vantajoso pagar ', diff
        credit = credit - calcBenefits() - calcIncome()
        console.log(credit, cash, credit - cash)
        diff = (credit - cash).toFixed(2)
        if (diff < 0) {
            text += textInCard.html() + '! A diferença é de '
            text += Math.abs(diff).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})
            result.html(text).addClass('alert-success').removeClass('alert-info').removeClass('alert-warning')
        } else if (diff > 0){
            text += 'à vista! A diferença é de '
            text += diff.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})
            result.html(text).addClass('alert-info').removeClass('alert-success').removeClass('alert-warning')
        } else{
            text = 'A diferença entre o pagamento em cartão e à vista nesse caso é nula, escolha o mais conveniente.'
            result.html(text).addClass('alert-warning').removeClass('alert-success').removeClass('alert-warning')
        }
        result.removeClass('d-none')
    }

    $(this).addClass('was-validated')
})

installments.on('change', () => { // Valor parcelado
    if (installments.is(':checked')) {
        installmentsDiv.removeClass('d-none').addClass('d-flex')
        value.attr('required', '').on('change', changeInstallments)
        quantity.attr('required', '').on('change', changeInstallments)
        valueInCredit.attr('readonly', '')
        inCardDiv.removeClass('d-none')
        textInCard.html('parcelado')
    } else {
        installmentsDiv.addClass('d-none').removeClass('d-flex')
        value.removeAttr('required')
        quantity.removeAttr('required')
        valueInCredit.removeAttr('readonly')
        inCardDiv.addClass('d-none')
        inCard.prop('checked', false)
        textInCard.html('no cartão')
    }
})

plusPercent.on('change', () => { // Porcentagem adicional
    if (plusPercent.is(':checked')) {
        incomeAdditionalDiv.removeClass('d-none')
        incomeAdditional.attr('required', '')
    } else {
        incomeAdditionalDiv.addClass('d-none')
        incomeAdditional.removeAttr('required')
    }
})

benefits.on('change', () => { //  Muda benefícios do cartão
    if (benefitsCashback.is(':checked')) {
        benefitsCashbackDiv.removeClass('d-none')
        benefitsPointsDiv.addClass('d-none')
        cashbackValue.attr('required', '')
        pointsQuantity.removeAttr('required')
        pointsValue.removeAttr('required')
    } else if (benefitsPoints.is(':checked')) {
        benefitsCashbackDiv.addClass('d-none')
        benefitsPointsDiv.removeClass('d-none')
        pointsValue.attr('required', '')
        pointsQuantity.attr('required', '')
        cashbackValue.removeAttr('required')
    } else {
        benefitsPointsDiv.addClass('d-none')
        benefitsCashbackDiv.addClass('d-none')
        cashbackValue.removeAttr('required')
        pointsValue.removeAttr('required')
        pointsQuantity.removeAttr('required')
    }
})

axios.get('/api.php') // Pega as taxas, atualizadas
    .then((response) => {
        if (response.status === 200){
            cdi = response.data.cdi
            selic = response.data.selic
            dollar = response.data.usd
            $('#dollar-value').html(dollar.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}))
        } else console.error(response)
    })
    .catch((error) => console.error(error))

function changeInstallments() { // Recalcula o valor total das parcelas
    let data = quantity.val() * value.val()
    valueInCredit.val(data)
}

function calcBenefits(){ // Calcula o ganho com os benefícios do cartão
    if (inCard.is(':checked')) return 0 // Se o à vista for pago no cartão

    let code = $('input[name="benefits-credit"]:checked').val()
    const currency = $('#currency')
    if (code === '1'){ // Cashback
        let percent = benefitsCashback.val()
        return valueInCredit.val()/100*percent
    } else if (code === '2'){ // Pontos
        let points = (currency.val() === '1') ?
            valueInCredit.val()/dollar*pointsQuantity.val() : // Pontos por dólar
            valueInCredit.val()*pointsQuantity.val() // Pontos por real
        return points/1000*pointsValue.val()
    }
    return 0 // Nenhum
}

function calcIncome(){ // Calcula o ganho com os investimentos até o pagamento da fatura
    let indexer = $('#indexer').val(), income = 0, percent, percentIncome = $('#percent-income').val()
    let additional = plusPercent.is(':checked')?incomeAdditional.val():0

    if (indexer === '1') percent = ((percentIncome / 100) * cdi) + additional // CDI
    else if (indexer === '2') percent = ((percentIncome / 100) * selic) + additional // Selic
    else percent = parseFloat(percentIncome) + parseFloat(additional) // a.m.

    if (installments.is(':checked')){ // Com parcelas
        let total = valueInCredit.val(), installmentsQuantity = quantity.val(), installmentsValue = value.val()
        let incomeInCard = 0

        for (let i = 1; i <= installmentsQuantity; i++){
            let incomeMonthly = total / 100 * percent, irrf

            if (i <= 6) irrf = 22.5 // Até 180 dias (22,5%)
            else if (i > 6 && i < 12) irrf = 20 // Até 180 e 360 dias (20%)
            else irrf = 17.5 // Acima de 361 dias (17,5%)

            incomeMonthly -= incomeMonthly / 100 * irrf
            income += incomeMonthly
            total -= installmentsValue
            if (i === 1) incomeInCard = incomeMonthly
        }

        if (inCard.is(':checked')) income -= valueInCash.val() / 100 * percent // Se o à vista for pago no cartão
    } else {
        income += valueInCash.val() / 100 * percent
        income -= income / 100 * 22.5  // - 22,5% de IRRF
    }  // Sem parcelas

    // TODO Incluir investimentos isentos de IRRF

    return income
}