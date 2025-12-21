interface Props {
  isLogin: boolean;
}

export default function AuthHeader({ isLogin }: Props) {
  return (
    <div className="bg-linear-to-r from-amber-500 to-orange-500 p-8 text-white">
      <h1 className="text-3xl font-bold text-center">
        {isLogin ? "Welcome Back" : "Create Account"}
      </h1>
      <p className="text-center text-amber-100 mt-2">
        {isLogin ? "Sign in to continue" : "Sign up to get started"}
      </p>
    </div>
  );
}
