@isTest
private class SfGpsDsResponsiveSizePickList_Test {
  static @isTest
  void validateOptions() {
    SfGpsDsResponsiveSizePickList pl = new SfGpsDsResponsiveSizePickList();

    VisualEditor.DataRow dr = pl.getDefaultValue();

    System.assertEquals('None', dr.getLabel(), 'Expected None.');
    System.assertEquals('', dr.getValue(), 'Expected None.');

    System.assertEquals(6, pl.getValues().size(), 'Expected six values.');
  }
}
