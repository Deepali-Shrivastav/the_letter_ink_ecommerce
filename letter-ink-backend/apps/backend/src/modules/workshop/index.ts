import WorkshopModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const WORKSHOP_MODULE = "workshopModuleService"

export default Module(WORKSHOP_MODULE, {
  service: WorkshopModuleService,
})
