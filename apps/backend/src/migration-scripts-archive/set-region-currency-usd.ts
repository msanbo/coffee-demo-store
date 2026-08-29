import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { updateRegionsWorkflow } from "@medusajs/medusa/core-flows";

/**
 * The store was switched to USD-only, so the existing region's currency
 * needs to match - otherwise products with only USD prices show no price
 * at all in that region.
 */
export default async function set_region_currency_usd({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code"],
  });

  for (const region of regions) {
    if (region.currency_code !== "usd") {
      logger.info(
        `Updating region "${region.name}" currency from ${region.currency_code} to usd...`
      );
      await updateRegionsWorkflow(container).run({
        input: {
          selector: { id: region.id },
          update: { currency_code: "usd" },
        },
      });
    }
  }
  logger.info("Finished updating region currencies.");
}
