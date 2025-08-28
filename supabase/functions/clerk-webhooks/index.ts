// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import { createClient } from 'npm:@supabase/supabase-js'
import { verifyWebhook } from 'npm:@clerk/backend/webhooks'

Deno.serve(async (req) => {
  const webhookSecret = Deno.env.get('CLERK_WEBHOOK_SECRET')
  if (!webhookSecret) {
    return new Response('Webhook secret not configured', { status: 500 })
  }

  let event
  try {
    event = await verifyWebhook(req, { signingSecret: webhookSecret })
  } catch (err) {
    console.error('Webhook verification failed:', err)
    return new Response('Invalid signature', { status: 400 })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response('Supabase credentials not configured', { status: 500 })
  }
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    switch (event.type) {
      case 'user.created':
      case 'user.updated': {
        const { data: user, error } = await supabase
          .from('users')
          .upsert({
            id: event.data.id,
            email: event.data.email_addresses?.[0]?.email_address ?? null,
            first_name: event.data.first_name ?? null,
            last_name: event.data.last_name ?? null,
            avatar_url: event.data.image_url ?? null,
            updated_at: new Date(event.data.updated_at).toISOString(),
            created_at: new Date(event.data.created_at).toISOString(),
          })
          .select()
          .single()

        if (error) throw error
        return new Response(JSON.stringify({ user }), { status: 200 })
      }

      case 'user.deleted': {
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', event.data.id)

        if (error) throw error
        return new Response(JSON.stringify({ success: true }), { status: 200 })
      }

      case 'organization.created':
      case 'organization.updated': {
        const { data, error } = await supabase
          .from('organizations')
          .upsert({
            id: event.data.id,
            name: event.data.name,
            updated_at: new Date(event.data.updated_at).toISOString(),
            created_at: new Date(event.data.created_at).toISOString(),
          })
          .select()
          .single()

        if (error) throw error
        return new Response(JSON.stringify({ data }), { status: 200 })
      }

      case 'organizationMembership.created':
      case 'organizationMembership.updated': {
        const { data, error } = await supabase
          .from('members')
          .upsert({
            id: event.data.id,
            user_id: event.data.public_user_data?.user_id ?? null,
            organization_id: event.data.organization?.id ?? null,
            updated_at: new Date(event.data.updated_at).toISOString(),
            created_at: new Date(event.data.created_at).toISOString(),
          })
          .select()
          .single()

        if (error) throw error
        return new Response(JSON.stringify({ data }), { status: 200 })
      }

      default: {
        console.log('Unhandled event type:', event.type)
        return new Response(JSON.stringify({ success: true }), { status: 200 })
      }
    }
  } catch (err) {
    console.error('Error handling webhook:', err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})


/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/clerk-webhooks' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
