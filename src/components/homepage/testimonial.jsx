import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const TestimonialCard = ({ name, avatar, country, content }) => (
  <Card className="flex flex-col h-full">
    <CardHeader className="flex flex-row items-center gap-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <div>
        <CardTitle className="text-lg">{name}</CardTitle>
        <p className="text-sm text-muted-foreground">{country}</p>
      </div>
    </CardHeader>
    <CardContent className="flex-grow">
      <p>&ldquo;{content}&rdquo;</p>
    </CardContent>
  </Card>
);

const Testimonials = () => {
  const testimonials = [
    {
      name: "Giovanni Rossi",
      avatar: "/avatar1.png",
      country: "Italy",
      content:
        "90Minutes ha rivoluzionato il mio approccio alle scommesse sul calcio. Le loro previsioni sono incredibilmente accurate e hanno notevolmente aumentato i miei profitti.",
    },
    {
      name: "Marcus Holtmann",
      avatar: "/avatar2.png",
      country: "Germany",
      content:
        "Mit 90Minutes habe ich meine Wettstrategien auf ein neues Level gehoben. Die datengesteuerten Prognosen sind präzise und haben meine Erfolgsquote deutlich verbessert.",
    },
    {
      name: "Pierre Dubois",
      avatar: "/avatar3.png",
      country: "France",
      content:
        "Grâce à 90Minutes, j'ai transformé ma passion pour le football en une source de revenus fiable. Leurs prédictions sont un véritable atout pour tout parieur sérieux.",
    },
    {
      name: "João Silva",
      avatar: "/avatar4.png",
      country: "Portugal",
      content:
        "90Minutes superou todas as minhas expectativas. As suas análises profundas e previsões precisas permitiram-me aumentar significativamente os meus ganhos nas apostas.",
    },
    {
      name: "Luuk van der Berg",
      avatar: "/avatar5.png",
      country: "Netherlands",
      content:
        "90Minutes heeft mijn kijk op voetbalweddenschappen compleet veranderd. Hun voorspellingen zijn verbazingwekkend nauwkeurig en hebben mijn succes aanzienlijk vergroot.",
    },
    {
      name: "Erik Andersson",
      avatar: "/avatar6.png",
      country: "Sweden",
      content:
        "Tack vare 90Minutes har jag kunnat förvandla mitt intresse för fotboll till en lönsam sysselsättning. Deras prognoser är otroligt träffsäkra och har ökat min vinstfrekvens markant.",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">
          What Our Users Say
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Join thousands of satisfied users who have transformed their betting
          experience with 90Minutes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
      <Separator className="mt-16" />
    </section>
  );
};

export default Testimonials;
