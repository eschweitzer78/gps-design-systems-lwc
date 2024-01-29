global class SfGpsDsEncodingOF implements Callable {
  public void setError(Map<String, Object> output, String errorCode) {
    // TODO: deal with error handling
    //output.put('error', 'KO');
    //output.put('errorCode', errorCode);
  }

  /*
      inputs - arguments - List<Object> of passed in arguments
      output - result - The result of the Function being called. Supports single Object values, List<Object> or Map<String, Object>
  */
  public Object call(String action, Map<String, Object> args) {
    Map<String, Object> input = (Map<String, Object>) args.get('input');
    Map<String, Object> output = (Map<String, Object>) args.get('output');
    Map<String, Object> options = (Map<String, Object>) args.get('options');

    Object argumentsObject = input.get('arguments');

    if (!(argumentsObject instanceof List<Object>) || argumentsObject == null) {
      setError(output, 'ARGLIST-001');
      return false;
    }

    List<Object> arguments = (List<Object>) argumentsObject;

    switch on action {
      when 'UrlEncode' {
        if (arguments.isEmpty()) {
          setError(output, 'ARGLIST-002');
          return false;
        }

        if (!(arguments[0] instanceof String)) {
          setError(output, 'ARGLIST-003');
          return false;
        }

        output.put(
          'result',
          EncodingUtil.urlEncode((String) arguments[0], 'UTF-8')
        );
        return true;
      }
      when 'UrlDecode' {
        if (arguments.isEmpty()) {
          setError(output, 'ARGLIST-002');
          return false;
        }

        if (!(arguments[0] instanceof String)) {
          setError(output, 'ARGLIST-003');
          return false;
        }

        output.put(
          'result',
          EncodingUtil.urlDecode((String) arguments[0], 'UTF-8')
        );
        return true;
      }
      when else {
        setError(output, 'ACTION-001');
        return false;
      }
    }
  }

  public class MalformedCallException extends Exception {
  }
}
