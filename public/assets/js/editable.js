"use strict";
var params = null,
	colsEdi = null,
	newColHtml = "<div class='btn-group pull-right ml-2'><button data-toggle='tooltip' data-placement='top' title='' data-original-title='Click to edit this row'  type='button' class='bEdit btn btn-sm btn-default text-info' onclick='rowEdit(this);'><i class='bx bx-pencil font-size-18' > </i></button><button data-toggle='tooltip' data-placement='top' title='' data-original-title='Click to delete this row' type='button' class='bElim btn btn-sm btn-default text-danger' onclick='rowElim(this);'><i class='bx bx-trash font-size-18' > </i></button><button data-toggle='tooltip' data-placement='top' title='' data-original-title='Click to accept changes' type='button' class='bAcep btn btn-sm btn-default text-success' style='display:none;' onclick='rowAcep(this);'><i class='bx bx-check font-size-24' > </i></button><button data-toggle='tooltip' data-placement='top' title='' data-original-title='Click to cancel changes'type='button' class='bCanc btn btn-sm btn-default text-danger' style='display:none;' onclick='rowCancel(this);'><i class='bx bx-x font-size-24' > </i></button></div>",
	colEdicHtml = "<td name='buttons'>" + newColHtml + "</td>";
$.fn.SetEditable = function(a) {
	params = $.extend({
		autoDelete: null,
		columnsEd: null,
		$addButton: null,
		onEdit: function() {},
		onBeforeDelete: function() {},
		onDelete: function() {},
		onAdd: function() {}
	}, a), this.find("thead tr").append("<th name='buttons'>Actions</th>"), this.find("tbody tr").append(colEdicHtml);
	var b = this;
	null != params.$addButton && params.$addButton.click(function() {
		rowAddNew(b.attr("id"))
	}), null != params.columnsEd && (colsEdi = params.columnsEd.split(","))
};

function completeEditing(a, b) {
	if(13 == a.keyCode) {
		var c = $(b).parent().parent().find(".bAcep");
		return rowAcep(c), !1
	}
	return !0
}

function EditRepeatFields(a, b) {
	function c(a) {
		if(null == colsEdi) return !0;
		for(var b = 0; b < colsEdi.length; b++)
			if(a == colsEdi[b]) return !0;
		return !1
	}
	var d = 0;
	a.each(function() {
		d++;
		"buttons" != $(this).attr("name") && c(d - 1) && b($(this))
	})
}

function FijModoNormal(a) {
	$(a).parent().find(".bAcep").hide(), $(a).parent().find(".bCanc").hide(), $(a).parent().find(".bEdit").show(), $(a).parent().find(".bElim").show();
	var b = $(a).parents("tr");
	b.attr("id", "")
}

function FijModoEdit(a) {
	$(a).parent().find(".bAcep").show(), $(a).parent().find(".bCanc").show(), $(a).parent().find(".bEdit").hide(), $(a).parent().find(".bElim").hide();
	var b = $(a).parents("tr");
	b.attr("id", "editing")
}

function ModoEdicion(a) {
	return !("editing" != a.attr("id"))
}

function rowAcep(a) {
	var b = $(a).parents("tr"),
		c = b.find("td");
	ModoEdicion(b) && (EditRepeatFields(c, function(a) {
		var b = a.find("input").val();
		a.html(b)
	}), FijModoNormal(a), params.onEdit(b))
}

function rowCancel(a) {
	var b = $(a).parents("tr"),
		c = b.find("td");
	ModoEdicion(b) && (EditRepeatFields(c, function(a) {
		var b = a.find("div").html();
		a.html(b)
	}), FijModoNormal(a))
}

function rowEdit(a) {
	var b = $(a).parents("tr"),
		c = b.find("td");
	EditRepeatFields(c, function(a) {
		var b = a.html();
		a.html("<div style='display: none;'>" + b + "</div>" + ("<input onkeypress='return completeEditing(event, this)' class='form-control input-sm'  value=\"" + b + "\">"))
	}), b.find("input").filter(":input:visible:first").focus(), FijModoEdit(a)
}

function rowElim(a) {
	var b = $(a).parents("tr");
	params.onBeforeDelete(b), params.autoDelete ? (b.remove(), params.onDelete(b)) :  sharpAlert({
		title: "Confirm?",
		text: "Are you sure you want to delete this row?",
		showCancelButton: !0,
		confirmButtonText: "Yes",
		confirmButtonClass: "btn btn-success mr-2 btn-swal",
		cancelButtonText: "No",
		cancelButtonClass: "btn btn-danger mr-2 btn-swal",
		reverseButtons: !0,
		buttonsStyling: !1
	}).then(a => {
		a.value && (b.remove(), params.onDelete(b))
	})
}

function rowAddNew(a) {
	var b = $("#" + a),
		c = b.find("tbody tr");
	if(0 == c.length) {
		var d = b.find("thead tr"),
			e = d.find("th"),
			f = "";
		e.each(function() {
			f += "buttons" == $(this).attr("name") ? colEdicHtml : "<td></td>"
		}), b.find("tbody").append("<tr>" + f + "</tr>");
		b.find(".bEdit")
	} else {
		var g = b.find("tr:last");
		g.clone().appendTo(g.parent()), g = b.find("tr:last");
		var e = g.find("td");
		e.each(function() {
			"buttons" == $(this).attr("name") || $(this).html("")
		})
	}
	var h = b.find("tr").last().find(".bEdit");
	rowEdit(h), params.onAdd()
}

function TableToCSV(a, b) {
	var c = "",
		d = "",
		e = $("#" + a);
	return e.find("tbody tr").each(function() {
		ModoEdicion($(this)) && $(this).find(".bAcep").click();
		var a = $(this).find("td");
		c = "", a.each(function() {
			"buttons" == $(this).attr("name") || (c = c + $(this).html() + b)
		}), "" != c && (c = c.substr(0, c.length - b.length)), d = d + c + "\n"
	}), d
}