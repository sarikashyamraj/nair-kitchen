// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "npm:@supabase/server";

export default {
  fetch: withSupabase(
    { auth: "user" },
    async (req, ctx) => {
      try {
        if (req.method !== "POST") {
          return Response.json(
            {
              success: false,
              message: "Method not allowed.",
            },
            {
              status: 405,
              headers: {
                Allow: "POST",
              },
            }
          );
        }

        const userId = ctx.userClaims?.id;

        if (!userId) {
          console.error(
            "Authenticated user ID was not available.",
            ctx.userClaims
          );

          return Response.json(
            {
              success: false,
              message:
                "Unable to identify the authenticated user.",
            },
            {
              status: 401,
            }
          );
        }

        const { error } =
          await ctx.supabaseAdmin.auth.admin.deleteUser(
            userId,
            false
          );

        if (error) {
          console.error(
            "Account deletion failed:",
            error
          );

          return Response.json(
            {
              success: false,
              message:
                "We could not delete your account. Please try again.",
            },
            {
              status: 500,
            }
          );
        }

        return Response.json(
          {
            success: true,
            message:
              "Your account and associated data were deleted.",
          },
          {
            status: 200,
          }
        );
      } catch (error) {
        console.error(
          "Unexpected account deletion error:",
          error
        );

        return Response.json(
          {
            success: false,
            message:
              "An unexpected error occurred while deleting the account.",
          },
          {
            status: 500,
          }
        );
      }
    }
  ),
};