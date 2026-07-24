"use client";
import { saveToken } from "@/lib/auth";
import { getToken } from "@/lib/auth";
import { API_URL } from "@/lib/api";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";




export function LoginForm({
    
  className,
  ...props
}: React.ComponentProps<"div">) 



{
    const router = useRouter();
    const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setLoading(true);

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!res.ok) {
      throw new Error("Sai tài khoản hoặc mật khẩu");
    }

    const data = await res.json();

  saveToken(data.access_token);

   router.push("/dashboard");
  } catch (error) {
    console.error(error);
    alert("Đăng nhập thất bại");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login dashboard</CardTitle>
          <CardDescription>
           Sign in to manage your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Username</FieldLabel>
                <Input
                  id="username"
                  value={username}
                   onChange={(e) =>
                        setUsername(e.target.value)
                        }
                        placeholder="username"
                  required
                />
              </Field>
                        <Field>
            <FieldLabel htmlFor="password">
                Password
            </FieldLabel>

            <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) =>
                setPassword(e.target.value)
                }
                required
            />
            </Field>
              <Field>
               <Button
                    type="submit"
                    disabled={loading}
                    className="w-full"
                    >
                    {loading ? "Signing in..." : "Login"}
                    </Button>
              
              
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
