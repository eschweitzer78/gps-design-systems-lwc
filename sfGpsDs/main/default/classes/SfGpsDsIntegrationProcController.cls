/* Works only if Omnistudio Standard Runtime is enabled */
public with sharing class SfGpsDsIntegrationProcController {
  @AuraEnabled(cacheable=false)
  public static Object runIntegrationProcedure(
    String ipName,
    Map<String, Object> input,
    Map<String, Object> options
  ) {
    try {
      ConnectAPI.IntegrationProcedureServiceRunInputRepresentation apexInput = new ConnectAPI.IntegrationProcedureServiceRunInputRepresentation();

      List<String> stringList = new List<String>();
      String serializedInput = JSON.serialize(
        input != null ? input : new Map<String, Object>()
      );
      stringList.add(serializedInput);
      apexInput.input = stringList;

      ConnectAPI.IntegrationProcedureServiceRunOptionsRepresentation apexOptions = new ConnectAPI.IntegrationProcedureServiceRunOptionsRepresentation();
      Map<String, Object> optionsMap = options != null
        ? options
        : new Map<String, Object>();

      for (String key : optionsMap.keySet()) {
        switch on key {
          when 'isDebug' {
            apexOptions.isDebug = (Boolean) optionsMap.get(key);
          }
          when 'chainable' {
            apexOptions.chainable = (Boolean) optionsMap.get(key);
          }
          when 'resetCache' {
            apexOptions.resetCache = (Boolean) optionsMap.get(key);
          }
          when 'ignoreCache' {
            apexOptions.ignoreCache = (Boolean) optionsMap.get(key);
          }
          when 'queueableChainable' {
            apexOptions.queueableChainable = (Boolean) optionsMap.get(key);
          }
          when 'useQueueableApexRemoting' {
            apexOptions.useQueueableApexRemoting = (Boolean) optionsMap.get(
              key
            );
          }
          when 'vlcApexResponse' {
            apexOptions.vlcApexResponse = (Boolean) optionsMap.get(key);
          }
          when 'useFuture' {
            apexOptions.useFuture = (Boolean) optionsMap.get(key);
          }
          when 'useQueueable' {
            apexOptions.useQueueable = (Boolean) optionsMap.get(key);
          }
          when 'vlcIPData' {
            apexOptions.vlcIPData = (String) optionsMap.get(key);
          }
          when 'vlcStatus' {
            apexOptions.vlcStatus = (String) optionsMap.get(key);
          }
          when 'vlcMessage' {
            apexOptions.vlcMessage = (String) optionsMap.get(key);
          }
        }
      }
      apexOptions.shouldSendLegacyResponse = true;
      apexInput.options = apexOptions;

      ConnectAPI.IntegrationProcedureServiceRunOutputRepresentation output = ConnectAPI.OmniDesignerConnect.integrationProcedureExecute(
        ipName,
        apexInput
      );

      List<String> responseList = output.response;
      String currentSerResponse = responseList[0];
      Map<String, Object> currentResponseObj = (Map<String, Object>) JSON.deserializeUntyped(
        currentSerResponse
      );

      return currentResponseObj.get('result');
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
