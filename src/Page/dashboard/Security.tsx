import { zodResolver } from "@hookform/resolvers/zod";
import { Monitor, Shield, Smartphone } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { logout } from "../../features/auth/authSlice";
import { useChangePasswordMutation } from "../../services/api";
import { useAppDispatch } from "../../store/hooks";
import { passwordSchema } from "../../Auth/validation";

const securitySchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SecurityForm = z.infer<typeof securitySchema>;

export default function Security() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const dispatch = useAppDispatch();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<SecurityForm>({
    resolver: zodResolver(securitySchema),
  });

  const onSubmit = async (values: SecurityForm) => {
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();
      reset();
      toast.success("Password changed");
    } catch {
      toast.error("Unable to change password");
    }
  };

  const logoutAll = () => {
    dispatch(logout());
    toast.success("Logged out from all devices");
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold sm:text-3xl">Security</h1>
          <p className="mt-1 text-sm text-stone-500">
            Manage password, optional two-factor authentication, and sessions.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900"
        >
          <h2 className="font-bold">Change Password</h2>
          {(["currentPassword", "newPassword", "confirmPassword"] as const).map(
            (field) => (
              <label
                key={field}
                className="mt-4 block text-sm font-semibold text-stone-700 dark:text-stone-200"
              >
                {field === "currentPassword"
                  ? "Current Password"
                  : field === "newPassword"
                    ? "New Password"
                    : "Confirm Password"}
                <input
                  type="password"
                  {...register(field)}
                  className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-3 outline-none focus:border-amber-600 dark:border-stone-700 dark:bg-stone-950"
                />
                {errors[field] && (
                  <span className="mt-1 block text-sm text-red-600">
                    {errors[field]?.message}
                  </span>
                )}
              </label>
            ),
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 rounded-md bg-amber-700 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-60"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      <aside className="space-y-4">
        <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-amber-700" />
            <h2 className="font-bold">Two-Factor Authentication</h2>
          </div>
          <p className="mt-3 text-sm text-stone-500">
            Add an authenticator app challenge before new devices can sign in.
          </p>
          <label className="mt-4 flex items-center justify-between rounded-md bg-stone-50 p-3 text-sm font-semibold dark:bg-stone-950">
            Enable 2FA
            <input type="checkbox" className="h-5 w-5" />
          </label>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <h2 className="font-bold">Active Sessions</h2>
          <div className="mt-4 space-y-3">
            {[
              { label: "Current browser", icon: Monitor },
              { label: "Mobile reader app", icon: Smartphone },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-md bg-stone-50 p-3 dark:bg-stone-950"
              >
                <Icon className="h-5 w-5 text-stone-500" />
                <div>
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="text-xs text-stone-500">Active recently</p>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={logoutAll}
            className="mt-4 w-full rounded-md border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
          >
            Logout From All Devices
          </button>
        </div>
      </aside>
    </section>
  );
}
