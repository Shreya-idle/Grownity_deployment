import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">About Community Connect</h1>
              <p className="text-lg text-muted-foreground">
                Building bridges between communities across India
              </p>
            </div>

            <div className="space-y-8">
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Community Connect was founded with a simple yet powerful mission: to make it easy for
                  people across India to discover and connect with communities that match their interests
                  and passions. We believe that strong communities are the foundation of growth, learning,
                  and innovation.
                </p>
              </Card>

              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-4">What We Do</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We provide a comprehensive platform that brings together community organizers and members:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Help people discover communities in their city or domain of interest</li>
                  <li>• Provide tools for organizers to manage their communities effectively</li>
                  <li>• Aggregate events from various communities in one place</li>
                  <li>• Enable meaningful connections between like-minded individuals</li>
                </ul>
              </Card>

              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Have questions or want to learn more? We'd love to hear from you.
                </p>
                <Button size="lg" data-testid="button-contact">
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Us
                </Button>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
