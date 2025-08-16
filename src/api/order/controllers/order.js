"use strict";

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async customOrderController(ctx) {
    try {
      return { data: "ok" };
    } catch (e) {
      ctx.body(e);
    }
  },

  async create(ctx) {
    try {
      const { Products } = ctx.request.body;
      
      const lineItems = await Promise.all(Products.map(async (product) => {
        const image=product.image
        const productEntities=await strapi.entityService.findMany('api::product.product',{
          filters:{
            key:product.key
          }
        })
        const realProduct=productEntities[0]
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: realProduct.title,
              images:[image]
            },
            unit_amount: realProduct.price * 100,
          },

          quantity: product.quantity,
        };
      }));
      console.log(lineItems, "line Items");
      const session = await stripe.checkout.sessions.create({
        shipping_address_collection: {
          allowed_countries: ["IN"],
        },
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.CLIENT_BASE_URL}/payments/success`,
        cancel_url: `${process.env.CLIENT_BASE_URL}/payments/failed`,
      });

      const x = await strapi.entityService.create("api::order.order", {
        data: {
          Products,
          stripeId: session.id,
        },
      });

      return { stripeId: session.id };
    } catch (e) {
      console.log("error occured", e);
      ctx.response.status = 500;
      return e;
    }
  },
})); 