import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CircleAlert } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "./ui/loader";

export function SignupForm(props) {
  const {
    username,
    password,
    setUsername,
    setPassword,
    show,
    setShow,
    handleRegister,
    err,
    setErr,
    loading,
  } = props;
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your username below to signup your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Username</Label>
            <Input
              id="email"
              placeholder="name"
              required
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErr("");
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type={show ? "text" : "password"}
              required
              placeholder="67890"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErr("");
              }}
            />
            <div className="flex items-center gap-2">
              <Input
                id="show"
                type="checkbox"
                checked={show}
                onChange={() => setShow((prev) => !prev)}
                className="w-4 h-fit m-0"
              />
              <Label htmlFor="show">Show Password</Label>
            </div>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <Button type="submit" className="w-full" onClick={handleRegister}>
              Sign up
            </Button>
          )}
          {err.length > 0 && (
            <div className="flex items-center gap-2 text-red-600">
              <CircleAlert />
              <p>{err}</p>
            </div>
          )}
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
