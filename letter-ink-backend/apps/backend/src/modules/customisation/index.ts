import { Module } from "@medusajs/framework/utils"
import CustomisationModuleService from "./service"

export const CUSTOMISATION_MODULE = "customisation"

export default Module(CUSTOMISATION_MODULE, {
  service: CustomisationModuleService,
})
