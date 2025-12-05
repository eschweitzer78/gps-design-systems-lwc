/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/* We currently do not support Short/Narrow Cards as they seem to be working quite differently when it comes to their interaction with the surrounding OmniscriptEditBlockWrapper, which cannot be extended/overriden */

import OmniscriptEditBlockWrapper from "omnistudio/omniscriptEditBlockWrapper";

export default class extends OmniscriptEditBlockWrapper {}
