declare module "@salesforce/apex/sfGpsDsIntegrationProcController.runIntegrationProcedure" {
  export default function runIntegrationProcedure({
    ipName: string,
    input: object,
    options: object
  }): Promise<any>;
}