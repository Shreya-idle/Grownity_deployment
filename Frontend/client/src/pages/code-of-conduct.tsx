import { Shield, Mail, Phone, AlertTriangle, Users, Lock, FileText, Scale } from "lucide-react";

export default function CodeOfConduct() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg mb-6">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
            Code of Conduct
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Community Connect is dedicated to providing a harassment-free and inclusive experience for everyone.
          </p>
        </div>

        {/* Applicability */}
        <section className="mb-10 bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-6 w-6 text-orange-400" />
            <h2 className="text-2xl font-semibold">Applicability</h2>
          </div>
          <p className="text-gray-400 mb-4">This Code of Conduct applies to all Community Connect spaces, including:</p>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center gap-2">• Hackathons and coding events</li>
            <li className="flex items-center gap-2">• Talks, presentations, or demos</li>
            <li className="flex items-center gap-2">• Workshops and training sessions</li>
            <li className="flex items-center gap-2">• Parties and social events</li>
            <li className="flex items-center gap-2">• Social media channels and online communities</li>
          </ul>
        </section>

        {/* No Plagiarism */}
        <section className="mb-10 bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="h-6 w-6 text-blue-400" />
            <h2 className="text-2xl font-semibold">No Plagiarism or Re-using of Past Work</h2>
          </div>
          <p className="text-gray-400">
            All work submitted or presented must be original and created during the event timeframe (where applicable). 
            Re-using past projects or copying others' work is strictly prohibited.
          </p>
        </section>

        {/* No Discrimination */}
        <section className="mb-10 bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-6 w-6 text-green-400" />
            <h2 className="text-2xl font-semibold">No Discrimination</h2>
          </div>
          <p className="text-gray-400 mb-4">We do not tolerate discrimination based on:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-gray-300 text-sm">
            <span className="bg-white/5 rounded-lg px-3 py-2">Gender</span>
            <span className="bg-white/5 rounded-lg px-3 py-2">Gender Identity</span>
            <span className="bg-white/5 rounded-lg px-3 py-2">Age</span>
            <span className="bg-white/5 rounded-lg px-3 py-2">Sexual Orientation</span>
            <span className="bg-white/5 rounded-lg px-3 py-2">Disability</span>
            <span className="bg-white/5 rounded-lg px-3 py-2">Physical Appearance</span>
            <span className="bg-white/5 rounded-lg px-3 py-2">Race</span>
            <span className="bg-white/5 rounded-lg px-3 py-2">Ethnicity</span>
            <span className="bg-white/5 rounded-lg px-3 py-2">Nationality</span>
            <span className="bg-white/5 rounded-lg px-3 py-2">Religion</span>
            <span className="bg-white/5 rounded-lg px-3 py-2">Political Views</span>
            <span className="bg-white/5 rounded-lg px-3 py-2">Experience Level</span>
          </div>
        </section>

        {/* No Harassment */}
        <section className="mb-10 bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-400" />
            <h2 className="text-2xl font-semibold">No Harassment</h2>
          </div>
          <p className="text-gray-400">
            Harassment of any kind is not tolerated. This includes offensive comments, verbal threats, 
            deliberate intimidation, stalking, harassing photography or recording, sustained disruption 
            of talks or events, inappropriate physical contact, and unwelcome attention.
          </p>
        </section>

        {/* No Recording Without Consent */}
        <section className="mb-10 bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="h-6 w-6 text-purple-400" />
            <h2 className="text-2xl font-semibold">No Recording Without Consent</h2>
          </div>
          <p className="text-gray-400">
            Always ask for permission before recording or photographing other participants. 
            Respect others' privacy and personal boundaries.
          </p>
        </section>

        {/* Safe Space */}
        <section className="mb-10 bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-cyan-400" />
            <h2 className="text-2xl font-semibold">Creation of a Safe Space</h2>
          </div>
          <p className="text-gray-400">
            We are committed to creating a safe and welcoming environment for all participants. 
            Everyone should feel comfortable to express their ideas, ask questions, and participate fully.
          </p>
        </section>

        {/* Intellectual Property */}
        <section className="mb-10 bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="h-6 w-6 text-yellow-400" />
            <h2 className="text-2xl font-semibold">Intellectual Property</h2>
          </div>
          <p className="text-gray-400">
            Respect intellectual property rights. Do not use copyrighted materials without permission. 
            All participants retain ownership of their original work created during events.
          </p>
        </section>

        {/* Consequences */}
        <section className="mb-10 bg-red-500/10 rounded-xl p-6 border border-red-500/20">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-400" />
            <h2 className="text-2xl font-semibold text-red-400">Consequences of Violations</h2>
          </div>
          <p className="text-gray-400 mb-4">Violations of this Code of Conduct may result in:</p>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center gap-2">• Expulsion from the event with no refund (if applicable)</li>
            <li className="flex items-center gap-2">• Blocking access to Community Connect resources</li>
            <li className="flex items-center gap-2">• Reporting behavior to local law enforcement</li>
          </ul>
        </section>

        {/* Contact */}
        <section className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="h-6 w-6 text-orange-400" />
            <h2 className="text-2xl font-semibold">Contact Us</h2>
          </div>
          <p className="text-gray-400 mb-4">
            If you experience or witness any violations, please report them immediately:
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-300">
              <Mail className="h-5 w-5 text-orange-400" />
              <a href="mailto:info@grownity.tech" className="hover:text-orange-400 transition-colors">
                info@grownity.tech
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
