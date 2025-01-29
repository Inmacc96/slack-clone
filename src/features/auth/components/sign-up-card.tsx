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

interface SignUpCardProps {
  setAuthState: (state: AuthState) => void;
}
type SignUpData = { email: string; password: string; confirmPassword: string };

const SignUpCard: React.FC<SignUpCardProps> = ({ setAuthState }) => {
  const [data, setData] = useState<SignUpData>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (key: keyof SignUpData, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };
  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Sign up to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5">
          <Input
            disabled={false}
            value={data.email}
            onChange={(e) => {
              handleChange("email", e.target.value);
            }}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            disabled={false}
            value={data.password}
            onChange={(e) => {
              handleChange("password", e.target.value);
            }}
            placeholder="Password"
            type="password"
            required
          />
          <Input
            disabled={false}
            value={data.confirmPassword}
            onChange={(e) => {
              handleChange("confirmPassword", e.target.value);
            }}
            placeholder="Confirm password"
            type="password"
            required
          />
          <Button type="submit" className="w-full" size="lg" disabled={false}>
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={false}
            onClick={() => {}}
            variant="outline"
            size="lg"
            className="w-full relative"
          >
            <FcGoogle className="size-5 absolute top-3 left-3" />
            Continue with Google
          </Button>
          <Button
            disabled={false}
            onClick={() => {}}
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
