$.fn.setDeletable = function (options) {
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
    var $current_table = this;
    var $table_id = $current_table.attr("id");
   $('#'+ $table_id +'_length').append('<button type="button" class="btn btn-danger btn-sm ml-2">Delete Checked</button>');  //encabezado vacío
    //this.find('tbody tr').append(colEdicHtml);
      //Read reference to the current table, to resolve "this" here.
    console.log($current_table.attr("id")+"")
    //Process "addButton" parameter
    if (params.$addButton != null) {
        //Se proporcionó parámetro
        params.$addButton.click(function() {
            rowAddNew($current_table.attr("id"));
        });
    }
    //Process "columnsEd" parameter
    
  };