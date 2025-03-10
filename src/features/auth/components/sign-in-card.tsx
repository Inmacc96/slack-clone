import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { TriangleAlert } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { AuthState } from "../types";

interface SignInCardProps {
  setAuthState: (state: AuthState) => void;
}

type SignInData = { email: string; password: string };

const SignInCard: React.FC<SignInCardProps> = ({ setAuthState }) => {
  const { signIn } = useAuthActions();
  const [data, setData] = useState<SignInData>({ email: "", password: "" });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key: keyof SignInData, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const onPasswordSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    try {
      await signIn("password", { ...data, flow: "signIn" });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setIsPending(false);
    }
  };

  const onProviderSignIn = async (value: "github" | "google") => {
    setIsPending(true);
    await signIn(value);
    setIsPending(false);
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
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
        <form className="space-y-2.5" onSubmit={onPasswordSignIn}>
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
              onProviderSignIn("google");
            }}
            variant="outline"
            size="lg"
            className="w-full relative font-bold"
          >
            <FcGoogle className="size-5 absolute top-3 left-3" />
            Continue with Google
          </Button>
          <Button
            disabled={isPending}
            onClick={() => {
              onProviderSignIn("github");
            }}
            variant="outline"
            size="lg"
            className="w-full relative font-bold"
          >
            <FaGithub className="size-5 absolute top-3 left-3" />
            Continue with GitHub
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => setAuthState("signUp")}
          >
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignInCard;
