const installmentsDiv = $('#installments-div'), installments = $('#installments'), value = $('#installments-value')
const quantity = $('#installments-quantity'), valueInCredit = $('#value-in-credit'), valueInCash = $('#value-in-cash')
const inCardDiv = $('#in-card-div'), inCard = $('#in-card'), textInCard = $('#text-in-card')

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