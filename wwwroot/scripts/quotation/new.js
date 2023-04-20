!function ($) {
    "use strict";
    $('#QuotationId').val('');
    $('#QuotaId').val('');
    $('#QuotaDiscountId').val('');
    $('#InterestId').val('');
    $('#InterestJustification').val('');
    var vehiclesModel;
    var products = [];
    var loadProducts = false;
    var administrativeFee = 0.0;
    var aggregate = true;
    var vehicleTypeId = 0;

    function formatState(state) {
        if (!state.id)
            return state.text;

        var $state;
        if (state.disabled)
            $state = $('<span>' + state.text + '<span class="text-danger"> *Sem Aceitação</span></span>');
        else
            $state = $('<span>' + state.text + '</span>');

        return $state;
    };

    $('[data-plugin="switchery"]').each(function (a, e) { new Switchery($(this)[0], $(this).data()) });
    $('[data-toggle="input-mask"]').each(function (a, e) { var t = $(e).data("maskFormat"), n = $(e).data("reverse"); null != n ? $(e).mask(t, { reverse: n }) : $(e).mask(t) });

    $("#InterestId").select2();
    $("#DueDay").select2();
    $("#StateId").select2();
    $("#VehicleBrandId").select2();
    $('#VehicleYear').select2();
    $("#VehicleModelId").select2();
        
    function templateImplementType(state) {
        if (!state.id)
            return state.text;

        var $state;
        if (state.image != '' && state.image != undefined && state.image != null)
            $state = $('<span>' + state.text + '&nbsp;&nbsp;&nbsp; <img src="' + state.image + '" width="60px" /></span>');
        else
            $state = $('<span>' + state.text + '</span>');

        return $state;
    };

    $('#ImplementBrandId').select2({
        ajax: {
            url: '/Implement/Brands',
            data: function (params) {
                return {
                    query: params.term,
                }
            },
            processResults: function (data) {
                return {
                    results: data
                };
            }
        },
        placeholder: 'Pesquisar',
    });

    $('#ImplementModelId').select2({
        ajax: {
            url: '/Implement/Models',
            data: function (params) {
                return {
                    query: params.term,
                    brandId: $('#ImplementBrandId').val(),
                }
            },
            processResults: function (data) {
                return {
                    results: data,
                };
            }
        },
        placeholder: 'Pesquisar',
    });

    $('#ImplementModelId').prop("disabled", true);

    $('#ImplementFloorTypeId').select2({
        ajax: {
            url: '/Implement/FloorTypes',
            data: function (params) {
                return {
                    query: params.term,
                }
            },
            processResults: function (data) {
                return {
                    results: data
                };
            }
        },
        placeholder: 'Pesquisar',
    });

    $('#ImplementBrandId').change(function () {
        $('#ImplementModelId').val('').trigger("change");
        $('#ImplementModelId').prop("disabled", true);

        if ($(this).val() > 0)
            $('#ImplementModelId').prop("disabled", false);
    });

    $('#VehicleModelId').prop("disabled", true);
    $('#VehicleYear').prop("disabled", true);
        
    $('#VehicleBrandId').change(function () {
        $('#VehicleYear').val('').trigger("change");
        $('#VehicleModelId').val('').trigger("change");

        $('#VehicleModelId').prop("disabled", true);

        if ($(this).val() > 0)
            $('#VehicleYear').prop("disabled", false);
    });

    $('#VehicleYear').change(function () {
        $('#VehicleModelId').val('').trigger("change");

        if ($(this).val() != '' && $(this).val() != null)
            $('#VehicleModelId').prop("disabled", false);
    });

    $('#associated-next').click(function () {
        $('#div-associated').hide();
        $('#div-vehicle').show();
        validDivVehicle();
        if (!($('#VehicleModelId').val() > 0)) {
            $('#FipeCode').val('');
            $('#FipePrice').val('');
            $('#VehicleType').val('');
            $('#div-vehicle-complement').hide();
        }
        $('#InterestId').val('');
        $('#InterestJustification').val('');
    });
    $('#vehicle-next').click(function () {
        $('#InterestId').val('');
        $('#InterestJustification').val('');
        searchQuota();
    });
    $('#vehicle-back').click(function () {
        $('#div-vehicle').hide();
        $('#div-associated').show();
    });

    $('#quota-back').click(function () {
        $('#div-quota').hide();
        $('#div-vehicle').show();
    });

    $('#quota-finish').click(function () {

        $(".message-error").remove();

        var interestId = $('#InterestId').val();

        var validated = true;

        var groupInterest = $("#InterestId").parents(".form-group");
        if (!(interestId > 0)) {
            groupInterest.append(
                `<div class="message-error badge badge-danger" style="font-size: 12px;padding: 5px 5px;margin-top: 5px;">                                             
                    Campo obrigatório.
                </div>`);

            validated = false;
        }

        var groupJustification = $("#InterestJustification").parents(".form-group");
        if (interestId == 4 && $('#InterestJustification').val() == '') {
            groupJustification.append(
                `<div class="message-error badge badge-danger" style="font-size: 12px;padding: 5px 5px;margin-top: 5px;">                                             
                    Campo obrigatório.
                </div>`);

            validated = false;
        }

        if (!validated)
            return;

        saveQuotation(true, null);
    });

    $('#quotation-interest').click(function () {
        $('#InterestId').val('').trigger("change");
        $('#InterestJustification').val('');

        saveQuotation(true, 1);
    });

    $('#quotation-interest-information').click(function () {
        $('#InterestId').val('').trigger("change");
        $('#InterestJustification').val('');

        saveQuotation(true, 2);
    });

    $('#quotation-not-interest').click(function () {
        $('#InterestId').html('').select2();

        var option = $("<option></option>").val('').text("Selecione");
        $('#InterestId').append(option).trigger('change');

        option = $("<option></option>").val(3).text("Custo não atende minhas expectativas");
        $('#InterestId').append(option).trigger('change');

        option = $("<option></option>").val(5).text("Estava apenas especulando");
        $('#InterestId').append(option).trigger('change');

        option = $("<option></option>").val(4).text("Outro(s)");
        $('#InterestId').append(option).trigger('change');
    });

    $("#InterestId").change(function () {
        $('#InterestJustification').val('');
        if ($(this).val() == 4) {
            $('#justification-div').show();
        } else {
            $('#justification-div').hide();
        }
    });

    $('#AssociatedName, #AssociatedEmail, #AssociatedPhoneNumber, #StateId').change(validDivAssociated);
    function validDivAssociated() {
        var associatedName = $('#AssociatedName').val().trim();
        var associatedEmail = $('#AssociatedEmail').val().trim();
        var associatedPhoneNumber = $('#AssociatedPhoneNumber').val();
        var stateId = $('#StateId').val();

        var emailValidate = validateEmail(associatedEmail)
        showMessageEmail(emailValidate);

        if (associatedName != '' && emailValidate && associatedPhoneNumber != '' && stateId > 0)
            document.querySelector('#associated-next').disabled = 0;
        else
            document.querySelector('#associated-next').disabled = 1;
    }

    var options = {
        onKeyPress: function (document, e, field, options) {
            var masks = ['000.000.000-009', '00.000.000/0000-00'];
            var mask = (document.length > 14) ? masks[1] : masks[0];
            $('#AssociatedDocument').mask(mask, options);
        }
    };
    $('#AssociatedDocument').mask('000.000.000-009', options);

    function validateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return true
        }
        return false
    }

    function showMessageEmail(validated) {
        var group = $("#AssociatedEmail").parents(".form-group");
        group.find("#message-email").remove();

        if (validated == false && $("#AssociatedEmail").val() != '') {
            group.append(
                `<div id="message-email" class="badge badge-danger" style="font-size: 12px;padding: 5px 5px;margin-top: 5px;">
                    E-mail inválido.
                </div>`)
        }
    }




}(window.jQuery);