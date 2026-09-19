import ProductModule from "@medusajs/medusa/product";
import CustomisationModule from "../modules/customisation";
import { defineLink } from "@medusajs/framework/utils";

export default defineLink(
  ProductModule.linkable.product,
  {
    linkable: CustomisationModule.linkable.customisationGroup,
    isList: true,
  }
);
