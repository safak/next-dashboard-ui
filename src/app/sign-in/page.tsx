"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  GraduationCap,
  Users,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

export default function LoginPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const role = user.publicMetadata?.role as string | undefined;

    router.replace(role ? `/${role}` : "/dashboard");
  }, [isLoaded, isSignedIn, user, router]);

  if (isLoaded && isSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#E4E7F2] via-[#F0EEF7] to-[#FFF1DC]">
        <div className="flex flex-col items-center gap-4 text-[#4B517D]">
          <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#4B517D]/20 border-t-[#F59A23]" />
          <p className="text-sm font-medium text-[#4B517D]">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#E4E7F2] via-[#F0EEF7] to-[#FFF1DC]">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#4B517D]/20 border-t-[#F59A23]" />
      </div>
    );
  }

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br
      from-[#E4E7F2] via-[#F0EEF7] to-[#FFF1DC] p-5"
    >
      {/* Background Blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#4B517D]/12 blur-[120px]" />

        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-[#F59A23]/15 blur-[140px]" />

        <div className="absolute right-24 top-20 h-72 w-72 rounded-full bg-[#555B86]/10 blur-[120px]" />
      </div>

      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-[34px] bg-white/70 backdrop-blur-3xl
      border border-white/10 shadow-[0_25px_70px_rgba(75,81,125,0.16)] grid lg:grid-cols-2"
      >
        {/* LEFT SIDE */}

        <div
          className="hidden lg:flex relative overflow-hidden
        bg-gradient-to-br from-[#4B517D] via-[#555B86] to-[#626991] p-14 text-white"
        >
          {/* Decorations */}

          <div className="absolute inset-0">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

            <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-[#F59A23]/12 blur-3xl" />

            <div className="absolute top-1/2 right-16 h-40 w-40 rounded-full border border-white/10" />

            <div className="absolute bottom-24 left-24 h-28 w-28 rounded-full border border-white/10" />
          </div>

          {/* Back Button */}

          <Link
            href="/"
            className="absolute left-8 top-8 z-20 flex h-10 w-10 items-center justify-center
            rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 transition hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="relative z-10 flex flex-col justify-between h-full w-full">
            {/* TOP */}

            <div>
              <div className="mt-10 flex justify-center">
                <Image
                  src="/TSLogo.png"
                  alt="True Sunshine"
                  width={180}
                  height={180}
                  className="object-contain drop-shadow-2xl"
                />
              </div>

              <div className="mt-4 text-center">
                {/* <h1 className="text-3xl font-bold tracking-tight">
                  True Sunshine
                </h1> */}

                <p className="mt-1 text-lg font-medium text-[#FFF1DC]">
                  School Management System
                </p>

                <p className="mx-auto mt-2 max-w-md text-xs leading-4 text-white/85">
                  Secure, modern and centralized platform for managing students,
                  teachers, academics, attendance, admissions, finance and
                  school operations from a single dashboard.
                </p>
              </div>
            </div>

            {/* Core Modules */}

            <div className="mt-4">
              <h3 className="text-center text-base font-semibold text-white">
                Our Core Modules
              </h3>

              <div className="mt-4 grid grid-cols-4 gap-6">
                <div className="flex flex-col items-center text-center group">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4B517D]
                  backdrop-blur-md border border-white/20 transition-all duration-300 group-hover:scale-110
                  group-hover:bg-white/20"
                  >
                    <GraduationCap className="h-4 w-4 text-[#F59A23]" />
                  </div>

                  <p className="mt-2 text-sm font-semibold">Academics</p>
                </div>

                <div className="flex flex-col items-center text-center group">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4B517D]
                  backdrop-blur-md border border-white/20 transition-all duration-300 group-hover:scale-110
                  group-hover:bg-white/20"
                  >
                    <Users className="h-4 w-4 text-[#F59A23]" />
                  </div>

                  <p className="mt-2 text-sm font-semibold">Administration</p>
                </div>

                <div className="flex flex-col items-center text-center group">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4B517D]
                  backdrop-blur-md border border-white/20 transition-all duration-300 group-hover:scale-110
                  group-hover:bg-white/20"
                  >
                    <BookOpen className="h-4 w-4 text-[#F59A23]" />
                  </div>

                  <p className="mt-2 text-sm font-semibold">Learning</p>
                </div>

                <div className="flex flex-col items-center text-center group">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4B517D]
                  backdrop-blur-md border border-white/20 transition-all duration-300 group-hover:scale-110
                  group-hover:bg-white/20"
                  >
                    <ShieldCheck className="h-4 w-4 text-[#F59A23]" />
                  </div>

                  <p className="mt-2 text-sm font-semibold">Security</p>
                </div>
              </div>
            </div>

            {/* Bottom */}

            <div
              className="mt-4 flex items-center justify-between rounded-3xl
            bg-white/10 border border-white/15 p-14 backdrop-blur-xl px-8 py-4"
            >
              <div>
                <p className="text-xl font-bold">150+</p>

                <span className="text-sm text-white/80">Students</span>
              </div>

              <div>
                <p className="text-xl font-bold">15+</p>

                <span className="text-sm text-white/80">Teachers</span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#F59A23]" />

                  <span className="font-semibold">Secure</span>
                </div>

                <p className="mt-2 text-sm text-white/80">
                  Trusted School Platform
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE STARTS HERE */}
        <div className="relative flex items-center justify-center bg-[#FFFDF8] px-8 py-2 lg:px-16">
          {/* Mobile Back Button */}

          <Link
            href="/"
            className="absolute left-6 top-8 flex h-11 w-11 items-center justify-center rounded-2xl
            border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 lg:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="w-full max-w-md">
            {/* Logo */}

            <div className="flex flex-col items-center">
              <div
                className="mt-2 flex h-20 w-20 items-center justify-center rounded-full
              bg-gradient-to-br from-[#FFF4E4] to-[#EEF0FA] shadow-[0_8px_25px_rgba(75,81,125,0.12)]
              ring-4 ring-[#F59A23]/15"
              >
                <Image
                  src="/TSLogo.png"
                  alt="True Sunshine"
                  width={56}
                  height={56}
                  className="object-contain"
                />
              </div>

              <h2 className="mt-4 text-xl font-bold tracking-tight text-[#4B517D]">
                Welcome Back
              </h2>

              <p className="mt-1 text-center text-xs text-slate-500">
                Sign in to your account.
              </p>
            </div>

            {/* Clerk */}

            <div className="mt-6">
              <SignIn.Root>
                <SignIn.Step name="start" className="space-y-4">
                  {/* Global Error */}

                  <Clerk.GlobalError
                    className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3
                  text-sm text-red-600"
                  />

                  {/* Username */}

                  <Clerk.Field name="identifier">
                    <Clerk.Label className="mb-2 block text-sm font-semibold text-slate-700">
                      Username or Email
                    </Clerk.Label>

                    <div className="relative">
                      <div
                        className="absolute left-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center
                      justify-center rounded-full bg-[#FFF4E4]"
                      >
                        <Mail className="h-4 w-4 text-[#F59A23]" />
                      </div>

                      <Clerk.Input
                        required
                        autoComplete="username"
                        placeholder="Enter your username or email"
                        className="h-10 w-full rounded-2xl border-2 border-slate-200 bg-white pl-16 pr-5
                         text-[15px] transition-all focus:border-[#F59A23] focus:outline-none
                         focus:ring-4 focus:ring-[#F59A23]/15"
                      />
                    </div>

                    <Clerk.FieldError className="mt-2 text-xs text-red-500" />
                  </Clerk.Field>

                  {/* Password */}

                  <Clerk.Field name="password">
                    <Clerk.Label className="mb-2 block text-sm font-semibold text-slate-700">
                      Password
                    </Clerk.Label>

                    <div className="relative">
                      <div
                        className="absolute left-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center
                      justify-center rounded-full bg-[#EEF0FA]"
                      >
                        <Lock className="h-4 w-4 text-[#4B517D]" />
                      </div>

                      <Clerk.Input
                        required
                        autoComplete="current-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="h-10 w-full rounded-2xl border-2 border-slate-200 bg-white pl-16 pr-14
                        text-[15px] transition-all focus:border-[#4B517D] focus:outline-none focus:ring-4
                        focus:ring-[#4B517D]/10"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#4B517D]"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    <Clerk.FieldError className="mt-2 text-xs text-red-500" />
                  </Clerk.Field>

                  {/* Forgot */}

                  <div className="flex justify-end -mt-1">
                    <SignIn.Action
                      navigate="forgot-password"
                      className="text-xs font-semibold text-[#F59A23] transition hover:text-[#4B517D]"
                    >
                      Forgot Password?
                    </SignIn.Action>
                  </div>

                  {/* Login */}

                  <SignIn.Action
                    submit
                    className="flex h-10 w-full items-center justify-center rounded-2xl
                    bg-gradient-to-r from-[#4B517D] to-[#F59A23] text-base font-semibold text-white
                    shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
                  >
                    <Clerk.Loading>
                      {(loading) =>
                        loading ? (
                          <span
                            className="h-5 w-5 animate-spin rounded-full border-2 border-white
                          border-t-transparent"
                          />
                        ) : (
                          <span className="flex items-center gap-2">
                            Login
                            <span>→</span>
                          </span>
                        )
                      }
                    </Clerk.Loading>
                  </SignIn.Action>
                </SignIn.Step>
              </SignIn.Root>
            </div>

            {/* Divider */}

            <div className="my-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            {/* Footer */}

            <div className="space-y-2 text-center">
              <p className="font-medium text-slate-600 text-sm">
                &quot;A Traditional Way of Learning&quot;
              </p>

              <p className="text-xs text-slate-400">
                © 2024 True Sunshine Powered by
                <span className="ml-1 font-semibold text-[#4B517D]">
                  ASquare Technologies
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
