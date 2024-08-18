import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star } from 'lucide-react';

const TestimonialCard = ({ name, location, content, rating }) => (
  <Card className="h-full">
    <CardContent className="pt-6">
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
        ))}
      </div>
      <p className="mb-4 text-gray-600">{content}</p>
      <div className="font-semibold">{name}</div>
      <div className="text-sm text-gray-500">{location}</div>
    </CardContent>
  </Card>
);

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Carlos Rodríguez",
      location: "Madrid, España",
      content: "Gracias a los pronósticos de esta plataforma, he mejorado significativamente mis resultados en apuestas deportivas. Su análisis detallado y precisión son incomparables.",
      rating: 5
    },
    {
      name: "Laura Martínez",
      location: "Barcelona, España",
      content: "Como aficionada al deporte, esta herramienta me ha ayudado a entender mejor las probabilidades y a tomar decisiones más informadas. ¡Altamente recomendado!",
      rating: 4
    },
    {
      name: "Javier Sánchez",
      location: "Sevilla, España",
      content: "He probado muchas plataformas de pronósticos, pero esta es sin duda la mejor. Las actualizaciones en tiempo real y el análisis profundo marcan la diferencia.",
      rating: 5
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Lo que dicen nuestros usuarios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;