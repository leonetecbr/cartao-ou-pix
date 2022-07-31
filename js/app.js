const installmentsDiv = $('#installments-div'), installments = $('#installments'), value = $('#installments-value')
const quantity = $('#installments-quantity'), valueInCredit = $('#value-in-credit'), valueInCash = $('#value-in-cash')
const inCardDiv = $('#in-card-div'), inCard = $('#in-card')

$('.needs-validation').on('submit', function (e) {
    e.preventDefault()
    if (!this.checkValidity()) {
        e.stopPropagation()
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
    } else {
        installmentsDiv.addClass('d-none').removeClass('d-flex')
        value.removeAttr('required')
        quantity.removeAttr('required')
        valueInCredit.removeAttr('readonly')
        inCardDiv.addClass('d-none')
        inCard.prop('checked', false)
    }
})