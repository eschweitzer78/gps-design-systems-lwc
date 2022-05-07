/* Current status: DEV */

global with sharing
class SfGpsDsPassthroughORA
implements Callable {
  global Object call(String action, map<String, Object> args) {
    switch on action {
      when 'PassRecords' {
        passRecords((Map<String, Object>) args.get('input'), (Map<String, Object>) args.get('output'), (Map<String, Object>) args.get('options'));
        return args;
      }

      when else {
        throw new MalformedCallException('Method not implemented');
      }
    }
  }

  @AuraEnabled(cacheable=true)
  public static Map<String, Object> passRecords(Map<String, Object> inputMap, Map<String, Object> outputMap, Map<String, Object> options) {
    outputMap.putAll(inputMap);
    return outputMap;
  }

  public class MalformedCallException extends Exception {}
}
