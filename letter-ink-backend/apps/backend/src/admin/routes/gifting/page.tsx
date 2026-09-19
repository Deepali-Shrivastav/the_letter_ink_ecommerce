import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button } from "@medusajs/ui"
import { Gift } from "@medusajs/icons"
import { Link } from "react-router-dom"

const GiftingAdminPage = () => {
  return (
    <Container className="p-8">
      <Heading level="h1" className="mb-2">
        Gifting Module
      </Heading>
      <Text className="text-ui-fg-subtle mb-8">
        Manage bespoke hampers and occasion gifts.
      </Text>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-ui-border-base rounded-lg p-6 flex flex-col items-start">
          <div className="bg-ui-bg-base border border-ui-border-base w-10 h-10 rounded-md flex items-center justify-center mb-4">
            <Gift />
          </div>
          <Heading level="h2" className="mb-1">
            Bespoke Hampers
          </Heading>
          <Text className="text-ui-fg-subtle mb-6 flex-grow">
            Manage hand-assembled hampers, trunks, and chests. Items added here appear directly in the Hamper section of the frontend gifting page.
          </Text>
          <Link to="/gifting/hamper">
            <Button variant="secondary">Manage Hampers</Button>
          </Link>
        </div>

        <div className="border border-ui-border-base rounded-lg p-6 flex flex-col items-start">
          <div className="bg-ui-bg-base border border-ui-border-base w-10 h-10 rounded-md flex items-center justify-center mb-4">
            <Gift />
          </div>
          <Heading level="h2" className="mb-1">
            Occasion Gifts
          </Heading>
          <Text className="text-ui-fg-subtle mb-6 flex-grow">
            Manage gifts categorized by occasion (e.g., Birthday, Wedding). Organize categories and add gifts to specific occasions.
          </Text>
          <Link to="/gifting/occasion">
            <Button variant="secondary">Manage Occasions</Button>
          </Link>
        </div>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Gifting",
  icon: Gift,
})

export default GiftingAdminPage
