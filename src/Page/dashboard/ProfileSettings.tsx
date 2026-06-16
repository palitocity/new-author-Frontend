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
  const dispatch = useAppDispatch();

  const { data: profile, isLoading: profileLoading } = useProfileQuery();
  console.log("Profile data:", profile?.data?.firstName);

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [avatar, setAvatar] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.data.firstName || "",
        lastName: profile.data.lastName || "",
        email: profile.data.email || "",
        bio: profile.data.bio || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (values: ProfileForm) => {
    try {
      const formData = new FormData();

      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);

      if (values.bio) {
        formData.append("bio", values.bio);
      }

      if (avatar) {
        formData.append("avatar", avatar);
      }

      const updatedUser = await updateProfile(formData).unwrap();

      dispatch(setUser(updatedUser));

      toast.success("Profile updated successfully");

      setIsEditing(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(message);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        Loading profile...
      </div>
    );
  }

  return (
    <section className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="mt-1 text-sm text-stone-500">
          Manage your profile information.
        </p>
      </div>

      <div className="rounded-xl border border-stone-200 bg-black p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        {!isEditing ? (
          <>
            {/* HEADER */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="h-24 w-24 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                {profile?.data?.avatar ? (
                  <img
                    src={profile.data.avatar}
                    alt="avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Camera className="h-8 w-8 text-stone-500" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-semibold">
                  {profile?.data?.firstName} {profile?.data?.lastName}
                </h2>

                <p className="text-stone-500">{profile?.data?.email}</p>

                <div className="mt-2 flex flex-wrap gap-3 text-sm">
                  <span className="rounded-full bg-stone-100 px-3 py-1 dark:bg-stone-800">
                    {profile?.data?.role || "User"}
                  </span>

                  <span className="text-stone-500">
                    Joined{" "}
                    {profile?.data?.createdAt
                      ? new Date(profile.data.createdAt).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="rounded-md bg-amber-700 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-800"
              >
                Edit Profile
              </button>
            </div>

            {/* INFO */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm text-stone-500">First Name</p>
                <p className="mt-1 font-medium">
                  {profile?.data?.firstName || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-stone-500">Last Name</p>
                <p className="mt-1 font-medium">
                  {profile?.data?.lastName || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-stone-500">Email Address</p>
                <p className="mt-1 font-medium">
                  {profile?.data?.email || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-stone-500">Role</p>
                <p className="mt-1 font-medium capitalize">
                  {profile?.data?.role || "User"}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm text-stone-500">Bio</p>

              <p className="mt-2 leading-relaxed">
                {profile?.data?.bio || "No bio added yet."}
              </p>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* AVATAR */}
            <label className="mb-6 flex w-fit cursor-pointer items-center gap-4">
              <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                {profile?.data?.avatar ? (
                  <img
                    src={profile.data.avatar}
                    alt="avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Camera className="h-8 w-8 text-stone-500" />
                )}
              </div>

              <div>
                <p className="font-semibold">Profile Picture</p>
                <p className="text-sm text-stone-500">
                  Upload JPG, PNG or WEBP
                </p>
              </div>

              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => setAvatar(e.target.files?.[0] || null)}
              />
            </label>

            {/* INPUTS */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  First Name
                </label>

                <input
                  {...register("firstName")}
                  className="w-full rounded-md border border-stone-300 px-4 py-3 outline-none focus:border-amber-600 dark:border-stone-700 dark:bg-stone-950"
                />

                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Last Name
                </label>

                <input
                  {...register("lastName")}
                  className="w-full rounded-md border border-stone-300 px-4 py-3 outline-none focus:border-amber-600 dark:border-stone-700 dark:bg-stone-950"
                />

                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium">
                Email Address
              </label>

              <input
                type="email"
                {...register("email")}
                className="w-full rounded-md border border-stone-300 px-4 py-3 outline-none focus:border-amber-600 dark:border-stone-700 dark:bg-stone-950"
              />

              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium">Bio</label>

              <textarea
                rows={5}
                {...register("bio")}
                className="w-full rounded-md border border-stone-300 px-4 py-3 outline-none focus:border-amber-600 dark:border-stone-700 dark:bg-stone-950"
              />

              {errors.bio && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.bio.message}
                </p>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-md bg-amber-700 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);

                  reset({
                    firstName: profile?.data?.firstName || "",
                    lastName: profile?.data?.lastName || "",
                    email: profile?.data?.email || "",
                    bio: profile?.data?.bio || "",
                  });
                }}
                className="rounded-md border border-stone-300 px-5 py-3 text-sm font-semibold hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
