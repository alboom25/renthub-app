function sharpAlert(options, callback) {
    var params = null;
    var defaults = {
        title: "",
        text: "",
        type: "info",
        showConfirmButton: true,
        confirmButtonText: "OK",
        confirmButtonClass: "btn btn-success mr-2 btn-swal",
        showCancelButton: false,
        cancelButtonText: "Cancel",
        cancelButtonClass: "btn btn-danger mr-2 btn-swal",
        showCloseButton: false,
    };
    params = $.extend(defaults, options);
    var border_color = "#50a5f1";
    switch (params.type) {
        case "warning":
            border_color = "#f1b44c";
            break;
        case "danger":
            border_color = "#f46a6a";
            break;
        case "success":
            border_color = "#34c38f";
            break;
        case "info":
            border_color = "#50a5f1";
        case "question":
            border_color = "#556ee6";
        default:
            border_color = "#eff2f7";
    }
    const alert_id = moment().format().getTime();
    var cancel_button = "";
    if (params.showCancelButton) {
        cancel_button = '<button id="btn_alert_cancel_' + alert_id + '" type="button" class="' + params.cancelButtonClass + '">' + params.cancelButtonText + "</button>";
    }
    var close_button = "";
    if (params.showCloseButton) {
        close_button = '<button type="button" class="btn btn-danger mr-2 btn-swal" data-dismiss="modal">Close</button>';
    }

    var ok_button = "";
    if (params.showConfirmButton) {
        ok_button = '<button id="btn_alert_ok_' + alert_id + '" type="button" class="' + params.confirmButtonClass + '">' + params.confirmButtonText + "</button>";
    }

    var alert_body = '<div id="' + alert_id + '" data-backdrop="static" class="modal fade" role="dialog"> <div class="modal-dialog modal-dialog-centered"><div class="modal-content" style="border-color:' + border_color + ';"> <div class="modal-header d-inline bg-white" style="border:none;"> <h5 class="modal-title text-center font-weight-bold">' + params.title + '</h5></div> <div class="modal-body alert alert-' + params.type + ' mx-2 my-0"><h6 class="text-center">' + params.text + '</h6> </div> <div class="modal-footer d-flex justify-content-center" style="border:none;"> ' + ok_button + cancel_button + close_button + " </div> </div> </div> </div>";
    $("body").append(alert_body);
    $("#" + alert_id).modal("show");

    $("#btn_alert_cancel_" + alert_id).click(function (e) {
        callback(false);
        $("#" + alert_id).remove();
    });

    $("#btn_alert_ok_" + alert_id).click(function (e) {
        callback(true);
        $("#" + alert_id).remove();
    });
}
