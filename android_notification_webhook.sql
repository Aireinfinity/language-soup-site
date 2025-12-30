-- Supabase Database Webhook for Android Signups
-- This will trigger whenever a new signup with device='Android' is inserted

-- Step 1: Create a webhook function that sends a notification
-- Go to Supabase Dashboard → Database → Functions → Create a new function

CREATE OR REPLACE FUNCTION notify_android_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger for Android signups
  IF NEW.device = 'Android' THEN
    -- Send notification via Supabase Edge Function or external webhook
    -- You'll need to set up an Edge Function or use a service like Zapier/Make
    PERFORM
      net.http_post(
        url := 'YOUR_WEBHOOK_URL_HERE',
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body := json_build_object(
          'name', NEW.name,
          'email', NEW.email,
          'languages', NEW.languages,
          'submitted_at', NEW.submitted_at
        )::text
      );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Create a trigger on the signups table
CREATE TRIGGER android_signup_notification
  AFTER INSERT ON signups
  FOR EACH ROW
  EXECUTE FUNCTION notify_android_signup();
