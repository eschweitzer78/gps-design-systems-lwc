abstract public class SfGpsDsBaseORA {
  protected Map<String, Object> input;
  protected Map<String, Object> output;
  protected Map<String, Object> options;

  public static final String ERROR_KEY = 'error';
  public static final String ERROR_KEY_KO_VALUE = 'KO';
  public static final String ERROR_CODE_KEY = 'errorCode';

  public enum WhereFrom {
    INPUT,
    OPTIONS
  }

  protected @TestVisible
  void setError(String errorCode) {
    output.put(ERROR_KEY, ERROR_KEY_KO_VALUE);
    output.put(ERROR_CODE_KEY, errorCode);
    return;
  }

  public Boolean hasError() {
    return output.containsKey(ERROR_KEY);
  }

  public String getErrorCode() {
    return output.containsKey(ERROR_KEY)
      ? (String) output.get(ERROR_CODE_KEY)
      : null;
  }

  protected @TestVisible
  void putOutput(String key, Object value) {
    if (output != null) {
      output.put(key, value);
    }
  }

  protected @TestVisible
  Object getTypedFromMap(WhereFrom wf, String key, Type type) {
    return getTypedFromMap(wf, key, type, false);
  }

  // limitation: apply only on primitive types
  protected @TestVisible
  Object getTypedFromMap(
    WhereFrom wf,
    String key,
    Type type,
    Boolean canBeNull
  ) {
    Object untyped = (wf == WhereFrom.INPUT)
      ? input.get(key)
      : options.get(key);

    if (
      untyped == null ||
      (untyped == '' &&
      type == Id.class) ||
      (untyped == 'undefined' &&
      type == Id.class)
    ) {
      if (!canBeNull) {
        String errorText =
          ((wf == WhereFrom.INPUT) ? 'Input' : 'Options') +
          ' parameter ' +
          key +
          ' must be set.';

        setError(errorText);
        throw new ArgsException(errorText);
      }

      return null;
    }

    String typeName = 'Object'; // if we can't find out anything, we will return 'Object'
    if (untyped instanceof SObject) {
      typeName =
        ((SObject) untyped).getSObjectType().getDescribe().getName() + '';
    } else if (untyped instanceof Boolean) {
      typeName = 'Boolean';
    } else if (untyped instanceof Id) {
      typeName = 'Id';
    } else if (untyped instanceof String) {
      typeName = 'String';
    } else if (untyped instanceof Blob) {
      typeName = 'Blob';
    } else if (untyped instanceof Date) {
      typeName = 'Date';
    } else if (untyped instanceof Datetime) {
      typeName = 'Datetime';
    } else if (untyped instanceof Time) {
      typeName = 'Time';
    } else if (untyped instanceof Integer) {
      typeName = 'Integer';
    } else if (untyped instanceof Long) {
      typeName = 'Long';
    } else if (untyped instanceof Decimal) {
      typeName = 'Decimal';
    } else if (untyped instanceof Double) {
      typeName = 'Double';
    } else if (untyped instanceof List<Object>) {
      typeName = 'List<ANY>';
    }

    String currentTypeName = type.getName();

    if (typeName != currentTypeName) {
      // It turns out Double and Decimal both return true when applying
      // instanceof on a Double/Decimal

      if (
        (typeName != 'Double' &&
        typeName != 'Decimal') ||
        (typeName == 'Double' &&
        currentTypeName != 'Decimal') ||
        (typeName == 'Decimal' &&
        currentTypeName != 'Double')
      ) {
        String errorText =
          ((wf == WhereFrom.INPUT) ? 'Input' : 'Options') +
          ' parameter ' +
          key +
          ' should be of type ' +
          currentTypeName +
          ' vs. ' +
          typeName;

        setError(errorText);
        throw new TypeException(errorText);
      }
    }

    return untyped;
  }

  protected void init(Map<String, Object> args) {
    input = (Map<String, Object>) args.get('input');
    output = (Map<String, Object>) args.get('output');
    options = (Map<String, Object>) args.get('options');

    if (output == null) {
      throw new ArgsException('Output is null');
    }
  }

  public class TypeException extends Exception {
  }

  public class ArgsException extends Exception {
  }
}
