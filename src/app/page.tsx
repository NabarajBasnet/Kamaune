import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShieldIcon } from "lucide-react"

export default function AccessRestricted() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center bg-gray-800 border border-gray-700">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-6 bg-red-100/10 rounded-full flex items-center justify-center">
          <ShieldIcon className="w-8 h-8 text-red-500" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-2">
          Access Restricted
        </h1>

        {/* Description */}
        <p className="text-gray-400 mb-6">
          Please log in to access this page
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
            <Link href="/login">Login to Continue</Link>
          </Button>
          <p className="text-gray-400 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-emerald-400 hover:underline font-medium"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
