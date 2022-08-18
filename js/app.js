const installmentsDiv = $('#installments-div'), installments = $('#installments'), value = $('#installments-value')
const quantity = $('#installments-quantity'), valueInCredit = $('#value-in-credit'), valueInCash = $('#value-in-cash')
const inCardDiv = $('#in-card-div'), inCard = $('#in-card'), textInCard = $('#text-in-card'), plusPercent = $('#plus-percent')
const incomeAdditionalDiv = $('#percent-income-additional-div'), incomeAdditional = $('#percent-income-additional')

$('#calculator').on('submit', function (e) {
    e.preventDefault()
    if (!this.checkValidity()) {
        e.stopPropagation()
    }else{
        let credit = parseInt(valueInCredit.val()), cash = parseInt(valueInCash.val())
        let result = $('#result'), text = 'É mais vantajoso pagar '
        if (credit <= cash) {
            text += textInCard.html() + '!'
            result.html(text).addClass('alert-success')
        }
        result.removeClass('d-none')
    }

    $(this).addClass('was-validated')
})

function changeInstallments(){
    let data = quantity.val() * value.val()
    valueInCredit.val(data)
}

installments.on('click', () =>  {
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

plusPercent.on('click', () => {
    if (plusPercent.is(':checked')){
        incomeAdditionalDiv.removeClass('d-none')
        incomeAdditional.attr('required', '')
    }
    else{
        incomeAdditionalDiv.addClass('d-none')
        incomeAdditional.removeAttr('required')
    }
})

axios.get('/api.php')
    .then((response) => {
        if (response.status === 200) console.log(response.data)
        else console.error(response)
    })
    .catch((error) => console.error(error))