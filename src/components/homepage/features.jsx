import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Shield, Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <Card className="h-full">
    <CardHeader className="flex flex-row items-center space-x-4">
      <Icon className="h-8 w-8 text-primary" />
      <CardTitle className="text-xl">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-justify">{description}</p>
    </CardContent>
  </Card>
);

const Features = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "AI-Powered Predictions",
      description:
        "Leverage cutting-edge algorithms for unparalleled accuracy in football predictions.",
    },
    {
      icon: Target,
      title: "Precision Targeting",
      description:
        "Focus on high-probability outcomes to maximize your betting success rate.",
    },
    {
      icon: Shield,
      title: "Risk Management",
      description:
        "Implement smart staking strategies to protect and grow your bankroll.",
    },
    {
      icon: Zap,
      title: "Real-Time Insights",
      description: "Stay ahead with instant updates and live match analysis.",
    },
  ];

  return (
    <section>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">
          Unlock Your Betting Potential
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Harness the power of data-driven predictions and expert insights to
          elevate your football betting game.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
        <CallToAction />
      </div>
      <Separator className="mt-16" />
    </section>
  );
};

const CallToAction = () => (
  <div className="mt-16 flex flex-col items-center -space-y-2">
    <AvatarGroup />
    <Link href="https://t.me/ninetyminutesxyz" passHref>
      <Badge
        variant="secondary"
        className="text-lg px-4 py-2"
      >
        Join 10,000+ winning bettors today!
      </Badge>
    </Link>
  </div>
);

const AvatarGroup = () => {
  const avatars = [1, 2, 3, 4];

  return (
    <div className="flex -space-x-4 overflow-hidden">
      {avatars.map((i) => (
        <Avatar
          key={i}
          className="inline-block h-10 w-10 rounded-full ring-2 ring-background"
        >
          <AvatarImage src={`/avatar${i}.png`} alt={`User ${i}`} />
          <AvatarFallback>U{i}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
};

export default Features;