/*
Bootstable
 @description  Javascript library to make HMTL tables editable, using Bootstrap
 @version 1.1
 @autor Tito Hinostroza
*/
"use strict";
//Global variables
 var page_params = {}; 		//Parameters

 var newColHtml = "<div class='btn-group pull-right ml-2'><button data-toggle='tooltip' data-placement='top' title='' data-original-title='Click to edit this row'  type='button' class='bEdit btn btn-sm btn-default text-info' onclick='rowEdit(this);'><i class='mdi mdi-pencil font-size-18' > </i></button><button data-toggle='tooltip' data-placement='top' title='' data-original-title='Click to delete this row' type='button' class='bElim btn btn-sm btn-default text-danger' onclick='rowElim(this);'><i class='mdi mdi-delete font-size-18' > </i></button><button data-toggle='tooltip' data-placement='top' title='' data-original-title='Click to accept changes' type='button' class='bAcep btn btn-sm btn-default text-success' style='display:none;' onclick='rowAcep(this);'><i class='mdi mdi-check font-size-24' > </i></button><button data-toggle='tooltip' data-placement='top' title='' data-original-title='Click to cancel changes'type='button' class='bCanc btn btn-sm btn-default text-danger' style='display:none;' onclick='rowCancel(this);'><i class='mdi mdi-close font-size-24' > </i></button></div>";
var colEdicHtml = '<td name="buttons">'+newColHtml+'</td>'; 
  
$.fn.SetEditable = function (options) {
	var params = null; 
  var defaults = {
	  autoDelete: null,
      columnsEd: null,         //Index to editable columns. If null all td editables. Ex.: "1,2,3,4,5"
      $addButton: null,        //Jquery object of "Add" button
      onEdit: function() {},   //Called after edition
      onBeforeDelete: function() {}, //Called before deletion
      onDelete: function() {}, //Called after deletion
      onAdd: function() {}     //Called when added a new row
  };
  params = $.extend(defaults, options);
  this.find('thead tr').append('<th name="buttons">Actions</th>');  //encabezado vacío
  this.find('tbody tr').append(colEdicHtml);
  var $tabedi = this;   //Read reference to the current table, to resolve "this" here.
  //Process "addButton" parameter
  if (params.$addButton != null) {
      //Se proporcionó parámetro
      params.$addButton.click(function() {
          rowAddNew($tabedi.attr("id"));
      });
  }
  //Process "columnsEd" parameter
  if (params.columnsEd != null) {
      //Extract felds
      params.colsEdi = params.columnsEd.split(',');
  }
  page_params[$tabedi.attr("id")]=params;
};
function completeEditing(e, obj){
	if(e.keyCode==13){
		var $but = $(obj).parent().parent().find(".bAcep");
		rowAcep($but);
		return false;
	}
	 return true;
}

