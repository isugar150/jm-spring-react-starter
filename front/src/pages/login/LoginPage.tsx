import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
  Switch,
} from "@radix-ui/themes";
import { LogIn } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import { getApiErrorMessage } from "@/lib/api";
import { useLoginMutation } from "@/lib/auth";
import { useAuthStore } from "@/stores/authStore";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "로그인 아이디를 입력해주세요.")
    .refine(
      (value) => /^\S+@\S+\.\S+$/.test(value) || value.trim().length >= 5,
      "이메일 형식이 아니면 5자 이상 아이디를 입력하세요.",
    ),
  password: z
    .string()
    .min(1, "비밀번호는 필수입니다.")
    .min(8, "8자 이상 입력하세요."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const savedEmail =
    typeof window !== "undefined"
      ? (localStorage.getItem("login_remember_email") ?? "")
      : "";
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [rememberId, setRememberId] = useState(() => Boolean(savedEmail));
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: savedEmail, password: "" },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormValues) => {
    setSubmitError(null);
    try {
      await loginMutation.mutateAsync({
        username: data.email,
        password: data.password,
      });
      if (rememberId) {
        localStorage.setItem("login_remember_email", data.email);
      } else {
        localStorage.removeItem("login_remember_email");
      }
      navigate("/home", { replace: true });
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
    }
  };

  const isSubmitting = form.formState.isSubmitting || loginMutation.isPending;
  const isFormDisabled = isSubmitting;

  return (
    <Box
      style={{
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <Flex align="center" justify="center" style={{ minHeight: "100vh" }}>
        <Card
          style={{
            width: "100%",
            maxWidth: 440,
            margin: "24px",
            boxShadow:
              "0 30px 80px rgba(2, 6, 23, 0.18), 0 10px 30px rgba(2, 6, 23, 0.12)",
            border: "1px solid var(--gray-a6)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Flex direction="column" gap="5" p="6">
            <Flex align="start" justify="between" gap="4">
              <Box>
                <Heading as="h1" size="6">
                  환영합니다
                </Heading>
                <Text as="p" size="2" color="gray">
                  이메일과 비밀번호로 로그인하세요.
                </Text>
              </Box>
              <ModeToggle />
            </Flex>

            <Box asChild>
              <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                <Flex direction="column" gap="4">
                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Flex direction="column" gap="2">
                        <Text
                          as="label"
                          htmlFor="login-email"
                          size="2"
                          weight="medium"
                        >
                          로그인 아이디
                        </Text>

                        <TextField.Root
                          {...field}
                          id="login-email"
                          type="text"
                          autoComplete="username"
                          placeholder="로그인 아이디"
                          size="3"
                          aria-invalid={fieldState.invalid || undefined}
                          disabled={isFormDisabled}
                        />

                        {fieldState.error?.message && (
                          <Text as="p" size="2" color="red">
                            {fieldState.error.message}
                          </Text>
                        )}
                      </Flex>
                    )}
                  />

                  <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Flex direction="column" gap="2">
                        <Text
                          as="label"
                          htmlFor="login-password"
                          size="2"
                          weight="medium"
                        >
                          비밀번호
                        </Text>

                        <TextField.Root
                          {...field}
                          id="login-password"
                          type="password"
                          autoComplete="current-password"
                          placeholder="8자 이상 입력"
                          size="3"
                          aria-invalid={fieldState.invalid || undefined}
                          disabled={isFormDisabled}
                        />

                        {fieldState.error?.message && (
                          <Text as="p" size="2" color="red">
                            {fieldState.error.message}
                          </Text>
                        )}
                      </Flex>
                    )}
                  />

                  <Flex align="center" justify="end" gap="2">
                    <Switch
                      id="login-remember-id"
                      checked={rememberId}
                      onCheckedChange={setRememberId}
                      disabled={isFormDisabled}
                    />
                    <Text
                      as="label"
                      htmlFor="login-remember-id"
                      size="2"
                      color="gray"
                    >
                      아이디 저장
                    </Text>
                  </Flex>

                  {submitError && (
                    <Text as="p" size="2" color="red">
                      {submitError}
                    </Text>
                  )}

                  <Button
                    type="submit"
                    size="3"
                    disabled={isFormDisabled}
                    style={{ width: "100%" }}
                  >
                    <Flex align="center" justify="center" gap="2">
                      <LogIn size={18} />
                      {isSubmitting ? "로그인 중..." : "로그인"}
                    </Flex>
                  </Button>
                </Flex>
              </form>
            </Box>
          </Flex>
        </Card>
      </Flex>
    </Box>
  );
}
