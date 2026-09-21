import { Module } from "@medusajs/framework/utils"
import CustomizationsModuleService from "./service"

export const CUSTOMIZATIONS_MODULE = "customizations"

export default Module(CUSTOMIZATIONS_MODULE, {
  service: CustomizationsModuleService,
})