function EditRepeatFields($cols, tarea) {
//Itera por los campos editables de una fila
  
  var params = page_params[$cols.parents("table").attr("id")];
  var n = 0;
  $cols.each(function() {
      n++;
      if ($(this).attr('name')=='buttons') return;  //excluye columna de botones
      if (!EsEditable(n-1)) return;   //noe s campo editable
      tarea($(this));
  });
  
  function EsEditable(idx) {
  //Indica si la columna pasada está configurada para ser editable
      if (params.colsEdi==null) {  //no se definió
          return true;  //todas son editable
      } else {  //hay filtro de campos
//alert('verificando: ' + idx);
          for (var i = 0; i < params.colsEdi.length; i++) {
            if (idx == params.colsEdi[i]) return true;
          }
          return false;  //no se encontró
      }
  }
}
function setNormalMode(but) {
  $(but).parent().find('.bAcep').hide();
  $(but).parent().find('.bCanc').hide();
  $(but).parent().find('.bEdit').show();
  $(but).parent().find('.bElim').show();
  var $row = $(but).parents('tr');  //accede a la fila
  $row.attr('id', '');  //quita marca
}
function setEditMode(but) {
  $(but).parent().find('.bAcep').show();
  $(but).parent().find('.bCanc').show();
  $(but).parent().find('.bEdit').hide();
  $(but).parent().find('.bElim').hide();
  var $row = $(but).parents('tr');  //accede a la fila
  $row.attr('id', 'editing');  //indica que está en edición
}
function editMode($row) {
  if ($row.attr('id')=='editing') {
      return true;
  } else {
      return false;
  }
}
function rowAcep(but) {
//Acepta los cambios de la edición
  var params = page_params[$(but).parents("table").attr("id")];
  var $row = $(but).parents('tr');  //accede a la fila
  var $cols = $row.find('td');  //lee campos
  if (!editMode($row)) return;  //Ya está en edición
  //Está en edición. Hay que finalizar la edición
  EditRepeatFields($cols, function($td) {  //itera por la columnas
    var cont = $td.find('input').val(); //lee contenido del input
    $td.html(cont);  //fija contenido y elimina controles
  });
  setNormalMode(but);
  params.onEdit($row);
}
function rowCancel(but) {
//Rechaza los cambios de la edición
  var $row = $(but).parents('tr');  //accede a la fila
  var $cols = $row.find('td');  //lee campos
  if (!editMode($row)) return;  //Ya está en edición
  //Está en edición. Hay que finalizar la edición
  EditRepeatFields($cols, function($td) {  //itera por la columnas
      var cont = $td.find('div').html(); //lee contenido del div
      $td.html(cont);  //fija contenido y elimina controles
  });
  setNormalMode(but);
}
function rowEdit(but) {  //Inicia la edición de una fila  
  var $row = $(but).parents('tr');  //accede a la fila
 // console.log($row.parents("table").attr("id"))
  var $cols = $row.find('td');  //lee campos
  //if (editMode($row)) return;  //if already in edit mode
  //Pone en modo de edición
  EditRepeatFields($cols, function($td) {  //itera por la columnas
      var cont = $td.html(); //lee contenido
      var div = '<div style="display: none;">' + cont + '</div>';  //guarda contenido
      var input = '<input onkeypress="return completeEditing(event, this)" class="form-control input-sm"  value="' + cont + '">';
      $td.html(div + input);  //fija contenido	 
  });
  
  $row.find("input").filter(':input:visible:first').focus();
  setEditMode(but);
}
function rowElim(but) {  //Elimina la fila actual
  var params = page_params[$(but).parents("table").attr("id")];
  var $row = $(but).parents('tr');  //accede a la fila
   params.onBeforeDelete($row);
  if(params.autoDelete){
	  $row.remove();
	  params.onDelete($row);
  }else{
	  sharpAlert({
		title: 'Confirm?',
		text: "Are you sure you want to delete this row?",
		type: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Yes',
		confirmButtonClass:"btn btn-success mr-2 btn-swal",
		cancelButtonText: 'No',
		cancelButtonClass:"btn btn-danger mr-2 btn-swal",
		reverseButtons: true,
		buttonsStyling: false
	},(passed)=>{
		 if (passed) {
			$row.remove();
			params.onDelete($row);
		} 
	});
  }

}
function rowAddNew(tabId) {  //Agrega fila a la tabla indicada.
  var params = page_params[tabId];
  var $tab_en_edic = $("#" + tabId);  //Table to edit
  var $filas = $tab_en_edic.find('tbody tr');

  if ($filas.length==0) {
      //There are no rows of data. You have to create them complete
      var $row = $tab_en_edic.find('thead tr');  //encabezado
      var $cols = $row.find('th');  //lee campos
      //construye html
      var htmlDat = '';
      $cols.each(function() {
          if ($(this).attr('name')=='buttons') {
              //It's column of buttons
              htmlDat = htmlDat + colEdicHtml;  //agrega botones
          } else {
              htmlDat = htmlDat + '<td></td>';
          }
      });
      $tab_en_edic.find('tbody').append('<tr>'+htmlDat+'</tr>');
	  
	  var $but = $tab_en_edic.find('.bEdit');	 
	 // rowEdit($but);
  } else {
      //There are other rows, we can clone the last row, to copy the buttons
      var $ultFila = $tab_en_edic.find('tr:last');
      $ultFila.clone().appendTo($ultFila.parent());  
      $ultFila = $tab_en_edic.find('tr:last');
      var $cols = $ultFila.find('td');  //lee campos
      $cols.each(function() {
          if ($(this).attr('name')=='buttons') {
              //It's column of buttons
          } else {
              $(this).html('');  //clean content
          }
      });
	  
  }
  var $butt = $tab_en_edic.find("tr").last().find(".bEdit");	  
  rowEdit($butt);  
  params.onAdd();
}
function TableToCSV(tabId, separator) {  //Convierte tabla a CSV
  var datFil = '';
  var tmp = '';
  var $tab_en_edic = $("#" + tabId);  //Table source
  $tab_en_edic.find('tbody tr').each(function() {
      //Termina la edición si es que existe
      if (editMode($(this))) {
          $(this).find('.bAcep').click();  //acepta edición
      }
      var $cols = $(this).find('td');  //lee campos
      datFil = '';
      $cols.each(function() {
          if ($(this).attr('name')=='buttons') {
              //Es columna de botones
          } else {
              datFil = datFil + $(this).html() + separator;
          }
      });
      if (datFil!='') {
          datFil = datFil.substr(0, datFil.length-separator.length); 
      }
      tmp = tmp + datFil + '\n';
  });
  return tmp;
}

$.fn.tableToJSON = function (options) {	
  var defaults = {
	  columns: null      
  };
  
  var $c_tb =  $(this);
  
  var params = $.extend(defaults, options);
  var columns = params.columns;
  columns = columns || Array.from({length: $c_tb.find("tbody > tr:first > td").length}, (x, i) => i);
	var $all_rows = $c_tb.find("tbody > tr");	
  var jdata = [];

	//var json_string="";	
	$all_rows.each(function() {			
		var $current_row = $(this);
		var $datas = $current_row.find("td");
		//var row_json ="{";
    var json_row ={};
		$datas.each(function() {	
			var $current_data = $(this);
			var tdIndex = $current_data.index();
			if(columns.includes(tdIndex)){
        json_row[$c_tb.find('th').eq(tdIndex).text()] = $current_data.text();
				//row_json += "\"" + $c_tb.find('th').eq(tdIndex).text()+"\":\""+ $current_data.text()+"\",";
			}			
		});
		//row_json = row_json.slice(0, -1);
		//row_json +="},"
    jdata.push(json_row);
		//json_string +=row_json;
    });	
	//json_string = json_string.slice(0, -1);
	//json_string = "["+json_string+"]";
  return jdata;
	//return JSON.parse(json_string);
  
};
