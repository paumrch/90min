import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

const Hero = () => {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="space-y-6">
        <CardTitle asChild>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-center">
            90Minutes
          </h1>
        </CardTitle>
        <CardDescription className="text-lg md:text-xl text-center max-w-3xl mx-auto">
          Unlock the Power of Precision: Where Data Meets Passion, and Every
          Prediction Counts. Your Winning Streak Starts Here!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-16">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" className="text-base">View predictions</Button>
            <Button size="lg" variant="outline" className="text-base">
              Go to Telegram <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-4 overflow-hidden">
                {[1, 2, 3, 4].map((i) => (
                  <Avatar
                    key={i}
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-background"
                  >
                    <AvatarImage src={`/avatar${i}.png`} alt={`User ${i}`} />
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <Badge variant="secondary" className="px-2 py-1 text-sm flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                <span className="font-semibold">Verified Odds</span>
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">
              Rated excellent in over 7.5k predictions.
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-lg md:text-xl text-center text-muted-foreground">
            Specialists in the World&apos;s Best Leagues
          </p>
          <div className="flex justify-center space-x-8">
            <div className="w-24 h-24 flex items-center justify-center">
              <Image
                src="/LALIGA_EA_SPORTS_h_RGB_monocromatico_negativo.png"
                alt="La Liga"
                width={96}
                height={96}
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className="w-72 h-24 flex items-center justify-center">
              <Image
                src="/LALIGA_HYPERMOTION_RGB_h_monocromatico_negativo.png"
                alt="La Liga 2"
                width={288}
                height={96}
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <Separator className="mt-8" />
    </Card>
  );
};

export default Hero;