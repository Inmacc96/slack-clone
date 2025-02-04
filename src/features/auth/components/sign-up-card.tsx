import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthState } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";

interface SignUpCardProps {
  setAuthState: (state: AuthState) => void;
}
type SignUpData = { email: string; password: string; confirmPassword: string };

const SignUpCard: React.FC<SignUpCardProps> = ({ setAuthState }) => {
  const { signIn } = useAuthActions();
  const [data, setData] = useState<SignUpData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key: keyof SignUpData, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    const { password, confirmPassword } = data;
    if (password.length < 8) {
      return { message: "Password must be at least 8 characters" };
    }
    if (password !== confirmPassword) {
      return { message: "Passwords do not match" };
    }
    return {};
  };

  const onPasswordSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.message) {
      setError(errors.message);
      return;
    }

    setIsPending(true);
    try {
      const { email, password } = data;
      await signIn("password", { email, password, flow: "signUp" });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  const onProviderSignUp = async (value: "github" | "google") => {
    setIsPending(true);
    await signIn(value);
    setIsPending(false);
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Sign up to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {!!error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5" onSubmit={onPasswordSignUp}>
          <Input
            disabled={isPending}
            value={data.email}
            onChange={(e) => {
              handleChange("email", e.target.value);
            }}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            disabled={isPending}
            value={data.password}
            onChange={(e) => {
              handleChange("password", e.target.value);
            }}
            placeholder="Password"
            type="password"
            required
          />
          <Input
            disabled={isPending}
            value={data.confirmPassword}
            onChange={(e) => {
              handleChange("confirmPassword", e.target.value);
            }}
            placeholder="Confirm password"
            type="password"
            required
          />
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isPending}
          >
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={isPending}
            onClick={() => {
              onProviderSignUp("google");
            }}
            variant="outline"
            size="lg"
            className="w-full relative"
          >
            <FcGoogle className="size-5 absolute top-3 left-3" />
            Continue with Google
          </Button>
          <Button
            disabled={isPending}
            onClick={() => {
              onProviderSignUp("github");
            }}
            variant="outline"
            size="lg"
            className="w-full relative"
          >
            <FaGithub className="size-5 absolute top-3 left-3" />
            Continue with GitHub
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => setAuthState("signIn")}
          >
            Sign in
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignUpCard;
