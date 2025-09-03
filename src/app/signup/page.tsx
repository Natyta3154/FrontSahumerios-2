import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="relative flex items-center justify-center min-h-[calc(100vh-14rem)] py-12">
      <Image
        src="https://picsum.photos/1920/1080"
        alt="Aromatherapy background"
        data-ai-hint="zen background"
        fill
        className="object-cover absolute inset-0 z-0"
      />
      <div className="absolute inset-0 bg-background/80 z-10" />
      <Card className="w-full max-w-sm z-20">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Sign Up</CardTitle>
          <CardDescription>Enter your information to create an account.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="John Doe" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input id="confirm-password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </CardContent>
        <CardFooter className="text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline ml-1">
              Login
            </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
