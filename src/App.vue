<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Users, BarChart3, Zap, Shield, ArrowRight, Star } from 'lucide-react'
// import Link from "next/link"
// import Image from "next/Image"
</script>

<template>
<!-- export default function WelcomePage() {
  return ( -->
    <div className="flex flex-col min-h-screen">
      <!-- {/* Header */} -->
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <CheckCircle className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-bold">TaskFlow</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#about">
            About
          </Link>
        </nav>
        <div className="ml-4 flex gap-2">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button size="sm">
            Get Started
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <!-- {/* Hero Section */} -->
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge variant="secondary" className="w-fit">
                    ✨ New: AI-powered task suggestions
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Organize Your Work,{" "}
                    <span className="text-primary">Amplify Your Impact</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    The modern task management system that helps teams stay focused, organized, and productive. 
                    From simple to-dos to complex project workflows.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="h-12 px-8">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="lg" className="h-12 px-8">
                    Watch Demo
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">4.9/5</span>
                  </div>
                  <span>•</span>
                  <span>10,000+ teams trust TaskFlow</span>
                  <span>•</span>
                  <span>No credit card required</span>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  alt="Task Management Dashboard"
                  className="aspect-video overflow-hidden rounded-xl object-cover shadow-2xl"
                  height="400"
                  src="/modern-task-dashboard.png"
                  width="600"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- {/* Features Section */} -->
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary">Features</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Everything you need to stay productive
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Powerful features designed to help individuals and teams manage tasks, 
                  collaborate effectively, and achieve their goals.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-8">
              <Card>
                <CardHeader>
                  <CheckCircle className="h-8 w-8 text-primary" />
                  <CardTitle>Smart Task Organization</CardTitle>
                  <CardDescription>
                    Organize tasks with projects, labels, priorities, and custom filters. 
                    Never lose track of what matters most.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 text-primary" />
                  <CardTitle>Team Collaboration</CardTitle>
                  <CardDescription>
                    Assign tasks, share projects, and communicate with your team. 
                    Real-time updates keep everyone in sync.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Clock className="h-8 w-8 text-primary" />
                  <CardTitle>Time Tracking</CardTitle>
                  <CardDescription>
                    Built-in time tracking and reporting. Understand where your time goes 
                    and optimize your productivity.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <BarChart3 className="h-8 w-8 text-primary" />
                  <CardTitle>Analytics & Insights</CardTitle>
                  <CardDescription>
                    Detailed analytics on productivity, team performance, and project progress. 
                    Make data-driven decisions.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Zap className="h-8 w-8 text-primary" />
                  <CardTitle>Automation</CardTitle>
                  <CardDescription>
                    Automate repetitive tasks with custom rules and templates. 
                    Focus on what matters, not busy work.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Shield className="h-8 w-8 text-primary" />
                  <CardTitle>Enterprise Security</CardTitle>
                  <CardDescription>
                    Bank-level security with SSO, 2FA, and compliance certifications. 
                    Your data is always protected.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <!-- {/* Social Proof */} -->
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Trusted by teams worldwide
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From startups to Fortune 500 companies, teams choose TaskFlow to get things done.
                </p>
              </div>
              <div className="grid w-full grid-cols-2 lg:grid-cols-5 items-center justify-center gap-8 lg:gap-12 [&>img]:mx-auto opacity-60">
                <Image
                  src="/generic-company-logo.png"
                  width="120"
                  height="60"
                  alt="Company Logo"
                  className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                />
                <Image
                  src="/abstract-tech-logo.png"
                  width="120"
                  height="60"
                  alt="Company Logo"
                  className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                />
                <Image
                  src="/abstract-startup-logo.png"
                  width="120"
                  height="60"
                  alt="Company Logo"
                  className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                />
                <Image
                  src="/abstract-enterprise-logo.png"
                  width="120"
                  height="60"
                  alt="Company Logo"
                  className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                />
                <Image
                  src="/abstract-business-logo.png"
                  width="120"
                  height="60"
                  alt="Company Logo"
                  className="aspect-[2/1] col-span-2 lg:col-span-1 overflow-hidden rounded-lg object-contain object-center"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- {/* CTA Section */} -->
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to transform your productivity?
                </h2>
                <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of teams who have already made the switch to TaskFlow. 
                  Start your free trial today.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex gap-2">
                  <Input
                    className="max-w-lg flex-1 bg-primary-foreground text-primary"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button type="submit" variant="secondary">
                    Get Started
                  </Button>
                </form>
                <p className="text-xs text-primary-foreground/60">
                  Start your 14-day free trial. No credit card required.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- {/* Footer */} -->
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © 2024 TaskFlow. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy Policy
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  <!-- )
} -->

</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
