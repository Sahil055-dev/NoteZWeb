import Header from "../Header/Header";
import ThemeToggle from "../Components/ThemeToggler";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Shield,
  BookOpen,
  Search,
  Upload,
  GraduationCap,
  CheckCircle2,
  Filter,
  Award,
} from "lucide-react";
import { Users } from "lucide-react";
import Logo from "../Components/Logo";

export default function LandingPage() {
  return (
    <>
      <div className=" min-h-screen bg-background flex flex-col text-foreground">
        <Header></Header>
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block px-4 py-2 bg-primary/20 rounded-full mb-4">
              <span className="text-sm font-semibold text-secondary">
                Mumbai University & Beyond
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
              Share & Access
              <span className="block bg-secondary bg-clip-text text-transparent">
                Quality University Notes
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of students contributing and accessing
              mentor-verified notes. Navigate by university, field, year,
              subject, and topic with ease.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <Button
                size="lg"
                className="bg-primary hover:opacity-90 font-semibold text-lg h-14 px-8 shadow-glow"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/20 hover:bg-primary-hover/10 hover:border-none font-semibold text-lg h-14 px-8 border-2"
              >
                Browse Notes
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  What is NoteZ?
                </h2>
                <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full"></div>
              </div>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
                <p className="text-center text-lg leading-relaxed">
                  NoteZ is a collaborative platform designed exclusively for
                  university students to share, access, and contribute
                  high-quality study materials. Starting with
                  <span className="font-semibold text-foreground">
                    {" "}
                    Mumbai University
                  </span>
                  , we're building a comprehensive repository of
                  syllabus-aligned notes verified by experienced mentors.
                </p>
                <div className="grid md:grid-cols-3 gap-6 mt-12">
                  <Card className="p-6 text-center border-2 border-secondary/10 hover:border-primary/50 transition-all hover:shadow-glow">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">
                      Student-Driven
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      By students, for students. Everyone can contribute and
                      benefit.
                    </p>
                  </Card>
                  <Card className="p-6 text-center border-2 border-secondary/10 hover:border-primary/50 transition-all hover:shadow-glow">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">
                      Mentor-Verified
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      All notes reviewed by experienced teachers before
                      publishing.
                    </p>
                  </Card>
                  <Card className="p-6 text-center border-2 border-secondary/10 hover:border-primary/50 transition-all hover:shadow-glow">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">
                      Syllabus-Aligned
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Organized precisely by curriculum structure and topics.
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Simple, streamlined process for both contributors and learners
              </p>
            </div>
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Upload Flow */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
                    <Upload className="w-6 h-6 text-secondary mr-2" />
                    For Contributors
                  </h3>
                  {[
                    {
                      step: "1",
                      title: "Select University",
                      desc: "Choose your university from our growing list",
                    },
                    {
                      step: "2",
                      title: "Choose Field & Year",
                      desc: "Pick your field of study and current year",
                    },
                    {
                      step: "3",
                      title: "Pick Subject & Topic",
                      desc: "Navigate to the specific topic you want to contribute to",
                    },
                    {
                      step: "4",
                      title: "Upload Notes",
                      desc: "Share your quality notes with fellow students",
                    },
                    {
                      step: "5",
                      title: "Mentor Review",
                      desc: "Expert mentors verify your content for accuracy",
                    },
                    {
                      step: "6",
                      title: "Go Live",
                      desc: "Approved notes appear under the respective topic",
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start group">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary-foreground shrink-0 group-hover:scale-110 transition-transform">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Access Flow */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
                    <Search className="w-6 h-6 text-secondary mr-2" />
                    For Learners
                  </h3>
                  {[
                    {
                      step: "1",
                      title: "Select University",
                      desc: "Start by choosing your university",
                    },
                    {
                      step: "2",
                      title: "Navigate Structure",
                      desc: "Field → Year → Subject → Topic",
                    },
                    {
                      step: "3",
                      title: "Browse Notes",
                      desc: "View all verified notes for your topic",
                    },
                    {
                      step: "4",
                      title: "Filter & Search",
                      desc: "Find exactly what you need quickly",
                    },
                    {
                      step: "5",
                      title: "Access Content",
                      desc: "Download or view notes instantly",
                    },
                    {
                      step: "6",
                      title: "Excel Together",
                      desc: "Use quality materials to ace your exams",
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start group">
                      <div className="w-10 h-10 rounded-full bg-primary/60 flex items-center justify-center font-bold text-secondary-foreground shrink-0 group-hover:scale-110 transition-transform">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-foreground text-background py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Why Choose NoteZ?
              </h2>
              <p className="text-xl text-background/80 max-w-2xl mx-auto">
                Powerful features designed to enhance your learning experience
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: GraduationCap,
                  title: "University-Specific Content",
                  desc: "Tailored precisely for Mumbai University syllabus with plans to expand to more universities",
                },
                {
                  icon: CheckCircle2,
                  title: "Quality Assurance",
                  desc: "Every note reviewed and approved by experienced mentors and inspecting teachers",
                },
                {
                  icon: Filter,
                  title: "Smart Navigation",
                  desc: "Intuitive hierarchy: University → Field → Year → Subject → Topic for precise content discovery",
                },
                {
                  icon: Upload,
                  title: "Easy Contribution",
                  desc: "Simple upload process that encourages peer-to-peer knowledge sharing",
                },
                {
                  icon: Search,
                  title: "Quick Search & Filtering",
                  desc: "Find exactly what you need with powerful search and filter capabilities",
                },
                {
                  icon: Award,
                  title: "Peer-Reviewed Excellence",
                  desc: "Community-driven quality where the best content rises to the top",
                },
              ].map((feature, idx) => (
                <Card
                  key={idx}
                  className="px-6 py-4 bg-background border-secondary/50 hover:shadow-glow transition-all hover:-translate-y-1 border-2"
                >
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-2">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Why Contribute Your Notes?
                </h2>
                <p className="text-xl text-muted-foreground">
                  Be part of a growing community making education accessible
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Help Fellow Students",
                    desc: "Your notes can help hundreds of students excel in their studies",
                    emoji: "🤝",
                  },
                  {
                    title: "Build Your Reputation",
                    desc: "Become a recognized contributor in the academic community",
                    emoji: "⭐",
                  },
                  {
                    title: "Reinforce Your Learning",
                    desc: "Teaching others is the best way to solidify your own understanding",
                    emoji: "🧠",
                  },
                  {
                    title: "Access More Content",
                    desc: "Active contributors get priority access to premium materials",
                    emoji: "🔓",
                  },
                ].map((benefit, idx) => (
                  <Card
                    key={idx}
                    className="p-6 border-secondary/10 hover:shadow-glow transition-all hover:-translate-y-1 border-2"
                  >
                    <div className="text-4xl mb-3">{benefit.emoji}</div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground">{benefit.desc}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-primary py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground dark:text-background/90 mb-6">
              Ready to Excel Together?
            </h2>
            <p className="text-xl text-foreground/90 dark:text-background/90 max-w-2xl mx-auto mb-8">
              Join community of students already benefiting from quality,
              verified notes
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="bg-foreground dark:bg-background text-background dark:text-foreground hover:bg-foreground/90 hover:text-primary dark:hover:bg-amber-950/90 dark:hover:text-amber-500 font-semibold text-lg h-14 px-8"
              >
                Sign Up Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="font-semibold text-lg h-14 px-8 border-2 border-primary-foreground text-primary-foreground hover:bg-primary-hover dark:bg-foreground dark:text-background hover:text-primary-hover"
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black text-white  py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <Logo size="medium" invert={true} />
              </div>
              <div className="text-center md:text-right text-secondary">
                <p>
                  © 2025 NoteZ. Empowering students through shared knowledge.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
