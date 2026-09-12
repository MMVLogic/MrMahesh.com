import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

serve(async (req) => {
  const signature = req.headers.get("Stripe-Signature");

  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret) {
    return new Response("Webhook secret not configured", { status: 500 });
  }

  try {
    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider
    );

    // Initialize Supabase admin client to bypass RLS for inserting records
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log(`Processing event: ${event.type}`);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // We pass the user's Supabase ID in the client_reference_id
      const userId = session.client_reference_id;
      
      if (!userId) {
        console.warn("No client_reference_id found in session. Cannot map to user.");
        return new Response("OK - No User ID mapped", { status: 200 });
      }

      // Determine what app they bought based on metadata or product ID
      // For now, we assume 'openfit' or 'pro_bundle' is passed in session.metadata.app_id
      // Setup Stripe Payment Links to include metadata: {"app_id": "openfit"}
      const appId = session.metadata?.app_id || "openfit"; 

      const { error } = await supabase
        .from("user_entitlements")
        .upsert({
          user_id: userId,
          app_id: appId,
          status: "active",
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string | null,
        }, { onConflict: 'user_id, app_id' });

      if (error) {
        console.error("Error inserting entitlement:", error);
        return new Response("Database error", { status: 500 });
      }
      
      console.log(`Successfully granted ${appId} access to user ${userId}`);
    }

    if (event.type === "customer.subscription.deleted" || event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      const status = subscription.status; // 'active', 'canceled', 'past_due'
      
      // Update entitlement status
      await supabase
        .from("user_entitlements")
        .update({ status: status === 'active' ? 'active' : 'canceled' })
        .eq('stripe_subscription_id', subscription.id);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
});
