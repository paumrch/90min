import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQs = () => {
  const faqsData = [
    {
      question: "What is 90Minutes?",
      answer:
        "90Minutes is an AI-powered football prediction platform that offers detailed analysis and accurate odds to help you make informed decisions in your sports betting.",
    },
    {
      question: "How does the prediction system work?",
      answer:
        "Our system uses advanced machine learning algorithms that analyze large amounts of historical data, team and player statistics, and factors such as recent performance and match conditions to generate accurate predictions.",
    },
    {
      question: "Which leagues and competitions does 90Minutes cover?",
      answer:
        "90Minutes specializes in the world's top leagues, including La Liga, Premier League, Serie A, Bundesliga, and Ligue 1, as well as major competitions like the Champions League and Europa League.",
    },
    {
      question: "How often are predictions updated?",
      answer:
        "Our predictions are updated in real-time, taking into account the latest events, injuries, suspensions, and other factors that may influence the match outcome.",
    },
    {
      question: "Can I access 90Minutes from my mobile device?",
      answer:
        "Yes, 90Minutes is optimized for mobile devices. You can access all our features through your mobile browser or via our dedicated app available for iOS and Android.",
    },
    {
      question: "Do you offer any guarantee on the predictions?",
      answer:
        "While our system has a high accuracy rate, it's important to remember that sports betting always carries a risk. We recommend using our predictions as a tool for making informed decisions, but we cannot guarantee specific outcomes.",
    },
    {
      question: "How can I start using 90Minutes?",
      answer:
        "To get started, simply sign up on our platform through our website or join our Telegram channel. Once registered, you'll have immediate access to our predictions and analysis.",
    },
    {
      question: "Do you offer customer support?",
      answer:
        "Yes, we offer 24/7 customer support. You can contact us through our live chat, email, or via our Telegram channel for any questions or assistance you might need.",
    },
  ];

  return (
    <section>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <Accordion
          type="single"
          collapsible
          className="w-full max-w-3xl mx-auto"
        >
          {faqsData.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQs;
