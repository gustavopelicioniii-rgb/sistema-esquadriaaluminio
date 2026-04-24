export { goldProfiles } from "./gold";
export { supremaProfiles } from "./suprema";
export { aluprimeProfiles } from "./aluprime";
export { decaProfiles } from "./deca";
export { tamizziProfiles } from "./tamizzi";
export { aluvidProfiles } from "./aluvid";
export { glasterProfiles } from "./glaster";

import { goldProfiles } from "./gold";
import { supremaProfiles } from "./suprema";
import { aluprimeProfiles } from "./aluprime";
import { decaProfiles } from "./deca";
import { tamizziProfiles } from "./tamizzi";
import { aluvidProfiles } from "./aluvid";
import { glasterProfiles } from "./glaster";
import type { SupplierProfile } from "../types";

export const allSupplierProfiles: SupplierProfile[] = [
  ...goldProfiles,
  ...supremaProfiles,
  ...aluprimeProfiles,
  ...decaProfiles,
  ...tamizziProfiles,
  ...aluvidProfiles,
  ...glasterProfiles,
];
