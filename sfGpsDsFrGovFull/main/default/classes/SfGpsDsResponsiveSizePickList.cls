global class SfGpsDsResponsiveSizePickList extends VisualEditor.DynamicPickList {
  global override VisualEditor.DataRow getDefaultValue() {
    return new VisualEditor.DataRow('None', '');
  }

  global override VisualEditor.DynamicPickListRows getValues() {
    VisualEditor.DynamicPickListRows values = new VisualEditor.DynamicPickListRows();

    values.addRow(new VisualEditor.DataRow('Twelfth', '1'));
    values.addRow(new VisualEditor.DataRow('Sixth', '2'));
    values.addRow(new VisualEditor.DataRow('Quarter', '3'));
    values.addRow(new VisualEditor.DataRow('Third', '4'));
    values.addRow(new VisualEditor.DataRow('Half', '6'));
    values.addRow(new VisualEditor.DataRow('Full', '12'));

    return values;
  }
}
