import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { setUser } from "../../features/auth/authSlice";
import { useProfileQuery, useUpdateProfileMutation } from "../../services/api";
import { useAppDispatch } from "../../store/hooks";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfileSettings() {
  const { data: profile } = useProfileQuery();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const dispatch = useAppDispatch();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        bio: profile.bio || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (values: ProfileForm) => {
    const formData = new FormData();
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("email", values.email);
    formData.append("bio", values.bio || "");
    if (avatar) formData.append("avatar", avatar);

    try {
      const updated = await updateProfile(formData).unwrap();
      dispatch(setUser(updated));
      toast.success("Profile updated");
    } catch {
      toast.error("Unable to update profile");
    }
  };

  return (
    <section className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Profile Settings</h1>
        <p className="mt-1 text-sm text-stone-500">
          Update your public reader profile and account email.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900"
      >
        <label className="mb-6 flex w-fit cursor-pointer items-center gap-4">
          <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
            {profile?.avatar ? (
              <img
                src={profile.avatar}
                alt="Profile avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <Camera className="h-7 w-7 text-stone-500" />
            )}
          </div>
          <div>
            <p className="font-semibold">Profile Picture</p>
            <p className="text-sm text-stone-500">
              Upload a JPG or PNG avatar.
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => setAvatar(event.target.files?.[0] || null)}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          {(["firstName", "lastName", "email"] as const).map((field) => (
            <label
              key={field}
              className="block text-sm font-semibold text-stone-700 dark:text-stone-200"
            >
              {field === "firstName"
                ? "First Name"
                : field === "lastName"
                  ? "Last Name"
                  : "Email"}
              <input
                type={field === "email" ? "email" : "text"}
                {...register(field)}
                className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-3 outline-none focus:border-amber-600 dark:border-stone-700 dark:bg-stone-950"
              />
              {errors[field] && (
                <span className="mt-1 block text-sm text-red-600">
                  {errors[field]?.message}
                </span>
              )}
            </label>
          ))}
        </div>

        <label className="mt-4 block text-sm font-semibold text-stone-700 dark:text-stone-200">
          Bio
          <textarea
            rows={5}
            {...register("bio")}
            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-3 outline-none focus:border-amber-600 dark:border-stone-700 dark:bg-stone-950"
          />
          {errors.bio && (
            <span className="mt-1 block text-sm text-red-600">
              {errors.bio.message}
            </span>
          )}
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 rounded-md bg-amber-700 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-60"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </section>
  );
}
