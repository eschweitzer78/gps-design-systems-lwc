import { OmniscriptHttpSoapNcApexActionUtil } from "./omniscriptHttpSoapNcApexActionUtil";
import { OmniscriptHttpWebActionUtil } from "./omniscriptHttpWebActionUtil";

export class OmniscriptHttpActionUtil {
  constructor(element) {
    if (element) {
      if (element.propSetMap.type === "Web") {
        return new OmniscriptHttpWebActionUtil(element);
      }

      return new OmniscriptHttpSoapNcApexActionUtil(element);
    }
  }
}
