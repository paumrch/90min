import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section>
      <Card className="border-none shadow-none">
        <CardHeader className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center">
            90Minutes
          </h1>
          <CardDescription className="text-lg md:text-xl text-center max-w-3xl mx-auto">
            Unlock the power of precision. Where data meets passion and every
            prediction matters. Your winning streak begins here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-16">
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" className="text-base">
                <Link href="/matches">View predictions</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base" asChild>
                <Link href="https://t.me/ninetyminutesxyz">
                  Go to Telegram
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-lg md:text-xl text-center text-muted-foreground">
              Specialists in the World&apos;s Best Leagues
            </p>
            <div className="flex flex-wrap justify-center mx-auto space-x-4 sm:space-x-8 items-center">
              <Image
                src="/LALIGA_EA_SPORTS_h_RGB_monocromatico_negativo.png"
                alt="La Liga"
                width={120}
                height={30}
                quality={100}
                className="w-24 h-auto"
              />
              <Image
                src="/LALIGA_HYPERMOTION_RGB_h_monocromatico_negativo.png"
                alt="La Liga 2"
                width={288}
                height={35}
                quality={100}
                className="w-72 h-auto"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Separator className="mt-16" />
    </section>
  );
};

export default Hero;
