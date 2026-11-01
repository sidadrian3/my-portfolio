import Image from "next/image";

export function Hero() {
  return (
    <header className="pt-8 pb-4 sm:pt-12">
      <Image
        src="/myprofile.jpg"
        alt="Sid Adrian Digamon"
        width={56}
        height={56}
        priority
        className="mb-6 size-14 rounded-full object-cover"
      />
      <h1 className="text-[36px] font-[650] leading-[1.1] tracking-[-0.035em] text-ink sm:text-[46px]">
        <span className="type-once">
          <span className="type-once-text">hey, i&apos;m sid.</span>
        </span>
      </h1>
      <p className="mt-4 max-w-[540px] text-base text-mute">
        cs grad from ateneo de davao. i build back-ends, lift, run, and eat an
        honestly concerning amount of chicken and steak.
      </p>
    </header>
  );
}
