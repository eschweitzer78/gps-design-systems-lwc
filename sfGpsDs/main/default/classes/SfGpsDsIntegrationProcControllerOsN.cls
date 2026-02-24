/* Deploy only if Omnistudio Managed Package is installed (rename SfGpsDsIntegrationProcController) */
public with sharing class SfGpsDsIntegrationProcControllerOsN {
  @AuraEnabled(cacheable=false)
  public static Object runIntegrationProcedure(
    String ipName,
    Map<String, Object> input,
    Map<String, Object> options
  ) {
    try {
      return omnistudio.IntegrationProcedureService.runIntegrationService(
        ipName,
        input != null ? input : new Map<String, Object>(),
        options != null ? options : new Map<String, Object>()
      );
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
