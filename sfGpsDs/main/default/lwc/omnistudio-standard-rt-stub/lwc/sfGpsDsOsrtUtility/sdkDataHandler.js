import { getSDKInstance } from "./getSdkInstance";
import { DatasourceInputTypes } from "./datasourceInputTypes";

export default function sdkDataHandler(data, context) {
  data = JSON.parse(data);
  return getSDKInstance(data, context)
    .then((sdkInstance) => {
      switch (data.type) {
        case DatasourceInputTypes.APEXREMOTE:
          return sdkInstance
            .apexRemote(
              sdkInstance.apexRemoteInput({
                className: data.value.className,
                methodName: data.value.methodName,
                inputMap: data.value.inputMap
              })
            )
            .execute();
        case DatasourceInputTypes.APEXREST:
          return sdkInstance
            .apexRest(
              sdkInstance.apexRestInput({
                method: data.value.methodType,
                options: data.value.headers,
                body: data.value.payload,
                path: data.value.endpoint
              })
            )
            .execute();
        case DatasourceInputTypes.DATARAPTOR:
          return sdkInstance
            .dataRaptor(sdkInstance.dataRaptorInput(data.value))
            .execute();
        case DatasourceInputTypes.INTEGRATIONPROCEDURE:
          return sdkInstance
            .integrationProcedure(
              sdkInstance.integrationProcedureInput({
                procedureKey: "",
                input: data.value.inputmap,
                optionsMap: data.value.optionsmap,
                methodName: data.value.ipMethod
              })
            )
            .execute();
        case DatasourceInputTypes.SOQL:
          return sdkInstance.soql(sdkInstance.soqlInput(data.value)).execute();
        case DatasourceInputTypes.SOSL:
          return sdkInstance.sosl(sdkInstance.soslInput(data.value)).execute();

        default:
          throw new Error(`Unknown datsource type ${data.type}`);
      }
    })
    .catch((e) => {
      throw new Error(`Error:`, e);
    });
}
