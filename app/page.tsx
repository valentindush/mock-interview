import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="w-full px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="hidden font-bold sm:inline-block">MockInterview</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="">
        <section className="w-full py-12 ">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Prepare for Your Next Interview
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Practice with our AI-powered interview simulator and get real-time feedback to improve your skills.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Choose Interview Type</CardTitle>
                    <CardDescription>Select the type of interview you want to practice for</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <Link href="/interview?type=software-engineer">
                      <Button className="w-full cursor-pointer" variant="outline">
                        Software Engineer
                      </Button>
                    </Link>
                    <Link href="/interview?type=data-scientist">
                      <Button className="w-full cursor-pointer" variant="outline">
                        Data Scientist
                      </Button>
                    </Link>
                    <Link href="/interview?type=product-manager">
                      <Button className="w-full cursor-pointer" variant="outline">
                        Product Manager
                      </Button>
                    </Link>
                    <Link href="/interview?type=ux-designer">
                      <Button className="w-full cursor-pointer" variant="outline">
                        UX Designer
                      </Button>
                    </Link>
                  </CardContent>
                  <CardFooter>
                    <p className="text-xs text-muted-foreground">
                      Your responses will be analyzed to provide personalized feedback
                    </p>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}