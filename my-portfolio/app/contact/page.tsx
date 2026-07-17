import GridContacts from "./grid-contacts";

export default function Page() {
  return (
    <div className="flex flex-col gap-16 pt-8 relative">
      <div className="absolute top-0 left-1/4 w-1/2 h-64 bg-apple-accent/5 rounded-full blur-[100px] -z-10" />
      <div className="flex flex-col items-start">
        <h1 className="text-5xl font-thin tracking-tight text-white mb-4">Contact</h1>
        <p className="text-lg text-white/50 leading-relaxed max-w-xl">
          Feel free to reach out. I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
        </p>
      </div>
      
      <div className="flex flex-col items-start w-full">
        <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-white/30 mb-6">Connect</h2>
        <GridContacts />
      </div>
    </div>
  );
}
