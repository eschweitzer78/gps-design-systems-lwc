@SuppressWarnings('PMD.ApexCRUDViolation')
public without sharing class SfGpsDsAuVic2EmailTemplateController {
  public class SfGpsDsAuVic2EmailTemplate {
    @AuraEnabled
    public String subject;
    @AuraEnabled
    public String body;
  }

  @AuraEnabled(cacheable=true)
  public static SfGpsDsAuVic2EmailTemplate getTemplateByDevName(
    String developerName
  ) {
    /* We do not check for CRUD as it's system access */

    try {
      List<EmailTemplate> tmplList = [
        SELECT Id, Name, TemplateType, Subject, Body, HtmlValue
        FROM EmailTemplate
        WHERE DeveloperName = :developerName AND IsActive = TRUE
        LIMIT 1
      ];

      if (tmplList.size() > 0) {
        EmailTemplate tmpl = tmplList[0];

        SfGpsDsAuVic2EmailTemplate rv = new SfGpsDsAuVic2EmailTemplate();
        rv.subject = tmpl.Subject;

        switch on tmpl.TemplateType {
          when 'html' {
            rv.body = tmpl.HtmlValue;
          }
          when 'text' {
            rv.body = tmpl.Body;
          }
          when 'custom' {
            rv.body = tmpl.HtmlValue;
          }
          when else {
            rv = null;
          }
        }

        return rv;
      }

      return null;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
