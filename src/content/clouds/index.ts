import type { CloudSlug } from "../site";
import type { CloudContent } from "../types";
import { aws } from "./aws";
import { azure } from "./azure";
import { googleCloud } from "./google-cloud";
import { jiocloud } from "./jiocloud";
import { oci } from "./oci";

export const cloudContent: Record<CloudSlug, CloudContent> = {
  aws,
  azure,
  "google-cloud": googleCloud,
  jiocloud,
  oci,
};
