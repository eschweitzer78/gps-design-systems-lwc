abstract
public class SfGpsDsBaseORA {
  protected Map<String, Object> input;
  protected Map<String, Object> output;
  protected Map<String, Object> options;

  public enum WhereFrom { INPUT, OPTIONS }

  protected void setError(String errorCode) {
    //output.put('error', 'KO');
    //output.put('errorCode', errorCode);
    return;
  }

  protected Object getTypedFromMap(WhereFrom wf, String key, Type type) {
    return getTypedFromMap(wf, key, type, false);
  }

  // limitation: apply only on primitive types
  protected Object getTypedFromMap(WhereFrom wf, String key, Type type, Boolean canBeNull) {
    Object untyped = (wf == WhereFrom.INPUT) ? input.get(key) : options.get(key);

    if (untyped == null && canBeNull) {
      return null;
    }

    String                                    typeName  = 'Object';     // if we can't find out anything, we will return 'Object'
    if (untyped instanceof SObject)           typeName = ((SObject) untyped).getSObjectType().getDescribe().getName()+''; 
    else if (untyped instanceof Boolean)      typeName = 'Boolean';
    else if (untyped instanceof Id)           typeName = 'Id';
    else if (untyped instanceof String)       typeName = 'String';
    else if (untyped instanceof Blob)         typeName = 'Blob';
    else if (untyped instanceof Date)         typeName = 'Date';
    else if (untyped instanceof Datetime)     typeName = 'Datetime';
    else if (untyped instanceof Time)         typeName = 'Time';
    else if (untyped instanceof Integer)      typeName = 'Integer';
    else if (untyped instanceof Long)         typeName = 'Long';
    else if (untyped instanceof Decimal)      typeName = 'Decimal';
    else if (untyped instanceof Double)       typeName = 'Double';
    else if (untyped instanceof List<Object>) typeName = 'List';

    if (typeName != type.getName()) {
      String errorText = ((wf == WhereFrom.INPUT) ? 'Input' : 'Options') +
        ' parameter ' + key + ' should be of type ' + type.getName() + 
        ' vs. ' + typeName;

      setError(errorText);
      throw new TypeException(errorText);
    }

    return untyped;
  }

  protected void init(Map<String, Object> args) {
    input = (Map<String, Object>) args.get('input');
    output = (Map<String, Object>) args.get('output');
    options = (Map<String, Object>) args.get('options');
  }

  public class TypeException extends Exception {}
}
